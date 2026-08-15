"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Product } from "@/lib/data/products";
import { ease, viewportOnce } from "@/lib/motion";

const LABELS: { key: keyof Product["intensity"]; label: string; hint: string }[] = [
  { key: "longevity", label: "Стойкость", hint: "Сколько держится на коже" },
  { key: "sillage", label: "Шлейф", hint: "Насколько далеко уходит" },
  { key: "warmth", label: "Теплота", hint: "Сколько в нём тепла" },
];

export function IntensityMeter({ intensity }: { intensity: Product["intensity"] }) {
  const reduced = useReducedMotion();

  return (
    <dl className="space-y-6">
      {LABELS.map(({ key, label, hint }, index) => {
        const value = intensity[key];
        return (
          <div key={key}>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="label-xs">{label}</dt>
              {/* Значение продублировано числом — полоска никогда не единственный сигнал. */}
              <dd className="text-[0.8rem] tabular-nums text-muted">{value} из 100</dd>
            </div>
            <div
              className="mt-2.5 h-px w-full bg-line"
              role="meter"
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${label} — ${hint}`}
            >
              <motion.div
                className="h-px origin-left bg-accent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: value / 100 }}
                viewport={viewportOnce}
                transition={
                  reduced
                    ? { duration: 0.01 }
                    : { duration: 1.2, ease: ease.out, delay: index * 0.09 }
                }
              />
            </div>
            <p className="mt-1.5 text-[0.78rem] text-muted">{hint}</p>
          </div>
        );
      })}
    </dl>
  );
}
