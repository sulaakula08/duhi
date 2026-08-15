"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { ButtonLink } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { getProductBySlug } from "@/lib/data/products";
import { ease } from "@/lib/motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const hero = getProductBySlug("vesper-bloom");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Capped at 12% travel — enough to feel like depth, not enough to detach.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-20"
      aria-labelledby="hero-heading"
    >
      <div className="container-x grid w-full gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
        <div className="relative z-10 order-2 lg:order-1">
          <motion.p
            className="label-xs text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            Парфюмерия Eldea
          </motion.p>

          <MaskedLines
            as="h1"
            immediate
            delay={0.2}
            lines={["Ароматы себе", "и в подарок"]}
            className="display-1 mt-6"
          />

          <motion.p
            className="mt-8 max-w-md text-[1.05rem] text-muted"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: ease.out }}
          >
            Четырнадцать ароматов для женщин и мужчин. Три объёма, парфюмерная
            вода, два пробника к каждому заказу.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: ease.out }}
          >
            <ButtonLink href="/collections" size="lg">
              В каталог
            </ButtonLink>
            <ButtonLink href="/collections/women" size="lg" variant="ghost">
              Подобрать аромат
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          className="relative order-1 mx-auto h-[42vh] w-full max-w-md lg:order-2 lg:h-[76vh] lg:max-w-none"
          style={reduced ? undefined : { y }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.1, ease: ease.out }}
        >
          {hero && (
            <ProductImage
              art={hero.art}
              alt="Флакон Vesper Bloom, подсвеченный сбоку, на тёплом фоне"
              photo={hero.photos?.[0]}
              priority
            />
          )}
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { opacity: fade }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="label-xs text-muted">Листайте</span>
        <span className="relative block h-12 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 block h-4 bg-accent"
            animate={reduced ? undefined : { y: ["-100%", "300%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
