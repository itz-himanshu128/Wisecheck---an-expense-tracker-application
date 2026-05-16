"use client";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const links = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/developer", label: "Developer" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass py-3" : "py-5 bg-transparent"
        }`}
        style={{
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 z-50 relative">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm" style={{ background: "var(--accent)" }}>W</div>
            <span className="font-bold text-xl text-white">WiseCheck</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-white transition-colors" style={{ color: "var(--text-muted)" }}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-white hover:text-[var(--accent)] transition-colors">
              Log in
            </Link>
            <Link href="/auth/login" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105" style={{ background: "var(--accent)" }}>
              Get Started <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden z-50 relative text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--bg-primary)] flex flex-col items-center justify-center gap-8 md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-white">
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col items-center gap-4 mt-8">
            <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-[var(--text-muted)]">
              Log in
            </Link>
            <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 rounded-full text-lg font-semibold text-white" style={{ background: "var(--accent)" }}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
