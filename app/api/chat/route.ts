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