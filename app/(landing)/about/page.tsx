"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, Database, Paintbrush, Zap, Users, Target, 
  ChevronDown, CheckCircle, Shield, Rocket, Lock
} from "lucide-react";

const personas = [
  {
    title: "The Financial Optimizer",
    desc: "Wants maximum clarity on where every cent goes. Demands highly granular charts, fast data entry, and proactive limit warnings.",
    icon: Target
  },
  {
    title: "The Social Splitter",
    desc: "Frequently travels, dines out, or shares apartments. Needs an effortless way to track debts, credits, and who owes what without awkward texts.",
    icon: Users
  }
];

const specs = [
  {
    id: "dashboard",
    title: "1.0 Core Dashboard Engine",
    status: "Production",
    content: (
      <div className="space-y-4 text-sm text-[var(--text-muted)]">
        <p><strong className="text-white">Objective:</strong> Provide an immediate, zero-latency overview of the user's current financial state across all active accounts.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Must render raw transaction lists into interactive React Recharts (Pie/Bar/Line).</li>
          <li>Calculations for 'Total Spent' and 'Daily Average' must happen client-side using useMemo to prevent server roundtrips.</li>
          <li>Optimistic UI updates required for all CUD (Create, Update, Delete) operations on transactions.</li>
        </ul>
      </div>
    )
  },
  {
    id: "ledger",
    title: "2.0 Social Ledger Module",
    status: "Production",
    content: (
      <div className="space-y-4 text-sm text-[var(--text-muted)]">
        <p><strong className="text-white">Objective:</strong> Eliminate the friction of tracking informal debts and credits.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Two-way toggle system: "I Owe" vs "They Owe Me".</li>
          <li>Global 'Total Debt' and 'Total Credit' aggregate counters.</li>
          <li>One-click resolution system to instantly zero out balances when paid.</li>
        </ul>
      </div>
    )
  },
  {
    id: "sandbox",
    title: "3.0 Financial Sandbox",
    status: "Beta",
    content: (
      <div className="space-y-4 text-sm text-[var(--text-muted)]">
        <p><strong className="text-white">Objective:</strong> Allow simulation of upcoming financial events without altering core balance sheets.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Isolated Supabase tables for Sandbox projects.</li>
          <li>Must include a markdown-enabled notes area and dynamic checklist system per project.</li>
          <li>Simulated expenses do not impact the global "Current Balance" metric.</li>
        </ul>
      </div>
    )
  }
];

const roadmap = [
  { period: "Q3 2026", title: "Shared Household Accounts", done: false },
  { period: "Q4 2026", title: "Automated Bank Integrations (Plaid)", done: false },
  { period: "Q1 2027", title: "AI-Driven Spending Insights", done: false }
];

export default function AboutPage() {
  const [openSpec, setOpenSpec] = useState<string | null>("dashboard");

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">
      
      {/* Header */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-semibold text-primary"
        >
          <Lock className="h-3.5 w-3.5" />
          <span>PUBLIC PRODUCT SPECS</span>
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          The <span className="gradient-text">WiseCheck</span> PRD
        </h1>
        <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
          We build in the open. Review our product vision, target personas, technical architecture, and interactive feature specifications.
        </p>
      </div>

      {/* Vision & Principles */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass p-8 rounded-3xl border border-[var(--border)]"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Rocket className="text-primary h-6 w-6" />
            Executive Vision
          </h2>
          <div className="space-y-4 text-sm text-[var(--text-muted)] leading-relaxed">
            <p>
              WiseCheck was born out of frustration with complex, cluttered financial tools that feel like spreadsheets from 2010. 
              We believe tracking money should be as seamless as spending it.
            </p>
            <p>
              Our objective is to deliver a <strong className="text-white">zero-latency, highly aesthetic</strong> financial tracker that prioritizes data privacy and rapid data entry.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-3xl border border-[var(--border)]"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="text-primary h-6 w-6" />
            Core Principles
          </h2>
          <ul className="space-y-4 text-sm text-[var(--text-muted)]">
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span><strong>Speed over everything:</strong> If it takes more than 2 seconds to log an expense, we've failed.</span>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span><strong>Aesthetic Utility:</strong> Beauty is not just for show; good design reduces cognitive load.</span>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span><strong>Uncompromising Security:</strong> Strict Row-Level Security rules at the database level ensure absolute privacy.</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Target Personas */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-[var(--border)] pb-4">Target Personas</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {personas.map((persona, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <persona.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">{persona.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{persona.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Specs */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-[var(--border)] pb-4">Feature Specifications</h2>
        <div className="space-y-3">
          {specs.map((spec) => {
            const isOpen = openSpec === spec.id;
            return (
              <div key={spec.id} className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
                <button 
                  onClick={() => setOpenSpec(isOpen ? null : spec.id)}
                  className="w-full px-6 py-5 flex items-center justify-between bg-transparent hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-white">{spec.title}</span>
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${spec.status === "Production" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {spec.status}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-[var(--border)]/50">
                        {spec.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-[var(--border)] pb-4">Technical Architecture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Layers, name: "Next.js App Router", desc: "Chosen for React Server Components to push heavy data lifting to the edge, keeping the client lightweight." },
            { icon: Database, name: "Supabase & Postgres", desc: "Chosen for its real-time web-socket sync and robust Row Level Security (RLS) guaranteeing user data isolation." },
            { icon: Paintbrush, name: "Tailwind CSS & OKLCH", desc: "Chosen for absolute design control and the ability to dynamically inject precise color variables at runtime." },
            { icon: Zap, name: "Framer Motion", desc: "Chosen to provide immediate, hardware-accelerated visual feedback for all user interactions." }
          ].map((tech, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-2xl bg-card border border-[var(--border)]">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                <tech.icon size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{tech.name}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-[var(--border)] pb-4">Product Roadmap</h2>
        <div className="glass p-6 rounded-3xl border border-[var(--border)] space-y-4">
          {roadmap.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-8 flex justify-center">
                {item.done ? (
                  <CheckCircle className="text-green-400 w-5 h-5" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-[var(--text-muted)]" />
                )}
              </div>
              <div className="flex-1">
                <span className={`text-sm ${item.done ? "text-[var(--text-muted)] line-through" : "text-white font-medium"}`}>
                  {item.title}
                </span>
              </div>
              <div className="text-xs font-mono text-[var(--text-muted)] bg-black/20 px-2 py-1 rounded">
                {item.period}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

