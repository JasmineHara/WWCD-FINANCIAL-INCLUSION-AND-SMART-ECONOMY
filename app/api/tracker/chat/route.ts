/**
 * app/api/tracker/chat/route.ts
 * ---------------------------------
 * POST /api/tracker/chat
 * Body: { "reportId": string, "question": string }
 *
 * Powers the small chatbot box on the Report page (right column in the
 * mockup). Loads the report, loads recent chat history for context, asks
 * Gemini, then saves both the user's question and the assistant's answer
 * so the thread persists across refreshes.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { askChatbot } from "@/lib/gemini/client";
import type { ChatResponse } from "@/types/tracker";

// TODO: replace with your real auth lookup.
async function getCurrentUserId(_req: NextRequest): Promise<string> {
  return "00000000-0000-0000-0000-000000000000";
}

export async function POST(req: NextRequest): Promise<NextResponse<ChatResponse>> {
  try {
    const supabase = await createSupabaseServerClient();
    const userId = await getCurrentUserId(req);
    const { reportId, question } = (await req.json()) as {
      reportId: string;
      question: string;
    };

    if (!reportId || !question?.trim()) {
      return NextResponse.json(
        { success: false, error: "reportId and question are required." },
        { status: 400 }
      );
    }

    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .single();

    if (reportError || !report) {
      return NextResponse.json({ success: false, error: "Report not found." }, { status: 404 });
    }

    const { data: history } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("report_id", reportId)
      .order("created_at", { ascending: true })
      .limit(20);

    const answerText = await askChatbot(question, [], history ?? []);

    // Save both turns.
    await supabase.from("chat_messages").insert([
      { user_id: userId, report_id: reportId, role: "user", content: question },
      { user_id: userId, report_id: reportId, role: "assistant", content: answerText },
    ]);

    const { data: saved } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("report_id", reportId)
      .eq("role", "assistant")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({ success: true, message: saved ?? undefined });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
