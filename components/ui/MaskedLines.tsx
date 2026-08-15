"use client";

import { motion, useReducedMotion } from "motion/react";
import { lineReveal, respectMotion, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Headline treatment: each line sits in an overflow-hidden mask and rises into
 * place. Pass lines explicitly rather than splitting a string — where a headline
 * breaks is a typographic decision, not something to leave to the layout engine.
 */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  immediate = false,
  id,
  as: Tag = "h2",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Animate on mount instead of on scroll — for above-the-fold headlines. */
  immediate?: boolean;
  id?: string;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const reduced = useReducedMotion();

  const animationProps = immediate
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: viewportOnce };

  return (
    <Tag id={id} className={cn(className)}>
      <motion.span
        className="block"
        variants={stagger(0.08, delay)}
        initial="hidden"
        {...animationProps}
      >
        {lines.map((line) => (
          <span key={line} className="line-mask">
            <motion.span
              className="block"
              variants={respectMotion(lineReveal, reduced)}
            >
              <span className={cn(lineClassName)}>{line}</span>
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
