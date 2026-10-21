"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/tracker/TopBar";
import { InventoryTable } from "@/components/tracker/InventoryTable";
import { ViewReportMenu } from "@/components/tracker/ViewReportMenu";
import { useLanguage } from "@/context/LanguageContext";
import { FolderOpen } from "lucide-react";
import type { Transaction } from "@/types/tracker";

interface TrackerFile {
  id: string;
  name: string;
  count: number;
}

type ReportPeriod = "daily" | "weekly" | "monthly";

type SavedReport = {
  id: string;
  key: string;
  title: string;
  period: ReportPeriod;
  summary: string;
  createdAt: string;
};

const REPORTS_KEY = "tracker.savedReports";

function readSavedReports(): SavedReport[] {
  if (typeof window === "undefined") return [];
  try {
    const value = localStorage.getItem(REPORTS_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function writeSavedReports(reports: SavedReport[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

function getReportDateKey(period: ReportPeriod) {
  const now = new Date();

  if (period === "daily") {
    return `daily-${now.toISOString().slice(0, 10)}`;
  }

  if (period === "weekly") {
    const d = new Date(now);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return `weekly-${monday.toISOString().slice(0, 10)}`;
  }

  return `monthly-${now.toISOString().slice(0, 7)}`;
}

function getReportTitle(period: ReportPeriod) {
  const now = new Date();

  if (period === "daily") {
    return `Daily Report - ${now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;
  }

  if (period === "weekly") {
    const d = new Date(now);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return `Weekly Report - ${monday.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} to ${sunday.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;
  }

  return `Monthly Report - ${now.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  })}`;
}

export default function DataTrackerPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const isBM = lang === "bm";

  const [activeTab, setActiveTab] = useState<"transactions" | "reports">("transactions");
  const [files, setFiles] = useState<TrackerFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reportError, setReportError] = useState<string | null>(null);

  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [selectedSavedReportId, setSelectedSavedReportId] = useState<string | null>(null);

  useEffect(() => {
    setSavedReports(readSavedReports());
  }, []);

  const saveOrOpenReport = (period: ReportPeriod) => {
    const key = getReportDateKey(period);

    const existing = savedReports.find((report) => report.key === key);

    if (existing) {
      setSelectedSavedReportId(existing.id);
      setActiveTab("reports");
      router.push(`/tracker/report?period=${period}&saved=${existing.id}`);
      return;
    }

    const newReport: SavedReport = {
      id: `report-${Date.now()}`,
      key,
      title: getReportTitle(period),
      period,
      summary: `Generated ${period} report for this period.`,
      createdAt: new Date().toISOString(),
    };

    const updated = [newReport, ...savedReports.filter((report) => report.key !== key)];

    setSavedReports(updated);
    writeSavedReports(updated);

    setSelectedSavedReportId(newReport.id);
    setActiveTab("reports");
    router.push(`/tracker/report?period=${period}&saved=${newReport.id}`);
  };

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
      <TopBar title={t.page.trackerTitle} />

      <main className="px-8 py-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.page.trackerDescription}
          </p>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/tracker/upload")}
                className="rounded-full px-5 py-2.5 text-sm font-semibold transition hover:brightness-95 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: "var(--color-primary, #f76f54)",
                  color: "#ffffff",
                }}
              >
                + {t.tracker.uploadDocument}
              </button>

              <ViewReportMenu
                onSelectPeriod={(p) => {
                  if (transactions.length === 0) {
                    setReportError(t.tracker.noFilesWarning);
                    return;
                  }

                  setReportError(null);
                  saveOrOpenReport(p);
                }}
              />
            </div>

            {reportError && (
              <span className="text-xs font-medium text-red-500 pr-1 animate-fadeIn">
                ⚠️ {reportError}
              </span>
            )}
          </div>
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-4 border-b pb-4"
          style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}
        >
          <div className="flex items-center gap-1.5 rounded-xl bg-black/5 dark:bg-zinc-800 p-1">
            {(["transactions", "reports"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition cursor-pointer ${
                  activeTab === tab
                    ? "bg-white dark:bg-zinc-900 shadow-sm text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab === "transactions" ? t.tracker.transactions : t.tracker.reports}
              </button>
            ))}
          </div>

          <div
            className="flex items-center gap-2.5 bg-surface px-3.5 py-1.5 rounded-xl border shadow-sm"
            style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}
          >
            <FolderOpen className="h-4 w-4 text-amber-600 shrink-0" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t.tracker.fileLabel}</span>
            <select
              value={selectedFileId}
              onChange={(e) => setSelectedFileId(e.target.value)}
              className="rounded-lg border px-2.5 py-1 text-xs bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}
            >
              <option value="all">{t.tracker.allFiles}</option>
              {files.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.name} ({file.count} entries)
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeTab === "transactions" && (
          <InventoryTable
            transactions={transactions}
            aiSummary={aiSummary}
            isLoading={isLoading}
          />
        )}

        {activeTab === "reports" && (
          <div
            className="rounded-2xl border bg-surface p-4 shadow-sm"
            style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200">{t.tracker.generatedReports}</h3>
            </div>

            {savedReports.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                {isBM ? "Tiada laporan tersimpan lagi." : "No saved reports yet."}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {savedReports.map((report) => (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => {
                      setSelectedSavedReportId(report.id);
                      router.push(`/tracker/report?period=${report.period}&saved=${report.id}`);
                    }}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition cursor-pointer ${
                      selectedSavedReportId === report.id
                        ? "border-orange-300 bg-orange-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-lg">
                      📄
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-gray-900">{report.title}</div>
                      <div className="text-xs text-gray-500">
                        {report.period} • {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}