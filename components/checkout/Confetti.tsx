"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { ease } from "@/lib/motion";

/**
 * The confirmation flourish: a ring that draws itself and a mark that springs
 * in. Under reduced motion it simply appears.
 */
export function Confetti() {
  const reduced = useReducedMotion();

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0">
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1"
          strokeLinecap="round"
          initial={reduced ? { pathLength: 1 } : { pathLength: 0, rotate: -90 }}
          animate={{ pathLength: 1, rotate: -90 }}
          style={{ transformOrigin: "50% 50%" }}
          transition={reduced ? { duration: 0 } : { duration: 1.1, ease: ease.out }}
        />
      </svg>

      <motion.span
        className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-contrast"
        initial={reduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={
          reduced
            ? { duration: 0.2 }
            : { type: "spring", stiffness: 300, damping: 22, delay: 0.5 }
        }
      >
        <Check size={20} aria-hidden="true" />
      </motion.span>
    </div>
  );
}
