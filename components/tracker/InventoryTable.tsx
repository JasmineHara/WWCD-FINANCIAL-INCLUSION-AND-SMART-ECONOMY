"use client";

import type { Transaction } from "@/types/tracker";

interface InventoryTableProps {
  transactions: Transaction[];
  aiSummary?: string | null;
  isLoading?: boolean;
}

export function InventoryTable({
  transactions,
  aiSummary,
  isLoading = false,
}: InventoryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border shadow-sm" style={{ borderColor: "var(--mifi-border)" }}>
      {/* Table Header Section */}
      <div
        className="px-6 py-4 text-lg font-bold text-white"
        style={{ backgroundColor: "var(--mifi-table-header-bg)", color: "var(--mifi-table-header-text)" }}
      >
        My inventory
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto bg-white dark:bg-zinc-900">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr
              className="text-xs font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: "var(--mifi-table-subheader-bg)",
                color: "var(--mifi-table-subheader-text)",
              }}
            >
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--mifi-border)" }}>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                  Loading transactions...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                  No transactions recorded yet. Upload a statement to get started!
                </td>
              </tr>
            ) : (
              transactions.map((tx, idx) => (
                <tr key={tx.id || idx} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {tx.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {tx.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                    <span className="inline-block rounded-full bg-gray-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium">
                      {tx.category || "General"}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-right font-semibold ${
                      typeof tx.amount === "number" && tx.amount < 0
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {typeof tx.amount === "number"
                      ? `${tx.amount < 0 ? "-" : "+"}RM ${Math.abs(tx.amount).toFixed(2)}`
                      : tx.amount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* AI Summary Banner */}
      <div
        className="px-6 py-4 text-sm leading-relaxed"
        style={{
          backgroundColor: "var(--mifi-ai-summary-bg)",
          color: "var(--mifi-ai-summary-text)",
        }}
      >
        <span className="font-bold uppercase tracking-wider text-xs block mb-1 opacity-90">
          ✨ AI Financial Insight
        </span>
        {aiSummary ??
          "AI Analysis: Upload your monthly receipts and bank statements to receive personalized cash flow insights and cost savings opportunities."}
      </div>
    </div>
  );
}