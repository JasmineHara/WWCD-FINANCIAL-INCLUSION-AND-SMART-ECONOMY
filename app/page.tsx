"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Lightbulb,
  MessageSquare,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const [userName] = useState("mifi");

  // Mock data for weekly cash flow chart (Mon - Sun)
  const weeklyData = [
    { day: "Mon", cashFlow: 320, balance: 320 },
    { day: "Tue", cashFlow: 450, balance: 420 },
    { day: "Wed", cashFlow: 500, balance: 480 },
    { day: "Thu", cashFlow: 620, balance: 600 },
    { day: "Fri", cashFlow: 410, balance: 460 },
    { day: "Sat", cashFlow: 580, balance: 520 },
    { day: "Sun", cashFlow: 850, balance: 790 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pt-2">
      {/* 1. Greeting Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome back, {userName}! 👋
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Track cash flow, get AI insights, and connect with business mentors.
        </p>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div
          className="rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between transition hover:shadow-md"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
              Total Revenue
            </span>
            <div className="rounded-full bg-white/20 p-2">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold">RM 6,700</div>
            <div className="mt-1 flex items-center gap-1 text-xs font-medium opacity-90">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">+67%</span>
              <span>vs last week</span>
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="rounded-2xl p-6 bg-surface border shadow-sm flex flex-col justify-between transition hover:shadow-md" style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Expenses
            </span>
            <div className="rounded-full bg-red-50 dark:bg-red-950/30 p-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">RM 2,210</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <span className="bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded text-[10px] font-bold">-12%</span>
              <span>vs last week</span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="rounded-2xl p-6 bg-surface border shadow-sm flex flex-col justify-between transition hover:shadow-md" style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Net Profit
            </span>
            <div className="rounded-full bg-amber-50 dark:bg-amber-950/30 p-2">
              <DollarSign className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">RM 4,490</div>
            <p className="mt-1 text-xs text-gray-500">Net earnings this period</p>
          </div>
        </div>

        {/* Net Profit Margin */}
        <div
          className="rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between transition hover:shadow-md"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
              Net Profit Margin
            </span>
            <div className="rounded-full bg-white/20 p-2">
              <PieChart className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold">67%</div>
            <p className="mt-1 text-xs opacity-90">Healthy cash efficiency</p>
          </div>
        </div>
      </div>

      {/* 3. Weekly Report & Cash Flow Summary Chart Card */}
      <div className="rounded-2xl bg-surface border p-6 shadow-sm" style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Weekly Report & Cash Flow Summary
            </h2>
            <p className="text-xs text-gray-500">Cash Flow vs Running Balance (RM)</p>
          </div>
          <Link
            href="/tracker"
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline"
          >
            <span>View detailed tracker</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* CSS Bar Chart Visualization */}
        <div className="pt-4 pb-2">
          <div className="h-56 flex items-end justify-between gap-2 border-b border-l border-gray-300 dark:border-zinc-700 px-4 pb-2">
            {weeklyData.map((item) => {
              const barHeightPct = (item.cashFlow / 1000) * 100;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[10px] py-1 px-2 rounded shadow pointer-events-none whitespace-nowrap z-10">
                    RM {item.cashFlow}
                  </div>
                  {/* Bar */}
                  <div className="w-full max-w-[40px] bg-amber-200 dark:bg-amber-600/40 rounded-t-lg transition-all group-hover:bg-amber-400" style={{ height: `${barHeightPct}%` }} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick AI Insight Strip */}
        <div className="mt-6 rounded-xl p-4 flex items-start gap-3 bg-amber-50/80 dark:bg-zinc-800/60 border border-amber-200/60 dark:border-zinc-700">
          <Sparkles className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="text-sm text-gray-800 dark:text-gray-200">
            <strong className="font-semibold text-amber-900 dark:text-amber-300">Quick AI Insight: </strong>
            Your Sunday cash flow spiked by +35% due to weekend orders. Consider shifting inventory restocking to Thursdays to prevent stockouts.
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Tip of the Day & Community Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Tip Card */}
        <div className="rounded-2xl bg-surface border p-6 shadow-sm flex flex-col justify-between" style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}>
          <div>
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-3">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h3>Business Tip of the Day</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
              <li>Separate business and personal bank accounts to simplify expense tracking and tax filings.</li>
              <li>Review fixed monthly subscriptions every quarter to cut underutilized costs.</li>
            </ul>
          </div>
          <div className="mt-5 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Link href="/tips" className="text-xs font-semibold text-amber-600 hover:underline">
              Read more tips →
            </Link>
          </div>
        </div>

        {/* Community Forum Highlights Card */}
        <div className="rounded-2xl bg-surface border p-6 shadow-sm flex flex-col justify-between" style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}>
          <div>
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-3">
              <MessageSquare className="h-5 w-5 text-amber-500" />
              <h3>Community Forum Highlights</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800 p-1.5 rounded transition">
                <span>• How are you handling supplier price increases in 2026?</span>
                <span className="text-xs text-gray-400">12 replies</span>
              </li>
              <li className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800 p-1.5 rounded transition">
                <span>• Best digital payment gateways for micro-retailers in MY</span>
                <span className="text-xs text-gray-400">8 replies</span>
              </li>
            </ul>
          </div>
          <div className="mt-5 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Link href="/community" className="text-xs font-semibold text-amber-600 hover:underline">
              Join community discussions →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}