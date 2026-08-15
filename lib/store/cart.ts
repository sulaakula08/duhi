"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

export type CartLine = {
  /** `${productId}-${ml}` — a product in two sizes is two lines. */
  key: string;
  productId: string;
  slug: string;
  name: string;
  subtitle: string;
  ml: number;
  sku: string;
  price: number;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  add: (line: Omit<CartLine, "key" | "quantity">, quantity?: number) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,

      add: (line, quantity = 1) =>
        set((state) => {
          const key = `${line.productId}-${line.ml}`;
          const existing = state.lines.find((l) => l.key === key);
          const lines = existing
            ? state.lines.map((l) =>
                l.key === key ? { ...l, quantity: Math.min(l.quantity + quantity, 99) } : l,
              )
            : [...state.lines, { ...line, key, quantity }];
          return { lines, isOpen: true };
        }),

      remove: (key) => set((state) => ({ lines: state.lines.filter((l) => l.key !== key) })),

      setQuantity: (key, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.key !== key)
              : state.lines.map((l) =>
                  l.key === key ? { ...l, quantity: Math.min(quantity, 99) } : l,
                ),
        })),

      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "eldea-cart",
      // `isOpen` is session UI state, not something to restore on next visit.
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

export const SHIPPING_THRESHOLD = 120;
export const SHIPPING_FEE = 8;

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function shippingFor(subtotal: number): number {
  if (subtotal === 0 || subtotal >= SHIPPING_THRESHOLD) return 0;
  return SHIPPING_FEE;
}

/**
 * Persisted state does not exist during SSR or the first client render.
 * Reading the store through this hook keeps markup identical on both passes,
 * so counts and totals fade in instead of causing a hydration mismatch.
 */
export function useHydratedCart() {
  const [hydrated, setHydrated] = useState(false);
  const lines = useCartStore((s) => s.lines);

  useEffect(() => setHydrated(true), []);

  return {
    hydrated,
    lines: hydrated ? lines : ([] as CartLine[]),
  };
}
