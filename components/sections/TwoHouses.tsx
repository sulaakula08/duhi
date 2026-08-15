"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { getProductBySlug } from "@/lib/data/products";
import { ease } from "@/lib/motion";

const HOUSES = [
  {
    key: "women" as const,
    href: "/collections/women",
    title: "Ей",
    line: "Тубероза, роза, мёд, соль",
    tint: "var(--feminine)",
    slug: "vesper-bloom",
  },
  {
    key: "men" as const,
    href: "/collections/men",
    title: "Ему",
    line: "Ветивер, зола, железное дерево, кожа",
    tint: "var(--masculine)",
    slug: "noir-vetiver",
  },
];

/**
 * Разделённая панель. На десктопе наведение расширяет одну половину, на тач-
 * устройствах обе остаются равными и работают как обычные ссылки — ничего не
 * завязано на наведение.
 */
export function TwoHouses() {
  const [hovered, setHovered] = useState<"women" | "men" | null>(null);
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="houses-heading" className="py-24 md:py-32">
      <div className="container-x">
        <p className="label-xs text-accent">Две половины</p>
        <h2 id="houses-heading" className="display-2 mt-4 max-w-2xl">
          Линия делится один раз — и только один.
        </h2>
      </div>

      <div className="container-x mt-14">
        <div className="flex flex-col gap-4 md:flex-row md:gap-5">
          {HOUSES.map((house) => {
            const product = getProductBySlug(house.slug);
            const isHovered = hovered === house.key;
            const isOther = hovered !== null && !isHovered;

            return (
              <motion.div
                key={house.key}
                className="relative min-w-0 flex-1"
                onHoverStart={() => !reduced && setHovered(house.key)}
                onHoverEnd={() => !reduced && setHovered(null)}
                animate={{
                  // Сдержаннее, чем было: 1.5/0.75 слишком сильно дёргало сетку.
                  flexGrow: reduced ? 1 : isHovered ? 1.18 : isOther ? 0.88 : 1,
                }}
                transition={{ duration: 0.7, ease: ease.out }}
              >
                <Link
                  href={house.href}
                  className="group block overflow-hidden rounded-sm"
                  onFocus={() => !reduced && setHovered(house.key)}
                  onBlur={() => !reduced && setHovered(null)}
                >
                  {/* Высота задана явно, а не пропорцией: на широком экране
                      половина контейнера в пропорции 3/4 давала панель под
                      900 пикселей — флакон вырастал во весь экран. */}
                  <div
                    className="relative flex h-[clamp(20rem,42vh,26rem)] items-end overflow-hidden md:h-[clamp(22rem,52vh,30rem)]"
                    style={{ backgroundColor: "var(--surface)" }}
                  >
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{ backgroundColor: house.tint }}
                      animate={{ opacity: isHovered ? 0.16 : 0.07 }}
                      transition={{ duration: 0.7, ease: ease.out }}
                    />

                    {/* Отступ снизу убирает флакон из-под подписи. */}
                    <motion.div
                      className="absolute inset-x-0 top-0 bottom-20 flex items-center justify-center"
                      animate={{ scale: isHovered ? 1.04 : 1 }}
                      transition={{ duration: 0.9, ease: ease.out }}
                    >
                      {product && (
                        <ProductImage
                          art={product.art}
                          alt=""
                          view="angle"
                          showGround={false}
                        />
                      )}
                    </motion.div>

                    <div className="relative w-full bg-gradient-to-t from-bg/85 to-transparent p-6 md:p-8">
                      <h3 className="display-3">{house.title}</h3>
                      <p className="mt-2 text-[0.9rem] text-muted">{house.line}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-[0.8rem] text-accent">
                        Смотреть подборку
                        <ArrowRight
                          size={14}
                          aria-hidden="true"
                          className="transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-[0.85rem] text-muted">
          Или обойтись без деления —{" "}
          <Link
            href="/collections/unisex"
            className="text-accent underline-offset-4 hover:underline"
          >
            четыре аромата для кого угодно
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
