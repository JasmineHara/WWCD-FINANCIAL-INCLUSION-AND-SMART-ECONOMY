import type { Transaction } from "@/types/tracker";

export async function parseStatementFile(
  _file: File | Blob | Buffer,
  _type?: "csv" | "xls" | "xlsx" | "pdf"
): Promise<Transaction[]> {
  return [
    {
      name: "Placeholder transaction",
      date: new Date().toISOString().slice(0, 10),
      description: "Placeholder parsed transaction",
      amount: 0,
      price: 0,
      value: 0,
      type: "expense",
      category: "Miscellaneous",
    },
  ];
}
