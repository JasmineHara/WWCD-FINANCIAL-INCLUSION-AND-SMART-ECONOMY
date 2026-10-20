export type ReportPeriod = "daily" | "weekly" | "monthly";

export type Transaction = {
  id?: string;
  user_id?: string;
  date?: string;
  description?: string;
  amount?: number;
  type?: "income" | "expense";
  category?: string;
  merchant?: string;
  raw_data?: Record<string, unknown>;
  name?: string;
  price?: number;
  value?: number;
};

export type ReportBreakdownEntry = {
  category: string;
  amount: number;
  color?: string;
};

export type ReportMetricSet = {
  total_revenue: number;
  revenue_change_pct: number;
  total_expenses: number;
  expenses_change_pct: number;
  net_profit: number;
  net_profit_change_pct: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type ReportData = {
  id?: string;
  business_name?: string;
  period?: ReportPeriod;
  date_range_label?: string;
  summary?: string;
  insights?: string[];
  summary_points?: string[];
  health_rating?: string;
  metrics?: ReportMetricSet;
  breakdown?: ReportBreakdownEntry[];
  cost_trends_notes?: string[];
  item_transaction_summary?: string[];
};

export type ReportResponse = {
  success: boolean;
  report?: {
    id?: string;
    user_id?: string;
    period?: ReportPeriod;
    summary?: string;
    insights?: string[];
    generated_at?: string;
  };
  error?: string;
};

export type ChatResponse = {
  success: boolean;
  reply?: string;
  message?: ChatMessage;
  error?: string;
};

export type UploadResponse = {
  success: boolean;
  inserted?: number;
  error?: string;
  document?: Record<string, unknown>;
  transactionsInserted?: number;
};
