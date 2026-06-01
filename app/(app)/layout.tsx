import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppSidebar from "@/components/sidebar/AppSidebar";
import AppLayoutClient from "./AppLayoutClient";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch profile for balance + avatar
  let { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, current_balance")
    .eq("id", user.id)
    .single();

  // If profile does not exist yet (brand new user), create it on demand
  if (error || !profile) {
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "New User",
        avatar_url: user.user_metadata?.avatar_url || null,
        current_balance: 0,
      })
      .select("full_name, avatar_url, current_balance")
      .single();

    if (!insertError && newProfile) {
      profile = newProfile;
    }
  }

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
