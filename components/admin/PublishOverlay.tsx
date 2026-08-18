"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STEPS = ["Сохраняем карточку", "Готовим фото", "Обновляем каталог"] as const;

/** Сколько показываем каждый шаг. Вместе — примерно полторы секунды. */
const STEP_MS = 480;

/**
 * Показ выгрузки товара в магазин.
 *
 * Запись на диск занимает миллисекунды, поэтому шаги здесь — не индикатор
 * реального прогресса, а объяснение, что произошло. Оверлей держится заданное
 * время и закрывается сам; форма к этому моменту уже сохранена.
 */
export function PublishOverlay({
  open,
  title,
  onDone,
}: {
  open: boolean;
  /** Что показать после завершения: «Добавлено» или «Сохранено». */
  title: string;
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) {
      setStep(0);
      return;
    }

    if (reduced) {
      const done = setTimeout(onDone, 400);
      return () => clearTimeout(done);
    }

    const timers = STEPS.map((_, i) =>
      setTimeout(() => setStep(i + 1), STEP_MS * (i + 1)),
    );
    const done = setTimeout(onDone, STEP_MS * STEPS.length + 700);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [open, reduced, onDone]);

  const finished = step >= STEPS.length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-100 flex items-center justify-center bg-bg/80 px-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="w-full max-w-sm rounded-sm border border-line bg-surface p-8 shadow-lift"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: ease.out }}
          >
            {/* Кольцо прогресса из того же словаря, что и знак дома. */}
            <div className="relative mx-auto h-16 w-16">
              <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0">
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="var(--line)"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ transformOrigin: "50% 50%", rotate: -90 }}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: Math.max(0.08, step / STEPS.length) }}
                  transition={{ duration: 0.5, ease: ease.out }}
                />
              </svg>

              <AnimatePresence>
                {finished && (
                  <motion.span
                    className="absolute inset-0 flex items-center justify-center text-accent"
                    initial={reduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 20 }}
                  >
                    <Check size={26} aria-hidden="true" />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <p className="mt-6 text-center font-display text-2xl font-light">
              {finished ? title : "Выгружаем в магазин"}
            </p>

            <ul className="mt-6 space-y-2.5">
              {STEPS.map((label, i) => {
                const state = i < step ? "done" : i === step ? "active" : "todo";
                return (
                  <li
                    key={label}
                    className={cn(
                      "flex items-center gap-3 text-[0.88rem] transition-colors duration-300",
                      state === "todo" ? "text-muted/60" : "text-ink",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300",
                        state === "todo" ? "bg-line" : "bg-accent",
                      )}
                    />
                    {label}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
