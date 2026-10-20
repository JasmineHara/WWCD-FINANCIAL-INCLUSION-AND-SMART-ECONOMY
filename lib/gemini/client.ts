import type { ReportPeriod, Transaction } from "@/types/tracker";

export async function generateReportFromTransactions(
  transactions: Transaction[],
  period: ReportPeriod
) {
  const total = transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const uniqueCategories = new Set(
    transactions
      .map((tx) => tx.category)
      .filter((category): category is string => Boolean(category))
  );

  return {
    period,
    summary: `For the ${period} period, you tracked ${transactions.length} transactions with a net total of $${total.toFixed(2)}.`,
    insights: [
      `You categorized spending across ${uniqueCategories.size} groups.`,
      "This is a placeholder AI summary generated during local build setup.",
    ],
    generated_at: new Date().toISOString(),
  };
}

export async function askChatbot(
  _prompt: string,
  _transactions: Transaction[],
  _history?: unknown[]
): Promise<string> {
  return "This is a placeholder chatbot response while the tracker feature is being scaffolded locally.";
}
