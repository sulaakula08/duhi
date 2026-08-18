"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useMoney } from "@/components/CurrencyProvider";
import { Field, Input } from "@/components/ui/Field";
import { transition } from "@/lib/motion";

export type AppliedPromo = { code: string; percent: number; discount: number };

export function PromoField({
  subtotal,
  applied,
  onApply,
  onClear,
}: {
  subtotal: number;
  applied?: AppliedPromo;
  onApply: (promo: AppliedPromo) => void;
  onClear: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const money = useMoney();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!code.trim()) return;

    setBusy(true);
    setError(undefined);

    // Проверяет сервер: список кодов и их условия клиенту не отдаём.
    const response = await fetch("/api/promo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, subtotal }),
    });
    const data = await response.json().catch(() => ({}));

    if (data.ok) {
      onApply({ code: data.code, percent: data.percent, discount: data.discount });
      setCode("");
    } else {
      setError(
        data.minTotal
          ? `Промокод работает от ${money(data.minTotal)}.`
          : (data.error ?? "Код не подошёл."),
      );
    }
    setBusy(false);
  }

  return (
    <div className="mt-6 border-t border-line pt-6">
      <AnimatePresence mode="wait" initial={false}>
        {applied ? (
          <motion.div
            key="applied"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={transition.standard}
            className="flex items-center justify-between gap-3"
          >
            <span className="inline-flex items-center gap-2 text-[0.9rem]">
              <Check size={15} aria-hidden="true" className="text-accent" />
              <span className="font-medium">{applied.code}</span>
              <span className="text-muted">−{applied.percent}%</span>
            </span>
            <button
              type="button"
              onClick={onClear}
              aria-label={`Убрать промокод ${applied.code}`}
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:text-accent"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            initial={false}
            exit={{ opacity: 0 }}
            transition={transition.standard}
          >
            <Field label="Промокод" error={error}>
              <span className="flex items-center gap-3">
                <Input
                  value={code}
                  placeholder="WINTER20"
                  aria-invalid={Boolean(error)}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    if (error) setError(undefined);
                  }}
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="label-xs min-h-11 shrink-0 rounded-full border border-line px-4 transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
                >
                  {busy ? "…" : "ОК"}
                </button>
              </span>
            </Field>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
