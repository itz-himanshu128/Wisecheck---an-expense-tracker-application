"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Plus, Trash2, Check, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Lended } from "@/lib/types";

export default function LendedClient({ initial }: { initial: Lended[] }) {
  const [rows, setRows] = useState<Lended[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [showReceived, setShowReceived] = useState(false);
  const [toPerson, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [expectedBy, setExpected] = useState("");

  const supabase = createClient();

  const active = rows.filter((r) => !r.is_received);
  const received = rows.filter((r) => r.is_received);
  const outstanding = active.reduce((s, l) => s + l.amount, 0);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!toPerson.trim() || !amt) return toast.error("Enter person and amount");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error("User not authenticated");

    const { data, error } = await supabase
      .from("lended")
      .insert({
        user_id: user.id,
        to_person: toPerson.trim(),
        amount: amt,
        reason: reason.trim() || null,
        lended_on: date,
        expected_by: expectedBy || null,
        is_received: false,
      })
      .select("*")
      .single();

    if (error) return toast.error(error.message);
    setRows([data, ...rows]);
    toast.success("Lended entry added");
    setTo(""); setAmount(""); setReason(""); setExpected("");
    setShowForm(false);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("lended")
      .update({ is_received: !currentStatus })
      .eq("id", id);
    if (error) return toast.error(error.message);
    setRows(rows.map((l) => l.id === id ? { ...l, is_received: !currentStatus } : l));
    toast.success("Status updated");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("lended").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows(rows.filter((l) => l.id !== id));
    toast.success("Entry removed");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Lended</h2>
            <p className="text-sm text-muted-foreground">Money owed to you — outstanding <span className="font-semibold text-success">₹{outstanding.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></p>
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
            className="grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft md:grid-cols-[1fr_120px_1fr_140px_140px_auto]"
          >
            <Input placeholder="To whom" value={toPerson} onChange={(e) => setTo(e.target.value)} />
            <Input type="number" step="0.01" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Input placeholder="Purpose" value={reason} onChange={(e) => setReason(e.target.value)} />
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} title="Lent on" />
            <Input type="date" value={expectedBy} onChange={(e) => setExpected(e.target.value)} title="Expected return" />
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
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Lent on</th>
                <th className="px-4 py-3">Expected</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {active.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No active lended entries yet.</td></tr>
              ) : active.map((l) => (
                <tr key={l.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{l.to_person}</td>
                  <td className="px-4 py-3 font-semibold text-success">₹{l.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.reason || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{format(new Date(l.lended_on), "MMM d, yyyy")}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.expected_by ? format(new Date(l.expected_by), "MMM d, yyyy") : "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-warning/15 px-2.5 py-1 text-xs font-medium text-warning">Pending</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleToggle(l.id, l.is_received)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-success" title="Mark received">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(l.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive">
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

      {/* Received section */}
      {received.length > 0 && (
        <div>
          <button onClick={() => setShowReceived(!showReceived)} className="flex items-center gap-2 text-sm font-medium mb-3 text-muted-foreground">
            {showReceived ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Received ({received.length})
          </button>
          <AnimatePresence>
            {showReceived && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft opacity-70">
                <table className="w-full text-sm">
                  <tbody>
                    {received.map((l) => (
                      <tr key={l.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium text-muted-foreground">{l.to_person}</td>
                        <td className="px-4 py-3 text-muted-foreground">₹{l.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3 text-muted-foreground">{format(new Date(l.lended_on), "MMM d, yyyy")}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">Received</span>
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
