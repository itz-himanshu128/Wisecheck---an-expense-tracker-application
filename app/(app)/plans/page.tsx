import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PlansClient from "./PlansClient";
import { Plan } from "@/lib/types";

export const metadata = { title: "Plans — WiseCheck" };

export default async function PlansPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/auth/login");

  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return <PlansClient initialPlans={(plans as Plan[]) ?? []} />;
}
