"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, BarChart2, TrendingUp, Plus, X, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useExpenseStore, PendingExpense } from "@/lib/store/expenseStore";
import FloatingSaveButton from "@/components/ui/FloatingSaveButton";
import dynamic from "next/dynamic";
import { Category } from "@/lib/types";
import { useEffect } from "react";

const ExpensePieChart  = dynamic(() => import("@/components/charts/ExpensePieChart"),  { ssr: false });
const ExpenseBarChart  = dynamic(() => import("@/components/charts/ExpenseBarChart"),  { ssr: false });
const ExpenseLineChart = dynamic(() => import("@/components/charts/ExpenseLineChart"), { ssr: false });

type ChartType = "pie" | "bar" | "line";

const CHART_TABS: { type: ChartType; icon: typeof PieChart; label: string }[] = [
  { type: "pie",  icon: PieChart,   label: "Pie" },
  { type: "bar",  icon: BarChart2,  label: "Bar" },
  { type: "line", icon: TrendingUp, label: "Line" },
];

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

export default function DashboardClient({
  categories,
  chartData,
  lineData,
}: {
  categories: Category[];
  chartData: { name: string; value: number; color: string }[];
  lineData: { name: string; value: number }[];
}) {
  const [activeChart, setActiveChart] = useState<ChartType>("pie");
  const [saving, setSaving] = useState(false);
  const { pending, addPending, removePending, clearPending } = useExpenseStore();

  // Form state
  const [form, setForm] = useState({
    title: "", amount: "", type: "debit" as "debit" | "credit",
    note: "", date: new Date().toISOString().split("T")[0], categoryIds: [] as string[],
  });

  const toggleCategory = (id: string) => {
    setForm((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter((c) => c !== id)
        : [...f.categoryIds, id],
    }));
  };

  const handleAddToQueue = () => {
    if (!form.title.trim() || !form.amount) return;
    addPending({
      _localId: crypto.randomUUID(),
      title: form.title.trim(),
      amount: parseFloat(form.amount),
      type: form.type,
      note: form.note,
      date: form.date,
      categoryIds: form.categoryIds,
    });
    setForm({ title: "", amount: "", type: "debit", note: "", date: new Date().toISOString().split("T")[0], categoryIds: [] });
  };

  const handleSave = async () => {
    if (!pending.length) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    for (const exp of pending) {
      const { data: inserted } = await supabase
        .from("expenses")
        .insert({ user_id: user.id, title: exp.title, amount: exp.amount, type: exp.type, note: exp.note || null, date: exp.date })
        .select("id").single();

      if (inserted && exp.categoryIds.length) {
        await supabase.from("expense_categories").insert(
          exp.categoryIds.map((cid) => ({ expense_id: inserted.id, category_id: cid }))
        );
      }
    }

    // Recalculate balance
    const { data: allExpenses } = await supabase.from("expenses").select("amount, type").eq("user_id", user.id);
    if (allExpenses) {
      const bal = allExpenses.reduce((acc, e) => e.type === "credit" ? acc + e.amount : acc - e.amount, 0);
      await supabase.from("profiles").update({ current_balance: bal }).eq("id", user.id);
    }

    clearPending();
    setSaving(false);
    window.location.reload();
  };

  const renderChart = () => {
    const variants = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
    return (
      <AnimatePresence mode="wait">
        <motion.div key={activeChart} {...variants} transition={{ duration: 0.25 }}>
          {activeChart === "pie"  && <ExpensePieChart  data={chartData} />}
          {activeChart === "bar"  && <ExpenseBarChart  data={chartData} />}
          {activeChart === "line" && <ExpenseLineChart data={lineData} />}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-32 flex flex-col gap-6">
      {/* Chart Card */}
      <div className="glass rounded-2xl p-6" style={{ border: "1px solid var(--border)" }}>
        {/* Chart switcher */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Monthly Expenses</h2>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-primary)" }}>
            {CHART_TABS.map(({ type, icon: Icon, label }) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveChart(type)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: activeChart === type ? "var(--accent)" : "transparent",
                  color: activeChart === type ? "white" : "var(--text-muted)",
                }}>
                <Icon size={13} />
                {label}
              </motion.button>
            ))}
          </div>
        </div>
        {renderChart()}
      </div>

      {/* Add Expense */}
      <div className="glass rounded-2xl p-6" style={{ border: "1px solid var(--border)" }}>
        <h2 className="text-lg font-semibold text-white mb-4">Add Expense</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Title */}
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>Title *</label>
            <input
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Zomato order"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-[var(--text-muted)] focus:ring-1 transition-all"
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", outlineColor: "var(--accent)" }} />
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>Amount (₹) *</label>
            <input
              type="number" min="0" step="0.01"
              value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-[var(--text-muted)] focus:ring-1 transition-all"
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", outlineColor: "var(--accent)" }} />
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>Date</label>
            <div className="relative">
              <input
                type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white focus:ring-1 transition-all"
                style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", outlineColor: "var(--accent)", colorScheme: "dark" }} />
            </div>
          </div>

          {/* Type toggle */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>Type</label>
            <div className="flex gap-2">
              {(["debit", "credit"] as const).map((t) => (
                <button key={t} onClick={() => setForm({ ...form, type: t })}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-200"
                  style={{
                    background: form.type === t ? (t === "debit" ? "rgba(248,113,113,0.2)" : "rgba(74,222,128,0.2)") : "var(--bg-primary)",
                    color: form.type === t ? (t === "debit" ? "var(--danger)" : "var(--success)") : "var(--text-muted)",
                    border: `1px solid ${form.type === t ? (t === "debit" ? "var(--danger)" : "var(--success)") : "var(--border)"}`,
                  }}>
                  {t === "debit" ? "−" : "+"} {t}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="col-span-2">
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>Note (optional)</label>
            <input
              value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Any additional info..."
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-[var(--text-muted)] focus:ring-1 transition-all"
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", outlineColor: "var(--accent)" }} />
          </div>

          {/* Categories */}
          <div className="col-span-2">
            <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-muted)" }}>Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const selected = form.categoryIds.includes(cat.id);
                return (
                  <button key={cat.id} onClick={() => toggleCategory(cat.id)}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-150"
                    style={{
                      background: selected ? cat.color + "33" : "var(--bg-primary)",
                      color: selected ? cat.color : "var(--text-muted)",
                      border: `1px solid ${selected ? cat.color : "var(--border)"}`,
                    }}>
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button onClick={handleAddToQueue}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: "var(--accent)" }}>
          <Plus size={16} /> Add to Queue
        </button>
      </div>

      {/* Pending queue */}
      <AnimatePresence>
        {pending.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="glass rounded-2xl p-6" style={{ border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
              PENDING — {pending.length} unsaved
            </h3>
            <div className="flex flex-col gap-2">
              {pending.map((exp) => (
                <motion.div key={exp._localId} layout
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-white">{exp.title}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{exp.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: exp.type === "credit" ? "var(--success)" : "var(--danger)" }}>
                      {exp.type === "credit" ? "+" : "−"}₹{exp.amount.toLocaleString("en-IN")}
                    </span>
                    <button onClick={() => removePending(exp._localId)} style={{ color: "var(--text-muted)" }}>
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Save */}
      <AnimatePresence>
        {pending.length > 0 && (
          <FloatingSaveButton onClick={handleSave} loading={saving} count={pending.length} />
        )}
      </AnimatePresence>
    </div>
  );
}
