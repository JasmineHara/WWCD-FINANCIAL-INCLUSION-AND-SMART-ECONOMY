import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

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

// ai
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT =
  "You are mifi's AI financial assistant for small business owners. " +
  "Help with cash flow, expenses, suppliers, and financial optimization. " +
  "Be concise and practical. If you don't have the user's actual data, say so " +
  "instead of inventing numbers.";

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as {
      messages: { sender: "user" | "ai"; text: string }[];
    };

    // gemini use user and model roles but we use user and ai in the frontend, so we need to convert them
    const contents = messages.map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const result = await ai.models.generateContentStream({
      model: "gemini-3.5-flash",
      contents,
      config: { systemInstruction: SYSTEM_PROMPT },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result) {
            if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
          }
        } catch (err) {
          console.error("Stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Gemini error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(message, { status: 500 });
  }
}