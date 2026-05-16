"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ArrowDownCircle, ArrowUpCircle,
  Target, BookOpen, ChevronLeft, ChevronRight, LogOut,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview",    icon: LayoutDashboard },
  { href: "/borrowed",  label: "Borrowed",    icon: ArrowDownCircle },
  { href: "/lended",    label: "Lended",      icon: ArrowUpCircle },
  { href: "/budget",    label: "Set Budget",  icon: Target },
  { href: "/plans",     label: "Plans",       icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col shrink-0 h-screen overflow-hidden"
      style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border)" }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 glow-sm"
          style={{ background: "var(--accent)" }}>W</div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="font-bold text-lg text-white whitespace-nowrap">
              WiseCheck
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 2 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 relative"
                style={{
                  background: active ? "rgba(108,99,255,0.18)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-muted)",
                }}>
                {active && (
                  <motion.div
                    layoutId="sidebar-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(108,99,255,0.14)", border: "1px solid rgba(108,99,255,0.3)" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
                )}
                <Icon size={20} className="shrink-0 relative z-10" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      className="text-sm font-medium whitespace-nowrap relative z-10">
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-4 border-t pt-4" style={{ borderColor: "var(--border)" }}>
        <form action="/auth/signout" method="POST">
          <motion.button
            whileHover={{ x: 2 }}
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-colors duration-200 text-left"
            style={{ color: "var(--text-muted)" }}>
            <LogOut size={20} className="shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap">
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[76px] w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
