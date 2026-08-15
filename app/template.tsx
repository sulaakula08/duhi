"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

/**
 * Route transition. A template remounts on navigation, which is what gives the
 * enter animation something to run on. Exit is faster than enter so the site
 * never feels like it is holding you up on the way out.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0.15 } : { duration: 0.4, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
