"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
        // Supabase returns no error when the email is already registered
        // (to avoid leaking which emails exist), but identities is empty.
        showStatus("An account with this email already exists. Try logging in.", true);
      } else {
        showStatus("Check your email to confirm your account.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showStatus(error.message, true);
      } else {
        showStatus("Logged in successfully.");
        router.push("/dashboard");
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
  return (
    // ===================== FRONTEND UI START =====================
    <div>
      <h1>{mode === "signup" ? "Sign up" : "Log in"}</h1>

      {user ? (
        <div>
          <p>Signed in as {user.email}</p>
          <button type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Log in"}
            </button>
          </form>

          <button type="button" onClick={handleGoogleSignIn} disabled={loading}>
            Continue with Google
          </button>

          <button type="button" onClick={toggleMode}>
            {mode === "signup"
              ? "Already have an account? Log in"
              : "No account? Sign up"}
          </button>
        </>
      )}

      {status && <p role={isError ? "alert" : "status"}>{status}</p>}
    </div>
    // ====================== FRONTEND UI END ======================
  );
}
