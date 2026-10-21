    // app/mentor/find/page.tsx
    "use client";

    import { useEffect, useState } from "react";
    import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
    import { TopBar } from "@/components/tracker/TopBar";
    import { Search, ShieldCheck, Calendar } from "lucide-react";

    const supabase = getSupabaseBrowserClient();

    export default function FindMentorPage() {
    const [mentors, setMentors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    supabase
    .from("mentors")
    .select("*")
    .eq("verified", true)
    .then(({ data, error }) => {
        if (data) setMentors(data);
        if (error) console.error("Error fetching mentors:", error.message);
        setLoading(false);
    });
    }, []);

    return (
    <div className="w-full min-h-screen pb-16">
    <TopBar title="Find a Mentor 🔍" />

    <main className="px-8 py-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Advisory Network
        </h1>
        </div>

        {loading ? (
        <div className="p-12 text-center text-gray-400">Loading verified mentors from Supabase...</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mentors.map((m) => (
            <div
                key={m.id}
                className="p-6 bg-surface border rounded-3xl shadow-sm flex flex-col justify-between space-y-4"
                style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
            >
                <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{m.name}</h3>
                    <ShieldCheck className="h-5 w-5 text-emerald-600" title="Verified Expert" />
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">{m.role}</p>
                <span className="inline-block px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                    {m.expertise}
                </span>
                </div>

                <button
                onClick={() => alert(`Requesting booking session with ${m.name}...`)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition hover:brightness-95 cursor-pointer shadow-sm flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--color-primary, #f76f54)" }}
                >
                <Calendar className="h-3.5 w-3.5" />
                <span>Request Session</span>
                </button>
            </div>
            ))}
        </div>
        )}

        {!loading && mentors.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-surface border text-gray-400 shadow-sm" style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}>
            No verified mentors found in the database yet. Submit an application via <a href="/mentor" className="text-amber-600 underline">Become a Mentor</a> to seed records!
        </div>
        )}
    </main>
    </div>
    );
    }