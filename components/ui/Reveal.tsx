"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, respectMotion, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Scroll reveal. Fires once, slightly before the element is fully in view, and
 * degrades to a plain fade under `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={respectMotion(fadeUp, reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: reduced ? 0 : delay }}
    >
      {children}
    </Component>
  );
}

/**
 * Staggers direct `RevealItem` children. Keep groups to roughly eight elements —
 * past that the tail of the stagger arrives too late to read as one gesture.
 */
export function RevealGroup({
  children,
  className,
  amount = 0.07,
  delayChildren = 0,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  delayChildren?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduced ? undefined : stagger(amount, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div className={cn(className)} variants={respectMotion(fadeUp, reduced)}>
      {children}
    </motion.div>
  );
}
