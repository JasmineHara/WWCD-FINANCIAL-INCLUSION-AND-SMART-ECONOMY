"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/tracker/TopBar";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import {
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Send,
} from "lucide-react";

type MentorFormData = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  expertise: string;
  linkedinUrl: string;
  bio: string;
};

export default function BecomeMentorPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<MentorFormData>({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    expertise: "Cash Flow & Budgeting",
    linkedinUrl: "",
    bio: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("mentor_applications").insert([formData] as never);
      if (error) {
        console.error("Supabase insert error:", error.message);
        alert(`Submission failed: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error("Unexpected error:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen pb-16">
      <TopBar title="Become a Mentor 🎓" />

      <main className="px-8 py-6 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Mentors</span>
          </button>
        </div>

        {isSubmitted ? (
          <div
            className="rounded-3xl bg-surface border p-12 text-center space-y-6 shadow-sm max-w-2xl mx-auto"
            style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
          >
            <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Application Submitted!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                Your application has been logged to Supabase. Our team will review your profile within 2–3 business days.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/mentor")}
              className="rounded-full px-6 py-3 text-xs font-bold text-white transition hover:brightness-95 cursor-pointer shadow-sm"
              style={{ backgroundColor: "var(--color-primary, #f76f54)" }}
            >
              Browse Mentors
            </button>
          </div>
        ) : (
          <div
            className="rounded-3xl bg-surface border p-8 space-y-8 shadow-sm"
            style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
          >
            <div className="space-y-3 border-b pb-6" style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Join the mifi Advisory Network</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                Share Your Expertise with Growing Businesses
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-xl border px-4 py-2.5 text-xs bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border px-4 py-2.5 text-xs bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+60..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border px-4 py-2.5 text-xs bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Current Role / Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Advisor at Apex"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-xl border px-4 py-2.5 text-xs bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Area of Expertise *</label>
                <select
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  className="w-full rounded-xl border px-4 py-2.5 text-xs bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
                >
                  <option value="Cash Flow & Budgeting">Cash Flow & Budgeting</option>
                  <option value="Tax Planning & Legal">Tax Planning & Legal</option>
                  <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                  <option value="Marketing & Acquisition">Marketing & Acquisition</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">LinkedIn / CV URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full rounded-xl border px-4 py-2.5 text-xs bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Short Bio *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your experience, the businesses you advise, and what kind of support you can offer."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full rounded-xl border px-4 py-2.5 text-xs bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
                />
              </div>

              <div className="pt-6 border-t flex items-center justify-end gap-4" style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full px-8 py-3 text-xs font-bold text-white transition hover:brightness-95 cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
                  style={{ backgroundColor: "var(--color-primary, #f76f54)" }}
                >
                  {isSubmitting ? <span>Submitting...</span> : <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Application</span>
                  </>}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}