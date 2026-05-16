import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WiseCheck — Smart Money Tracking",
  description:
    "Track expenses, manage debts, set budgets, and plan your finances all in one place.",
  keywords: ["expense tracker", "budget", "money", "finance", "personal finance"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
