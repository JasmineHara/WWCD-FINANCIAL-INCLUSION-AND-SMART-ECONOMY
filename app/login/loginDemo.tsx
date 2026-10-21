"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useLanguage } from "@/context/LanguageContext";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

type LoginDemoProps = {
  user: User | null;
};

type Mode = "signup" | "login";

export default function LoginDemo({ user }: LoginDemoProps) {
  // ---------------------------------------------------------------
  // STATE & LOGIC  (backend) - frontend: please don't edit this part.
  // Everything you need for the UI is listed in AUTH_UI_GUIDE.md
  // ---------------------------------------------------------------
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = getSupabaseBrowserClient();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  function showStatus(message: string, error = false) {
    setStatus(message);
    setIsError(error);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    showStatus("");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        showStatus(error.message, true);
      } else if (data.user && data.user.identities?.length === 0) {
        showStatus(t.auth.alreadyExists, true);
      } else {
        const createdUser = data.user;

        if (createdUser) {
          await supabase.from("profiles").upsert(
            {
              id: createdUser.id,
              email: createdUser.email ?? email,
              full_name: "",
              business_name: "",
              dob: "",
              phone: "",
              location: "",
              industry: "",
              bio: "",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" },
          );
        }
        showStatus(t.auth.emailConfirmation);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showStatus(error.message, true);
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase.from("profiles").upsert(
            {
              id: user.id,
              email: user.email ?? email,
              full_name: "",
              business_name: "",
              dob: "",
              phone: "",
              location: "",
              industry: "",
              bio: "",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" },
          );
        }

        showStatus(t.auth.loginSuccess);
        router.push("/");
        router.refresh();
      }
    }

    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    showStatus("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    // On success the browser is redirected to Google, so we only land
    // here with an error if something went wrong before the redirect.
    if (error) {
      showStatus(error.message, true);
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh();
  }

  function toggleMode() {
    setMode((current) => (current === "signup" ? "login" : "signup"));
    showStatus("");
  }

  // ---------------------------------------------------------------
  // UI  (frontend) - build the design inside the return() below.
  //
  // Available to you:
  //   user              -> logged-in user object, or null
  //   mode              -> "login" | "signup"
  //   toggleMode()      -> switch between login and signup
  //   email, setEmail   -> controlled email input
  //   password, setPassword -> controlled password input
  //   handleSubmit      -> put on <form onSubmit={handleSubmit}>
  //   handleGoogleSignIn-> onClick of the "Continue with Google" button
  //   handleSignOut     -> onClick of a sign out button
  //   status, isError   -> message text + whether it's an error
  //   loading           -> true while a request is running
  // ---------------------------------------------------------------
  
   // "welcome" = the Log In / Sign Up choice screen
  const [step, setStep] = useState<"welcome" | "form">("welcome");
  // if fail
  const callbackFailed =
    useSearchParams().get("error") === "auth_callback_failed";

  function choose(next: Mode) {
    if (mode !== next) toggleMode();
    setStep("form");
  }

  // for ease of reusing code
  const pill =
    "flex h-12 w-full items-center justify-center rounded-full font-heading text-lg text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60";
  const field =
    "h-12 w-full rounded-lg border border-cute-orange bg-input px-4 text-black outline-none focus:ring-2 focus:ring-orange";
  const label = "mb-1 block text-sm font-medium";

  
  return (
    // ===================== FRONTEND UI START =====================
    <div className="flex min-h-screen">
      {/* Left panel*/}
      <section className="flex w-full items-center justify-center bg-bg px-6 py-10 font-heading text-fg lg:w-[62.5%]">
        <div className="flex w-full max-w-sm flex-col items-center">
          <div className="relative h-36 w-36 flex items-center justify-center p-2 overflow-visible">
            <Image
              src="/mifi-logo.png"
              alt="mifi logo"
              fill
              sizes="144px"
              className="object-contain filter drop-shadow-md"
              priority
            />
          </div>
      
      {user ? (
            /* ---------- Already signed in ---------- */
            <>
              <h1 className="mb-2 text-xl font-semibold">{t.auth.signedInTitle}</h1>
              <p className="mb-6 break-all text-center text-sm">
                {t.auth.signedInAs} {user.email}
              </p>
              <Link href="/" className={`${pill} bg-primary`}>
                {t.auth.goToDashboard}
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className={`${pill} mt-3 bg-accent`}
              >
                {t.auth.signOut}
              </button>
            </>
          ) : step === "welcome" ? (
            /* ---------- Welcome ---------- */
            <>
              <h1 className="mb-8 text-xl font-semibold">{t.auth.welcomeTitle}</h1>
              <button
                type="button"
                onClick={() => choose("login")}
                className={`${pill} bg-primary`}
              >
                {t.auth.loginButton}
              </button>
              <button
                type="button"
                onClick={() => choose("signup")}
                className={`${pill} mt-3 bg-accent`}
              >
                {t.auth.signUp}
              </button>
            </>
          ) : (
            /* ---------- Login / Sign up form ---------- */
            <>
              <h1 className="mb-6 text-xl font-semibold">
                {mode === "signup" ? t.auth.signUpFree : t.auth.loginFormTitle}
              </h1>

              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                  <label htmlFor="email" className={label}>
                    {t.auth.email}
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={field}
                  />
                </div>
                <div>
                  <label htmlFor="password" className={label}>
                    {t.auth.password}
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                    className={field}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`${pill} bg-primary`}
                >
                  {loading ? t.auth.pleaseWait : t.auth.getStarted}
                </button>
              </form>

              {/* Feedback: wrong password etc */}
              {status ? (
                <p
                  role={isError ? "alert" : "status"}
                  className={`mt-4 w-full rounded-lg px-3 py-2 text-center text-sm ${
                    isError
                      ? "bg-red-100 text-red-700"
                      : "bg-green-moss/20 text-dark-moss-green dark:text-green-moss"
                  }`}
                >
                  {status}
                </p>
              ) : callbackFailed ? (
                <p
                  role="alert"
                  className="mt-4 w-full rounded-lg bg-red-100 px-3 py-2 text-center text-sm text-red-700"
                >
                  {t.auth.googleError}
                </p>
              ) : null}

              {/* Google button on sign up */}
              {mode === "signup" && (
                <>
                  <p className="my-3 font-semibold">{t.auth.or}</p>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className={`${pill} bg-accent`}
                  >
                    {t.auth.signInGoogle}
                  </button>
                </>
              )}

              <p className="mt-4 text-sm">
                {mode === "signup" ? t.auth.alreadyHaveAccount : t.auth.noAccount}
                <button
                  type="button"
                  onClick={toggleMode}
                  disabled={loading}
                  className="font-semibold text-green-moss hover:underline"
                >
                  {mode === "signup" ? t.auth.loginButton : t.auth.signUp}
                </button>
              </p>
            </>
          )}
        </div>
      </section>

        <aside className="relative hidden flex-1 lg:block" aria-hidden="true">
        <Image
          src="/books_finance.jpg"
          alt=""
          fill
          sizes="40vw"
          priority
          className="object-cover"
        />
      </aside>
    </div>
    // ====================== FRONTEND UI END ======================
  );
}
