/**
 * app/api/tracker/transactions/route.ts
 * ----------------------------------------
 * GET /api/tracker/transactions?limit=50
 * Returns the current user's transactions, newest first — this is what
 * fills the "My inventory" table on the Tracker page.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Transaction } from "@/types/tracker";

export async function GET(
  req: NextRequest
): Promise<NextResponse<{ success: boolean; transactions?: Transaction[]; error?: string }>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ success: false, error: "You need to sign in first." }, { status: 401 });
  }

  const userId = user.id;
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 50);

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, transactions: data as Transaction[] });
}
