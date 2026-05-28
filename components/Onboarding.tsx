"use client";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// Inline tiny lottie animation (coin/wallet vibe via simple shapes)
const lottieData = {
  v: "5.7.4", fr: 60, ip: 0, op: 120, w: 400, h: 400, nm: "coin", ddd: 0, assets: [],
  layers: [{
    ddd: 0, ind: 1, ty: 4, nm: "circle", sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 1, k: [{ t: 0, s: [0] }, { t: 120, s: [360] }] },
      p: { a: 0, k: [200, 200, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [{ t: 0, s: [80, 80] }, { t: 60, s: [110, 110] }, { t: 120, s: [80, 80] }] },
    },
    shapes: [
      { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [180, 180] } },
      { ty: "st", c: { a: 0, k: [0.65, 0.42, 0.95, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 12 } },
      { ty: "fl", c: { a: 0, k: [0.78, 0.55, 1, 1] }, o: { a: 0, k: 60 } },
      { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
    ],
    ao: 0, ip: 0, op: 120, st: 0, bm: 0,
  }],
};

const STEPS = [
  { title: "Welcome to WiseCheck", subtitle: "Track every rupee with grace." },
  { title: "Visualize.", subtitle: "Switch charts, spot patterns instantly." },
  { title: "You're ready.", subtitle: "Let's get to your dashboard." },
];

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const next = () => (step < STEPS.length - 1 ? setStep(step + 1) : onDone());

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-primary opacity-10" />
      <div className="relative flex w-full max-w-md flex-col items-center px-6 text-center">
        <div className="h-64 w-64">
          <Lottie animationData={lottieData} loop />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-4xl font-bold tracking-tight text-foreground">{STEPS[step].title}</h2>
            <p className="mt-3 text-muted-foreground">{STEPS[step].subtitle}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-primary" : "w-2 bg-muted"}`}
            />
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="ghost" onClick={onDone}>Skip</Button>
          <Button onClick={next} className="bg-gradient-primary text-primary-foreground shadow-elegant">
            {step < STEPS.length - 1 ? "Next" : "Get Started"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
