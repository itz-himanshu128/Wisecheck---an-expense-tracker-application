import { useState, useEffect } from "react";
import { Plan, PlanContent } from "@/lib/types";
import { Trash2, Plus, Check } from "lucide-react";

interface Props {
  plan: Plan;
  onUpdate: (id: string, content: PlanContent) => void;
}

export default function ChecklistPlan({ plan, onUpdate }: Props) {
  const content = plan.content as { items: { id: string; text: string; checked: boolean }[] };
  const items = content.items || [];

  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    const t = setTimeout(() => {
      onUpdate(plan.id, { items: localItems });
    }, 500);
    return () => clearTimeout(t);
  }, [localItems, onUpdate, plan.id]);

  const addItem = () => {
    setLocalItems([...localItems, { id: crypto.randomUUID(), text: "", checked: false }]);
  };

  const removeItem = (id: string) => {
    setLocalItems(localItems.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: "text" | "checked", value: string | boolean) => {
    setLocalItems(localItems.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const completedCount = localItems.filter(i => i.checked).length;
  const progress = localItems.length === 0 ? 0 : (completedCount / localItems.length) * 100;

  return (
    <div className="flex flex-col gap-2 mt-4">
      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
          <span>{completedCount} of {localItems.length} tasks</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-[var(--bg-primary)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {localItems.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <button
            onClick={() => updateItem(item.id, "checked", !item.checked)}
            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${item.checked ? "bg-[var(--accent)] border-[var(--accent)]" : "border-[var(--border)] hover:border-[var(--accent)]"}`}
          >
            {item.checked && <Check size={12} className="text-white" />}
          </button>
          <input
            value={item.text}
            onChange={(e) => updateItem(item.id, "text", e.target.value)}
            placeholder="Task description"
            className={`flex-1 bg-transparent border-none outline-none text-sm transition-colors ${item.checked ? "text-[var(--text-muted)] line-through" : "text-white"}`}
          />
          <button onClick={() => removeItem(item.id)} className="text-[var(--text-muted)] hover:text-[var(--danger)] p-1 transition-colors flex-shrink-0">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <div className="mt-2 border-t border-[var(--border)] pt-2">
        <button onClick={addItem} className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:opacity-80 transition-opacity">
          <Plus size={12} /> Add Item
        </button>
      </div>
    </div>
  );
}
