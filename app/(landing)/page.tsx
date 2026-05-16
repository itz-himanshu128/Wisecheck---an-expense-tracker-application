"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 relative">
        <motion.div
          initial="hidden" animate="visible" variants={staggerContainer}
          className="text-center max-w-4xl mx-auto z-10"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm font-medium mb-8" style={{ color: "var(--accent)", border: "1px solid var(--accent)" }}>
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" /> Introducing WiseCheck 1.0
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Track Every Rupee.<br />
            <span className="gradient-text">Own Your Future.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-[var(--text-muted)] mb-10 max-w-2xl mx-auto">
            The smartest way to manage expenses, track borrowed money, set budgets, and plan your financial life—all in one beautiful dashboard.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/login" className="px-8 py-4 rounded-full font-bold text-white transition-all hover:scale-105 flex items-center gap-2 glow" style={{ background: "var(--accent)" }}>
              Try WiseCheck Free <ArrowRight size={18} />
            </Link>
            <Link href="/features" className="px-8 py-4 rounded-full font-bold text-white transition-all hover:bg-white/5 flex items-center gap-2 glass">
              Explore Features
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Image Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="mt-20 w-full max-w-5xl rounded-2xl md:rounded-[2rem] overflow-hidden glass p-2 md:p-4 z-10"
          style={{ border: "1px solid rgba(108,99,255,0.2)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
        >
          <div className="w-full aspect-[16/9] bg-[var(--bg-secondary)] rounded-xl md:rounded-2xl overflow-hidden relative border border-[var(--border)]">
            {/* Mock Dashboard UI */}
            <div className="absolute inset-0 p-4 md:p-8 flex flex-col gap-4">
              <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                <div className="w-32 h-6 bg-[var(--bg-card)] rounded" />
                <div className="w-24 h-8 bg-[var(--bg-card)] rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-4 flex-1">
                <div className="col-span-2 glass rounded-xl border border-[var(--border)] p-4 flex flex-col justify-end">
                   <div className="w-full h-40 bg-[var(--accent)] opacity-20 rounded-lg mt-auto" style={{ clipPath: "polygon(0 100%, 0 60%, 20% 50%, 40% 70%, 60% 40%, 80% 60%, 100% 20%, 100% 100%)" }} />
                </div>
                <div className="col-span-1 flex flex-col gap-4">
                  <div className="flex-1 glass rounded-xl border border-[var(--border)]" />
                  <div className="flex-1 glass rounded-xl border border-[var(--border)]" />
                </div>
              </div>
            </div>
            {/* Overlay gradient for fade effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent opacity-60" />
          </div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Built on Next.js App Router for instant page loads and seamless transitions." },
              { icon: Shield, title: "Bank-Grade Security", desc: "Powered by Supabase Row Level Security. Your data is strictly yours." },
              { icon: CheckCircle2, title: "No Clutter", desc: "A clean, ad-free interface designed to help you focus on what matters." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass p-8 rounded-3xl"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(108,99,255,0.1)", color: "var(--accent)" }}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
