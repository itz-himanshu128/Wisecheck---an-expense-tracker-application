"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Settings, User } from "lucide-react";
import { useState } from "react";
import ColorSwitcher from "@/components/ColorSwitcher";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/borrowed":  "Borrowed Money",
  "/lended":    "Lended Money",
  "/budget":    "Set Budget",
  "/plans":     "My Plans",
  "/profile":   "Profile",
};

interface TopBarProps {
  balance: number;
  userName?: string | null;
  avatarUrl?: string | null;
}

export default function TopBar({ balance, userName, avatarUrl }: TopBarProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "WiseCheck";
  const [showSettings, setShowSettings] = useState(false);

  const isPositive = balance >= 0;

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b shrink-0"
      style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>

      <h1 className="text-xl font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Balance */}
        <div className="glass px-4 py-1.5 rounded-full flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Balance</span>
          <span className="text-sm font-bold" style={{ color: isPositive ? "var(--success)" : "var(--danger)" }}>
            {isPositive ? "+" : ""}₹{Math.abs(balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Settings */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            <Settings size={16} />
          </motion.button>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 z-50 glass rounded-2xl p-4 w-56"
                style={{ border: "1px solid var(--border)" }}>
                <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>ACCENT COLOR</p>
                <ColorSwitcher />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <Link href="/profile">
          <motion.div whileHover={{ scale: 1.05 }} className="w-9 h-9 rounded-full overflow-hidden cursor-pointer border-2 transition-all"
            style={{ borderColor: "var(--border)" }}>
            {avatarUrl ? (
              <Image src={avatarUrl} alt={userName ?? "User"} width={36} height={36} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ background: "var(--accent)" }}>
                <User size={16} />
              </div>
            )}
          </motion.div>
        </Link>
      </div>
    </header>
  );
}
