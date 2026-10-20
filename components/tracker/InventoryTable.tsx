import type { Transaction } from "@/types/tracker";

type InventoryTableProps = {
  transactions: Transaction[];
  aiSummary: string | null;
  isLoading: boolean;
};

export function InventoryTable({ transactions, isLoading }: InventoryTableProps) {
  if (isLoading) {
    return <div className="rounded border bg-white p-6 text-sm text-gray-500">Loading transactions...</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                No transactions yet.
              </td>
            </tr>
          ) : (
            transactions.map((transaction, index) => {
              const description = transaction.name ?? transaction.description ?? "Imported transaction";
              const amount = transaction.price ?? transaction.amount ?? transaction.value ?? 0;
              const category = transaction.category ?? "General";

              return (
                <tr key={transaction.id ?? `${transaction.date ?? "unknown"}-${index}`} className="border-t">
                  <td className="px-4 py-3">{transaction.date ?? "—"}</td>
                  <td className="px-4 py-3">{description}</td>
                  <td className="px-4 py-3">{amount}</td>
                  <td className="px-4 py-3">{category}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
