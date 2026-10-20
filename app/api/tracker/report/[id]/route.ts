/**
 * app/api/tracker/report/[id]/route.ts
 * -----------------------------------------
 * GET /api/tracker/report/:id
 * Fetches a single previously-generated report by id — used by
 * app/tracker/report/page.tsx to load the report the user just generated
 * (or an older one, if you add a "report history" list later).
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReportResponse } from "@/types/tracker";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ReportResponse>> {
  const { id } = await context.params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, error: "Report not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, report: data });
}
