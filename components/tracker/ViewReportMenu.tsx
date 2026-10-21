"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { ReportPeriod } from "@/types/tracker";

interface ViewReportMenuProps {
  onSelectPeriod: (period: ReportPeriod) => void;
  isGenerating?: boolean;
}

export function ViewReportMenu({ onSelectPeriod, isGenerating = false }: ViewReportMenuProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const periods: { label: string; value: ReportPeriod }[] = [
    { label: t.tracker.reportMenuDaily, value: "daily" as ReportPeriod },
    { label: t.tracker.reportMenuWeekly, value: "weekly" as ReportPeriod },
    { label: t.tracker.reportMenuMonthly, value: "monthly" as ReportPeriod },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isGenerating}
        className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition hover:brightness-95 disabled:opacity-50"
        style={{
          backgroundColor: "var(--mifi-accent-secondary)",
          color: "var(--mifi-accent-secondary-text)",
        }}
      >
        <span>{isGenerating ? t.tracker.reportMenuGenerating : t.tracker.reportMenuView}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-zinc-800 shadow-lg border z-50 py-1 overflow-hidden"
          style={{ borderColor: "var(--mifi-border)" }}
        >
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => {
                setIsOpen(false);
                onSelectPeriod(period.value);
              }}
              className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-100"
            >
              {period.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}