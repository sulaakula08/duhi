"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Field, Input } from "@/components/ui/Field";
import { spring, transition } from "@/lib/motion";

const schema = z.string().email("Проверьте адрес почты.");

export function Newsletter() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = schema.safeParse(value.trim());
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(undefined);
    setDone(true);
  }

  return (
    <section className="container-x py-16 md:py-20" aria-labelledby="newsletter-heading">
      <div className="grid gap-8 md:grid-cols-2 md:items-end md:gap-16">
        <div>
          <p className="label-xs text-accent">Рассылка</p>
          <h2 id="newsletter-heading" className="display-3 mt-4">
            Два письма в год. Больше ничего.
          </h2>
          <p className="mt-3 max-w-md text-[0.95rem] text-muted">
            Пишем, когда есть что сказать: вышел новый аромат или хочется
            рассказать, как собирался старый.
          </p>
        </div>

        <div className="min-h-[6.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.div
                key="done"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition.standard}
                className="flex items-center gap-3"
              >
                <motion.span
                  initial={reduced ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={spring}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-contrast"
                >
                  <Check size={16} aria-hidden="true" />
                </motion.span>
                <p role="status" className="text-[0.95rem]">
                  Вы в списке. Ждите нас весной.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                noValidate
                initial={false}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={transition.standard}
              >
                <Field label="Почта" error={error}>
                  <span className="flex items-center gap-3">
                    <Input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={value}
                      aria-invalid={Boolean(error)}
                      onChange={(e) => {
                        setValue(e.target.value);
                        if (error) setError(undefined);
                      }}
                    />
                    <button
                      type="submit"
                      aria-label="Подписаться"
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line transition-colors duration-300 hover:border-accent hover:text-accent"
                    >
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </span>
                </Field>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
