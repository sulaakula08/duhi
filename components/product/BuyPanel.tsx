"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/data/products";
import { findSize } from "@/lib/data/products";
import { spring, transition } from "@/lib/motion";
import { SHIPPING_THRESHOLD } from "@/lib/data/shipping";
import { useCartStore } from "@/lib/store/cart";
import { useMoney } from "@/components/CurrencyProvider";
import { cn } from "@/lib/utils";

export function BuyPanel({ product }: { product: Product }) {
  const [ml, setMl] = useState<number>(product.sizes[1]?.ml ?? product.sizes[0].ml);
  const [added, setAdded] = useState(false);
  const add = useCartStore((s) => s.add);
  const reduced = useReducedMotion();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const money = useMoney();

  const size = findSize(product, ml);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function onAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle,
      ml: size.ml,
      sku: size.sku,
      price: size.price,
      art: product.art,
      photo: product.photos?.[0],
    });
    setAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <fieldset>
          <legend className="label-xs text-muted">Объём</legend>
          <div className="mt-3 flex gap-2">
            {product.sizes.map((option) => (
              <button
                key={option.ml}
                type="button"
                onClick={() => setMl(option.ml)}
                aria-pressed={option.ml === ml}
                className={cn(
                  "label-xs min-h-11 rounded-full border px-4 transition-colors duration-300",
                  option.ml === ml
                    ? "border-accent text-accent"
                    : "border-line text-muted hover:border-accent-soft hover:text-ink",
                )}
              >
                {option.ml} мл
              </button>
            ))}
          </div>
        </fieldset>

        <div className="text-right">
          <span className="label-xs text-muted">Цена</span>
          <div className="mt-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={size.price}
                initial={reduced ? { opacity: 0 } : { y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
                transition={transition.standard}
                className="font-display text-3xl tabular-nums"
              >
                {money(size.price)}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        onClick={onAdd}
        disabled={!product.inStock}
        className="relative mt-8 w-full overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          {added ? (
            <motion.span
              key="added"
              className="flex items-center gap-2"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
              transition={spring}
            >
              <Check size={15} aria-hidden="true" />
              Добавлено
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={transition.micro}
            >
              {product.inStock ? "В корзину" : "Продано"}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      {/* Читается скринридером, но не забирает фокус у кнопки. */}
      <p aria-live="polite" className="sr-only">
        {added ? `${product.name}, ${size.ml} мл — добавлено в корзину.` : ""}
      </p>

      <p className="mt-4 text-center text-[0.78rem] text-muted">
        Бесплатная доставка от {money(SHIPPING_THRESHOLD)} · Два пробника к заказу
      </p>
    </div>
  );
}
