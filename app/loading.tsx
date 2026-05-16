"use client";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg-primary)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white text-2xl glow-sm bg-[var(--accent)] relative z-10">
            W
          </div>
          <div className="absolute inset-0 bg-[var(--accent)] rounded-2xl animate-ping opacity-20" />
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-white font-semibold tracking-widest text-sm"
        >
          LOADING
        </motion.div>
      </motion.div>
    </div>
  );
}
