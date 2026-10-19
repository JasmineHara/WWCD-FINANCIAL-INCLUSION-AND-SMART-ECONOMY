// Header - Keisha

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">WWCD Project</h1>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
          Active
        </span>
      </div>
    </header>
  );
}