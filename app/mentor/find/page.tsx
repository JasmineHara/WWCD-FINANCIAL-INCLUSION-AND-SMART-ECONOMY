"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { TopBar } from "@/components/tracker/TopBar";
import { useLanguage } from "@/context/LanguageContext";
import { Search, ShieldCheck, Calendar } from "lucide-react";

type MentorRecord = {
  id: string;
  name: string;
  role: string;
  expertise: string;
  bio?: string;
  verified?: boolean;
};

const STATIC_MENTORS: MentorRecord[] = [
  {
    id: "m-1",
    name: "Aisha Rahman",
    role: "Financial Planning Mentor",
    expertise: "Cash Flow & Budgeting",
    bio: "Helps founders build realistic cash-flow models and investor-ready budgeting habits.",
    verified: true,
  },
  {
    id: "m-2",
    name: "Daniel Lim",
    role: "Sales Strategy Advisor",
    expertise: "Sales & Growth",
    bio: "Guides early-stage teams on pricing, pipeline growth, and customer retention systems.",
    verified: true,
  },
  {
    id: "m-3",
    name: "Nadia Ismail",
    role: "Operations Mentor",
    expertise: "Operations & Systems",
    bio: "Supports business owners with process mapping, team SOPs, and operational efficiency.",
    verified: true,
  },
  {
    id: "m-4",
    name: "Hariz Abdullah",
    role: "Marketing Mentor",
    expertise: "Marketing & Branding",
    bio: "Helps brands sharpen positioning, messaging, and sustainable digital acquisition channels.",
    verified: true,
  },
];

export default function FindMentorPage() {
  const { t } = useLanguage();
  const [mentors, setMentors] = useState<MentorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("All");

  useEffect(() => {
    let ignore = false;

    const loadMentors = () => {
      if (!ignore) {
        setMentors(STATIC_MENTORS);
        setLoading(false);
      }
    };

    loadMentors();
    return () => {
      ignore = true;
    };
  }, []);

  const expertiseOptions = t.mentor.expertiseOptions.map((option) => option.value);

  const filteredMentors = useMemo(() => {
    const value = searchQuery.trim().toLowerCase();

    return mentors.filter((mentor) => {
      const matchesExpertise = selectedExpertise === "All" || mentor.expertise === selectedExpertise;
      const haystack = `${mentor.name} ${mentor.role} ${mentor.expertise} ${mentor.bio ?? ""}`.toLowerCase();
      const matchesSearch = value.length === 0 || haystack.includes(value);
      return matchesExpertise && matchesSearch;
    });
  }, [mentors, searchQuery, selectedExpertise]);

  return (
    <div className="w-full min-h-screen pb-16">
      <TopBar title={t.nav.findMentor} />

      <main className="px-8 py-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
              {t.mentor.advisoryNetwork}
            </p>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t.mentor.findRightMentor}</h1>
          </div>

          <a
            href="/mentor"
            className="rounded-full border px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition"
            style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
          >
            {t.nav.becomeMentor}
          </a>
        </div>

        <div className="rounded-3xl bg-surface border p-4 shadow-sm" style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.mentor.searchPlaceholder}
                className="w-full rounded-xl border bg-white dark:bg-zinc-800 px-9 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
              />
            </div>

            <div className="min-w-[220px]">
              <label className="sr-only">{t.mentor.filterLabel}</label>
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="w-full rounded-xl border bg-white dark:bg-zinc-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
              >
                {t.mentor.expertiseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">{t.mentor.loadingMentors}</div>
        ) : filteredMentors.length === 0 ? (
          <div
            className="p-12 text-center rounded-3xl bg-surface border text-gray-500 shadow-sm"
            style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
          >
            {t.mentor.noMentorMatch}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="p-6 bg-surface border rounded-3xl shadow-sm flex flex-col justify-between space-y-4"
                style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{mentor.name}</h3>
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">{mentor.role}</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <ShieldCheck className="h-4 w-4" aria-label="Verified mentor" />
                    </div>
                  </div>

                  <span className="inline-block px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                    {mentor.expertise}
                  </span>

                  {mentor.bio ? (
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{mentor.bio}</p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.mentor.experiencedAdvisor}</p>
                  )}
                </div>

                <button
                  onClick={() => alert(`Requesting a session with ${mentor.name}...`)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition hover:brightness-95 cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--color-primary, #f76f54)" }}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{t.mentor.requestSession}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

