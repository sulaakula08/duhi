"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import {
  DEFAULT_CURRENCY,
  formatMoney,
  fromBase,
  type CurrencyCode,
} from "@/lib/data/currency";

const CurrencyContext = createContext<CurrencyCode>(DEFAULT_CURRENCY);

/**
 * Валюта приходит с сервера (её выбирают в админке) и раздаётся клиентским
 * компонентам: карточкам, корзине, оформлению. Хранить её в клиентском сторе
 * нельзя — тогда на первом кадре она отличалась бы от серверной разметки.
 */
export function CurrencyProvider({
  currency,
  children,
}: {
  currency: CurrencyCode;
  children: ReactNode;
}) {
  return <CurrencyContext.Provider value={currency}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyCode {
  return useContext(CurrencyContext);
}

/** Форматирует сумму, заданную в базовой единице, в валюте магазина. */
export function useMoney(): (base: number) => string {
  const currency = useCurrency();
  return useCallback((base: number) => formatMoney(base, currency), [currency]);
}

/** Число без символа валюты — для полей ввода в админке. */
export function useAmount(): (base: number) => number {
  const currency = useCurrency();
  return useCallback((base: number) => fromBase(base, currency), [currency]);
}
