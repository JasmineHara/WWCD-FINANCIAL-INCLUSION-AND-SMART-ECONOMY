// Home Page - Keisha

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          WWCD Project
        </p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Finance Tracker</h1>
        <p className="mt-3 text-slate-600">
          Your app is running. This page is the default home screen.
        </p>
      </div>
    </main>
  );
}