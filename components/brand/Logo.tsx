"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Wordmark } from "./Wordmark";

/**
 * Знак дома: тонкое кольцо, разделённое вертикальной чертой, — горлышко
 * флакона сверху. Нарисовано вручную примитивами SVG, красится currentColor.
 *
 * Кольцо прочерчивается один раз при появлении, черта выезжает следом, точка
 * пружинит. При наведении на логотип (группа `.logo`) знак доворачивается —
 * ровно настолько, чтобы это читалось как отклик, а не как аттракцион.
 */
export function Mark({ className, animate = true }: { className?: string; animate?: boolean }) {
  const reduced = useReducedMotion();
  const still = reduced || !animate;

  return (
    <motion.svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn(
        "h-[1.05em] w-[1.05em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:rotate-90",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      initial={still ? false : "hidden"}
      animate="visible"
    >
      <motion.circle
        cx="12"
        cy="12"
        r="9.25"
        strokeLinecap="round"
        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }}
        style={{ transformOrigin: "50% 50%", rotate: -90 }}
        transition={{ duration: 1.1, ease: ease.out }}
      />
      <motion.line
        x1="12"
        y1="1.5"
        x2="12"
        y2="22.5"
        strokeLinecap="round"
        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }}
        transition={{ duration: 0.7, ease: ease.out, delay: 0.45 }}
      />
      <motion.circle
        cx="12"
        cy="12"
        r="2.25"
        fill="currentColor"
        stroke="none"
        variants={{ hidden: { scale: 0 }, visible: { scale: 1 } }}
        style={{ transformOrigin: "50% 50%" }}
        transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.85 }}
      />
    </motion.svg>
  );
}

export function Logo({
  className,
  showMark = true,
  animate = true,
}: {
  className?: string;
  showMark?: boolean;
  /** Выключает вступительную анимацию — например, во второй копии логотипа. */
  animate?: boolean;
}) {
  const reduced = useReducedMotion();
  const still = reduced || !animate;

  return (
    <span className={cn("group/logo inline-flex items-center gap-2.5 text-ink", className)}>
      {showMark && <Mark className="text-accent" animate={animate} />}
      {/* Буквы разъезжаются из тесного трекинга в рабочий. */}
      <motion.span
        className="inline-flex"
        initial={still ? false : { opacity: 0, letterSpacing: "-0.04em" }}
        animate={{ opacity: 1, letterSpacing: "0em" }}
        transition={{ duration: 1, ease: ease.out, delay: 0.15 }}
      >
        <Wordmark className="h-[0.95em]" />
      </motion.span>
    </span>
  );
}
