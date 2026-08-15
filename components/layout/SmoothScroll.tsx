"use client";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Lenis smooth scrolling.
 *
 * Deliberately disabled under `prefers-reduced-motion`, and `autoRaf` is left on
 * so we do not run a second animation frame loop alongside Motion's.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.6,
      // Required: without this Lenis captures wheel events but never advances
      // its own frame loop, and the page simply refuses to scroll.
      autoRaf: true,
    });

    lenisRef.current = lenis;

    // When focus moves to something off-screen (tab key, skip link), let the
    // browser place it immediately rather than animating there.
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const offscreen = rect.top < 0 || rect.bottom > window.innerHeight;
      if (offscreen) {
        lenis.scrollTo(target, { immediate: true, offset: -120 });
      }
    };

    document.addEventListener("focusin", onFocusIn);

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // Land at the top of every new route.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
