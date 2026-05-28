import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppSidebar from "@/components/sidebar/AppSidebar";
import AppLayoutClient from "./AppLayoutClient";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch profile for balance + avatar
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, current_balance")
    .eq("id", user.id)
    .single();

  return (
    <AppLayoutClient
      balance={profile?.current_balance ?? 0}
      userName={profile?.full_name}
      avatarUrl={profile?.avatar_url}
    >
      {children}
    </AppLayoutClient>
  );
}
