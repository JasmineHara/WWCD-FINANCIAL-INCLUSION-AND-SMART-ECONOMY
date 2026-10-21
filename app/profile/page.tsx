// Profile Page - Keisha

"use client";

import { useState, useEffect, Suspense } from "react";
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
  const searchParams = useSearchParams();
  const viewUserId = searchParams.get("id"); // URL param for viewing mentor/peer profiles

  const isSelf = !viewUserId;

  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
          // Fetch from localStorage or backend user endpoint
          const savedName = localStorage.getItem("mifi_user_name") || "";
          const savedBusiness = localStorage.getItem("mifi_business_name") || "";
          const savedEmail = localStorage.getItem("mifi_user_email") || "";
          const savedDob = localStorage.getItem("mifi_user_dob") || "";
          const savedPhone = localStorage.getItem("mifi_user_phone") || "";
          const savedLocation = localStorage.getItem("mifi_user_location") || "";
          const savedIndustry = localStorage.getItem("mifi_user_industry") || "";
          const savedBio = localStorage.getItem("mifi_user_bio") || "";

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
          // TODO: Replace with backend API fetch: e.g., await fetch(`/api/users/${viewUserId}`)
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
      // Sync locally for frontend state persistence
      localStorage.setItem("mifi_user_name", profile.name);
      localStorage.setItem("mifi_business_name", profile.businessName);
      localStorage.setItem("mifi_user_email", profile.email);
      localStorage.setItem("mifi_user_dob", profile.dob);
      localStorage.setItem("mifi_user_phone", profile.phone);
      localStorage.setItem("mifi_user_location", profile.location);
      localStorage.setItem("mifi_user_industry", profile.industry);
      localStorage.setItem("mifi_user_bio", profile.bio);
      
      // TODO: Connect backend PUT/PATCH endpoint
      // await fetch('/api/profile', { method: 'PUT', body: JSON.stringify(profile) });

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const handleLogout = async () => {
  try {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut(); // Clears Supabase cookies & session
  } catch (error) {
    console.error("Error signing out:", error);
  } finally {
    localStorage.clear();
    router.push("/login");
    router.refresh(); // Refresh page state so server components re-evaluate session
  }
};

  return (
    <div className="w-full min-h-screen pb-16">
      <TopBar title={isSelf ? "Your Profile" : "Mentor Profile"} />

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
            <div className="h-28 w-28 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center shadow-inner overflow-hidden border-4 border-white dark:border-zinc-800">
              <User className="h-14 w-14 text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {profile.businessName || profile.name
                  ? `${profile.businessName} ${profile.businessName && profile.name ? "-" : ""} ${profile.name}`
                  : "User Profile"}
              </h3>
              <p className="text-sm text-gray-500 max-w-md mt-1">
                {profile.bio || "No profile bio provided yet."}
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
                  Name Of Business
                </label>
                <input
                  type="text"
                  placeholder="Enter business name"
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
                  Business Location
                </label>
                <input
                  type="text"
                  placeholder="City, Country"
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
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
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
                  Industry / Areas Of Expertise
                </label>
                <input
                  type="text"
                  placeholder="e.g. Retail & E-Commerce"
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
                  Date Of Birth
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
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+60..."
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
                    Edit Profile
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="profile-form"
                    className="flex-1 max-w-xs rounded-full py-3 text-sm font-semibold text-white transition hover:brightness-95 shadow-sm flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#4a6741" }}
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Profile</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 max-w-xs rounded-full py-3 text-sm font-semibold text-white transition hover:brightness-95 shadow-sm"
                  style={{ backgroundColor: "#f76f54" }}
                >
                  Logout
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
                  <span>{isFollowing ? "Following" : "+ Follow"}</span>
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
                  <span>Message</span>
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
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading profile...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}