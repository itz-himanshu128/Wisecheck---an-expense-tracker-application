import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LendedClient from "./LendedClient";

export const metadata = { title: "Lended — WiseCheck" };

export default async function LendedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: lended = [] } = await supabase
    .from("lended").select("*").eq("user_id", user.id).order("lended_on", { ascending: false });

  return <LendedClient initial={lended ?? []} />;
}
