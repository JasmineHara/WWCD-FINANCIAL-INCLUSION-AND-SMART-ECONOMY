/**
 * components/report/MetricsCards.tsx
 * ---------------------------------------
 * The 3 orange "Total Revenue / Total Expenses / Net Profit" tiles in the
 * Report page mockup. 🎨 FRONTEND — gradient/solid color via
 * --mifi-accent-primary; feel free to give each card its own shade.
 */
import type { ReportData } from "@/types/tracker";

export function MetricsCards({ metrics }: { metrics?: ReportData["metrics"] }) {
  const safeMetrics = metrics ?? {
    total_revenue: 0,
    revenue_change_pct: 0,
    total_expenses: 0,
    expenses_change_pct: 0,
    net_profit: 0,
    net_profit_change_pct: 0,
  };

  const cards = [
    { label: "Total Revenue", value: safeMetrics.total_revenue, change: safeMetrics.revenue_change_pct },
    { label: "Total Expenses", value: safeMetrics.total_expenses, change: safeMetrics.expenses_change_pct },
    { label: "Net Profit", value: safeMetrics.net_profit, change: safeMetrics.net_profit_change_pct },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-md p-3 text-xs text-white"
          style={{ backgroundColor: "var(--mifi-accent-primary)" }}
        >
          <p className="opacity-90">{c.label}</p>
          <p className="mt-1 text-base font-semibold">RM{c.value.toLocaleString()}</p>
          <p className="opacity-90">
            ({c.change >= 0 ? "+" : ""}
            {c.change}% vs last period)
          </p>
        </div>
      ))}
    </div>
  );
}
