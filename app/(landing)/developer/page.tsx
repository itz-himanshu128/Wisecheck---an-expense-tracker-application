"use client";
import { motion } from "framer-motion";
import { Code, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DeveloperPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-8 md:p-12 w-full border border-[var(--border)] text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--accent)]/20 to-transparent pointer-events-none" />
        
        <div className="w-24 h-24 rounded-full mx-auto mb-6 bg-[var(--accent)] flex items-center justify-center text-3xl font-bold text-white shadow-lg relative z-10">
          JD
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">John Doe</h1>
        <p className="text-[var(--accent)] font-medium mb-6">Full Stack Developer</p>
        
        <p className="text-[var(--text-muted)] leading-relaxed mb-8 max-w-lg mx-auto">
          Passionate about building beautiful, high-performance web applications. WiseCheck is a showcase of modern Next.js architecture, Supabase integration, and premium UI/UX design.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link href="https://github.com" target="_blank" className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-[var(--border)]">
            <Code size={20} />
          </Link>
          <Link href="mailto:hello@example.com" target="_blank" className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-[var(--border)]">
            <Mail size={20} />
          </Link>
          <Link href="#" className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-[var(--border)]">
            <ExternalLink size={20} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
