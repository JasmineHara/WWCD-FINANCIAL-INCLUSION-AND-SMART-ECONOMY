// Profile Page - Keisha

"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { TopBar } from "@/components/tracker/TopBar";
import {
  User,
  Mail,
  Building,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Save,
  Check,
  UserPlus,
  MessageCircle,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useLanguage } from "@/context/LanguageContext";

interface UserProfile {
  name: string;
  businessName: string;
  email: string;
  dob: string;
  phone: string;
  location: string;
  industry: string;
  bio: string;
}

function ProfilePageContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const viewUserId = searchParams.get("id"); // URL param for viewing mentor/peer profiles

  const isSelf = !viewUserId;

  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean initial state with no mock values
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    businessName: "",
    email: "",
    dob: "",
    phone: "",
    location: "",
    industry: "",
    bio: "",
  });

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        if (isSelf) {
          const supabase = getSupabaseBrowserClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          const savedName = localStorage.getItem("mifi_user_name") || "";
          const savedBusiness = localStorage.getItem("mifi_business_name") || "";
          const savedEmail = localStorage.getItem("mifi_user_email") || user?.email || "";
          const savedDob = localStorage.getItem("mifi_user_dob") || "";
          const savedPhone = localStorage.getItem("mifi_user_phone") || "";
          const savedLocation = localStorage.getItem("mifi_user_location") || "";
          const savedIndustry = localStorage.getItem("mifi_user_industry") || "";
          const savedBio = localStorage.getItem("mifi_user_bio") || "";

          if (user) {
            const { data: profileRow, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .maybeSingle();

            if (!error && profileRow) {
              const nextProfile = {
                name: profileRow.full_name ?? savedName,
                businessName: profileRow.business_name ?? savedBusiness,
                email: profileRow.email ?? user.email ?? savedEmail,
                dob: profileRow.dob ?? savedDob,
                phone: profileRow.phone ?? savedPhone,
                location: profileRow.location ?? savedLocation,
                industry: profileRow.industry ?? savedIndustry,
                bio: profileRow.bio ?? savedBio,
              };

              setProfile(nextProfile);
              localStorage.setItem("mifi_user_name", nextProfile.name);
              localStorage.setItem("mifi_business_name", nextProfile.businessName);
              localStorage.setItem("mifi_user_email", nextProfile.email);
              localStorage.setItem("mifi_user_dob", nextProfile.dob);
              localStorage.setItem("mifi_user_phone", nextProfile.phone);
              localStorage.setItem("mifi_user_location", nextProfile.location);
              localStorage.setItem("mifi_user_industry", nextProfile.industry);
              localStorage.setItem("mifi_user_bio", nextProfile.bio);
              return;
            }
          }

          setProfile({
            name: savedName,
            businessName: savedBusiness,
            email: savedEmail,
            dob: savedDob,
            phone: savedPhone,
            location: savedLocation,
            industry: savedIndustry,
            bio: savedBio,
          });
        } else {
          setProfile({
            name: "",
            businessName: "",
            email: "",
            dob: "",
            phone: "",
            location: "",
            industry: "",
            bio: "",
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [isSelf, viewUserId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);

    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      localStorage.setItem("mifi_user_name", profile.name);
      localStorage.setItem("mifi_business_name", profile.businessName);
      localStorage.setItem("mifi_user_email", profile.email);
      localStorage.setItem("mifi_user_dob", profile.dob);
      localStorage.setItem("mifi_user_phone", profile.phone);
      localStorage.setItem("mifi_user_location", profile.location);
      localStorage.setItem("mifi_user_industry", profile.industry);
      localStorage.setItem("mifi_user_bio", profile.bio);

      if (user) {
        const { error } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            email: profile.email || user.email,
            full_name: profile.name,
            business_name: profile.businessName,
            dob: profile.dob,
            phone: profile.phone,
            location: profile.location,
            industry: profile.industry,
            bio: profile.bio,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );

        if (error) {
          console.error("Supabase profile save error:", error.message);
        }
      }

      setSuccessMessage(t.profile.success);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      localStorage.clear();
      router.push("/login");
      router.refresh();
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
  };

  return (
    <div className="w-full min-h-screen pb-16">
      <TopBar title={isSelf ? t.profile.yourProfile : t.profile.mentorProfile} />

      <main className="px-8 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Success Alert Banner */}
        {successMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 p-4 text-emerald-800 dark:text-emerald-300 text-sm">
            <Check className="h-5 w-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Profile Card Container */}
        <div
          className="relative rounded-3xl bg-surface border p-8 shadow-sm space-y-8"
          style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}
        >
          {/* Avatar & Subheader Banner */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative h-28 w-28">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-28 w-28 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center shadow-inner overflow-hidden border-4 border-white dark:border-zinc-800 transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Upload profile image"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Profile preview"
                    width={112}
                    height={112}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-14 w-14 text-gray-400" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {profile.businessName || profile.name
                  ? `${profile.businessName} ${profile.businessName && profile.name ? "-" : ""} ${profile.name}`
                  : t.profile.userProfile}
              </h3>
              <p className="text-sm text-gray-500 max-w-md mt-1">
                {profile.bio || t.profile.noBio}
              </p>
            </div>
          </div>

          {/* Profile Form Grid */}
          <form id="profile-form" onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Of Business */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-amber-600" />
                  {t.profile.businessName}
                </label>
                <input
                  type="text"
                  placeholder={t.profile.businessPlaceholder}
                  disabled={!isEditing || !isSelf || isLoading}
                  value={profile.businessName}
                  onChange={(e) =>
                    setProfile({ ...profile, businessName: e.target.value })
                  }
                  className="w-full rounded-xl border px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 disabled:bg-black/5 dark:disabled:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Business Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-600" />
                  {t.profile.location}
                </label>
                <input
                  type="text"
                  placeholder={t.profile.locationPlaceholder}
                  disabled={!isEditing || !isSelf || isLoading}
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                  className="w-full rounded-xl border px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 disabled:bg-black/5 dark:disabled:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-amber-600" />
                  {t.profile.email}
                </label>
                <input
                  type="email"
                  placeholder={t.profile.emailPlaceholder}
                  disabled={!isEditing || !isSelf || isLoading}
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="w-full rounded-xl border px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 disabled:bg-black/5 dark:disabled:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Industry / Areas Of Expertise */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-amber-600" />
                  {t.profile.industry}
                </label>
                <input
                  type="text"
                  placeholder={t.profile.industryPlaceholder}
                  disabled={!isEditing || !isSelf || isLoading}
                  value={profile.industry}
                  onChange={(e) =>
                    setProfile({ ...profile, industry: e.target.value })
                  }
                  className="w-full rounded-xl border px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 disabled:bg-black/5 dark:disabled:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Date Of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-600" />
                  {t.profile.dob}
                </label>
                <input
                  type="date"
                  disabled={!isEditing || !isSelf || isLoading}
                  value={profile.dob}
                  onChange={(e) =>
                    setProfile({ ...profile, dob: e.target.value })
                  }
                  className="w-full rounded-xl border px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 disabled:bg-black/5 dark:disabled:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-amber-600" />
                  {t.profile.phone}
                </label>
                <input
                  type="tel"
                  placeholder={t.profile.phonePlaceholder}
                  disabled={!isEditing || !isSelf || isLoading}
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="w-full rounded-xl border px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 disabled:bg-black/5 dark:disabled:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </form>

          {/* Action Footer Buttons */}
          <div
            className="pt-6 border-t flex flex-wrap items-center justify-between gap-4"
            style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}
          >
            {isSelf ? (
              <>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 max-w-xs rounded-full py-3 text-sm font-semibold text-white transition hover:brightness-95 shadow-sm"
                    style={{ backgroundColor: "#4a6741" }}
                  >
                    {t.profile.editProfile}
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="profile-form"
                    className="flex-1 max-w-xs rounded-full py-3 text-sm font-semibold text-white transition hover:brightness-95 shadow-sm flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#4a6741" }}
                  >
                    <Save className="h-4 w-4" />
                    <span>{t.profile.saveProfile}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 max-w-xs rounded-full py-3 text-sm font-semibold text-white transition hover:brightness-95 shadow-sm"
                  style={{ backgroundColor: "#f76f54" }}
                >
                  {t.profile.logout}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className="flex-1 rounded-full py-3 text-sm font-semibold text-white transition hover:brightness-95 shadow-sm flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: isFollowing ? "#385330" : "#4a6741",
                  }}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{isFollowing ? t.profile.following : t.profile.follow}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alert(`Opening chat with ${profile.name || "user"}...`)
                  }
                  className="flex-1 rounded-full py-3 text-sm font-semibold text-white transition hover:brightness-95 shadow-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#f76f54" }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{t.profile.message}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  const { t } = useLanguage();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">{t.profile.loading}</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}