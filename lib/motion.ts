import type { Transition, Variants } from "motion/react";

/**
 * The single source of truth for motion in Eldea.
 *
 * Components import from here rather than inlining durations, so the whole site
 * shares one rhythm and a reduced-motion change only has to happen in one place.
 */

export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const duration = {
  micro: 0.15,
  standard: 0.4,
  expressive: 0.7,
  ambient: 1.2,
} as const;

export const spring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

/** Soft spring for large surfaces (drawers, panels) that should feel weighty. */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 32,
};

export const transition = {
  micro: { duration: duration.micro, ease: ease.out },
  standard: { duration: duration.standard, ease: ease.out },
  expressive: { duration: duration.expressive, ease: ease.out },
  ambient: { duration: duration.ambient, ease: ease.out },
} satisfies Record<string, Transition>;

/** Viewport config for scroll reveals — fire once, slightly before full entry. */
export const viewportOnce = { once: true, margin: "-80px" } as const;

/* ------------------------------------------------------------- variants -- */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transition.expressive },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.standard },
};

/** Text line rising out of an `overflow-hidden` mask. */
export const lineReveal: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: duration.ambient, ease: ease.out } },
};

/**
 * Stagger container. Keep `stagger` between 0.06 and 0.09 — beyond that long
 * lists start to crawl.
 */
export function stagger(amount = 0.07, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: amount, delayChildren },
    },
  };
}

/* --------------------------------------------------- reduced-motion guard -- */

/**
 * Collapses a variant set to a plain opacity fade. Every animated component
 * routes its variants through this so `prefers-reduced-motion` is honoured
 * without each component re-implementing the check.
 */
export function respectMotion(variants: Variants, reduced: boolean | null): Variants {
  if (!reduced) return variants;
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2, ease: "linear" } },
  };
}
