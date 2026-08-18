"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import {
  FAMILIES,
  FAMILY_LABEL,
  GENDERS,
  GENDER_LABEL,
  type Family,
  type Gender,
  type Product,
  priceRange,
} from "@/lib/data/products";
import { useMoney } from "@/components/CurrencyProvider";
import { transition } from "@/lib/motion";
import { cn, plural } from "@/lib/utils";

type Sort = "featured" | "price-asc" | "price-desc" | "newest";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Сначала главные" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "newest", label: "Новинки" },
];

/**
 * Границы заданы в базовой единице; подпись собирается в валюте магазина,
 * поэтому фильтр не расходится с ценами на карточках.
 */
const PRICE_BANDS = [
  { value: "under-100", max: 100, test: (min: number) => min < 100 },
  { value: "100-200", min: 100, max: 200, test: (min: number) => min >= 100 && min <= 200 },
  { value: "over-200", min: 200, test: (min: number) => min > 200 },
] as const;

/**
 * Filters live in the URL so the state is shareable and the back button
 * behaves. The list is filtered on the client from a fixed catalogue, which is
 * fine at fourteen products — move this to the server if the catalogue grows.
 */
export function CollectionView({
  products,
  lockedGender,
}: {
  products: Product[];
  /** Set on /collections/[gender], which hides the gender filter entirely. */
  lockedGender?: Gender;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const money = useMoney();

  const bandLabel = (band: (typeof PRICE_BANDS)[number]) => {
    if (!("min" in band)) return `До ${money(band.max)}`;
    if (!("max" in band)) return `Больше ${money(band.min)}`;
    return `${money(band.min)} – ${money(band.max)}`;
  };

  const activeFamilies = searchParams.getAll("family") as Family[];
  const activeGenders = searchParams.getAll("gender") as Gender[];
  const activePrice = searchParams.get("price") ?? "";
  const sort = (searchParams.get("sort") as Sort) ?? "featured";

  const setParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const toggleMulti = useCallback(
    (key: string, value: string) => {
      setParams((params) => {
        const current = params.getAll(key);
        params.delete(key);
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        next.forEach((v) => params.append(key, v));
      });
    },
    [setParams],
  );

  const filtered = useMemo(() => {
    const list = products.filter((product) => {
      if (activeFamilies.length && !activeFamilies.includes(product.family)) return false;
      if (activeGenders.length && !activeGenders.includes(product.gender)) return false;
      if (activePrice) {
        const band = PRICE_BANDS.find((b) => b.value === activePrice);
        if (band && !band.test(priceRange(product).min)) return false;
      }
      return true;
    });

    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => priceRange(a).min - priceRange(b).min);
      case "price-desc":
        return [...list].sort((a, b) => priceRange(b).min - priceRange(a).min);
      case "newest":
        return [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
      default:
        return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
  }, [products, activeFamilies, activeGenders, activePrice, sort]);

  const hasFilters =
    activeFamilies.length > 0 || activeGenders.length > 0 || activePrice !== "";

  return (
    <div className="container-x pb-24">
      {/* На узком экране каждая группа — своя строка с подписью сверху: одиннадцать
          фишек подряд превращались в нечитаемую стену. С lg всё встаёт в ряд. */}
      <div className="flex flex-col gap-5 border-y border-line py-5 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-8">
        <FilterGroup label="Семейство">
          {FAMILIES.map((family) => (
            <FilterChip
              key={family}
              active={activeFamilies.includes(family)}
              onClick={() => toggleMulti("family", family)}
            >
              {FAMILY_LABEL[family]}
            </FilterChip>
          ))}
        </FilterGroup>

        {!lockedGender && (
          <FilterGroup label="Кому">
            {GENDERS.map((gender) => (
              <FilterChip
                key={gender}
                active={activeGenders.includes(gender)}
                onClick={() => toggleMulti("gender", gender)}
              >
                {GENDER_LABEL[gender]}
              </FilterChip>
            ))}
          </FilterGroup>
        )}

        <FilterGroup label="Цена">
          {PRICE_BANDS.map((band) => (
            <FilterChip
              key={band.value}
              active={activePrice === band.value}
              onClick={() =>
                setParams((params) => {
                  if (activePrice === band.value) params.delete("price");
                  else params.set("price", band.value);
                })
              }
            >
              {bandLabel(band)}
            </FilterChip>
          ))}
        </FilterGroup>

        <label className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="label-xs w-full text-muted lg:w-auto">Порядок</span>
          <select
            value={sort}
            onChange={(e) =>
              setParams((params) => {
                if (e.target.value === "featured") params.delete("sort");
                else params.set("sort", e.target.value);
              })
            }
            className="min-h-11 w-full cursor-pointer rounded-full border border-line bg-transparent px-4 text-[0.78rem] text-ink transition-colors hover:border-accent focus:outline-none sm:w-auto"
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between gap-4 py-6">
        <p aria-live="polite" className="text-[0.85rem] text-muted">
          {filtered.length} {plural(filtered.length, "аромат", "аромата", "ароматов")}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={() =>
              setParams((params) => {
                params.delete("family");
                params.delete("gender");
                params.delete("price");
              })
            }
            className="inline-flex min-h-11 items-center gap-1.5 text-[0.8rem] text-muted transition-colors hover:text-accent"
          >
            <X size={13} aria-hidden="true" />
            Сбросить фильтры
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          onClear={() =>
            setParams((params) => {
              params.delete("family");
              params.delete("gender");
              params.delete("price");
            })
          }
        />
      ) : (
        <motion.ul
          layout
          className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <GridItem key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

function GridItem({ product }: { product: Product }) {
  const reduced = useReducedMotion();

  return (
    <motion.li
      layout={!reduced}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={reduced ? { duration: 0.01 } : transition.standard}
    >
      <ProductCard product={product} />
    </motion.li>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* w-full ставит подпись на отдельную строку на мобильном, на lg — в ряд. */}
      <span className="label-xs w-full text-muted lg:w-auto lg:mr-1">{label}</span>
      {children}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "label-xs min-h-11 rounded-full border px-4 transition-colors duration-300",
        active
          ? "border-accent bg-accent text-accent-contrast"
          : "border-line text-muted hover:border-accent-soft hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 py-28 text-center">
      <p className="display-3">Под такое сочетание ничего нет.</p>
      <p className="max-w-sm text-[0.95rem] text-muted">
        В доме всего четырнадцать ароматов, поэтому узкие фильтры быстро
        упираются в пустоту.
      </p>
      <Button variant="ghost" onClick={onClear}>
        Сбросить фильтры
      </Button>
    </div>
  );
}
