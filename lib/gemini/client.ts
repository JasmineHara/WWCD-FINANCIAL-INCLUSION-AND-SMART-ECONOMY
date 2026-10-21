import { GoogleGenAI } from "@google/genai";
import type { ReportPeriod, Transaction } from "@/types/tracker";

function normalizeTransactionAmount(tx: Transaction) {
  const raw = tx.amount ?? tx.price ?? tx.value ?? 0;
  const number = typeof raw === "number" ? raw : Number(String(raw).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function detectTxType(tx: Transaction) {
  const rawType = String(tx.type ?? "").toLowerCase();
  const name = String(tx.name ?? tx.description ?? "").toLowerCase();
  const amount = normalizeTransactionAmount(tx);

  if (rawType.includes("income") || rawType.includes("revenue")) return "income";
  if (rawType.includes("expense") || rawType.includes("debit") || rawType.includes("cost")) return "expense";
  if (/income|revenue|sales|salary|commission|refund|return/.test(name)) return "income";
  if (/expense|cost|payment|purchase|bill|rent|utility|tax|fee|withdraw|debit|spend/.test(name)) return "expense";
  return amount >= 0 ? "income" : "expense";
}

function buildFinancialMetrics(transactions: Transaction[], period: ReportPeriod) {
  const revenue = transactions
    .filter((tx) => detectTxType(tx) === "income")
    .reduce((sum, tx) => sum + Math.abs(normalizeTransactionAmount(tx)), 0);

  const expenses = transactions
    .filter((tx) => detectTxType(tx) === "expense")
    .reduce((sum, tx) => sum + Math.abs(normalizeTransactionAmount(tx)), 0);

  const netProfit = revenue - expenses;

  const categoryMap = new Map<string, number>();
  for (const tx of transactions) {
    const category = tx.category ?? "General";
    const amount = Math.abs(normalizeTransactionAmount(tx));
    categoryMap.set(category, (categoryMap.get(category) ?? 0) + amount);
  }

  const breakdown = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const label = period === "daily" ? "day" : period === "weekly" ? "week" : "month";

  const insights = [
    `Total revenue for this ${label} is RM ${revenue.toFixed(2)}.`,
    `Total expenses for this ${label} are RM ${expenses.toFixed(2)}.`,
    `Net profit is RM ${netProfit.toFixed(2)}.`,
    breakdown.length
      ? `The biggest spending category is ${breakdown[0].category} at RM ${breakdown[0].amount.toFixed(2)}.`
      : "No category data was available for the selected period.",
  ];

  return {
    metrics: {
      total_revenue: revenue,
      revenue_change_pct: 0,
      total_expenses: expenses,
      expenses_change_pct: 0,
      net_profit: netProfit,
      net_profit_change_pct: 0,
    },
    breakdown,
    insights,
    summary: `For this ${label}, total revenue was RM ${revenue.toFixed(2)}, total expenses were RM ${expenses.toFixed(2)}, and net profit was RM ${netProfit.toFixed(2)}.`,
  };
}

function buildFallbackReport(transactions: Transaction[], period: ReportPeriod) {
  const { metrics, breakdown, insights, summary } = buildFinancialMetrics(transactions, period);

  return {
    period,
    summary,
    insights,
    metrics,
    breakdown,
    generated_at: new Date().toISOString(),
  };
}

export async function generateReportFromTransactions(
  transactions: Transaction[],
  period: ReportPeriod
) {
  const safeTransactions = (transactions ?? []).filter(Boolean);

  if (!safeTransactions.length) {
    return {
      period,
      summary: `No transactions were found for this ${period} period. Upload a file to generate a report.`,
      insights: ["No data available."],
      metrics: {
        total_revenue: 0,
        revenue_change_pct: 0,
        total_expenses: 0,
        expenses_change_pct: 0,
        net_profit: 0,
        net_profit_change_pct: 0,
      },
      breakdown: [],
      generated_at: new Date().toISOString(),
    };
  }

  const base = buildFinancialMetrics(safeTransactions, period);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ...base, period, generated_at: new Date().toISOString() };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const summaryPayload = safeTransactions.map((tx) => ({
      date: tx.date ?? "unknown",
      description: tx.description ?? tx.name ?? "Imported transaction",
      category: tx.category ?? "General",
      amount: normalizeTransactionAmount(tx),
      type: detectTxType(tx),
    }));

    const prompt = `You are a financial analyst. Based only on the following transactions, calculate revenue, expenses, and net profit in MYR. Return ONLY valid JSON with exact fields: summary, insights, metrics, breakdown. metrics must include total_revenue, revenue_change_pct, total_expenses, expenses_change_pct, net_profit, net_profit_change_pct. breakdown is an array of {category, amount}. Use the exact list: ${JSON.stringify(summaryPayload)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const rawText = String(response.text ?? "").trim();
    const cleaned = rawText.replace(/```json|```/gi, "").trim();
    const parsed = JSON.parse(cleaned);

    const safeMetrics = {
      total_revenue: Number(parsed.metrics?.total_revenue ?? base.metrics.total_revenue),
      revenue_change_pct: Number(parsed.metrics?.revenue_change_pct ?? 0),
      total_expenses: Number(parsed.metrics?.total_expenses ?? base.metrics.total_expenses),
      expenses_change_pct: Number(parsed.metrics?.expenses_change_pct ?? 0),
      net_profit: Number(parsed.metrics?.net_profit ?? base.metrics.net_profit),
      net_profit_change_pct: Number(parsed.metrics?.net_profit_change_pct ?? 0),
    };

    const safeBreakdown = Array.isArray(parsed.breakdown)
      ? parsed.breakdown
          .map((item: { category?: string; amount?: number }) => ({
            category: String(item?.category ?? "General"),
            amount: Number(item?.amount ?? 0),
          }))
          .filter((item: { category: string; amount: number }) => item.category)
      : base.breakdown;

    return {
      period,
      summary: String(parsed.summary ?? base.summary),
      insights: Array.isArray(parsed.insights) && parsed.insights.length ? parsed.insights : base.insights,
      metrics: safeMetrics,
      breakdown: safeBreakdown,
      generated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Gemini report generation failed:", error);
    return { ...base, period, generated_at: new Date().toISOString() };
  }
}

export async function askChatbot(
  prompt: string,
  transactions: Transaction[],
  history?: unknown[]
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "Gemini API key is not configured yet, so a live assistant response is unavailable.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const context = transactions.length
      ? `Recent transaction context: ${JSON.stringify(
          transactions.slice(0, 10).map((tx) => ({
            date: tx.date,
            description: tx.description ?? tx.name,
            category: tx.category,
            amount: normalizeTransactionAmount(tx),
            type: detectTxType(tx),
          }))
        )}`
      : "No transaction context is available.";

    const conversationHistory = Array.isArray(history) ? JSON.stringify(history) : "";
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are a financial assistant. Use the context below to answer the user's question. Context: ${context}. Conversation history: ${conversationHistory}. User question: ${prompt}`,
    });

    return String(response.text ?? "I couldn't generate a response right now.");
  } catch (error) {
    console.error("Gemini chatbot failed:", error);
    return "I could not access the live AI service right now, but the latest data is still available in your report.";
  }
}
