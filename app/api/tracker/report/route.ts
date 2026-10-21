/**
 * app/api/tracker/report/route.ts
 * -----------------------------------
 * POST /api/tracker/report
 * Body: { "period": "daily" | "weekly" | "monthly" }
 *
 * Flow (matches pseudocode: "view weekly/monthly/yearly report -> website
 * loads to report page"):
 *   1. Pull the user's transactions for the requested period's date range.
 *   2. Send them to Gemini for analysis (lib/gemini/client.ts).
 *   3. Save the structured result to `reports`.
 *   4. Return it — the Report page fetches this on load / dropdown change.
 *
 * Note: the UI mockup's dropdown says "daily / weekly / monthly" (the
 * pseudocode also mentions "yearly" — add a "yearly" branch to
 * getDateRangeForPeriod() below if you want a 4th option).
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateReportFromTransactions } from "@/lib/gemini/client";
import type { ReportPeriod, ReportResponse, Transaction } from "@/types/tracker";

export async function POST(req: NextRequest): Promise<NextResponse<ReportResponse>> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: "You need to sign in first." }, { status: 401 });
    }

    const userId = user.id;
    const { period } = (await req.json()) as { period: ReportPeriod };

    if (!period || !["daily", "weekly", "monthly"].includes(period)) {
      return NextResponse.json(
        { success: false, error: "period must be 'daily', 'weekly', or 'monthly'." },
        { status: 400 }
      );
    }

    const { from, to } = getDateRangeForPeriod(period);

    const { data: transactions, error: txError } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .gte("date", from)
      .lte("date", to)
      .order("date", { ascending: false });

    if (txError) {
      return NextResponse.json({ success: false, error: txError.message }, { status: 500 });
    }

    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { success: false, error: `No transactions found for the ${period} period yet.` },
        { status: 404 }
      );
    }

    const generated = await generateReportFromTransactions(transactions as Transaction[], period);

    const { data: saved, error: saveError } = await supabase
      .from("reports")
      .insert({
        user_id: userId,
        period,
        summary: generated.summary,
        insights: generated.insights,
        metrics: generated.metrics,
        breakdown: generated.breakdown,
        generated_at: generated.generated_at,
      })
      .select()
      .single();

    if (saveError || !saved) {
      return NextResponse.json(
        { success: false, error: saveError?.message ?? "Could not save report." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, report: saved });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

function getDateRangeForPeriod(period: ReportPeriod): { from: string; to: string } {
  const now = new Date();
  const to = new Date(now);
  const from = new Date(now);

  if (period === "daily") {
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);
    return {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
    };
  }

  if (period === "weekly") {
    const day = now.getDay();
    const diffToMonday = (day + 6) % 7;
    from.setDate(now.getDate() - diffToMonday);
    from.setHours(0, 0, 0, 0);
    to.setDate(from.getDate() + 6);
    to.setHours(23, 59, 59, 999);
    return {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
    };
  }

  from.setMonth(now.getMonth(), 1);
  from.setHours(0, 0, 0, 0);
  to.setMonth(now.getMonth() + 1, 0);
  to.setHours(23, 59, 59, 999);

  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}
