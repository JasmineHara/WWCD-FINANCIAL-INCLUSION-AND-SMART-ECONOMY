// Login Page - Hara
import LoginDemo from "./loginDemo";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <LoginDemo user={user} />;
}
