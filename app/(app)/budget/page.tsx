import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BudgetClient from "./BudgetClient";

export const metadata = { title: "Budget — WiseCheck" };

function getMonthRange() {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0],
    end:   new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0],
  };
}

export default async function BudgetPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { start, end } = getMonthRange();

  const [{ data: budgets = [] }, { data: categories = [] }, { data: expenses = [] }] = await Promise.all([
    supabase.from("budgets").select("*, categories(name, color)").eq("user_id", user.id),
    supabase.from("categories").select("*").eq("user_id", user.id),
    supabase.from("expenses").select("amount, type, expense_categories(category_id)")
      .eq("user_id", user.id).eq("type", "debit").gte("date", start).lte("date", end),
  ]);

  // Compute spending per category and total this month
  const totalSpent = (expenses ?? []).reduce((acc, e) => acc + e.amount, 0);
  const catSpending: Record<string, number> = {};
  for (const exp of expenses ?? []) {
    for (const ec of (exp.expense_categories as { category_id: string }[])) {
      catSpending[ec.category_id] = (catSpending[ec.category_id] ?? 0) + exp.amount;
    }
  }

  return <BudgetClient budgets={budgets ?? []} categories={categories ?? []} catSpending={catSpending} totalSpent={totalSpent} />;
}
