"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { Product } from "@/lib/data/products";
import { FAMILY_LABEL, priceRange } from "@/lib/data/products";
import { transition } from "@/lib/motion";
import { useMoney } from "@/components/CurrencyProvider";
import { cn } from "@/lib/utils";
import { ProductImage } from "./ProductImage";

const GENDER_ACCENT: Record<Product["gender"], string> = {
  women: "text-feminine",
  men: "text-masculine",
  unisex: "text-accent",
};

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { min } = priceRange(product);
  const money = useMoney();

  return (
    <motion.article
      className={cn("group relative", className)}
      whileHover={reduced ? undefined : { y: -6 }}
      transition={transition.expressive}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-surface">
          <motion.div
            className="h-full w-full"
            whileHover={reduced ? undefined : { scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductImage
              art={product.art}
              alt={product.images[0].alt}
              photo={product.photos?.[0]}
            />
          </motion.div>

          {(product.isNew || !product.inStock) && (
            <span className="label-xs absolute left-4 top-4 rounded-full bg-bg/90 px-2.5 py-1.5 backdrop-blur-sm">
              {product.inStock ? "Новинка" : "Продано"}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-4">
          <div className="min-w-0">
            <p className={cn("label-xs", GENDER_ACCENT[product.gender])}>
              {FAMILY_LABEL[product.family]}
            </p>
            <h3 className="mt-2 truncate font-display text-2xl font-light leading-tight transition-colors duration-300 group-hover:text-accent">
              {product.name}
            </h3>
            <p className="mt-1 truncate text-[0.85rem] text-muted">{product.subtitle}</p>
          </div>
          <p className="shrink-0 text-[0.9rem] tabular-nums text-muted">
            от {money(min)}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
