import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const metadata = { title: "Dashboard — WiseCheck" };

function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const end   = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
  return { start, end };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { start, end } = getMonthRange();

  // Fetch categories
  const { data: categories = [] } = await supabase
    .from("categories").select("*").eq("user_id", user.id).order("name");

  // Fetch this month's expenses with their categories
  const { data: expenses = [] } = await supabase
    .from("expenses")
    .select("*, expense_categories(category_id)")
    .eq("user_id", user.id)
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: false });

  // Build chart data: sum by category (debits only)
  const catMap: Record<string, { name: string; value: number; color: string }> = {};
  for (const exp of expenses ?? []) {
    if (exp.type !== "debit") continue;
    const catIds = (exp.expense_categories as { category_id: string }[]).map((ec) => ec.category_id);
    if (!catIds.length) {
      catMap["_uncategorised"] = {
        name: "Uncategorised",
        value: (catMap["_uncategorised"]?.value ?? 0) + exp.amount,
        color: "#8888AA",
      };
    }
    for (const cid of catIds) {
      const cat = categories?.find((c) => c.id === cid);
      if (!cat) continue;
      catMap[cid] = {
        name: cat.name,
        value: (catMap[cid]?.value ?? 0) + exp.amount,
        color: cat.color,
      };
    }
  }
  const chartData = Object.values(catMap).sort((a, b) => b.value - a.value);

  // Build line data: sum by day this month
  const dayMap: Record<string, number> = {};
  for (const exp of expenses ?? []) {
    if (exp.type !== "debit") continue;
    dayMap[exp.date] = (dayMap[exp.date] ?? 0) + exp.amount;
  }
  const lineData = Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ name: date.slice(5), value }));

  return (
    <DashboardClient
      categories={categories ?? []}
      chartData={chartData}
      lineData={lineData}
    />
  );
}
