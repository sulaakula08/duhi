"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { ButtonLink } from "@/components/ui/Button";
import { useMoney } from "@/components/CurrencyProvider";
import { transition } from "@/lib/motion";
import {
  SHIPPING_THRESHOLD,
  cartSubtotal,
  shippingFor,
  useCartStore,
  useHydratedCart,
} from "@/lib/store/cart";

export function CartView() {
  const remove = useCartStore((s) => s.remove);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const { lines, hydrated } = useHydratedCart();
  const reduced = useReducedMotion();
  const money = useMoney();

  const subtotal = cartSubtotal(lines);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  if (hydrated && lines.length === 0) {
    return (
      <div className="container-x flex flex-col items-center gap-6 py-28 text-center">
        <p className="display-3">Пока пусто.</p>
        <p className="max-w-sm text-[0.95rem] text-muted">
          Четырнадцать ароматов, у каждого три объёма. К любому заказу — два пробника.
        </p>
        <ButtonLink href="/collections">В каталог</ButtonLink>
      </div>
    );
  }

  return (
    <div className="container-x grid gap-14 pb-28 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
      <ul className="border-t border-line">
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
                <div className="flex gap-5 py-7 sm:gap-7">
                  <Link
                    href={`/products/${line.slug}`}
                    className="block w-24 shrink-0 rounded-sm bg-surface sm:w-32"
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

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          href={`/products/${line.slug}`}
                          className="font-display text-2xl leading-tight transition-colors hover:text-accent"
                        >
                          {line.name}
                        </Link>
                        <p className="mt-1 text-[0.85rem] text-muted">{line.subtitle}</p>
                        <p className="mt-2 text-[0.8rem] text-muted">
                          {line.ml} мл · {line.sku}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.key)}
                        aria-label={`Убрать ${line.name} из корзины`}
                        className="shrink-0 p-2 text-muted transition-colors hover:text-accent"
                      >
                        <X size={15} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center rounded-full border border-line">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.key, line.quantity - 1)}
                          aria-label={`Уменьшить количество: ${line.name}`}
                          className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:text-accent"
                        >
                          <Minus size={13} aria-hidden="true" />
                        </button>
                        <span className="w-8 text-center text-[0.9rem] tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.key, line.quantity + 1)}
                          aria-label={`Увеличить количество: ${line.name}`}
                          className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:text-accent"
                        >
                          <Plus size={13} aria-hidden="true" />
                        </button>
                      </div>
                      <span className="font-display text-2xl tabular-nums">
                        {money(line.price * line.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Итоги заказа">
        <h2 className="label-xs text-muted">Итого</h2>

        <dl className="mt-6 space-y-3 border-t border-line pt-6 text-[0.95rem]">
          <div className="flex justify-between">
            <dt className="text-muted">Товары</dt>
            <dd className="tabular-nums">{money(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Доставка</dt>
            <dd className="tabular-nums">
              {shipping === 0 ? "Включена" : money(shipping)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-line pt-4 text-lg">
            <dt>К оплате</dt>
            <dd className="font-display text-3xl tabular-nums">{money(total)}</dd>
          </div>
        </dl>

        {subtotal < SHIPPING_THRESHOLD && subtotal > 0 && (
          <p className="mt-4 text-[0.82rem] text-muted">
            До бесплатной доставки — {money(SHIPPING_THRESHOLD - subtotal)}.
          </p>
        )}

        <ButtonLink href="/checkout" size="lg" className="mt-8 w-full">
          Оформить заказ
        </ButtonLink>

        <p className="mt-4 text-center text-[0.78rem] text-muted">
          Налоги считаются при оформлении. Это демонстрационный магазин — оплата
          не проводится.
        </p>
      </aside>
    </div>
  );
}
