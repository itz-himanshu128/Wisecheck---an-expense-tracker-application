"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NotebookPen, Plus, Trash2, Table2, AlignLeft, CheckSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plan, PlanContent } from "@/lib/types";
import TablePlan from "@/components/plans/TablePlan";
import NotePlan from "@/components/plans/NotePlan";
import ChecklistPlan from "@/components/plans/ChecklistPlan";

interface Props {
  initialPlans: Plan[];
}

const PLAN_TYPE_OPTIONS = [
  { type: "table" as const, label: "Table Plan", icon: Table2 },
  { type: "note" as const, label: "Note Plan", icon: AlignLeft },
  { type: "checklist" as const, label: "Checklist Plan", icon: CheckSquare },
];

export default function PlansClient({ initialPlans }: Props) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [showTypeSelect, setShowTypeSelect] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreatePlan = async (type: Plan["type"]) => {
    setCreating(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let content: PlanContent;
    switch (type) {
      case "table": content = { rows: [] }; break;
      case "note": content = { text: "" }; break;
      case "checklist": content = { items: [] }; break;
    }

    const { data, error } = await supabase
      .from("plans")
      .insert({
        user_id: user.id,
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Plan`,
        type,
        content,
      })
      .select("*")
      .single();

    if (error) { toast.error(error.message); setCreating(false); return; }
    if (data) setPlans([data as Plan, ...plans]);
    toast.success("Plan created!");
    setShowTypeSelect(false);
    setCreating(false);
  };

  const handleDeletePlan = async (id: string) => {
    const supabase = createClient();
    await supabase.from("plans").delete().eq("id", id);
    setPlans(plans.filter((p) => p.id !== id));
    toast.success("Plan deleted");
  };

  const handleUpdateContent = async (id: string, newContent: PlanContent) => {
    setPlans(plans.map((p) => p.id === id ? { ...p, content: newContent } : p));
    const supabase = createClient();
    await supabase.from("plans").update({ content: newContent }).eq("id", id);
  };

  const handleUpdateTitle = async (id: string, newTitle: string) => {
    setPlans(plans.map((p) => p.id === id ? { ...p, title: newTitle } : p));
    const supabase = createClient();
    await supabase.from("plans").update({ title: newTitle }).eq("id", id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <NotebookPen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Plans</h2>
            <p className="text-sm text-muted-foreground">Simulations and personal notes (isolated from budget)</p>
          </div>
        </div>

        <div className="relative">
          <Button onClick={() => setShowTypeSelect(!showTypeSelect)} className="bg-gradient-primary text-primary-foreground shadow-elegant">
            <Plus className="h-4 w-4 mr-1" /> New Plan
          </Button>

          <AnimatePresence>
            {showTypeSelect && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-48 rounded-xl border border-border bg-popover p-2 z-50 flex flex-col gap-1 shadow-elegant"
              >
                {PLAN_TYPE_OPTIONS.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => handleCreatePlan(type)}
                    disabled={creating}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground text-left transition-colors"
                  >
                    <Icon className="h-4 w-4 text-primary" /> {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Plans grid */}
      {plans.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-border bg-card shadow-soft text-muted-foreground">
          No plans created yet. Click <strong>New Plan</strong> to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft relative group"
            >
              <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                <input
                  value={plan.title}
                  onChange={(e) => handleUpdateTitle(plan.id, e.target.value)}
                  className="bg-transparent border-none text-lg font-semibold text-foreground outline-none w-full"
                />
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {plan.type === "table" && <TablePlan plan={plan} onUpdate={handleUpdateContent} />}
              {plan.type === "note" && <NotePlan plan={plan} onUpdate={handleUpdateContent} />}
              {plan.type === "checklist" && <ChecklistPlan plan={plan} onUpdate={handleUpdateContent} />}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
