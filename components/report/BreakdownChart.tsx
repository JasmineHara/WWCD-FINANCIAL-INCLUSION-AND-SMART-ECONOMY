/**
 * components/report/BreakdownChart.tsx
 * ------------------------------------------
 * The grey pie chart under "3. Breakdown & Analysis" in the mockup, built
 * with "recharts" (npm install recharts). Colors cycle through a small
 * palette — 🎨 FRONTEND, edit CHART_COLORS freely.
 */
"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ReportData } from "@/types/tracker";

const CHART_COLORS = ["#e0744f", "#93a84a", "#4f5d2f", "#f0c869", "#5e2e2e", "#c9a0a0"];

export function BreakdownChart({ breakdown }: { breakdown: ReportData["breakdown"] }) {
  if (!breakdown?.length) {
    return <div className="flex h-48 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-400">No data yet</div>;
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={breakdown} dataKey="amount" nameKey="category" innerRadius={50} outerRadius={80}>
            {breakdown.map((entry, index) => (
              <Cell key={entry.category} fill={entry.color ?? CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
