"use client";
import { create } from "zustand";
import { AccentColor, ACCENT_COLORS } from "@/lib/types";

interface ThemeStore {
  accentColor: AccentColor;
  accentColors: AccentColor[];
  setAccentColor: (color: AccentColor) => void;
  initFromStorage: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  accentColor: ACCENT_COLORS[0],
  accentColors: ACCENT_COLORS,
  setAccentColor: (color) => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accent", color.hex);
      // Darken by ~15% for hover
      document.documentElement.style.setProperty("--accent-hover", color.hex + "CC");
      localStorage.setItem("wisecheck-accent", JSON.stringify(color));
    }
    set({ accentColor: color });
  },
  initFromStorage: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("wisecheck-accent");
    if (stored) {
      try {
        const color: AccentColor = JSON.parse(stored);
        document.documentElement.style.setProperty("--accent", color.hex);
        document.documentElement.style.setProperty("--accent-hover", color.hex + "CC");
        set({ accentColor: color });
      } catch {}
    }
  },
}));
