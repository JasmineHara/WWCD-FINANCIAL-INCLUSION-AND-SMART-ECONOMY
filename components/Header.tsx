// Header - Keisha
"use client";

import Link from "next/link";
import { Languages, Moon } from "lucide-react";

export default function Header() {
  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}
  }

  return (
    <header className="flex items-center justify-end gap-8 px-8 py-8">
      {/* TODO: BM/EN switch, wire up once the team picks an i18n approach */}
      <button
        type="button"
        aria-label="Switch language (BM / EN)"
        className="transition hover:opacity-70"
      >
        <Languages className="h-7 w-7" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="transition hover:opacity-70"
      >
        <Moon className="h-7 w-7" aria-hidden="true" />
      </button>

      <Link href="/profile" className="text-lg hover:underline">
        Your Profile
      </Link>
    </header>
  );
}
