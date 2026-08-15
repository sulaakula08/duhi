"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { Product } from "@/lib/data/products";
import { transition, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Tier = "top" | "heart" | "base";

const TIERS: { key: Tier; label: string; caption: string }[] = [
  { key: "top", label: "Верх", caption: "Первые десять минут" },
  { key: "heart", label: "Сердце", caption: "Следующие два часа" },
  { key: "base", label: "База", caption: "Весь остальной день" },
];

/**
 * Рисованная ольфакторная пирамида.
 *
 * Три трапеции, каждая — настоящий SVG-полигон. Наведение или фокус на полосе
 * показывает её материалы. Список под схемой — основной источник информации,
 * фигура его только иллюстрирует.
 */
export function NotesPyramid({ product }: { product: Product }) {
  const [active, setActive] = useState<Tier>("heart");
  const reduced = useReducedMotion();

  // Geometry: a 300-wide triangle sliced into three horizontal bands.
  const bands: Record<Tier, { points: string; y: number }> = {
    top: { points: "150,18 196,96 104,96", y: 66 },
    heart: { points: "104,104 196,104 236,178 64,178", y: 148 },
    base: { points: "64,186 236,186 282,262 18,262", y: 232 },
  };

  return (
    <div className="grid gap-8 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-center sm:gap-10">
      <motion.svg
        viewBox="0 0 300 280"
        role="img"
        aria-label={`Пирамида аромата ${product.name}`}
        className="mx-auto w-full max-w-[15rem] sm:mx-0"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {TIERS.map(({ key, label }, index) => {
          const band = bands[key];
          const isActive = active === key;
          return (
            <motion.g
              key={key}
              onHoverStart={() => setActive(key)}
              onFocus={() => setActive(key)}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              aria-label={`${label}: ${product.notes[key].join(", ")}`}
              onClick={() => setActive(key)}
              className="cursor-pointer outline-none"
              variants={{
                hidden: { opacity: 0, y: reduced ? 0 : 12 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: reduced ? 0 : 0.08 * index, duration: 0.6 },
                },
              }}
            >
              <polygon
                points={band.points}
                fill="var(--accent)"
                fillOpacity={isActive ? 0.22 : 0.07}
                stroke="var(--accent)"
                strokeOpacity={isActive ? 0.9 : 0.35}
                strokeWidth="1"
                style={{ transition: "fill-opacity 400ms, stroke-opacity 400ms" }}
              />
              <text
                x="150"
                y={band.y}
                textAnchor="middle"
                fontSize="11"
                letterSpacing="2.2"
                fill={isActive ? "var(--accent)" : "var(--muted)"}
                style={{ transition: "fill 400ms", textTransform: "uppercase" }}
              >
                {label.toUpperCase()}
              </text>
            </motion.g>
          );
        })}
      </motion.svg>

      <div>
        <div className="min-h-[7.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={transition.standard}
            >
              <p className="label-xs text-accent">
                {TIERS.find((t) => t.key === active)?.caption}
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-2">
                {product.notes[active].map((note) => (
                  <li
                    key={note}
                    className="rounded-full border border-line px-3 py-1.5 text-[0.85rem]"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex gap-2">
          {TIERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              aria-pressed={active === key}
              className={cn(
                "label-xs min-h-11 rounded-full border px-4 transition-colors duration-300",
                active === key
                  ? "border-accent text-accent"
                  : "border-line text-muted hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
