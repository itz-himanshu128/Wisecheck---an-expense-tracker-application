"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard, ArrowDownUp, Target, BookOpen, Palette,
  CheckCircle, Sparkles, Database, ShieldAlert, ArrowRight,
  TrendingUp, Calendar, Zap, FileText, Lock
} from "lucide-react";

const features = [
  {
    id: "analytics",
    icon: LayoutDashboard,
    title: "Vibrant Analytics Dashboard",
    shortDesc: "Understand your financial landscape instantly.",
    desc: "Your finances shouldn't look like a boring spreadsheet. Our modern analytics system compiles your raw transactions into stunning, interactive reports that make understanding your money effortless and enjoyable.",
    color: "#C084FC",
    points: [
      "Dynamic Pie, Bar, and Line chart toggles for multiple perspectives",
      "Real-time category spending breakdowns that update instantly",
      "Immediate card stats: Total Spent, Daily Averages, and Balances",
      "Fully reactive client-side rendering engine with zero lag"
    ]
  },
  {
    id: "ledger",
    icon: ArrowDownUp,
    title: "Debt & Credit Ledger",
    shortDesc: "Never lose track of borrowed money.",
    desc: "Keeping track of who owes who can be awkward and confusing. Manage borrowed and lended balances with dedicated tools that coordinate profiles instantly, ensuring you always know where your cash flows are.",
    color: "#4ADE80",
    points: [
      "Input expected return dates and attach tracking notes",
      "Instant calculations on total debt vs credit outstanding",
      "Smooth one-tap return/received toggling to settle balances",
      "Automated global balance updates across your profile"
    ]
  },
  {
    id: "targets",
    icon: Target,
    title: "Intelligent Budget Targets",
    shortDesc: "Achieve savings targets with proactive guards.",
    desc: "Setting a budget is easy; sticking to it is hard. Set monthly boundaries for specific categories and stay accountable with proactive visual warnings before you overspend.",
    color: "#FBBF24",
    points: [
      "Visual limit progress bars that fill as you spend",
      "Color-coded warning thresholds (Yellow at 80%, Red at 100%)",
      "Proactive warnings before category overspending occurs",
      "Historical spending metrics to compare month-over-month"
    ]
  },
  {
    id: "sandbox",
    icon: BookOpen,
    title: "Sandbox Financial Playgrounds",
    shortDesc: "Simulate custom projects and events.",
    desc: "Planning a vacation, wedding, or major purchase? Simulate custom projects without polluting your primary transaction log. Test different financial scenarios in a secure, isolated environment.",
    color: "#38BDF8",
    points: [
      "Multi-tab design: Tables, Notes, and Checklists per event",
      "Isolated balance sheets and cost calculations",
      "Flexible checkbox planners for tracking event requirements",
      "Rich text areas for storing financial ideas and links"
    ]
  },
  {
    id: "styling",
    icon: Palette,
    title: "Custom Accent Styling Engine",
    shortDesc: "Personalize the entire app in real-time.",
    desc: "Your app should feel like yours. Personalize the entire application in real-time. Choose from beautifully tuned oklch variables that match your style and flow seamlessly across every component.",
    color: "#F43F5E",
    points: [
      "5 hand-selected, premium oklch color themes",
      "Instant app-wide accent transitions without reloading",
      "Full responsive dark and light modes",
      "Harmonious custom-scrollbars and glow states"
    ]
  },
  {
    id: "sync",
    icon: Zap,
    title: "Supabase & Real-time Sync",
    shortDesc: "Enterprise-grade speed and safety.",
    desc: "Built with high-end, responsive architecture. Experience rapid database synchronization and optimistic offline capabilities, so your dashboard always feels instantly responsive.",
    color: "#818CF8",
    points: [
      "Real-time PostgreSQL Supabase integration",
      "Optimistic UI updates for immediate user feedback",
      "Enterprise-grade database safety and strict RLS security",
      "Zero page switching delays in production environments"
    ]
  }
];

const steps = [
  {
    num: "01",
    title: "Create your profile",
    desc: "Sign up securely in seconds. No credit card or complex onboarding required."
  },
  {
    num: "02",
    title: "Log your first expense",
    desc: "Use our streamlined entry form to add transactions. They instantly appear on your dashboard."
  },
  {
    num: "03",
    title: "Set budget targets",
    desc: "Define limits for your highest spend categories to trigger our intelligent warning system."
  },
  {
    num: "04",
    title: "Gain total clarity",
    desc: "Watch your interactive charts update in real-time, giving you absolute financial control."
  }
];

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-32">
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6 pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-semibold text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>POWERFUL & INTUITIVE</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight"
        >
          Everything you need to <br />
          <span className="gradient-text font-extrabold">master your money</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-[var(--text-muted)] leading-relaxed max-w-2xl mx-auto"
        >
          Explore a rich set of finance-management utilities, carefully structured inside a state-of-the-art glassmorphic user interface designed for speed and clarity.
        </motion.p>
      </div>

      {/* Interactive Feature Showcase */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left: Tab List */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-4">Capabilities</h3>
          {features.map((f) => {
            const isActive = activeFeature === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFeature(f.id)}
                className={`text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center gap-4 ${
                  isActive 
                    ? "bg-primary/10 border border-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]" 
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? "bg-primary text-white" : "bg-white/5 text-[var(--text-muted)]"
                  }`}
                >
                  <f.icon size={20} />
                </div>
                <div>
                  <div className={`font-semibold ${isActive ? "text-primary" : "text-white"}`}>
                    {f.title}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">
                    {f.shortDesc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Feature Details */}
        <div className="w-full lg:w-2/3">
          <AnimatePresence mode="wait">
            {features.map((f) => {
              if (f.id !== activeFeature) return null;
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-3xl border border-[var(--border)] overflow-hidden"
                >
                  {/* Visual Header Mock */}
                  <div className="h-48 md:h-64 relative flex items-center justify-center overflow-hidden border-b border-[var(--border)]/50" style={{ background: `linear-gradient(135deg, ${f.color}15, transparent)` }}>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-24 h-24 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-2xl z-10"
                      style={{ background: `${f.color}20`, border: `1px solid ${f.color}40`, color: f.color }}
                    >
                      <f.icon size={48} />
                    </motion.div>
                    
                    {/* Decorative blurred circles */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-30" style={{ background: f.color }}></div>
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: f.color }}></div>
                  </div>

                  <div className="p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-white mb-4">{f.title}</h2>
                    <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-8">
                      {f.desc}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {f.points.map((pt, index) => (
                        <div key={index} className="flex items-start gap-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: f.color }} />
                          <span className="text-sm text-white/80 leading-snug">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-12 border-t border-[var(--border)]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
          <p className="text-[var(--text-muted)]">From zero to complete financial clarity in minutes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative p-6 rounded-3xl bg-card border border-[var(--border)] hover:border-primary/30 transition-colors">
              <div className="text-5xl font-black text-primary/10 mb-6">{step.num}</div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-card p-10 md:p-16 text-center max-w-4xl mx-auto shadow-elegant space-y-6"
      >
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-primary-glow/20 blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight relative z-10">
          Ready to beautifully track your cash?
        </h2>
        <p className="text-base md:text-lg text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed relative z-10">
          Create an account and start managing your dashboard, logs, targets, and events immediately on our real-time database.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 relative z-10">
          <Link href="/auth/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-primary hover:opacity-95 text-primary-foreground font-bold text-sm rounded-xl shadow-elegant transition-all inline-flex items-center justify-center gap-2">
            <span>Get Started Free</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/about" className="w-full sm:w-auto px-8 py-4 bg-[#1B2134]/50 border border-[var(--border)] hover:bg-[#1B2134] text-white font-bold text-sm rounded-xl transition-all">
            Read the Specs
          </Link>
        </div>
      </motion.div>

    </div>
  );
}

