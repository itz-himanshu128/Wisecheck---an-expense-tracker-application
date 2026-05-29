"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap, TrendingUp, BarChart3, Users, Lock, Sparkles } from "lucide-react";

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// --- DATA ---
const HERO_WORDS = ["Your Money", "Your Debt.", "The Future.", "Your Life."];

const BENTO_FEATURES = [
  {
    title: "Vibrant Analytics",
    desc: "Understand your cashflow instantly with reactive charts.",
    icon: BarChart3,
    color: "#C084FC",
    colSpan: "col-span-1 md:col-span-2",
    delay: 0.1
  },
  {
    title: "Social Ledger",
    desc: "Effortlessly track who owes you without the awkward texts.",
    icon: Users,
    color: "#4ADE80",
    colSpan: "col-span-1",
    delay: 0.2
  },
  {
    title: "Strict Privacy",
    desc: "Bank-grade RLS security means nobody sees your data but you.",
    icon: Lock,
    color: "#FBBF24",
    colSpan: "col-span-1",
    delay: 0.3
  },
  {
    title: "Zero Latency",
    desc: "Built on edge infrastructure for instantaneous UI responses.",
    icon: Zap,
    color: "#38BDF8",
    colSpan: "col-span-1 md:col-span-2",
    delay: 0.4
  }
];

// Isolate rotating text to prevent full page re-renders
function RotatingText() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % HERO_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-flex items-center justify-center h-[1.2em] overflow-hidden min-w-[260px] md:min-w-[400px] lg:min-w-[520px]">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={wordIndex}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 14 }}
          className="absolute gradient-text whitespace-nowrap"
        >
          {HERO_WORDS[wordIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// Isolate demo state to prevent full page re-renders
function MiniDemo() {
  const [mockChartHeight, setMockChartHeight] = useState(40);

  const handleSimulateAdd = () => {
    setMockChartHeight((prev) => (prev >= 90 ? 30 : prev + 25));
  };

  return (
    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
      <div>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Experience true <br/><span className="text-[#38BDF8]">zero latency.</span>
        </h2>
        <p className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed">
          We've engineered the entire stack to respond instantly. Don't believe us? Click the button below and watch the UI react without waiting for a server roundtrip.
        </p>
        <button 
          onClick={handleSimulateAdd}
          className="px-6 py-3 rounded-xl font-bold text-[#1B2134] bg-[#38BDF8] hover:bg-[#38BDF8]/90 transition-all flex items-center gap-2 active:scale-95"
        >
          <TrendingUp size={18} /> Simulate Expense
        </button>
      </div>

      {/* Interactive Mock Chart */}
      <div className="glass rounded-2xl border border-[var(--border)] p-6 h-64 flex items-end gap-4 justify-center relative overflow-hidden bg-black/20">
        <div className="absolute top-6 left-6 text-sm font-bold text-white">Monthly Trend</div>
        
        <div className="w-12 bg-primary/20 rounded-t-md h-[30%] transition-all" />
        <div className="w-12 bg-primary/40 rounded-t-md h-[50%] transition-all" />
        <div className="w-12 bg-primary/60 rounded-t-md h-[70%] transition-all" />
        <div 
          className="w-12 bg-[#38BDF8] rounded-t-md transition-all duration-500 ease-out flex items-start justify-center pt-2 relative shadow-[0_0_15px_rgba(56,189,248,0.5)]" 
          style={{ height: `${mockChartHeight}%` }} 
        >
          {mockChartHeight > 40 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-8 text-xs font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-1 rounded"
            >
              Updated!
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="overflow-hidden relative">
      {/* Background Ambient Glow - Replaced Heavy blurs with CSS radial gradients for extreme performance */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full -z-10 pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }} />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full -z-10 pointer-events-none opacity-10" style={{ background: 'radial-gradient(circle, #4ADE80 0%, transparent 70%)' }} />

      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 pt-24 pb-12 relative z-10">
        <motion.div
          initial="hidden" animate="visible" variants={staggerContainer}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-semibold mb-8 shadow-elegant hover:scale-105 transition-transform" style={{ color: "var(--accent)", border: "1px solid var(--accent)" }}>
            <Sparkles className="w-4 h-4 animate-pulse" /> 
            <span>Welcome to WiseCheck 1.0</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-6 leading-[1.1] flex flex-col items-center justify-center">
            <div className="flex flex-wrap justify-center items-center gap-x-3 md:gap-x-5">
              <span>Track</span>
              <RotatingText />
            </div>
            <div className="mt-2 md:mt-4">Own Your Future.</div>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-[var(--text-muted)] mb-12 max-w-2xl mx-auto leading-relaxed">
            The smartest way to manage expenses, track borrowed money, set budgets, and plan your financial life—all within a zero-latency interface.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/login" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 flex items-center justify-center gap-2 glow shadow-elegant" style={{ background: "var(--accent)" }}>
              Try WiseCheck Free <ArrowRight size={18} />
            </Link>
            <Link href="/features" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white transition-all hover:bg-white/5 flex items-center justify-center gap-2 glass border border-[var(--border)] hover:border-white/20">
              Explore Features
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Bento Box Showcase */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">A toolkit designed for speed.</h2>
            <p className="text-[var(--text-muted)] text-lg">Hover over the modules below to see them in action.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENTO_FEATURES.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ scale: 0.98, translateY: -5 }}
                className={`glass p-8 rounded-3xl border border-[var(--border)] hover:border-white/20 transition-all cursor-crosshair group overflow-hidden relative ${feature.colSpan}`}
              >
                {/* Hover Ambient Glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl pointer-events-none" 
                  style={{ background: `radial-gradient(circle, ${feature.color} 0%, transparent 70%)` }} 
                />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3" style={{ background: `${feature.color}15`, color: feature.color }}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Mini-Demo Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto glass rounded-[2.5rem] border border-[var(--border)] p-8 md:p-16 overflow-hidden relative shadow-elegant">
          {/* Decorative Background grid inside the section */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <MiniDemo />
        </div>
      </section>

      {/* Trust Bottom Section */}
      <section className="py-24 px-6 relative z-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Ready to take control?</h2>
        <Link href="/auth/login" className="inline-flex px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 items-center justify-center gap-2 glow shadow-elegant" style={{ background: "var(--accent)" }}>
          Create Free Account <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}


