"use client";

import Link from "next/link";
import { Languages, Moon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Header() {
  const { lang, setLang, t } = useLanguage();

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}
  }

  function handleQuickLanguageToggle() {
    const nextLang = lang === "en" ? "bm" : "en";
    setLang(nextLang);
  }

  return (
    <header className="flex items-center justify-end gap-8 px-8 py-8">
      <button
        type="button"
        onClick={handleQuickLanguageToggle}
        aria-label={t.header.language}
        className="flex cursor-pointer items-center gap-1.5 text-gray-700 transition hover:opacity-75 dark:text-gray-300"
        title={lang === "en" ? "Switch to Bahasa Malaysia" : "Tukar ke Bahasa Inggeris"}
      >
        <Languages className="h-6 w-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />
        <span className="text-xs font-bold uppercase">{lang}</span>
      </button>

      {/* Theme Toggle Button */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={lang === "en" ? t.header.switchToDark : t.header.switchToLight}
        className="transition hover:opacity-75 cursor-pointer text-gray-700 dark:text-gray-300"
      >
        <Moon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Profile Link */}
      <Link href="/profile" className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:underline">
        {t.nav.profile}
      </Link>
    </header>
  );
}