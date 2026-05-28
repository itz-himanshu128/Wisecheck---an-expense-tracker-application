"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownLeft, Plus, Trash2, Check, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Borrowed } from "@/lib/types";

export default function BorrowedClient({ initial }: { initial: Borrowed[] }) {
  const [rows, setRows] = useState<Borrowed[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [showReturned, setShowReturned] = useState(false);
  const [fromPerson, setFrom] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const supabase = createClient();

  const active = rows.filter((r) => !r.is_returned);
  const returned = rows.filter((r) => r.is_returned);
  const outstanding = active.reduce((s, b) => s + b.amount, 0);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!fromPerson.trim() || !amt) return toast.error("Enter person and amount");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error("User not authenticated");

    const { data, error } = await supabase
      .from("borrowed")
      .insert({
        user_id: user.id,
        from_person: fromPerson.trim(),
        amount: amt,
        reason: reason.trim() || null,
        borrowed_on: date,
        is_returned: false,
      })
      .select("*")
      .single();

    if (error) return toast.error(error.message);
    setRows([data, ...rows]);
    toast.success("Borrowed entry added");
    setFrom(""); setAmount(""); setReason("");
    setShowForm(false);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("borrowed")
      .update({ is_returned: !currentStatus })
      .eq("id", id);
    if (error) return toast.error(error.message);
    setRows(rows.map((b) => b.id === id ? { ...b, is_returned: !currentStatus } : b));
    toast.success("Status updated");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("borrowed").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows(rows.filter((b) => b.id !== id));
    toast.success("Entry removed");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Borrowed</h2>
            <p className="text-sm text-muted-foreground">Money you owe — outstanding <span className="font-semibold text-destructive">₹{outstanding.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-primary text-primary-foreground shadow-elegant">
          <Plus className="h-4 w-4 mr-1" /> Add Entry
        </Button>
      </motion.div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleAdd}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.1 }}
            className="grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft md:grid-cols-[1fr_140px_1fr_160px_auto]"
          >
            <Input placeholder="From whom" value={fromPerson} onChange={(e) => setFrom(e.target.value)} />
            <Input type="number" step="0.01" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Input placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Button type="submit" className="bg-gradient-primary text-primary-foreground shadow-elegant">
              <Plus className="h-4 w-4" />
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {active.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No active borrowed entries yet.</td></tr>
              ) : active.map((b) => (
                <tr key={b.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{b.from_person}</td>
                  <td className="px-4 py-3 font-semibold text-destructive">₹{b.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.reason || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{format(new Date(b.borrowed_on), "MMM d, yyyy")}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-medium text-destructive">Pending</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleToggle(b.id, b.is_returned)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-success" title="Mark returned">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Returned section */}
      {returned.length > 0 && (
        <div>
          <button onClick={() => setShowReturned(!showReturned)} className="flex items-center gap-2 text-sm font-medium mb-3 text-muted-foreground">
            {showReturned ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Returned ({returned.length})
          </button>
          <AnimatePresence>
            {showReturned && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft opacity-70">
                <table className="w-full text-sm">
                  <tbody>
                    {returned.map((b) => (
                      <tr key={b.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium text-muted-foreground">{b.from_person}</td>
                        <td className="px-4 py-3 text-muted-foreground">₹{b.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3 text-muted-foreground">{format(new Date(b.borrowed_on), "MMM d, yyyy")}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">Returned</span>
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
    </div>
  );
}
