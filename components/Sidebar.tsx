// Sidebar - Keisha
"use client";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 border-r border-slate-200 bg-slate-100 p-4">
      <h2 className="text-lg font-bold text-slate-900">Navigation</h2>
      <nav className="mt-6 space-y-2 text-sm text-slate-700">
        <div>Dashboard</div>
        <div>Tracker</div>
        <div>Tips</div>
        <div>Chat</div>
        <div>Profile</div>
      </nav>
    </aside>
  );
}