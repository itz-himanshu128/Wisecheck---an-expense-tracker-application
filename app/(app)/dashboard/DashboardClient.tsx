"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  PieChart as PieIcon, BarChart3, LineChart as LineIcon,
  TrendingUp, TrendingDown, DollarSign, Receipt,
  Plus, Tag, X, Search, Calendar, Filter, Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useExpenseStore, PendingExpense } from "@/lib/store/expenseStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FloatingSaveButton from "@/components/ui/FloatingSaveButton";
import { toast } from "sonner";
import { Category } from "@/lib/types";

type ChartType = "pie" | "bar" | "line";

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const tooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  color: "var(--popover-foreground)",
};

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

export default function DashboardClient({
  categories,
  initialExpenses,
}: {
  categories: Category[];
  initialExpenses: any[];
}) {
  const [allExpenses, setAllExpenses] = useState<any[]>(initialExpenses);
  const [activeChart, setActiveChart] = useState<ChartType>("pie");
  const [sidebarTab, setSidebarTab] = useState<"activity" | "breakdown">("activity");
  const [saving, setSaving] = useState(false);
  const { pending, addPending, removePending, clearPending } = useExpenseStore();

  // Form state
  const [form, setForm] = useState({
    title: "", amount: "", type: "debit" as "debit" | "credit",
    note: "", date: new Date().toISOString().split("T")[0], categoryIds: [] as string[],
  });

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  // Calculate chart data from active expenses
  const chartData = useMemo(() => {
    const catMap: Record<string, { name: string; value: number; color: string }> = {};
    for (const exp of allExpenses) {
      if (exp.type !== "debit") continue;
      const catIds = (exp.expense_categories as { category_id: string }[] ?? []).map((ec) => ec.category_id);
      if (!catIds.length) {
        catMap["_uncategorised"] = {
          name: "Uncategorised",
          value: (catMap["_uncategorised"]?.value ?? 0) + exp.amount,
          color: "#8888AA",
        };
      }
      for (const cid of catIds) {
        const cat = categories.find((c) => c.id === cid);
        if (!cat) continue;
        catMap[cid] = {
          name: cat.name,
          value: (catMap[cid]?.value ?? 0) + exp.amount,
          color: cat.color,
        };
      }
    }
    return Object.values(catMap).sort((a, b) => b.value - a.value);
  }, [allExpenses, categories]);

  // Calculate line chart data from active expenses
  const lineData = useMemo(() => {
    const dayMap: Record<string, number> = {};
    for (const exp of allExpenses) {
      if (exp.type !== "debit") continue;
      dayMap[exp.date] = (dayMap[exp.date] ?? 0) + exp.amount;
    }
    return Object.entries(dayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({ name: date.slice(5), value }));
  }, [allExpenses]);

  const toggleCategory = (id: string) => {
    setForm((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter((c) => c !== id)
        : [...f.categoryIds, id],
    }));
  };  const handleAddExpense = async () => {
    if (!form.title.trim() || !form.amount) return toast.error("Enter title and amount");
    
    const amountNum = parseFloat(form.amount);
    const tempId = crypto.randomUUID();
    
    // Create new expense object for local state (Optimistic update)
    const newLocalExpense = {
      id: tempId,
      title: form.title.trim(),
      amount: amountNum,
      type: form.type,
      note: form.note || null,
      date: form.date,
      expense_categories: form.categoryIds.map(cid => ({ category_id: cid }))
    };

    // Optimistically prepend to allExpenses so it updates the charts and recent activity instantly!
    setAllExpenses((prev) => [newLocalExpense, ...prev]);
    toast.success("Expense added successfully!");

    // Clear form instantly for smooth feel
    setForm({ title: "", amount: "", type: "debit", note: "", date: new Date().toISOString().split("T")[0], categoryIds: [] });

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Insert real expense row
      const { data: inserted, error: expError } = await supabase
        .from("expenses")
        .insert({
          user_id: user.id,
          title: newLocalExpense.title,
          amount: newLocalExpense.amount,
          type: newLocalExpense.type,
          note: newLocalExpense.note,
          date: newLocalExpense.date
        })
        .select("id")
        .single();

      if (expError) throw expError;

      // Insert categories relations if any
      if (inserted && form.categoryIds.length) {
        const { error: catError } = await supabase.from("expense_categories").insert(
          form.categoryIds.map((cid) => ({ expense_id: inserted.id, category_id: cid }))
        );
        if (catError) console.error("Failed to associate categories:", catError);
      }

      // Update the temporary ID with the real database ID in state
      if (inserted) {
        setAllExpenses((prev) => 
          prev.map((e) => e.id === tempId ? { ...e, id: inserted.id } : e)
        );
      }

      // Recalculate balance inside user profile
      const { data: allRows } = await supabase.from("expenses").select("amount, type").eq("user_id", user.id);
      if (allRows) {
        const bal = allRows.reduce((acc, e) => e.type === "credit" ? acc + e.amount : acc - e.amount, 0);
        await supabase.from("profiles").update({ current_balance: bal }).eq("id", user.id);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to sync with database");
      // Rollback on database failure
      setAllExpenses((prev) => prev.filter((e) => e.id !== tempId));
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const originalExpenses = [...allExpenses];
    setAllExpenses((prev) => prev.filter((exp) => exp.id !== id));
    toast.success("Entry deleted");

    try {
      const supabase = createClient();
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;

      // Recalculate current_balance in profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: allRows } = await supabase.from("expenses").select("amount, type").eq("user_id", user.id);
        if (allRows) {
          const bal = allRows.reduce((acc, e) => e.type === "credit" ? acc + e.amount : acc - e.amount, 0);
          await supabase.from("profiles").update({ current_balance: bal }).eq("id", user.id);
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete entry");
      setAllExpenses(originalExpenses);
    }
  };

  const handleCreateCategorySubmit = async () => {
    if (!newCategoryName.trim()) return toast.error("Enter a category name");
    setAddingCategory(true);
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setAddingCategory(false);
      return;
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({ user_id: user.id, name: newCategoryName.trim(), color })
      .select()
      .single();

    setAddingCategory(false);

    if (error) {
      toast.error("Failed to add category");
    } else {
      toast.success("Category added!");
      setNewCategoryName("");
      setShowNewCategory(false);
      window.location.reload();
    }
  };

  const handleDeleteCategory = async (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("categories").delete().eq("id", catId);
      if (error) throw error;

      toast.success("Category deleted successfully");
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  // Stats
  const totalSpent = chartData.reduce((s, c) => s + c.value, 0);

  const chartOptions: { id: ChartType; label: string; icon: typeof PieIcon }[] = [
    { id: "pie", label: "Pie", icon: PieIcon },
    { id: "bar", label: "Bar", icon: BarChart3 },
    { id: "line", label: "Line", icon: LineIcon },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <main className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Total Spent", value: formatINR(totalSpent), icon: DollarSign, accent: "from-chart-1 to-chart-2" },
            { label: "Categories", value: `${chartData.length}`, icon: Tag, accent: "from-chart-2 to-chart-4" },
            { label: "Daily Avg", value: formatINR(lineData.length ? lineData.reduce((s, d) => s + d.value, 0) / lineData.length : 0), icon: TrendingUp, accent: "from-chart-4 to-chart-5" },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${c.accent} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{c.value}</p>
                </div>
                <div className="rounded-xl bg-gradient-primary p-2.5 text-primary-foreground shadow-elegant">
                  <c.icon className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Analytics</h3>
              <p className="text-sm text-muted-foreground">
                {activeChart === "line" ? "Daily spending trend" : "Spending breakdown by category"}
              </p>
            </div>

            <div className="relative inline-flex items-center rounded-xl border border-border bg-muted p-1">
              {chartOptions.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setActiveChart(o.id)}
                  className={`relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeChart === o.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeChart === o.id && (
                    <motion.div
                      layoutId="chart-toggle"
                      className="absolute inset-0 -z-10 rounded-lg bg-gradient-primary shadow-elegant"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <o.icon className="h-3.5 w-3.5" />
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChart}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  {activeChart === "pie" ? (
                    <PieChart>
                      <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} innerRadius={60} paddingAngle={3}>
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} stroke="var(--card)" strokeWidth={3} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  ) : activeChart === "bar" ? (
                    <BarChart data={chartData}>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <LineChart data={lineData}>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        dot={{ fill: "var(--primary)", r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Add Expense (Custom Screenshot Style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-3xl border border-border bg-card/85 p-6 shadow-soft space-y-5"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C084FC] text-[#0B0F19]">
              <Plus className="h-5 w-5 stroke-[3]" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Add Expense</h3>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="What did you buy?"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="flex-1 bg-[#101524]/10 dark:bg-[#101524] border border-[#C084FC]/30 rounded-xl h-11 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C084FC] focus:ring-1 focus:ring-[#C084FC] focus:outline-none transition-all"
              />
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-28 bg-[#101524]/10 dark:bg-[#101524] border border-[#C084FC]/30 rounded-xl h-11 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C084FC] focus:ring-1 focus:ring-[#C084FC] focus:outline-none text-right transition-all"
              />
            </div>

            {/* Category section with + New / Inline Add */}
            {showNewCategory ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span>Category</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategoryName("");
                    }}
                    className="text-sm font-semibold text-[#A855F7] hover:text-[#C084FC] transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="New category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 bg-[#101524]/10 dark:bg-[#101524] border border-[#C084FC]/30 rounded-xl h-11 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C084FC] focus:ring-1 focus:ring-[#C084FC] focus:outline-none transition-all"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreateCategorySubmit();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategorySubmit}
                    disabled={addingCategory}
                    className="px-5 bg-muted dark:bg-[#181F32] hover:bg-muted/80 dark:hover:bg-[#202A44] disabled:opacity-50 text-foreground font-bold text-sm h-11 rounded-xl transition-all duration-200"
                  >
                    {addingCategory ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span>Category</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(true)}
                    className="text-sm font-semibold text-[#A855F7] hover:text-[#C084FC] transition-colors"
                  >
                    + New
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {categories.map((cat) => {
                    const selected = form.categoryIds.includes(cat.id);
                    return (
                      <div
                        key={cat.id}
                        className={`group relative flex items-center rounded-full transition-all ${
                          selected
                            ? "bg-[#C084FC] text-[#0B0F19] shadow-md"
                            : "bg-muted dark:bg-[#181F32] hover:bg-muted/80 dark:hover:bg-[#202A44] text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className="pl-4 pr-2 py-2 text-xs font-semibold"
                        >
                          {cat.name}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCategory(cat.id, e)}
                          className={`mr-2 p-0.5 rounded-full transition-all ${
                            selected 
                              ? "hover:bg-black/10 text-[#0B0F19]/60 hover:text-[#0B0F19]" 
                              : "hover:bg-destructive/20 text-muted-foreground/60 hover:text-destructive"
                          }`}
                          title="Delete category"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={handleAddExpense}
              className="w-full bg-[#C084FC] hover:bg-[#B76EFA] active:scale-[0.98] text-[#0B0F19] font-bold text-sm h-11 rounded-2xl transition-all duration-200 shadow-md shadow-purple-500/10"
            >
              Add Expense
            </button>
          </div>
        </motion.div>

        {/* Mobile recent activity log with deletion */}
        <div className="block lg:hidden rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
            <span className="text-xs text-muted-foreground">{allExpenses.length} entries</span>
          </div>
          {allExpenses.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">No recent entries.</p>
          ) : (
            <ul className="space-y-1">
              {allExpenses.slice(0, 10).map((e) => {
                const catIds = (e.expense_categories as { category_id: string }[] ?? []).map((ec) => ec.category_id);
                const firstCat = categories.find((c) => c.id === catIds[0]);
                const catName = firstCat ? firstCat.name : "Uncategorised";
                const catColor = firstCat ? firstCat.color : "#8888AA";

                return (
                  <li key={e.id} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-muted/50">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground"
                      style={{ backgroundColor: catColor }}
                    >
                      {catName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{catName} · {e.date}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <p className={`text-sm font-semibold ${e.type === "credit" ? "text-success" : "text-foreground"}`}>
                        {e.type === "credit" ? "+" : "−"}{formatINR(e.amount)}
                      </p>
                      <button onClick={() => handleDeleteExpense(e.id)} className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>

      {/* Overview & Activity Tabbed Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="hidden lg:flex sticky top-6 h-[calc(100vh-3rem)] flex-col rounded-2xl border border-border bg-card shadow-soft"
      >
        <div className="border-b border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-lg bg-gradient-primary p-2 text-primary-foreground shadow-elegant">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Overview</h3>
              <p className="text-xs text-muted-foreground">Manage your entries</p>
            </div>
          </div>

          {/* Tab Controller */}
          <div className="relative inline-flex w-full items-center rounded-xl border border-border bg-muted p-1">
            {[
              { id: "activity", label: "Activity" },
              { id: "breakdown", label: "Breakdown" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSidebarTab(tab.id as any)}
                className={`relative z-10 flex-1 py-1.5 text-center text-xs font-medium transition-colors ${
                  sidebarTab === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {sidebarTab === tab.id && (
                  <motion.div
                    layoutId="sidebar-tab-indicator"
                    className="absolute inset-0 -z-10 rounded-lg bg-gradient-primary shadow-elegant"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {sidebarTab === "activity" ? (
            allExpenses.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">No recent entries.</p>
            ) : (
              <ul className="space-y-1">
                {allExpenses.map((e, i) => {
                  const catIds = (e.expense_categories as { category_id: string }[] ?? []).map((ec) => ec.category_id);
                  const firstCat = categories.find((c) => c.id === catIds[0]);
                  const catName = firstCat ? firstCat.name : "Uncategorised";
                  const catColor = firstCat ? firstCat.color : "#8888AA";

                  return (
                    <motion.li
                      key={e.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.5) }}
                      className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted"
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground"
                        style={{ backgroundColor: catColor }}
                      >
                        {catName[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{e.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {catName} · {e.date}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end justify-center">
                        <p className={`text-sm font-semibold ${e.type === "credit" ? "text-success" : "text-foreground"}`}>
                          {e.type === "credit" ? "+" : "−"}{formatINR(e.amount)}
                        </p>
                        <button
                          onClick={() => handleDeleteExpense(e.id)}
                          className="text-xs text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 mt-1 p-0.5 rounded transition-colors hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            )
          ) : (
            chartData.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">No spending data this month.</p>
            ) : (
              <ul className="space-y-1">
                {chartData.map((entry, i) => (
                  <motion.li
                    key={entry.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.5) }}
                    className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground"
                      style={{ backgroundColor: entry.color || CHART_COLORS[i % CHART_COLORS.length] }}
                    >
                      {entry.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{entry.name}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{formatINR(entry.value)}</p>
                  </motion.li>
                ))}
              </ul>
            )
          )}
        </div>
      </motion.aside>
    </div>
  );
}

