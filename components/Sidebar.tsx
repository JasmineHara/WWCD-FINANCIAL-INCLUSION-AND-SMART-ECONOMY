// Sidebar - Keisha
"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 border-r border-slate-200 bg-slate-100 p-4">
      <h2 className="text-lg font-bold text-slate-900">Navigation</h2>
      <nav className="mt-6 space-y-2 text-sm text-slate-700">
        <Link href="/" className="block hover:text-slate-900">
          Dashboard
        </Link>
        <Link href="/tracker" className="block hover:text-slate-900">
          Tracker
        </Link>
        <Link href="/tips" className="block hover:text-slate-900">
          Tips
        </Link>
        <Link href="/chat" className="block hover:text-slate-900">
          Chat
        </Link>
        <Link href="/mentor" className="block hover:text-slate-900">
          Mentor
        </Link>
        <Link href="/profile" className="block hover:text-slate-900">
          Profile
        </Link>
      </nav>
    </aside>
  );
}