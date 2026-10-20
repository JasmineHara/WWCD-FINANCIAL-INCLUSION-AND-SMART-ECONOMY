export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r bg-white p-4 md:block">
      <div className="text-lg font-semibold">Tracker</div>
      <nav className="mt-6 space-y-2 text-sm text-gray-600">
        <div className="rounded bg-gray-100 px-3 py-2 font-medium text-gray-900">Overview</div>
        <div className="px-3 py-2">Transactions</div>
        <div className="px-3 py-2">Reports</div>
      </nav>
    </aside>
  );
}
