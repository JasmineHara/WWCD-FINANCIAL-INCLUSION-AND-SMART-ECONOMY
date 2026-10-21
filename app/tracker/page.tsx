"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/tracker/TopBar";
import { InventoryTable } from "@/components/tracker/InventoryTable";
import { ViewReportMenu } from "@/components/tracker/ViewReportMenu";
import { FolderOpen } from "lucide-react";
import type { Transaction } from "@/types/tracker";

interface TrackerFile {
  id: string;
  name: string;
  count: number;
}

export default function DataTrackerPage() {
  const router = useRouter();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "reports">("transactions");

  // Backend state (initialized empty)
  const [files, setFiles] = useState<TrackerFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Error/Warning text state for reports
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrackerData() {
      try {
        setIsLoading(true);

        const res = await fetch("/api/tracker/transactions?limit=200", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load transactions");
        }

        const data = await res.json();
        const loadedTransactions = Array.isArray(data?.transactions) ? data.transactions : [];

        setTransactions(loadedTransactions);
        setFiles(
          loadedTransactions.length > 0
            ? [{ id: "all", name: "All Files / Combined View", count: loadedTransactions.length }]
            : []
        );

        if (loadedTransactions.length === 0) {
          setAiSummary("AI Analysis: No statements uploaded yet. Upload a document to generate cash flow insights.");
        } else {
          setAiSummary(
            `AI Analysis: ${loadedTransactions.length} transaction entries are currently available for review and budgeting insights.`
          );
        }
      } catch (error) {
        console.error("Failed to load tracker data:", error);
        setTransactions([]);
        setFiles([]);
        setAiSummary("AI Analysis: No statements uploaded yet. Upload a document to generate cash flow insights.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrackerData();
  }, [selectedFileId]);

  return (
    <div className="w-full min-h-screen pb-12">
      <TopBar title="Data Tracker" />

      <main className="px-8 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Subtitle & Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload your statements and let AI analyze your cash flow.
          </p>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/tracker/upload")}
                className="rounded-full px-5 py-2.5 text-sm font-semibold transition hover:brightness-95 active:scale-95"
                style={{
                  backgroundColor: "var(--color-primary, #f76f54)",
                  color: "#ffffff",
                }}
              >
                + Upload new document
              </button>

              {/* Safeguarded Report Menu with small text warning */}
              <ViewReportMenu
                onSelectPeriod={(p) => {
                  if (transactions.length === 0) {
                    setReportError("No files uploaded yet. Please upload a statement first.");
                    return;
                  }
                  setReportError(null);
                  router.push(`/tracker/report?period=${p}`);
                }}
              />
            </div>

            {/* Small text error notice */}
            {reportError && (
              <span className="text-xs font-medium text-red-500 pr-1 animate-fadeIn">
                ⚠️ {reportError}
              </span>
            )}
          </div>
        </div>

        {/* Horizontal Navigation Tabs (Overview / Transactions / Reports) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}>
          <div className="flex items-center gap-1.5 rounded-xl bg-black/5 dark:bg-zinc-800 p-1">
            {(["overview", "transactions", "reports"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${
                  activeTab === tab
                    ? "bg-white dark:bg-zinc-900 shadow-sm text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Active Tracker File Filter */}
          <div className="flex items-center gap-2.5 bg-surface px-3.5 py-1.5 rounded-xl border shadow-sm" style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}>
            <FolderOpen className="h-4 w-4 text-amber-600 shrink-0" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">File:</span>
            <select
              value={selectedFileId}
              onChange={(e) => setSelectedFileId(e.target.value)}
              className="rounded-lg border px-2.5 py-1 text-xs bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}
            >
              <option value="all">All Files / Combined View</option>
              {files.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.name} ({file.count} entries)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === "transactions" && (
          <InventoryTable
            transactions={transactions}
            aiSummary={aiSummary}
            isLoading={isLoading}
          />
        )}

        {activeTab === "overview" && (
          <div className="p-12 text-center rounded-2xl bg-surface border text-gray-500 shadow-sm" style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}>
            <h3 className="font-semibold text-base mb-1 text-gray-800 dark:text-gray-200">Overview Analytics</h3>
            <p className="text-sm text-gray-500">Visual breakdowns and cash flow charts will render here once statements are uploaded.</p>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="p-12 text-center rounded-2xl bg-surface border text-gray-500 shadow-sm" style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}>
            <h3 className="font-semibold text-base mb-1 text-gray-800 dark:text-gray-200">Generated Reports</h3>
            <p className="text-sm text-gray-500">View and download historical PDF/CSV financial summaries here.</p>
          </div>
        )}
      </main>
    </div>
  );
}