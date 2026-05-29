"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider, ThemeToggle } from "@/components/ThemeToggle";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Onboarding } from "@/components/Onboarding";
import AppSidebar from "@/components/sidebar/AppSidebar";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/borrowed":  "Borrowed Money",
  "/lended":    "Lended Money",
  "/budget":    "Set Budget",
  "/plans":     "My Plans",
};

interface AppLayoutClientProps {
  balance: number;
  userName?: string | null;
  avatarUrl?: string | null;
  children: React.ReactNode;
}

export default function AppLayoutClient({ balance, userName, avatarUrl, children }: AppLayoutClientProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "WiseCheck";
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("onboarding-seen");
    if (!seen) setShowOnboarding(true);
  }, []);

  const finishOnboarding = () => {
    localStorage.setItem("onboarding-seen", "1");
    setShowOnboarding(false);
  };

  return (
    <ThemeProvider>
      <SmoothScroll>
        <AnimatePresence>
          {showOnboarding && <Onboarding onDone={finishOnboarding} />}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showOnboarding ? 0 : 1 }}
          transition={{ duration: 0.6 }}
          className="min-h-screen bg-background"
        >
          {/* Ambient gradient blobs */}
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl" />
          </div>

          <div className="flex">
            <AppSidebar userName={userName} avatarUrl={avatarUrl} />

            <div className="min-w-0 flex-1">
              <div className="mx-auto max-w-[1600px] px-4 py-6 pl-16 lg:px-8 lg:pl-8">
                {/* Page header */}
                <motion.header
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center justify-between gap-4 border-b border-border/40 pb-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        {pathname === "/dashboard" ? `Welcome back, ${userName?.split(" ")[0] || "there"}!` : title}
                      </h1>
                      <p className="text-xs text-muted-foreground">
                        {pathname === "/dashboard" ? "Here is a summary of your financial health today." : "Your money, beautifully tracked."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Balance pill */}
                    <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-soft">
                      <span className="text-xs font-medium text-muted-foreground">Balance</span>
                      <span className={`text-sm font-bold ${balance >= 0 ? "text-success" : "text-destructive"}`}>
                        {balance >= 0 ? "+" : ""}₹{Math.abs(balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <ThemeToggle />
                    
                    {/* User profile avatar circle */}
                    <Link href="/profile" className="flex items-center">
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-accent hover:border-primary transition-all duration-200 cursor-pointer shadow-soft flex items-center justify-center font-bold text-sm">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          (userName ? userName[0].toUpperCase() : "U")
                        )}
                      </div>
                    </Link>
                  </div>
                </motion.header>

                {/* Page content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
        <Toaster />
      </SmoothScroll>
    </ThemeProvider>
  );
}
