import type { Transaction } from "@/types/tracker";
import * as XLSX from "xlsx";

const amountKeys = [
  "amount",
  "total",
  "value",
  "price",
  "net",
  "debit",
  "credit",
  "transaction_amount",
  "amt",
  "balance",
  "amountreceived",
  "amount_received",
  "received",
  "sales",
  "revenue",
];

const dateKeys = [
  "date",
  "transaction_date",
  "posting_date",
  "posted_date",
  "paid_date",
  "created_at",
  "datetime",
  "date_time",
];

const descriptionKeys = [
  "description",
  "details",
  "memo",
  "narration",
  "reference",
  "note",
  "name",
  "merchant",
  "transaction",
  "payee",
  "vendor",
  "item purchased",
  "item",
  "product",
  "item_name",
  "purchase",
  "customer id",
];

const categoryKeys = ["category", "type", "group", "account", "label"];

function detectFileKind(fileName?: string): "income" | "expense" | null {
  const text = (fileName ?? "").toLowerCase();
  if (!text) return null;
  if (/expense|costs|spend|outgoings|expenses/.test(text)) return "expense";
  if (/income|revenue|sales|earnings/.test(text)) return "income";
  return null;
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[$,RM\s]/gi, "").replace(/\((.*)\)/, "-$1");
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function normalizeDate(value: unknown): string {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return new Date().toISOString().slice(0, 10);

    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);

    const match = raw.match(/(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];

    const alt = raw.match(/(\d{2}[/-]\d{2}[/-]\d{4})/);
    if (alt) {
      const [d, m, y] = alt[1].split(/[/-]/);
      return `${y}-${m}-${d}`;
    }
  }

  return new Date().toISOString().slice(0, 10);
}

function inferType(name: string, amount: number, row: Record<string, unknown>): "income" | "expense" {
  const haystack = `${name} ${String(row.description ?? "")} ${String(row.category ?? "")} ${String(row.type ?? "")}`.toLowerCase();
  const category = String(row.category ?? "").toLowerCase();

  if (/income|revenue|sales|salary|commission|refund|return|cash in|receipt/.test(haystack)) return "income";
  if (/expense|cost|payment|purchase|bill|rent|utility|tax|fee|withdraw|debit|spend|outflow|ingredients|packaging|labor|maintenance|marketing|supplies/.test(haystack)) return "expense";

  if (row.type && typeof row.type === "string") {
    const t = row.type.toLowerCase();
    if (t.includes("income") || t.includes("revenue") || t.includes("credit")) return "income";
    if (t.includes("expense") || t.includes("debit") || t.includes("cost")) return "expense";
  }

  if (
    category.includes("ingredients") ||
    category.includes("packaging") ||
    category.includes("utilities") ||
    category.includes("labor") ||
    category.includes("maintenance") ||
    category.includes("marketing") ||
    category.includes("rent") ||
    category.includes("supplies")
  ) {
    return "expense";
  }

  if (amount < 0) return "expense";
  return "income";
}

function pickFirstValue(row: Record<string, unknown>, keys: string[]) {
  const normalizedKeys = keys.map((key) => key.toLowerCase());

  for (const [candidateKey, candidateValue] of Object.entries(row)) {
    const normalizedCandidate = String(candidateKey).toLowerCase();
    if (normalizedKeys.includes(normalizedCandidate)) {
      if (candidateValue !== undefined && candidateValue !== null && String(candidateValue).trim() !== "") {
        return candidateValue;
      }
    }
  }

  for (const key of keys) {
    const value = row[key] ?? row[key.toUpperCase()] ?? row[key.toLowerCase()];
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }

  for (const [candidateKey, candidateValue] of Object.entries(row)) {
    const normalizedCandidate = String(candidateKey).toLowerCase();
    if (normalizedKeys.some((key) => normalizedCandidate.includes(key))) {
      if (candidateValue !== undefined && candidateValue !== null && String(candidateValue).trim() !== "") {
        return candidateValue;
      }
    }
  }

  return undefined;
}

function applyFileKindOverride(row: Transaction, fileKind: "income" | "expense" | null): Transaction {
  if (!fileKind) return row;

  const next = { ...row };
  if (fileKind === "expense") {
    next.type = "expense";
    next.category = next.category && next.category !== "General" ? next.category : "Expenses";
  } else {
    next.type = "income";
    next.category = next.category && next.category !== "General" ? next.category : "Sales";
  }

  return next;
}

function normalizeRow(row: Record<string, unknown>): Transaction | null {
  const amountValue =
    pickFirstValue(row, [
      "amount received",
      "amount",
      "total",
      "value",
      "price",
      "net",
      "sales",
      "revenue",
      "amount_paid",
      "received",
      "debit",
      "credit",
    ]) ??
    pickFirstValue(row, ["debit_amount", "credit_amount", "amount_rm", "total_amount"]);

  if (amountValue === undefined) return null;

  const amount = toNumber(amountValue);
  const name = String(
    pickFirstValue(row, [
      "item purchased",
      "item",
      "description",
      "details",
      "memo",
      "narration",
      "name",
      "product",
      "item_name",
      "purchase",
      "customer id",
    ]) ?? "Imported transaction"
  ).trim() || "Imported transaction";

  const category = String(
    pickFirstValue(row, ["category", "type", "group", "account", "label"]) ?? "General"
  ).trim() || "General";

  const type = inferType(name, amount, row);

  return {
    name,
    description: name,
    date: normalizeDate(pickFirstValue(row, dateKeys)),
    amount,
    price: amount,
    value: amount,
    type,
    category: type === "expense" ? (category || "Expenses") : (category || "Sales"),
  };
}

function parseCsvText(csvText: string, fileName?: string): Transaction[] {
  const fileKind = detectFileKind(fileName);
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(",")
    .map((header) => header.trim().replace(/^"|"$/g, "").toLowerCase());

  const records: Record<string, unknown>[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    const values = line.split(",").map((value) => value.trim().replace(/^"|"$/g, ""));
    const row: Record<string, unknown> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    if (Object.values(row).some((value) => String(value).trim() !== "")) {
      records.push(row);
    }
  }

  return records
    .map((record) => {
      const parsed = normalizeRow(record);
      if (!parsed) return null;
      return applyFileKindOverride(parsed, fileKind);
    })
    .filter((row): row is Transaction => row !== null)
    .filter((row) => Number(row.amount) !== 0 || Number(row.value) !== 0 || Number(row.price) !== 0);
}

function parseWorkbookRows(workbook: XLSX.WorkBook, fileName?: string): Transaction[] {
  const fileKind = detectFileKind(fileName);
  const rows: Transaction[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const sheetRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });

    for (const row of sheetRows) {
      const normalized = normalizeRow(row);
      if (!normalized) continue;
      rows.push(applyFileKindOverride(normalized, fileKind));
    }
  }

  return rows;
}

export async function parseStatementFile(
  file: File | Blob | Buffer,
  type?: "csv" | "xls" | "xlsx" | "pdf",
  fileName?: string
): Promise<Transaction[]> {
  if (!file) return [];

  try {
    if (file instanceof Buffer) {
      const bufferText = file.toString("utf8");
      if (bufferText && bufferText.includes(",") && bufferText.includes("date")) {
        return parseCsvText(bufferText, fileName);
      }

      const workbook = XLSX.read(file, { type: "buffer" });
      return parseWorkbookRows(workbook, fileName);
    }

    if (file instanceof Blob) {
      const arrayBuffer = await file.arrayBuffer();
      const fileType = type ?? ("name" in file ? String(file.name).split(".").pop() ?? "" : "").toLowerCase();

      if (fileType === "csv") {
        const text = Buffer.from(arrayBuffer).toString("utf8");
        return parseCsvText(text, fileName ?? ("name" in file ? String(file.name) : undefined));
      }

      if (fileType === "xls" || fileType === "xlsx") {
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
        return parseWorkbookRows(workbook, fileName ?? ("name" in file ? String(file.name) : undefined));
      }

      return [];
    }

    const fileType = type ?? "";
    const source = Buffer.isBuffer(file) ? file : Buffer.from(file as ArrayBufferLike);

    if (fileType === "csv") {
      const text = source.toString("utf8");
      return parseCsvText(text, fileName);
    }

    if (fileType === "xls" || fileType === "xlsx") {
      const workbook = XLSX.read(source, { type: "buffer" });
      return parseWorkbookRows(workbook, fileName);
    }

    return [];
  } catch (error) {
    console.error("Failed to parse statement file:", error);
    return [];
  }
}
