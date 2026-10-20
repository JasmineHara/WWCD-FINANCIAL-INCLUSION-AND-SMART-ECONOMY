// Finance Tracker and Analysis - Hara

/**
 * app/tracker/page.tsx
 * -------------------------
 * The "Financial Data Tracker" page — matches Image 1 of the mockup.
 * Responsibilities (data/logic — not 🎨 frontend, though layout classes
 * around the components are fine to restyle):
 *   - Fetch the user's transactions on mount (GET /api/tracker/transactions)
 *   - Render Sidebar / TopBar / InventoryTable
 *   - "+ Upload new document" → navigates to /tracker/upload
 *   - "View Report >" dropdown → POST /api/tracker/report, then navigate
 *     to /tracker/report?reportId=... once generated
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/tracker/Sidebar";
import { TopBar } from "@/components/tracker/TopBar";
import { InventoryTable } from "@/components/tracker/InventoryTable";
import { ViewReportMenu } from "@/components/tracker/ViewReportMenu";
import type { ReportPeriod, Transaction } from "@/types/tracker";

export default function DataTrackerPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tracker/transactions");
      const data = await res.json();
      if (data.success) setTransactions(data.transactions ?? []);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSelectPeriod(period: ReportPeriod) {
    setReportError(null);
    setIsGeneratingReport(true);
    try {
      const res = await fetch("/api/tracker/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period }),
      });
      const data = await res.json();

      if (!data.success) {
        setReportError(data.error ?? "Could not generate report.");
        return;
      }

      router.push(`/tracker/report?reportId=${data.report.id}`);
    } finally {
      setIsGeneratingReport(false);
    }
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <TopBar title="Data Tracker" />

        <main className="px-8 py-6">
          <h2 className="text-2xl font-semibold">Financial Data Tracker</h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload your statements and let AI analyze your cash flow.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => router.push("/tracker/upload")}
              className="rounded-full px-5 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--mifi-accent-primary)" }}
            >
              + Upload new document
            </button>

            <ViewReportMenu onSelectPeriod={handleSelectPeriod} isGenerating={isGeneratingReport} />
          </div>

          {reportError && <p className="mt-2 text-sm text-red-600">{reportError}</p>}

          <div className="mt-6">
            <InventoryTable transactions={transactions} aiSummary={null} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </div>
  );
}
