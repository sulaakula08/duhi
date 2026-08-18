"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { ButtonLink } from "@/components/ui/Button";
import { springSoft, transition } from "@/lib/motion";
import {
  SHIPPING_THRESHOLD,
  cartSubtotal,
  shippingFor,
  useCartStore,
  useHydratedCart,
} from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const remove = useCartStore((s) => s.remove);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const { lines } = useHydratedCart();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
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
  }, [isOpen, close]);

  const subtotal = cartSubtotal(lines);
  const shipping = shippingFor(subtotal);
  const remaining = Math.max(0, SHIPPING_THRESHOLD - subtotal);

  // The backdrop and panel are keyed siblings rather than a fragment:
  // AnimatePresence cannot track exits through a Fragment wrapper, which leaves
  // the panel mounted forever after close.
  return (
    <AnimatePresence>
      {isOpen && (
          <motion.div
            key="cart-backdrop"
            className="fixed inset-0 z-100 bg-ink/35 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0.01 } : transition.standard}
            onClick={close}
            aria-hidden="true"
          />
      )}

      {isOpen && (
          <motion.div
            key="cart-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Корзина"
            className="fixed inset-y-0 right-0 z-100 flex w-full max-w-[27rem] flex-col bg-bg shadow-lift"
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={reduced ? { duration: 0.01 } : springSoft}
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="label-xs">Корзина</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Закрыть корзину"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:text-accent"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <p className="display-3">В корзине пусто.</p>
                <p className="text-[0.95rem] text-muted">
                  К каждому заказу — два пробника на ваш выбор.
                </p>
                <ButtonLink href="/collections" onClick={close} variant="ghost">
                  В каталог
                </ButtonLink>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => {
                                return (
                        <motion.li
                          key={line.key}
                          layout={!reduced}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={reduced ? { duration: 0.01 } : transition.standard}
                          className="overflow-hidden border-b border-line"
                        >
                          <div className="flex gap-4 py-5">
                            <Link
                              href={`/products/${line.slug}`}
                              onClick={close}
                              className="block w-20 shrink-0 rounded-sm bg-surface"
                            >
                              {line.art && (
                                <ProductImage
                                  art={line.art}
                                  alt=""
                                  photo={line.photo}
                                  showGround={false}
                                />
                              )}
                            </Link>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <Link
                                    href={`/products/${line.slug}`}
                                    onClick={close}
                                    className="block truncate font-display text-lg leading-tight transition-colors hover:text-accent"
                                  >
                                    {line.name}
                                  </Link>
                                  <p className="mt-0.5 text-[0.8rem] text-muted">
                                    {line.ml} мл · Парфюмерная вода
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => remove(line.key)}
                                  aria-label={`Убрать ${line.name} из корзины`}
                                  className="-mr-1 shrink-0 p-2 text-muted transition-colors hover:text-accent"
                                >
                                  <X size={14} aria-hidden="true" />
                                </button>
                              </div>

                              <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-1 rounded-full border border-line">
                                  <button
                                    type="button"
                                    onClick={() => setQuantity(line.key, line.quantity - 1)}
                                    aria-label={`Уменьшить количество: ${line.name}`}
                                    className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:text-accent"
                                  >
                                    <Minus size={13} aria-hidden="true" />
                                  </button>
                                  <span
                                    aria-live="polite"
                                    className="w-6 text-center text-[0.85rem] tabular-nums"
                                  >
                                    {line.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setQuantity(line.key, line.quantity + 1)}
                                    aria-label={`Увеличить количество: ${line.name}`}
                                    className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:text-accent"
                                  >
                                    <Plus size={13} aria-hidden="true" />
                                  </button>
                                </div>
                                <span className="text-[0.9rem] tabular-nums">
                                  {formatPrice(line.price * line.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                <footer className="border-t border-line px-6 py-5">
                  {remaining > 0 && (
                    <p className="mb-4 text-[0.8rem] text-muted">
                      До бесплатной доставки — {formatPrice(remaining)}.
                    </p>
                  )}
                  <div className="flex items-baseline justify-between">
                    <span className="label-xs text-muted">Итого</span>
                    <motion.span
                      key={subtotal}
                      initial={reduced ? false : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={transition.micro}
                      className="font-display text-2xl tabular-nums"
                    >
                      {formatPrice(subtotal)}
                    </motion.span>
                  </div>
                  <p className="mt-1 text-[0.78rem] text-muted">
                    {shipping === 0
                      ? "Доставка включена"
                      : `Доставка ${formatPrice(shipping)}`}{" "}
                    · Налоги считаются при оформлении
                  </p>
                  <ButtonLink href="/checkout" onClick={close} className="mt-5 w-full" size="lg">
                    Оформить заказ
                  </ButtonLink>
                  <Link
                    href="/cart"
                    onClick={close}
                    className="mt-3 block text-center text-[0.8rem] text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    Открыть корзину целиком
                  </Link>
                </footer>
              </>
            )}
          </motion.div>
      )}
    </AnimatePresence>
  );
}
