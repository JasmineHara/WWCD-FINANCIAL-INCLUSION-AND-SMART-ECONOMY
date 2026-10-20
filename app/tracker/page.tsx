"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/tracker/TopBar";
import { InventoryTable } from "@/components/tracker/InventoryTable";
import { ViewReportMenu } from "@/components/tracker/ViewReportMenu";

export default function DataTrackerPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "reports">("transactions");

  return (
    <div className="w-full">
      <TopBar title="Data Tracker" />

      <main className="px-8 py-6 space-y-6">
        {/* Header Title & Subtitle */}
        <div>
          <h2 className="text-2xl font-semibold">Financial Data Tracker</h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload your statements and let AI analyze your cash flow.
          </p>
        </div>

        {/* Horizontal Navigation Tabs + Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--mifi-border)" }}>
          {/* Tabs */}
          <div className="flex items-center gap-2 rounded-xl bg-black/5 p-1">
            {(["overview", "transactions", "reports"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                  activeTab === tab
                    ? "bg-white shadow-sm font-semibold text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/tracker/upload")}
              className="rounded-full px-5 py-2 text-sm font-medium text-white transition hover:brightness-95"
              style={{ backgroundColor: "var(--mifi-accent-primary)" }}
            >
              + Upload new document
            </button>

            <ViewReportMenu onSelectPeriod={(p) => router.push(`/tracker/report?period=${p}`)} />
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === "transactions" && (
          <InventoryTable transactions={[]} aiSummary={null} isLoading={false} />
        )}

        {activeTab === "overview" && (
          <div className="p-8 text-center rounded-2xl bg-white border text-gray-500">
            Overview Summary Metrics & Visual Breakdown
          </div>
        )}

        {activeTab === "reports" && (
          <div className="p-8 text-center rounded-2xl bg-white border text-gray-500">
            Generated Financial Reports & Historical Downloads
          </div>
        )}
      </main>
    </div>
  );
}