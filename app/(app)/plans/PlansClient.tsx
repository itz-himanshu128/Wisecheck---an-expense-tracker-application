"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Table2, AlignLeft, CheckSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Plan, PlanContent } from "@/lib/types";
import TablePlan from "@/components/plans/TablePlan";
import NotePlan from "@/components/plans/NotePlan";
import ChecklistPlan from "@/components/plans/ChecklistPlan";

interface Props {
  initialPlans: Plan[];
}

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

    const { data } = await supabase
      .from("plans")
      .insert({
        user_id: user.id,
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Plan`,
        type,
        content
      })
      .select("*")
      .single();

    if (data) {
      setPlans([data as Plan, ...plans]);
    }
    setShowTypeSelect(false);
    setCreating(false);
  };

  const handleDeletePlan = async (id: string) => {
    const supabase = createClient();
    await supabase.from("plans").delete().eq("id", id);
    setPlans(plans.filter((p) => p.id !== id));
  };

  const handleUpdateContent = async (id: string, newContent: PlanContent) => {
    // Optimistic UI update
    setPlans(plans.map(p => p.id === id ? { ...p, content: newContent } : p));
    
    // Background save to Supabase
    const supabase = createClient();
    await supabase.from("plans").update({ content: newContent }).eq("id", id);
  };

  const handleUpdateTitle = async (id: string, newTitle: string) => {
    setPlans(plans.map(p => p.id === id ? { ...p, title: newTitle } : p));
    const supabase = createClient();
    await supabase.from("plans").update({ title: newTitle }).eq("id", id);
  };

  return (
    <div className="max-w-6xl mx-auto pb-32 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Plans</h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Simulations and personal notes (isolated from budget)</p>
        </div>
        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTypeSelect(!showTypeSelect)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "var(--accent)" }}>
            <Plus size={16} /> New Plan
          </motion.button>

          <AnimatePresence>
            {showTypeSelect && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-48 glass rounded-xl p-2 z-50 flex flex-col gap-1"
                style={{ border: "1px solid var(--border)" }}
              >
                <button onClick={() => handleCreatePlan("table")} disabled={creating} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white text-left transition-colors">
                  <Table2 size={16} className="text-[var(--accent)]" /> Table Plan
                </button>
                <button onClick={() => handleCreatePlan("note")} disabled={creating} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white text-left transition-colors">
                  <AlignLeft size={16} className="text-[var(--accent)]" /> Note Plan
                </button>
                <button onClick={() => handleCreatePlan("checklist")} disabled={creating} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white text-left transition-colors">
                  <CheckSquare size={16} className="text-[var(--accent)]" /> Checklist Plan
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl" style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>
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
              className="glass rounded-2xl p-5 relative group"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-3">
                <input
                  value={plan.title}
                  onChange={(e) => handleUpdateTitle(plan.id, e.target.value)}
                  className="bg-transparent border-none text-lg font-semibold text-white outline-none w-full"
                />
                <button 
                  onClick={() => handleDeletePlan(plan.id)}
                  className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors opacity-0 group-hover:opacity-100 p-1"
                >
                  <Trash2 size={16} />
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
