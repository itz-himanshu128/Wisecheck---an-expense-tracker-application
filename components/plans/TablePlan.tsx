import { useState, useEffect } from "react";
import { Plan, PlanContent } from "@/lib/types";
import { Trash2, Plus, GripVertical } from "lucide-react";

interface Props {
  plan: Plan;
  onUpdate: (id: string, content: PlanContent) => void;
}

export default function TablePlan({ plan, onUpdate }: Props) {
  const content = plan.content as { rows: { id: string; label: string; amount: string }[] };
  const rows = content.rows || [];

  const [localRows, setLocalRows] = useState(rows);

  // Debounce saving to parent
  useEffect(() => {
    const t = setTimeout(() => {
      onUpdate(plan.id, { rows: localRows });
    }, 500);
    return () => clearTimeout(t);
  }, [localRows, onUpdate, plan.id]);

  const addRow = () => {
    setLocalRows([...localRows, { id: crypto.randomUUID(), label: "", amount: "" }]);
  };

  const removeRow = (id: string) => {
    setLocalRows(localRows.filter(r => r.id !== id));
  };

  const updateRow = (id: string, field: "label" | "amount", value: string) => {
    setLocalRows(localRows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const total = localRows.reduce((acc, row) => acc + (parseFloat(row.amount) || 0), 0);

  return (
    <div className="flex flex-col gap-2 mt-4">
      {localRows.map((row) => (
        <div key={row.id} className="flex items-center gap-2">
          <GripVertical size={14} className="text-[var(--text-muted)] cursor-grab" />
          <input
            value={row.label}
            onChange={(e) => updateRow(row.id, "label", e.target.value)}
            placeholder="Item description"
            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-white focus:border-[var(--accent)] outline-none"
          />
          <div className="relative w-32">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">₹</span>
            <input
              type="number"
              value={row.amount}
              onChange={(e) => updateRow(row.id, "amount", e.target.value)}
              placeholder="0.00"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg pl-7 pr-3 py-1.5 text-sm text-white focus:border-[var(--accent)] outline-none"
            />
          </div>
          <button onClick={() => removeRow(row.id)} className="text-[var(--text-muted)] hover:text-[var(--danger)] p-1 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between mt-2 border-t border-[var(--border)] pt-2">
        <button onClick={addRow} className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:opacity-80 transition-opacity">
          <Plus size={12} /> Add Row
        </button>
        <div className="text-sm font-semibold text-white">
          Total: <span className="text-[var(--accent)]">₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
