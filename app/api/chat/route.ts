import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { askChatbot } from "@/lib/gemini/client";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      message?: string;
      history?: Array<{ role: string; content: string }>;
    };

    const message = payload.message?.trim();
    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    const history = Array.isArray(payload.history)
      ? payload.history.filter((item) => item && typeof item.content === "string")
      : [];

    const reply = await askChatbot(message, [], history);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown chat error.",
      },
      { status: 500 },
    );
  }
}

// Supabase sends users here after Google sign-in and after clicking the
// confirmation link in the signup email. It swaps the ?code=... for a session.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}