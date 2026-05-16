import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BorrowedClient from "./BorrowedClient";

export const metadata = { title: "Borrowed — WiseCheck" };

export default async function BorrowedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: borrowed = [] } = await supabase
    .from("borrowed").select("*").eq("user_id", user.id).order("borrowed_on", { ascending: false });

  return <BorrowedClient initial={borrowed ?? []} />;
}
