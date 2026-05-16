"use client";
import { useEffect } from "react";
import { useThemeStore } from "@/lib/store/themeStore";
import { motion } from "framer-motion";

export default function ColorSwitcher() {
  const { accentColor, accentColors, setAccentColor, initFromStorage } = useThemeStore();

  useEffect(() => { initFromStorage(); }, [initFromStorage]);

  return (
    <div className="flex flex-wrap gap-2">
      {accentColors.map((color) => (
        <motion.button
          key={color.hex}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setAccentColor(color)}
          title={color.name}
          className="w-7 h-7 rounded-full transition-all duration-200 relative"
          style={{ background: color.hex }}>
          {accentColor.hex === color.hex && (
            <motion.div
              layoutId="color-ring"
              className="absolute inset-[-3px] rounded-full border-2"
              style={{ borderColor: color.hex }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
