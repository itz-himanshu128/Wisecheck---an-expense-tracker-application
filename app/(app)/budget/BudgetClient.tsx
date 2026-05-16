"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Category, Budget } from "@/lib/types";

interface BudgetWithCat extends Budget {
  categories?: { name: string; color: string } | null;
}

interface Props {
  budgets: BudgetWithCat[];
  categories: Category[];
  catSpending: Record<string, number>;
  totalSpent: number;
}

function ProgressBar({ spent, limit }: { spent: number; limit: number }) {
  const pct = Math.min((spent / limit) * 100, 100);
  const over = spent > limit;
  const warn = pct >= 80 && !over;
  const color = over ? "var(--danger)" : warn ? "var(--warning)" : "var(--success)";

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
        <span>₹{spent.toLocaleString("en-IN")} spent</span>
        <span style={{ color: over ? "var(--danger)" : "var(--text-muted)" }}>
          {over ? `₹${(spent - limit).toLocaleString("en-IN")} over` : `₹${(limit - spent).toLocaleString("en-IN")} left`}
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-primary)" }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}66` }} />
      </div>
      <div className="flex justify-end mt-1">
        <span className="text-xs font-semibold" style={{ color }}>
          {Math.round((spent / limit) * 100)}% of ₹{limit.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}

export default function BudgetClient({ budgets: initial, categories, catSpending, totalSpent }: Props) {
  const [budgets, setBudgets] = useState<BudgetWithCat[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", limit_amt: "", period: "monthly" as Budget["period"], category_id: "" });

  const handleSave = async () => {
    if (!form.title || !form.limit_amt) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("budgets")
      .insert({ user_id: user.id, title: form.title, limit_amt: parseFloat(form.limit_amt), period: form.period, category_id: form.category_id || null })
      .select("*, categories(name, color)").single();
    if (data) setBudgets((b) => [...b, data as BudgetWithCat]);
    setForm({ title: "", limit_amt: "", period: "monthly", category_id: "" });
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("budgets").delete().eq("id", id);
    setBudgets((b) => b.filter((x) => x.id !== id));
  };

  const getSpent = (b: BudgetWithCat) =>
    b.category_id ? (catSpending[b.category_id] ?? 0) : totalSpent;

  const inputCls = "w-full px-3 py-2 rounded-xl text-sm text-white transition-all";
  const inputStyle = { background: "var(--bg-primary)", border: "1px solid var(--border)", colorScheme: "dark" };

  return (
    <div className="max-w-4xl mx-auto pb-10 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Budget</h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Set spending limits and track usage</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "var(--accent)" }}>
          <Plus size={16} /> New Budget
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass rounded-2xl p-6" style={{ border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-4 text-white">New Budget</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>Title *</label>
                <input className={inputCls} style={inputStyle} placeholder="e.g. Monthly Food" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>Limit (₹) *</label>
                <input type="number" className={inputCls} style={inputStyle} placeholder="5000" value={form.limit_amt} onChange={(e) => setForm({ ...form, limit_amt: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>Period</label>
                <select className={inputCls} style={{ ...inputStyle, cursor: "pointer" }} value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value as Budget["period"] })}>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>Category (optional)</label>
                <select className={inputCls} style={{ ...inputStyle, cursor: "pointer" }} value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">Overall (all spending)</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60" style={{ background: "var(--accent)" }}>
                {saving ? "Saving…" : "Save Budget"}
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: "var(--text-muted)" }}>Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {budgets.length === 0 && (
          <div className="col-span-2 text-center py-20 glass rounded-2xl" style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            No budgets set yet. Click <strong>New Budget</strong> to start.
          </div>
        )}
        {budgets.map((b) => (
          <motion.div key={b.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-5" style={{ border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {b.categories && (
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: b.categories.color }} />
                )}
                <span className="font-semibold text-white">{b.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: "var(--bg-primary)", color: "var(--text-muted)" }}>{b.period}</span>
              </div>
              <button onClick={() => handleDelete(b.id)} style={{ color: "var(--text-muted)" }} className="hover:text-[var(--danger)] transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
            <ProgressBar spent={getSpent(b)} limit={b.limit_amt} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
