/**
 * Хранилище товаров и промокодов, добавленных через админку.
 *
 * ТОЛЬКО ДЛЯ СЕРВЕРА. Модуль работает с файловой системой, поэтому его нельзя
 * импортировать в клиентские компоненты — сборка упадёт.
 *
 * Данные лежат в JSON-файлах в папке data/. Для одного магазина этого хватает.
 * Если появится хостинг с read-only диском (Vercel и подобные) или вторая
 * копия приложения, менять надо только этот модуль: снаружи он выглядит как
 * набор async-функций, вызовы переписывать не придётся.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_CURRENCY, isCurrency, type CurrencyCode } from "./currency";
import {
  type Family,
  type Gender,
  type Product,
  getProducts as getSeedProducts,
} from "./products";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const PROMOS_FILE = path.join(DATA_DIR, "promos.json");
const OVERRIDES_FILE = path.join(DATA_DIR, "overrides.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

/**
 * Правки поверх каталога.
 *
 * Товары из products.ts зашиты в код, редактировать файл из админки нельзя.
 * Поэтому изменения и скрытия хранятся отдельно и накладываются при чтении.
 * Так работает и для добавленных товаров — правила одни для всех.
 */
type Overrides = {
  /** id скрытых товаров: «удаление» встроенного товара — это скрытие. */
  hidden: string[];
  /** id -> черновик с новыми значениями полей. */
  edits: Record<string, ProductDraft>;
};

export type Promo = {
  code: string;
  /** Скидка в процентах, 1–90. */
  percent: number;
  /** Минимальная сумма заказа. 0 — без условия. */
  minTotal: number;
  active: boolean;
  createdAt: string;
};

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch {
    // Файла ещё нет или он повреждён — работаем с пустым списком.
    return fallback;
  }
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

/* --------------------------------------------------------------- настройки -- */

export type Settings = { currency: CurrencyCode };

export async function getSettings(): Promise<Settings> {
  const raw = await readJson<Partial<Settings>>(SETTINGS_FILE, {});
  const currency = raw.currency;
  return { currency: currency && isCurrency(currency) ? currency : DEFAULT_CURRENCY };
}

export async function setCurrency(code: CurrencyCode): Promise<Settings> {
  const settings: Settings = { currency: code };
  await writeJson(SETTINGS_FILE, settings);
  return settings;
}

/* ------------------------------------------------------------------ товары -- */

export async function getCustomProducts(): Promise<Product[]> {
  return readJson<Product[]>(PRODUCTS_FILE, []);
}

async function getOverrides(): Promise<Overrides> {
  const raw = await readJson<Partial<Overrides>>(OVERRIDES_FILE, {});
  return { hidden: raw.hidden ?? [], edits: raw.edits ?? {} };
}

/** Накладывает черновик из админки на товар, сохраняя всё, чего он не касается. */
function applyDraft(product: Product, draft: ProductDraft): Product {
  return {
    ...product,
    name: draft.name,
    subtitle: draft.subtitle,
    description: draft.description,
    story: draft.story,
    gender: draft.gender,
    family: draft.family ?? product.family,
    notes:
      draft.notesTop === undefined
        ? product.notes
        : {
            top: splitNotes(draft.notesTop),
            heart: splitNotes(draft.notesHeart ?? ""),
            base: splitNotes(draft.notesBase ?? ""),
          },
    sizes: product.sizes.map((size) => ({ ...size, price: priceFor(draft.price, size.ml) })),
    photos: draft.photo ? [draft.photo, draft.photo, draft.photo, draft.photo] : product.photos,
    inStock: draft.inStock,
    featured: draft.featured,
    isNew: draft.isNew,
  };
}

/** Черновик из существующего товара — им заполняется форма редактирования. */
export function toDraft(product: Product): ProductDraft {
  const price = (ml: number) => product.sizes.find((s) => s.ml === ml)?.price ?? 0;
  return {
    name: product.name,
    subtitle: product.subtitle,
    description: product.description,
    story: product.story,
    gender: product.gender,
    price: price(50),
    photo: product.photos?.[0],
    inStock: product.inStock,
    featured: product.featured,
    isNew: product.isNew,
  };
}

export type AdminProduct = Product & { source: "custom" | "seed"; hidden: boolean };

/** Полный список для админки — вместе со скрытыми и с пометкой происхождения. */
export async function getAdminProducts(): Promise<AdminProduct[]> {
  const [custom, overrides] = await Promise.all([getCustomProducts(), getOverrides()]);
  const hidden = new Set(overrides.hidden);

  const decorate = (list: Product[], source: "custom" | "seed") =>
    list.map((p) => {
      const edit = overrides.edits[p.id];
      const merged = edit ? applyDraft(p, edit) : p;
      return { ...merged, source, hidden: hidden.has(p.id) };
    });

  return [...decorate(custom, "custom"), ...decorate(getSeedProducts(), "seed")];
}

/** Каталог целиком: зашитое в код плюс добавленное через админку. */
export async function getAllProducts(): Promise<Product[]> {
  return (await getAdminProducts())
    .filter((p) => !p.hidden)
    .map(({ source, hidden, ...product }) => {
      void source;
      void hidden;
      return product;
    });
}

export async function findProduct(slug: string): Promise<Product | undefined> {
  return (await getAllProducts()).find((p) => p.slug === slug);
}

export async function getProductsFor(gender: Gender): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.gender === gender);
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.featured).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getAllProducts();
  const same = all.filter((p) => p.family === product.family && p.id !== product.id);
  const rest = all.filter((p) => p.family !== product.family && p.id !== product.id);
  return [...same, ...rest].slice(0, limit);
}

export type ProductDraft = {
  name: string;
  subtitle: string;
  description: string;
  gender: Gender;
  /** Базовая цена — за 50 мл. Остальные объёмы считаются от неё. */
  price: number;
  story: string;
  photo?: string;
  inStock: boolean;
  featured: boolean;
  isNew: boolean;
  /**
   * Необязательные поля: форма админки их не показывает. Если поле не пришло,
   * при правке существующего товара прежнее значение сохраняется — иначе
   * редактирование названия стирало бы ноты и семейство.
   */
  family?: Family;
  notesTop?: string;
  notesHeart?: string;
  notesBase?: string;
};

/**
 * Соотношения взяты из каталога: 96 / 148 / 212 у Vesper Bloom и так далее.
 * Админ вводит одну цену, три объёма считаются по ним.
 */
export const SIZE_FACTOR = { 30: 0.65, 50: 1, 100: 1.45 } as const;

export function priceFor(base: number, ml: 30 | 50 | 100): number {
  return Math.round(base * SIZE_FACTOR[ml]);
}

/** Кириллицу транслитерируем, иначе slug получится пустым. */
const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join("")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitNotes(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createProduct(draft: ProductDraft): Promise<Product> {
  const custom = await getCustomProducts();
  const taken = new Set([...custom, ...getSeedProducts()].map((p) => p.slug));

  const base = slugify(draft.name) || "aromat";
  let slug = base;
  let n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;

  const id = `adm-${Date.now().toString(36)}`;
  const alt = `Флакон ${draft.name}`;

  const product: Product = {
    id,
    slug,
    name: draft.name,
    subtitle: draft.subtitle,
    gender: draft.gender,
    family: draft.family ?? "fresh",
    description: draft.description,
    story: draft.story,
    notes: {
      top: splitNotes(draft.notesTop ?? ""),
      heart: splitNotes(draft.notesHeart ?? ""),
      base: splitNotes(draft.notesBase ?? ""),
    },
    intensity: { longevity: 75, sillage: 60, warmth: 55 },
    sizes: [
      { ml: 30, price: priceFor(draft.price, 30), sku: `${slug}-30`.toUpperCase() },
      { ml: 50, price: priceFor(draft.price, 50), sku: `${slug}-50`.toUpperCase() },
      { ml: 100, price: priceFor(draft.price, 100), sku: `${slug}-100`.toUpperCase() },
    ],
    art: { shape: "tall", from: "#DDD8CE", to: "#9C978B", cap: "#5B564C" },
    photos: draft.photo ? [draft.photo, draft.photo, draft.photo, draft.photo] : undefined,
    images: [
      { view: "bottle", alt },
      { view: "angle", alt },
      { view: "detail", alt },
      { view: "still", alt },
    ],
    rating: 5,
    reviewCount: 0,
    featured: draft.featured,
    isNew: draft.isNew,
    inStock: draft.inStock,
  };

  await writeJson(PRODUCTS_FILE, [product, ...custom]);
  return product;
}

/**
 * Добавленный товар удаляем насовсем, встроенный — прячем.
 * Файл products.ts из админки не переписывается, поэтому скрытие обратимо.
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const custom = await getCustomProducts();
  const withoutIt = custom.filter((p) => p.id !== id);

  if (withoutIt.length !== custom.length) {
    await writeJson(PRODUCTS_FILE, withoutIt);
    const overrides = await getOverrides();
    delete overrides.edits[id];
    await writeJson(OVERRIDES_FILE, overrides);
    return true;
  }

  if (!getSeedProducts().some((p) => p.id === id)) return false;

  const overrides = await getOverrides();
  if (!overrides.hidden.includes(id)) overrides.hidden.push(id);
  await writeJson(OVERRIDES_FILE, overrides);
  return true;
}

export async function restoreProduct(id: string): Promise<boolean> {
  const overrides = await getOverrides();
  if (!overrides.hidden.includes(id)) return false;
  overrides.hidden = overrides.hidden.filter((x) => x !== id);
  await writeJson(OVERRIDES_FILE, overrides);
  return true;
}

export async function updateProduct(id: string, draft: ProductDraft): Promise<boolean> {
  const exists = [...(await getCustomProducts()), ...getSeedProducts()].some(
    (p) => p.id === id,
  );
  if (!exists) return false;

  const overrides = await getOverrides();
  overrides.edits[id] = draft;
  await writeJson(OVERRIDES_FILE, overrides);
  return true;
}

/** Убирает правки и возвращает товар к исходному виду. */
export async function resetProduct(id: string): Promise<boolean> {
  const overrides = await getOverrides();
  if (!overrides.edits[id]) return false;
  delete overrides.edits[id];
  await writeJson(OVERRIDES_FILE, overrides);
  return true;
}

/* -------------------------------------------------------------- промокоды -- */

export async function getPromos(): Promise<Promo[]> {
  return readJson<Promo[]>(PROMOS_FILE, []);
}

export async function createPromo(input: {
  code: string;
  percent: number;
  minTotal: number;
}): Promise<Promo | null> {
  const promos = await getPromos();
  const code = input.code.trim().toUpperCase();
  if (!code || promos.some((p) => p.code === code)) return null;

  const promo: Promo = {
    code,
    percent: Math.min(90, Math.max(1, Math.round(input.percent))),
    minTotal: Math.max(0, Math.round(input.minTotal)),
    active: true,
    createdAt: new Date().toISOString(),
  };

  await writeJson(PROMOS_FILE, [promo, ...promos]);
  return promo;
}

export async function togglePromo(code: string): Promise<Promo | undefined> {
  const promos = await getPromos();
  const next = promos.map((p) => (p.code === code ? { ...p, active: !p.active } : p));
  await writeJson(PROMOS_FILE, next);
  return next.find((p) => p.code === code);
}

export async function deletePromo(code: string): Promise<boolean> {
  const promos = await getPromos();
  const next = promos.filter((p) => p.code !== code);
  if (next.length === promos.length) return false;
  await writeJson(PROMOS_FILE, next);
  return true;
}

export type PromoCheck =
  | { ok: true; code: string; percent: number; discount: number }
  | { ok: false; error: string; minTotal?: number };

/** Проверяем на сервере: список промокодов клиенту не отдаём. */
export async function checkPromo(code: string, subtotal: number): Promise<PromoCheck> {
  const promo = (await getPromos()).find((p) => p.code === code.trim().toUpperCase());

  if (!promo || !promo.active) return { ok: false, error: "Такого промокода нет." };
  if (subtotal < promo.minTotal) {
    // Сумма приходит в базовой единице; в валюту её переведёт клиент.
    return { ok: false, error: "Сумма заказа слишком мала для этого кода.", minTotal: promo.minTotal };
  }

  return {
    ok: true,
    code: promo.code,
    percent: promo.percent,
    discount: Math.round((subtotal * promo.percent) / 100),
  };
}
