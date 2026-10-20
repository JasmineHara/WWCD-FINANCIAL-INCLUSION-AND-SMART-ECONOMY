"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TopBar } from "@/components/tracker/TopBar";
import { BreakdownChart } from "@/components/report/BreakdownChart";
import { ChatbotPanel } from "@/components/report/ChatbotPanel";
import { DownloadReportButton } from "@/components/report/DownloadReportButton";
import { MetricsCards } from "@/components/report/MetricsCards";
import { Sparkles, Loader2 } from "lucide-react";
import type { ReportData } from "@/types/tracker";

function ReportContent() {
const searchParams = useSearchParams();
const period = searchParams.get("period") || "monthly";
const reportId = searchParams.get("id") || "default-report";

const [reportData, setReportData] = useState<ReportData | null>(null);
const [isLoading, setIsLoading] = useState<boolean>(true);

useEffect(() => {
async function fetchReportData() {
    try {
    setIsLoading(true);
    // TODO: Connect your backend endpoint here (e.g., fetch(`/api/tracker/report?id=${reportId}`))
    setReportData(null);
    } catch (error) {
    console.error("Failed to load report data:", error);
    } finally {
    setIsLoading(false);
    }
}

fetchReportData();
}, [reportId]);

if (isLoading) {
return (
    <div className="w-full min-h-screen pb-16">
    <TopBar title="Your Report is Ready!" />
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        <p className="text-sm text-gray-500">Loading your AI financial report...</p>
    </div>
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
        {/* Header */}
        <div className="border-b pb-4" style={{ borderColor: "var(--mifi-border)" }}>
        <h2 className="text-2xl font-bold" style={{ color: "var(--mifi-sidebar-text)" }}>
            {reportData?.business_name || "Name Of Business"}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5 capitalize">
            Statement Period: {period} (Connect backend for exact date range)
        </p>
        </div>

        {/* 1. Summary & AI Feedback */}
        <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
            1. Summary & AI Feedback
        </h3>
        <div className="rounded-2xl p-4 bg-black/5 dark:bg-zinc-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>AI Status: Awaiting Statement Data</span>
            </div>
            <p className="text-gray-500 italic">
            * Connect your backend AI endpoint to generate automated business status ratings, restocking advice, and cash flow insights.
            </p>
        </div>
        </div>

        {/* 2. Key Metrics Dashboard */}
        <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
            2. Key Metrics Dashboard
        </h3>
        <MetricsCards metrics={reportData?.metrics} />
        </div>

        {/* 3. Breakdown & Analysis */}
        <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
            3. Breakdown & Analysis
        </h3>
        <div className="p-4 rounded-2xl border space-y-4" style={{ borderColor: "var(--mifi-border)" }}>
            <BreakdownChart breakdown={reportData?.breakdown ?? []} />
            <p className="text-xs text-gray-400 italic text-center">
            Visual expense distribution charts will render here once transaction data is fetched.
            </p>
        </div>
        </div>

        {/* 4. Item & Transaction Summary */}
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
            <div className="p-6 text-center text-gray-400">
            No transaction records loaded. Connect database to view summary entries.
            </div>
        </div>
        </div>
    </div>

    <div className="lg:col-span-5 sticky top-6 space-y-6 flex flex-col h-[550px]">
        <div className="flex-1">
        <ChatbotPanel reportId={reportId} />
        </div>
        <div>
        <DownloadReportButton reportId={reportId} />
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