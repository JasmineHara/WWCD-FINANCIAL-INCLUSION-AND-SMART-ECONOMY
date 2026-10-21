"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TopBar } from "@/components/tracker/TopBar";
import { BreakdownChart } from "@/components/report/BreakdownChart";
import { ChatbotPanel } from "@/components/report/ChatbotPanel";
import { DownloadReportButton } from "@/components/report/DownloadReportButton";
import { MetricsCards } from "@/components/report/MetricsCards";
import { Sparkles, Loader2 } from "lucide-react";
import type { ReportData, ReportPeriod } from "@/types/tracker";

function ReportContent() {
  const searchParams = useSearchParams();
  const period = (searchParams.get("period") as ReportPeriod) || "monthly";
  const queryReportId = searchParams.get("id");

  const [reportId, setReportId] = useState<string | null>(queryReportId ?? null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReportData() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/tracker/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ period }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error ?? "Failed to generate report.");
        }

        const report = data.report ?? null;
        setReportId(report?.id ?? queryReportId ?? null);

        if (!report?.id) {
          throw new Error("The generated report is missing its saved ID. Please try again.");
        }

        setReportData({
          business_name: "My Business",
          period,
          summary: report?.summary ?? "",
          insights: Array.isArray(report?.insights) ? report.insights : [],
          metrics: report?.metrics ?? {
            total_revenue: 0,
            revenue_change_pct: 0,
            total_expenses: 0,
            expenses_change_pct: 0,
            net_profit: 0,
            net_profit_change_pct: 0,
          },
          breakdown: Array.isArray(report?.breakdown) ? report.breakdown : [],
          summary_points: Array.isArray(report?.insights) ? report.insights : [],
          date_range_label: `Current ${period} report`,
        });
      } catch (loadError) {
        console.error("Failed to load report data:", loadError);
        setError(loadError instanceof Error ? loadError.message : "Failed to load report data.");
        setReportData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReportData();
  }, [period]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen pb-16">
        <TopBar title="Your Report is Ready!" />
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          <p className="text-sm text-gray-500">Generating your AI financial report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen pb-16">
        <TopBar title="Report unavailable" />
        <main className="px-8 py-6 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-16">
      <TopBar title="Your Report is Ready!" />

      <main className="px-8 py-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div
          className="lg:col-span-7 rounded-3xl bg-surface border p-8 space-y-8 shadow-sm"
          style={{ borderColor: "var(--mifi-border)" }}
        >
          <div className="border-b pb-4" style={{ borderColor: "var(--mifi-border)" }}>
            <h2 className="text-2xl font-bold" style={{ color: "var(--mifi-sidebar-text)" }}>
              {reportData?.business_name || "My Business"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 capitalize">
              Statement Period: {period} • {reportData?.date_range_label || "Current report"}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
              1. Summary & AI Feedback
            </h3>
            <div className="rounded-2xl p-4 bg-black/5 dark:bg-zinc-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span>AI Status: Report generated successfully</span>
              </div>
              <p className="text-gray-700 dark:text-gray-200 leading-6">
                {reportData?.summary || "No summary available."}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
              2. Key Metrics Dashboard
            </h3>
            <MetricsCards metrics={reportData?.metrics} />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
              3. Breakdown & Analysis
            </h3>
            <div className="p-4 rounded-2xl border space-y-4" style={{ borderColor: "var(--mifi-border)" }}>
              <BreakdownChart breakdown={reportData?.breakdown ?? []} />
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                {(reportData?.insights ?? []).map((insight, index) => (
                  <li key={`${insight}-${index}`} className="flex gap-2">
                    <span className="mt-0.5 text-amber-500">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
              4. Item & Transaction Summary
            </h3>
            <div className="rounded-2xl border overflow-hidden text-xs" style={{ borderColor: "var(--mifi-border)" }}>
              <div className="bg-gray-100 dark:bg-zinc-800 px-4 py-2.5 font-semibold grid grid-cols-3 text-gray-700 dark:text-gray-300">
                <span>Category</span>
                <span>Volume</span>
                <span className="text-right">Amount</span>
              </div>
              {reportData?.breakdown?.length ? (
                <div className="divide-y dark:divide-zinc-800">
                  {reportData.breakdown.map((entry) => (
                    <div key={entry.category} className="grid grid-cols-3 px-4 py-3 text-gray-700 dark:text-gray-200">
                      <span>{entry.category}</span>
                      <span>{entry.amount > 0 ? "1 entry" : "—"}</span>
                      <span className="text-right">RM {Number(entry.amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-400">No transaction records loaded.</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 sticky top-6 space-y-6 flex flex-col h-[550px]">
          <div className="flex-1">
            {reportId ? <ChatbotPanel reportId={reportId} /> : <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">Waiting for the saved report ID before the AI assistant can load.</div>}
          </div>
          <div>
            {reportId ? <DownloadReportButton reportId={reportId} /> : null}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading report...</div>}>
      <ReportContent />
    </Suspense>
  );
}