"use client";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";

interface FloatingSaveButtonProps {
  onClick: () => void;
  loading?: boolean;
  count?: number;
  label?: string;
}

export default function FloatingSaveButton({
  onClick, loading, count, label = "Save Changes",
}: FloatingSaveButtonProps) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(108,99,255,0.5)" }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        disabled={loading}
        className="flex items-center gap-3 px-8 py-3.5 rounded-2xl font-semibold text-white transition-all duration-200 disabled:opacity-60"
        style={{ background: "var(--accent)", boxShadow: "0 4px 20px rgba(108,99,255,0.4)" }}>
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {label}
        {count !== undefined && count > 0 && (
          <span className="bg-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            style={{ color: "var(--accent)" }}>
            {count}
          </span>
        )}
      </motion.button>
    </motion.div>
  );
}
