import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/TopBar";

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
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar
          balance={profile?.current_balance ?? 0}
          userName={profile?.full_name}
          avatarUrl={profile?.avatar_url}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
