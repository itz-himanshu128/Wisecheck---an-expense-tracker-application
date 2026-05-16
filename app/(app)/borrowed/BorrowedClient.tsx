"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import FloatingSaveButton from "@/components/ui/FloatingSaveButton";
import { Borrowed } from "@/lib/types";

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function BorrowedClient({ initial }: { initial: Borrowed[] }) {
  const [rows, setRows] = useState<Borrowed[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [showReturned, setShowReturned] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState<Partial<Borrowed>[]>([]);
  const [form, setForm] = useState({ from_person: "", amount: "", reason: "", borrowed_on: new Date().toISOString().split("T")[0], return_by: "" });

  const active   = rows.filter((r) => !r.is_returned);
  const returned = rows.filter((r) => r.is_returned);

  const addToQueue = () => {
    if (!form.from_person || !form.amount) return;
    setPending((p) => [...p, {
      from_person: form.from_person,
      amount: parseFloat(form.amount),
      reason: form.reason || null,
      borrowed_on: form.borrowed_on,
      return_by: form.return_by || null,
      is_returned: false,
    }]);
    setForm({ from_person: "", amount: "", reason: "", borrowed_on: new Date().toISOString().split("T")[0], return_by: "" });
    setShowForm(false);
  };

  const markReturned = async (id: string) => {
    const supabase = createClient();
    await supabase.from("borrowed").update({ is_returned: true }).eq("id", id);
    setRows((r) => r.map((row) => row.id === id ? { ...row, is_returned: true } : row));
  };

  const handleSave = async () => {
    if (!pending.length) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("borrowed")
      .insert(pending.map((p) => ({ ...p, user_id: user.id })))
      .select("*");
    if (data) setRows((r) => [...r, ...(data as Borrowed[])]);
    setPending([]);
    setSaving(false);
  };

  const thStyle = "text-left text-xs font-semibold px-4 py-3";
  const tdStyle = "px-4 py-3 text-sm";

  return (
    <div className="max-w-5xl mx-auto pb-32 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Borrowed</h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Money you owe to others</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "var(--accent)" }}>
          <Plus size={16} /> Add Entry
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass rounded-2xl p-6" style={{ border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-4 text-white">New Entry</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "From *", key: "from_person", placeholder: "Name" },
                { label: "Amount (₹) *", key: "amount", placeholder: "0", type: "number" },
                { label: "Reason", key: "reason", placeholder: "Optional" },
                { label: "Return By", key: "return_by", type: "date" },
              ].map(({ label, key, placeholder, type = "text" }) => (
                <div key={key}>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-muted)" }}>{label}</label>
                  <input type={type} placeholder={placeholder}
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm text-white transition-all"
                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", colorScheme: "dark" }} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={addToQueue} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--accent)" }}>
                Add to Queue
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: "var(--text-muted)" }}>
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending */}
      <AnimatePresence>
        {pending.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass rounded-2xl p-4" style={{ border: "1px solid var(--accent)", background: "rgba(108,99,255,0.05)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--accent)" }}>
              {pending.length} unsaved entry/entries
            </p>
            {pending.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-1">
                <span className="text-white">{p.from_person}</span>
                <span style={{ color: "var(--danger)" }}>₹{Number(p.amount).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Table */}
      <div className="glass rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <th className={thStyle}>From</th>
              <th className={thStyle}>Amount</th>
              <th className={thStyle}>Reason</th>
              <th className={thStyle}>Borrowed On</th>
              <th className={thStyle}>Return By</th>
              <th className={thStyle}>Done?</th>
            </tr>
          </thead>
          <tbody>
            {active.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-sm" style={{ color: "var(--text-muted)" }}>No active borrowed entries</td></tr>
            ) : active.map((row) => (
              <motion.tr key={row.id} layout style={{ borderBottom: "1px solid var(--border)" }}
                className="hover:bg-white/[0.02] transition-colors">
                <td className={`${tdStyle} font-medium text-white`}>{row.from_person}</td>
                <td className={tdStyle} style={{ color: "var(--danger)" }}>₹{row.amount.toLocaleString("en-IN")}</td>
                <td className={tdStyle} style={{ color: "var(--text-muted)" }}>{row.reason ?? "—"}</td>
                <td className={tdStyle} style={{ color: "var(--text-muted)" }}>{formatDate(row.borrowed_on)}</td>
                <td className={tdStyle} style={{ color: "var(--text-muted)" }}>{formatDate(row.return_by)}</td>
                <td className={tdStyle}>
                  <button onClick={() => markReturned(row.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all"
                    style={{ background: "rgba(74,222,128,0.1)", color: "var(--success)", border: "1px solid rgba(74,222,128,0.3)" }}>
                    <Check size={11} /> Mark Done
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Returned section */}
      {returned.length > 0 && (
        <div>
          <button onClick={() => setShowReturned(!showReturned)}
            className="flex items-center gap-2 text-sm font-medium mb-3" style={{ color: "var(--text-muted)" }}>
            {showReturned ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Returned ({returned.length})
          </button>
          <AnimatePresence>
            {showReturned && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="glass rounded-2xl overflow-hidden opacity-60" style={{ border: "1px solid var(--border)" }}>
                <table className="w-full">
                  <tbody>
                    {returned.map((row) => (
                      <tr key={row.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td className={`${tdStyle} font-medium`} style={{ color: "var(--text-muted)" }}>{row.from_person}</td>
                        <td className={tdStyle} style={{ color: "var(--text-muted)" }}>₹{row.amount.toLocaleString("en-IN")}</td>
                        <td className={tdStyle} style={{ color: "var(--text-muted)" }}>{formatDate(row.borrowed_on)}</td>
                        <td className={tdStyle}>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.1)", color: "var(--success)" }}>Returned</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {pending.length > 0 && <FloatingSaveButton onClick={handleSave} loading={saving} count={pending.length} />}
      </AnimatePresence>
    </div>
  );
}
