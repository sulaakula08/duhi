"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { Product } from "@/lib/data/products";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ProductImage, type BottleView } from "./ProductImage";

export function Gallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const reduced = useReducedMotion();
  const active = product.images[index];

  return (
    <div>
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-sm bg-surface"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              scale: zoomed && !reduced ? 1.06 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={transition.standard}
          >
            <ProductImage
              art={product.art}
              alt={active.alt}
              view={active.view as BottleView}
              photo={product.photos?.[index]}
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-3" role="tablist" aria-label={`Кадры: ${product.name}`}>
        {product.images.map((image, i) => (
          <button
            key={image.view}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={image.alt}
            onClick={() => setIndex(i)}
            className={cn(
              "relative aspect-square w-16 overflow-hidden rounded-sm border bg-surface transition-colors duration-300 sm:w-20",
              i === index ? "border-accent" : "border-line hover:border-accent-soft",
            )}
          >
            <ProductImage
              art={product.art}
              alt=""
              view={image.view as BottleView}
              showGround={false}
              photo={product.photos?.[i]}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
