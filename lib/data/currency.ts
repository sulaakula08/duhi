/**
 * Валюта магазина.
 *
 * Суммы везде хранятся в одной базовой единице (евро) — и в каталоге, и в
 * корзине, и в промокодах. Валюта влияет только на вывод: при показе сумма
 * пересчитывается и форматируется. Благодаря этому переключение валюты не
 * ломает уже заведённые цены — иначе «96» из евро превратилось бы в «96 ₸».
 *
 * Курсы — фиксированные константы, а не биржевые котировки. Это осознанно:
 * магазину нужна предсказуемая цена на витрине, а не та, что скачет каждый
 * час. Обновлять руками здесь.
 */

export const CURRENCIES = {
  KZT: { label: "Тенге", locale: "ru-KZ", perEur: 550, step: 100 },
  RUB: { label: "Рубль", locale: "ru-RU", perEur: 100, step: 50 },
  USD: { label: "Доллар", locale: "en-US", perEur: 1.08, step: 1 },
  EUR: { label: "Евро", locale: "ru-IE", perEur: 1, step: 1 },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

export const DEFAULT_CURRENCY: CurrencyCode = "KZT";

export function isCurrency(value: string): value is CurrencyCode {
  return value in CURRENCIES;
}

/** База -> валюта витрины. Округляем до шага, чтобы не было цен вида 52 837. */
export function fromBase(base: number, code: CurrencyCode): number {
  const { perEur, step } = CURRENCIES[code];
  return Math.round((base * perEur) / step) * step;
}

/** Валюта витрины -> база. Тем, что вводит админ, пользуется весь сайт. */
export function toBase(amount: number, code: CurrencyCode): number {
  return amount / CURRENCIES[code].perEur;
}

const formatters = new Map<CurrencyCode, Intl.NumberFormat>();

function formatterFor(code: CurrencyCode): Intl.NumberFormat {
  let formatter = formatters.get(code);
  if (!formatter) {
    formatter = new Intl.NumberFormat(CURRENCIES[code].locale, {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    });
    formatters.set(code, formatter);
  }
  return formatter;
}

/** Принимает сумму в базовой единице и печатает её в валюте магазина. */
export function formatMoney(base: number, code: CurrencyCode): string {
  return formatterFor(code).format(fromBase(base, code));
}
