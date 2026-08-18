"use client";

import { AnimatePresence, motion } from "motion/react";
import { Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { useCurrency, useMoney } from "@/components/CurrencyProvider";
import { toBase } from "@/lib/data/currency";
import type { Promo } from "@/lib/data/store";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function PromoPanel({ initial }: { initial: Promo[] }) {
  const [promos, setPromos] = useState(initial);
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("10");
  const [minTotal, setMinTotal] = useState("0");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const currency = useCurrency();
  const money = useMoney();

  async function refresh() {
    const response = await fetch("/api/admin/promos");
    if (response.ok) setPromos((await response.json()).promos);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);

    const response = await fetch("/api/admin/promos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      // Минимальная сумма хранится в базовой единице, как и цены.
      body: JSON.stringify({ code, percent, minTotal: toBase(Number(minTotal), currency) }),
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      setCode("");
      await refresh();
    } else {
      setError(data.error ?? "Не удалось создать код.");
    }
    setBusy(false);
  }

  async function toggle(target: string) {
    await fetch(`/api/admin/promos?code=${encodeURIComponent(target)}`, { method: "PATCH" });
    refresh();
  }

  async function remove(target: string) {
    await fetch(`/api/admin/promos?code=${encodeURIComponent(target)}`, { method: "DELETE" });
    refresh();
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
      <form onSubmit={onSubmit} noValidate className="space-y-7">
        <Field label="Код" hint="Латиница и цифры, например WINTER20" error={error}>
          <Input
            required
            value={code}
            placeholder="WINTER20"
            aria-invalid={Boolean(error)}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              if (error) setError(undefined);
            }}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Скидка, %">
            <Input
              required
              type="number"
              inputMode="numeric"
              min={1}
              max={90}
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
            />
          </Field>
          <Field label="От суммы" hint="0 — без условия">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={minTotal}
              onChange={(e) => setMinTotal(e.target.value)}
            />
          </Field>
        </div>

        <Button type="submit" size="lg" disabled={busy} className="w-full sm:w-auto">
          {busy ? "Создаём…" : "Создать код"}
        </Button>
      </form>

      <div>
        <p className="label-xs text-muted">
          Активных: {promos.filter((p) => p.active).length} из {promos.length}
        </p>

        {promos.length === 0 ? (
          <p className="mt-6 text-[0.95rem] text-muted">
            Пока ни одного промокода.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            <AnimatePresence initial={false}>
              {promos.map((promo) => (
                <motion.li
                  key={promo.code}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={transition.standard}
                  className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-sm border border-line p-4"
                >
                  <Tag
                    size={16}
                    aria-hidden="true"
                    className={promo.active ? "text-accent" : "text-muted"}
                  />
                  <span className="font-display text-xl tracking-wide">{promo.code}</span>

                  <span className="text-[0.85rem] text-muted">
                    −{promo.percent}%
                    {promo.minTotal > 0 && <> · от {money(promo.minTotal)}</>}
                  </span>

                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggle(promo.code)}
                      aria-pressed={promo.active}
                      className={cn(
                        "label-xs min-h-11 rounded-full border px-4 transition-colors",
                        promo.active
                          ? "border-accent text-accent"
                          : "border-line text-muted hover:text-ink",
                      )}
                    >
                      {promo.active ? "Включён" : "Выключен"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(promo.code)}
                      aria-label={`Удалить код ${promo.code}`}
                      className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:text-feminine"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
