"use client";
import { motion } from "framer-motion";
import { LayoutDashboard, ArrowDownUp, Target, BookOpen, Palette } from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Visual Dashboard",
    desc: "Understand your spending at a glance with beautiful Pie, Bar, and Line charts. Switch between views instantly.",
    color: "#6C63FF"
  },
  {
    icon: ArrowDownUp,
    title: "Borrowed & Lended",
    desc: "Never forget who owes you money. Track borrowed and lended amounts with expected return dates.",
    color: "#4ADE80"
  },
  {
    icon: Target,
    title: "Smart Budgets",
    desc: "Set monthly or yearly limits per category. Visual progress bars turn yellow and red to warn you before you overspend.",
    color: "#FBBF24"
  },
  {
    icon: BookOpen,
    title: "Isolated Plans",
    desc: "Simulate a trip or event budget without affecting your real dashboard. Use tables, checklists, and notes.",
    color: "#00D4FF"
  },
  {
    icon: Palette,
    title: "Custom Themes",
    desc: "Make it yours. Choose from 5 beautiful accent colors that instantly update the entire application interface.",
    color: "#FF6B6B"
  }
];

export default function FeaturesPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          Everything you need to <span className="gradient-text">manage wealth</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-lg text-[var(--text-muted)]"
        >
          Powerful features wrapped in an intuitive, beautiful interface.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-3xl border border-[var(--border)] group hover:border-[var(--accent)] transition-colors duration-300"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110" style={{ background: `${f.color}20`, color: f.color }}>
              <f.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
            <p className="text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
