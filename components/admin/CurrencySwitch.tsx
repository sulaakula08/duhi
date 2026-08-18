"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCurrency } from "@/components/CurrencyProvider";
import { CURRENCIES, CURRENCY_CODES, type CurrencyCode } from "@/lib/data/currency";
import { cn } from "@/lib/utils";

/**
 * Валюта магазина. Настройка общая для всего сайта, а не для одного товара —
 * поэтому подпись говорит об этом прямо, чтобы её не приняли за поле карточки.
 *
 * Суммы хранятся в базовой единице, так что переключение не портит уже
 * заведённые цены: они просто пересчитываются при выводе.
 */
export function CurrencySwitch({ className }: { className?: string }) {
  const currency = useCurrency();
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function pick(code: CurrencyCode) {
    if (code === currency || busy) return;
    setBusy(true);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ currency: code }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <span className={cn("relative shrink-0", className)}>
      <label className="sr-only" htmlFor="shop-currency">
        Валюта магазина
      </label>
      <select
        id="shop-currency"
        value={currency}
        disabled={busy}
        onChange={(e) => pick(e.target.value as CurrencyCode)}
        className={cn(
          "min-h-12 cursor-pointer rounded-full border border-line bg-transparent px-4 pr-9",
          "text-[0.8rem] text-ink transition-colors hover:border-accent focus:outline-none",
          busy && "opacity-60",
        )}
      >
        {CURRENCY_CODES.map((code) => (
          <option key={code} value={code}>
            {CURRENCIES[code].label}
          </option>
        ))}
      </select>
      {busy && (
        <Loader2
          size={14}
          aria-hidden="true"
          className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted"
        />
      )}
    </span>
  );
}
