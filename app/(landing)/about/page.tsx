"use client";
import { motion } from "framer-motion";
import { Layers, Database, Paintbrush, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Built with modern <span className="gradient-text">technology</span></h1>
        <p className="text-lg text-[var(--text-muted)]">Performance, security, and aesthetics at the core.</p>
      </div>

      <div className="glass rounded-3xl p-8 md:p-12 mb-12 border border-[var(--border)]">
        <h2 className="text-2xl font-bold text-white mb-6">Our Philosophy</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>
            WiseCheck was born out of frustration with complex, cluttered financial tools. We believe that tracking your money should be as seamless as spending it.
          </p>
          <p>
            Instead of bombarding you with ads or unnecessary upsells, we focus on clarity, speed, and design. Every pixel is crafted to give you the best possible experience, helping you make informed financial decisions without the noise.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-8 text-center">The Tech Stack</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { icon: Layers, name: "Next.js 14", desc: "App Router, Server Components, and edge-ready performance." },
          { icon: Database, name: "Supabase", desc: "PostgreSQL database with real-time capabilities and strict Row Level Security." },
          { icon: Paintbrush, name: "Tailwind CSS v4", desc: "Utility-first styling for beautiful, responsive, and maintainable designs." },
          { icon: Zap, name: "Framer Motion & Lenis", desc: "Fluid animations and buttery smooth scrolling for a premium feel." }
        ].map((tech, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-[var(--border)]"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(108,99,255,0.1)", color: "var(--accent)" }}>
              <tech.icon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">{tech.name}</h3>
              <p className="text-sm text-[var(--text-muted)]">{tech.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
