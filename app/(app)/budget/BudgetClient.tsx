"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Trash2, Wallet, LayoutGrid, List } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5 text-xs text-muted-foreground">
        <span>₹{spent.toLocaleString("en-IN")} spent</span>
        <span className={over ? "text-destructive" : ""}>
          {over ? `₹${(spent - limit).toLocaleString("en-IN")} over` : `₹${(limit - spent).toLocaleString("en-IN")} left`}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6 }}
          className={`h-full rounded-full ${over ? "bg-destructive" : warn ? "bg-warning" : "bg-gradient-primary"}`}
        />
      </div>
      <div className="flex justify-end mt-1">
        <span className={`text-xs font-semibold ${over ? "text-destructive" : warn ? "text-warning" : "text-success"}`}>
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleUpdateLimit = async (id: string, newLimit: number) => {
    if (isNaN(newLimit) || newLimit <= 0) return;
    const supabase = createClient();
    const { error } = await supabase.from("budgets")
      .update({ limit_amt: newLimit })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update limit");
    } else {
      setBudgets((prev) =>
        prev.map((b) => (b.id === id ? { ...b, limit_amt: newLimit } : b))
      );
      toast.success("Limit updated successfully!");
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.limit_amt) return toast.error("Title and limit are required");
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from("budgets")
      .insert({ user_id: user.id, title: form.title, limit_amt: parseFloat(form.limit_amt), period: form.period, category_id: form.category_id || null })
      .select("*, categories(name, color)").single();
    if (error) { toast.error(error.message); setSaving(false); return; }
    if (data) setBudgets((b) => [...b, data as BudgetWithCat]);
    toast.success("Budget created");
    setForm({ title: "", limit_amt: "", period: "monthly", category_id: "" });
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("budgets").delete().eq("id", id);
    setBudgets((b) => b.filter((x) => x.id !== id));
    toast.success("Budget deleted");
  };

  const getSpent = (b: BudgetWithCat) =>
    b.category_id ? (catSpending[b.category_id] ?? 0) : totalSpent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Set Budget</h2>
            <p className="text-sm text-muted-foreground">Define spending limits and track usage</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Grid/List View Toggle */}
          <div className="flex items-center bg-muted rounded-xl p-1 border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-[#C084FC] text-[#0B0F19] shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-[#C084FC] text-[#0B0F19] shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-primary text-primary-foreground shadow-elegant">
            <Plus className="h-4 w-4 mr-1" /> New Budget
          </Button>
        </div>
      </motion.div>

      {/* Monthly overview card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <Wallet className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">This Month</h3>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Spent</p>
          <p className="text-2xl font-bold text-foreground">
            ₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </motion.div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="text-sm font-semibold mb-4 text-foreground">New Budget</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-medium mb-1 block text-muted-foreground">Title *</label>
                <Input placeholder="e.g. Monthly Food" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block text-muted-foreground">Limit (₹) *</label>
                <Input type="number" placeholder="5000" value={form.limit_amt} onChange={(e) => setForm({ ...form, limit_amt: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block text-muted-foreground">Period</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground"
                  value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value as Budget["period"] })}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block text-muted-foreground">Category (optional)</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground"
                  value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                >
                  <option value="">Overall (all spending)</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary text-primary-foreground shadow-elegant">
                {saving ? "Saving…" : "Save Budget"}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget cards */}
      {viewMode === "list" ? (
        <div className="space-y-4">
          {budgets.length === 0 && (
            <div className="text-center py-20 rounded-2xl border border-border bg-card shadow-soft text-muted-foreground">
              No budgets set yet. Click <strong>New Budget</strong> to start.
            </div>
          )}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
              <h3 className="text-lg font-bold text-foreground">Category Limits</h3>
              <span className="text-xs text-muted-foreground">{budgets.length} limits configured</span>
            </div>
            <div className="space-y-4 divide-y divide-border">
              {budgets.map((b, index) => {
                const spent = getSpent(b);
                const limit = b.limit_amt;
                const remaining = limit - spent;
                const isOver = spent > limit;
                const pct = Math.min((spent / limit) * 100, 100);

                return (
                  <div key={b.id} className="pt-4 first:pt-0 pb-2 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {b.categories && (
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: b.categories.color }} />
                        )}
                        <span className="font-semibold text-base text-foreground">{b.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full capitalize bg-muted text-muted-foreground">{b.period}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Limit Input */}
                        <input
                          type="number"
                          placeholder="Limit"
                          defaultValue={limit || ""}
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (val !== limit && !isNaN(val)) {
                              handleUpdateLimit(b.id, val);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const val = parseFloat((e.target as HTMLInputElement).value);
                              if (val !== limit && !isNaN(val)) {
                                handleUpdateLimit(b.id, val);
                              }
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className="w-24 bg-[#101524] border border-[#C084FC]/30 rounded-xl h-8 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-[#C084FC] focus:ring-1 focus:ring-[#C084FC] focus:outline-none text-center transition-all"
                        />

                        {/* Spent Info */}
                        <span className="text-xs font-semibold text-[#50C878]">
                          ₹{spent.toLocaleString("en-IN")} / ₹{limit.toLocaleString("en-IN")}
                        </span>

                        {/* Delete */}
                        <button onClick={() => handleDelete(b.id)} className="text-muted-foreground hover:text-destructive transition-colors ml-2">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Remaining */}
                    <div className="space-y-1">
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted w-full">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6 }}
                          className={`h-full rounded-full ${isOver ? "bg-destructive" : pct >= 80 ? "bg-warning" : "bg-[#C084FC]"}`}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className={isOver ? "text-destructive font-semibold" : "text-[#50C878] font-semibold"}>
                          {isOver ? `₹${(spent - limit).toLocaleString("en-IN")} over` : `₹${remaining.toLocaleString("en-IN")} remaining`}
                        </span>
                        <span className="text-muted-foreground">{Math.round(pct)}% utilized</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {budgets.length === 0 && (
            <div className="col-span-2 text-center py-20 rounded-2xl border border-border bg-card shadow-soft text-muted-foreground">
              No budgets set yet. Click <strong>New Budget</strong> to start.
            </div>
          )}
          {budgets.map((b) => (
            <motion.div key={b.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {b.categories && (
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: b.categories.color }} />
                  )}
                  <span className="font-semibold text-foreground">{b.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize bg-muted text-muted-foreground">{b.period}</span>
                </div>
                <button onClick={() => handleDelete(b.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <ProgressBar spent={getSpent(b)} limit={b.limit_amt} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
