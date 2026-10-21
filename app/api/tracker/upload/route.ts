/**
 * app/api/tracker/upload/route.ts
 * ---------------------------------
 * POST /api/tracker/upload
 * Body: multipart/form-data with a single "file" field (csv/xls/xlsx/pdf).
 *
 * Flow:
 *   1. Check the user is signed in (real Supabase Auth user, not a placeholder).
 *   2. Validate file extension + size (<=25MB, matches the Upload Document UI).
 *   3. Insert a `source_documents` row (status: "processing").
 *   4. Upload the raw file to Supabase Storage bucket "statements".
 *   5. Parse the file into transaction rows (lib/parsers/fileParser.ts).
 *   6. Bulk-insert rows into `transactions`.
 *   7. Mark the source_documents row "complete" (or "failed" + error_message).
 *
 * Requires the tables/bucket from supabase/source_documents.sql.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseStatementFile } from "@/lib/parsers/fileParser";
import type { UploadResponse } from "@/types/tracker";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB — matches "Max size: 25MB" in the UI
const ALLOWED_EXTENSIONS = ["csv", "xls", "xlsx", "pdf"] as const;

export async function POST(req: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const supabase = await createSupabaseServerClient();

    // 1. Real signed-in user (the old placeholder id would fail the foreign key / RLS)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "You need to sign in first." }, { status: 401 });
    }
    const userId = user.id;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file received." }, { status: 400 });
    }

    // 2. Validate
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXTENSIONS.includes(extension as (typeof ALLOWED_EXTENSIONS)[number])) {
      return NextResponse.json(
        { success: false, error: "Unsupported file type. Please upload a CSV, XLS, or PDF." },
        { status: 415 }
      );
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ success: false, error: "File exceeds the 25MB limit." }, { status: 413 });
    }
    if (file.size === 0) {
      return NextResponse.json({ success: false, error: "This file is empty." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 3. Insert source_documents row first, so we have an id to attach everything to
    const { data: document, error: docError } = await supabase
      .from("source_documents")
      .insert({
        user_id: userId,
        file_name: file.name,
        file_type: extension,
        file_size_bytes: file.size,
        status: "processing",
      })
      .select()
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { success: false, error: `Could not save document record: ${docError?.message}` },
        { status: 500 }
      );
    }

    const markFailed = async (message: string) => {
      await supabase
        .from("source_documents")
        .update({ status: "failed", error_message: message })
        .eq("id", document.id);
    };

    // 4. Upload raw file to Storage bucket "statements".
    //    The file name is sanitised: spaces/symbols in names cause "Invalid key" errors.
    const safeName = file.name.replace(/[^\w.\-]+/g, "_");
    const storagePath = `${userId}/${document.id}-${safeName}`;
    const { error: storageError } = await supabase.storage
      .from("statements")
      .upload(storagePath, buffer, { contentType: file.type || undefined });

    if (storageError) {
      await markFailed(`Storage upload failed: ${storageError.message}`);
      return NextResponse.json(
        { success: false, error: `Storage upload failed: ${storageError.message}` },
        { status: 500 }
      );
    }
    await supabase.from("source_documents").update({ storage_path: storagePath }).eq("id", document.id);

    // 5. Parse the file into rows
    let rows;
    try {
      rows = await parseStatementFile(file, extension as "csv" | "xls" | "xlsx" | "pdf", file.name);
    } catch (parseErr) {
      console.error("[upload] parse failed:", parseErr);
      await markFailed(parseErr instanceof Error ? parseErr.message : String(parseErr));
      return NextResponse.json(
        { success: false, error: "Could not read that file. Please check its format." },
        { status: 422 }
      );
    }

    if (!rows || rows.length === 0) {
      await markFailed("No valid rows found in this file.");
      return NextResponse.json(
        { success: false, error: "No valid rows were found in that file." },
        { status: 422 }
      );
    }

    console.log(rows.slice(0, 3));
    // 6. Bulk insert transactions (in chunks so large files don't hit request limits)
    for (let i = 0; i < rows.length; i += 500) {
      const chunk = rows.slice(i, i + 500).map((row) => {
        const rawAmount = row.amount ?? row.price ?? row.value ?? 0;
        const numericAmount = Number(rawAmount ?? 0);
        const normalizedType = String(row.type ?? "").toLowerCase();
        const categoryText = String(row.category ?? "").toLowerCase();

        let inferredType: "income" | "expense" = "income";
        if (
          normalizedType.includes("expense") ||
          normalizedType.includes("debit") ||
          normalizedType.includes("cost") ||
          /ingredients|packaging|utilities|labor|maintenance|marketing|rent|supplies/.test(categoryText) ||
          numericAmount < 0
        ) {
          inferredType = "expense";
        }

        return {
          user_id: userId,
          name: row.name ?? row.description ?? "Imported transaction",
          description: row.description ?? row.name ?? "Imported transaction",
          amount: Number(numericAmount),
          date: row.date ?? new Date().toISOString().slice(0, 10),
          price: Number(numericAmount),
          value: Number(numericAmount),
          type: inferredType,
          category: row.category ?? "General",
          source_document_id: document.id,
        };
      });
      const { error: insertError } = await supabase.from("transactions").insert(chunk);

      if (insertError) {
        await supabase.from("transactions").delete().eq("source_document_id", document.id);
        await markFailed(insertError.message);
        return NextResponse.json(
          { success: false, error: `Could not save transactions: ${insertError.message}` },
          { status: 500 }
        );
      }
    }

    // 7. Mark complete
    await supabase
      .from("source_documents")
      .update({ status: "complete", row_count: rows.length })
      .eq("id", document.id);

    return NextResponse.json({
      success: true,
      document: { ...document, status: "complete", storage_path: storagePath },
      transactionsInserted: rows.length,
    });
  } catch (err) {
    console.error("[upload] unexpected error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}