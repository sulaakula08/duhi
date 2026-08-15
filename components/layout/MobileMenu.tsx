"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { ease, transition } from "@/lib/motion";
import { ThemeToggle } from "./ThemeToggle";
import { primaryNav } from "./nav";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Блокируем страницу, переводим фокус внутрь и держим его там, пока меню открыто.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Меню"
          className="fixed inset-0 z-100 bg-bg lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0.01 } : transition.standard}
        >
          <div className="container-x flex h-20 items-center justify-between">
            <Logo className="text-lg" />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Закрыть меню"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:text-accent"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <nav className="container-x mt-8">
            <ul>
              {primaryNav.map((link, index) => (
                <li key={link.href} className="line-mask border-b border-line">
                  <motion.span
                    className="block"
                    initial={reduced ? { opacity: 0 } : { y: "110%" }}
                    animate={reduced ? { opacity: 1 } : { y: "0%" }}
                    transition={
                      reduced
                        ? { duration: 0.15 }
                        : { duration: 0.7, ease: ease.out, delay: 0.06 + index * 0.05 }
                    }
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="display-3 block py-4 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </motion.span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-center justify-between">
              <Link
                href="/cart"
                onClick={onClose}
                className="inline-flex min-h-11 items-center gap-2 text-[0.9rem] text-muted transition-colors hover:text-accent"
              >
                <ShoppingBag size={16} aria-hidden="true" />
                Корзина
              </Link>
              <ThemeToggle />
            </div>
          </nav>

          <p className="container-x absolute inset-x-0 bottom-10 text-[0.8rem] text-muted">
            Доставка от €120 бесплатно.
            <br />
            Два пробника к каждому заказу.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
