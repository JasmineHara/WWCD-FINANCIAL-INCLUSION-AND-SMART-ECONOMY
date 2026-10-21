"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function TipsPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl py-8">
      <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">{t.page.businessTipsTitle}</h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">{t.page.businessTipsDescription}</p>

      <div className="space-y-4">
        {t.tips.map((tip: string, idx: number) => (
          <div
            key={idx}
            className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
              {idx + 1}
            </div>
            <p className="pt-1 leading-relaxed text-slate-800 dark:text-slate-200">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}