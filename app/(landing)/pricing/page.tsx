"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "₹0",
    desc: "Perfect for individuals getting started.",
    features: ["Unlimited expenses", "Basic charts", "Borrowed & Lended tracking", "1 Budget"],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "₹99",
    period: "/month",
    desc: "For those who want total financial control.",
    features: ["Everything in Free", "Unlimited Budgets", "Unlimited Plans", "Custom Themes", "Export to CSV"],
    cta: "Go Pro",
    popular: true
  },
  {
    name: "Team",
    price: "₹299",
    period: "/month",
    desc: "Manage finances together with family.",
    features: ["Everything in Pro", "Up to 5 members", "Shared budgets", "Role-based access", "Priority support"],
    cta: "Start Free Trial",
    popular: false
  }
];

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, transparent <span className="gradient-text">pricing</span></h1>
        <p className="text-lg text-[var(--text-muted)]">No hidden fees. Start for free, upgrade when you need more power.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`glass rounded-3xl p-8 relative flex flex-col ${plan.popular ? 'border-2 scale-105 z-10' : 'border'}`}
            style={{ borderColor: plan.popular ? 'var(--accent)' : 'var(--border)' }}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white" style={{ background: "var(--accent)" }}>
                RECOMMENDED
              </div>
            )}
            
            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6 h-10">{plan.desc}</p>
            
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-white">{plan.price}</span>
              {plan.period && <span className="text-[var(--text-muted)]">{plan.period}</span>}
            </div>
            
            <ul className="flex flex-col gap-4 mb-8 flex-1">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-sm text-white">
                  <Check size={16} style={{ color: "var(--success)" }} /> {f}
                </li>
              ))}
            </ul>
            
            <Link href="/auth/login" className={`w-full py-3 rounded-xl font-semibold text-center transition-transform hover:scale-105 ${plan.popular ? 'text-white glow' : 'text-white'}`}
              style={{ background: plan.popular ? "var(--accent)" : "rgba(255,255,255,0.1)" }}>
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
