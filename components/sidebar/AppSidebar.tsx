"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ArrowDownLeft, ArrowUpRight,
  Target, NotebookPen, Menu, X, LogOut,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview",   icon: LayoutDashboard },
  { href: "/borrowed",  label: "Borrowed",   icon: ArrowDownLeft },
  { href: "/lended",    label: "Lended",     icon: ArrowUpRight },
  { href: "/budget",    label: "Set Budget", icon: Target },
  { href: "/plans",     label: "Plans",      icon: NotebookPen },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = "/auth/login";
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen((s) => !s)}
        className="fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-soft lg:hidden"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Backdrop on mobile */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden" />
      )}

      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-border bg-card/95 backdrop-blur-md p-4 shadow-soft transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-6 flex items-center gap-2 px-2 pt-2 lg:pt-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">WiseCheck</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((it) => {
            const active = pathname === it.href || pathname.startsWith(it.href + "/");
            return (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setMobileOpen(false)}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 -z-10 rounded-xl bg-gradient-primary shadow-elegant"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <it.icon className="h-4 w-4 shrink-0" />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="border-t border-border pt-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>

        <p className="px-2 pt-4 text-[10px] uppercase tracking-wider text-muted-foreground">v1.0 · WiseCheck</p>
      </motion.aside>
    </>
  );
}
