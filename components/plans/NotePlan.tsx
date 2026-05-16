import { useState, useEffect } from "react";
import { Plan, PlanContent } from "@/lib/types";

interface Props {
  plan: Plan;
  onUpdate: (id: string, content: PlanContent) => void;
}

export default function NotePlan({ plan, onUpdate }: Props) {
  const content = plan.content as { text: string };
  const text = content.text || "";

  const [localText, setLocalText] = useState(text);

  useEffect(() => {
    const t = setTimeout(() => {
      onUpdate(plan.id, { text: localText });
    }, 500);
    return () => clearTimeout(t);
  }, [localText, onUpdate, plan.id]);

  return (
    <div className="mt-4">
      <textarea
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        placeholder="Start writing..."
        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-3 text-sm text-white focus:border-[var(--accent)] outline-none resize-none min-h-[120px]"
      />
    </div>
  );
}
