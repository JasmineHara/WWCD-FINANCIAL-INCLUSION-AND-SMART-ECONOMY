// Login Page - Hara
export const dynamic = "force-dynamic";

import LoginDemo from "./loginDemo";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/tracker");
  }

  return <LoginDemo user={user} />;
}
