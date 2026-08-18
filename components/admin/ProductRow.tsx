"use client";

import { motion } from "motion/react";
import { Pencil, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { FAMILY_LABEL, GENDER_LABEL, type Product } from "@/lib/data/products";
import { transition } from "@/lib/motion";
import { useMoney } from "@/components/CurrencyProvider";
import { cn } from "@/lib/utils";

export type AdminRow = Product & { source: "custom" | "seed"; hidden: boolean };

export function ProductRow({
  product,
  editing,
  onEdit,
  onDelete,
  onRestore,
}: {
  product: AdminRow;
  editing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onRestore: () => void;
}) {
  const price = Math.min(...product.sizes.map((s) => s.price));
  const money = useMoney();

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={transition.standard}
      className={cn(
        "rounded-sm border p-4 transition-colors",
        editing ? "border-accent" : "border-line",
        product.hidden && "opacity-55",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link
              href={`/products/${product.slug}`}
              className="font-display text-xl transition-colors hover:text-accent"
            >
              {product.name}
            </Link>
            {product.source === "custom" && (
              <span className="label-xs rounded-full border border-accent px-2 py-0.5 text-accent">
                Своё
              </span>
            )}
            {product.hidden && (
              <span className="label-xs rounded-full border border-line px-2 py-0.5 text-muted">
                Скрыт
              </span>
            )}
            {!product.inStock && !product.hidden && (
              <span className="label-xs rounded-full border border-line px-2 py-0.5 text-muted">
                Нет в наличии
              </span>
            )}
          </div>
          <p className="mt-1 text-[0.82rem] text-muted">
            {GENDER_LABEL[product.gender]} · {FAMILY_LABEL[product.family]} · от{" "}
            {money(price)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {product.hidden ? (
            <button
              type="button"
              onClick={onRestore}
              className="label-xs inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 transition-colors hover:border-accent hover:text-accent"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Вернуть
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onEdit}
                aria-label={`Изменить ${product.name}`}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                  editing ? "text-accent" : "text-muted hover:text-accent",
                )}
              >
                <Pencil size={15} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onDelete}
                aria-label={
                  product.source === "custom"
                    ? `Удалить ${product.name}`
                    : `Скрыть ${product.name} из каталога`
                }
                className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:text-feminine"
              >
                <Trash2 size={15} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.li>
  );
}
