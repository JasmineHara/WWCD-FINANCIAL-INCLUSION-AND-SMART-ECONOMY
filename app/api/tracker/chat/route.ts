/**
 * app/api/tracker/chat/route.ts
 * ---------------------------------
 * POST /api/tracker/chat
 * Body: { "reportId": string, "question": string, "mode"?: AdviceMode }
 *
 * Powers the chatbot box on the Report page. Checks the logged-in user,
 * loads their report and recent chat history, asks Gemini for advice,
 * then saves both the question and the answer so the thread persists.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ChatResponse } from "@/types/tracker";
import type { AdviceMode } from "@/lib/gemini/prompts";
import { askAdvisor } from "@/lib/gemini/client";

export async function POST(req: NextRequest): Promise<NextResponse<ChatResponse>> {
  try {
    const supabase = await createSupabaseServerClient();

    // 1. Who is logged in?
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Please log in again to use the report AI assistant.",
        },
        { status: 401 }
      );
    }
    const userId = user.id;

    // 2. Read and validate the request body.
    const { reportId, question, mode } = (await req.json()) as {
      reportId: string;
      question: string;
      mode?: AdviceMode;
    };

    if (!reportId || !question?.trim()) {
      return NextResponse.json(
        { success: false, error: "reportId and question are required." },
        { status: 400 }
      );
    }

    // 3. Load the report, only if it belongs to this user.
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .eq("user_id", userId)
      .single();

    if (reportError || !report) {
      return NextResponse.json(
        {
          success: false,
          error: "This report could not be loaded. Please generate or reopen the report and try again.",
        },
        { status: 404 }
      );
    }

    // 4. Load the 20 most recent messages, then put them back in order.
    const { data: historyDesc } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("report_id", reportId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(6);

    const history = (historyDesc ?? []).reverse();

    // 5. Ask Gemini.
    const answerText = await askAdvisor({
      question,
      report,
      history,
      mode: mode ?? "general",
    });

    // 6. Save the user's question first, then the answer.
    const { error: userInsertError } = await supabase.from("chat_messages").insert({
      user_id: userId,
      report_id: reportId,
      role: "user",
      content: question,
    });

    if (userInsertError) {
      return NextResponse.json(
        { success: false, error: userInsertError.message },
        { status: 500 }
      );
    }

    const { data: saved, error: assistantInsertError } = await supabase
      .from("chat_messages")
      .insert({
        user_id: userId,
        report_id: reportId,
        role: "assistant",
        content: answerText,
      })
      .select()
      .single();

    if (assistantInsertError) {
      return NextResponse.json(
        { success: false, error: assistantInsertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: saved ?? undefined });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}