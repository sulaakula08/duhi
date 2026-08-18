"use client";

import { AnimatePresence, motion } from "motion/react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import type { Promo } from "@/lib/data/store";
import { transition } from "@/lib/motion";
import { cn, plural } from "@/lib/utils";
import { ProductForm, type FormValues } from "./ProductForm";
import { ProductRow, type AdminRow } from "./ProductRow";
import { PromoPanel } from "./PromoPanel";

/**
 * Товар -> значения формы. Цена строковая, потому что это значение input.
 * Семейство и ноты форма не показывает, поэтому и не передаёт: сервер оставит
 * прежние значения, а не затрёт их пустыми.
 */
function toFormValues(product: AdminRow): FormValues {
  return {
    name: product.name,
    subtitle: product.subtitle,
    description: product.description,
    story: product.story,
    gender: product.gender,
    price: String(product.sizes.find((s) => s.ml === 50)?.price ?? ""),
    photo: product.photos?.[0],
    inStock: product.inStock,
    featured: product.featured,
    isNew: product.isNew,
  };
}

type Tab = "catalogue" | "promos";

export function AdminDashboard({
  products,
  promos,
}: {
  products: AdminRow[];
  promos: Promo[];
}) {
  const [tab, setTab] = useState<Tab>("catalogue");
  const [all, setAll] = useState(products);
  const [editing, setEditing] = useState<{ id: string; values: FormValues }>();
  const router = useRouter();

  async function refreshProducts() {
    const response = await fetch("/api/admin/products");
    if (response.ok) setAll((await response.json()).products);
    router.refresh();
  }

  async function removeProduct(id: string) {
    await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (editing?.id === id) setEditing(undefined);
    refreshProducts();
  }

  async function restore(id: string) {
    await fetch(`/api/admin/products?id=${encodeURIComponent(id)}&action=restore`, {
      method: "PATCH",
    });
    refreshProducts();
  }

  function startEdit(product: AdminRow) {
    setEditing({ id: product.id, values: toFormValues(product) });
    // На телефоне форма выше списка — иначе непонятно, что произошло.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const customCount = all.filter((p) => p.source === "custom").length;
  const hiddenCount = all.filter((p) => p.hidden).length;

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="min-h-[100svh]">
      {/* Шапка админки: на телефоне в две строки, дальше в одну. */}
      <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="container-x flex items-center gap-4 py-3">
          <Link href="/" className="min-w-0 shrink">
            <Logo className="text-sm sm:text-base" animate={false} />
          </Link>
          <span className="label-xs hidden text-muted sm:inline">Админка</span>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/collections"
              className="label-xs hidden min-h-11 items-center rounded-full border border-line px-4 transition-colors hover:border-accent hover:text-accent sm:inline-flex"
            >
              На витрину
            </Link>
            <button
              type="button"
              onClick={logout}
              aria-label="Выйти из админки"
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[0.8rem] text-muted transition-colors hover:text-accent"
            >
              <LogOut size={15} aria-hidden="true" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>

        <nav className="container-x flex gap-1 pb-1" aria-label="Разделы админки">
          {(
            [
              ["catalogue", "Каталог"],
              ["promos", "Промокоды"],
            ] as [Tab, string][]
          ).map(([key, title]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-current={tab === key ? "page" : undefined}
              className={cn(
                "label-xs relative min-h-11 px-4 transition-colors",
                tab === key ? "text-accent" : "text-muted hover:text-ink",
              )}
            >
              {title}
              {tab === key && (
                <motion.span
                  layoutId="admin-tab"
                  className="absolute inset-x-2 -bottom-px h-px bg-accent"
                />
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="container-x py-10 md:py-14">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={transition.standard}
          >
            {tab === "catalogue" ? (
              <section aria-label="Каталог">
                <div className="grid gap-12 xl:grid-cols-[minmax(0,34rem)_1fr] xl:gap-16">
                  <div>
                    <h1 className="display-3">
                      {editing ? "Изменить аромат" : "Новый аромат"}
                    </h1>
                    <p className="mt-2 text-[0.92rem] text-muted">
                      {editing
                        ? "Правки видны в каталоге сразу после сохранения."
                        : "Появится в каталоге сразу после сохранения."}
                    </p>
                    <div className="mt-8">
                      <ProductForm
                        onSaved={refreshProducts}
                        editing={editing}
                        onCancelEdit={() => setEditing(undefined)}
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className="display-3">Каталог</h2>
                    <p className="mt-2 text-[0.92rem] text-muted">
                      {all.length}{" "}
                      {plural(all.length, "позиция", "позиции", "позиций")}, из них{" "}
                      {customCount} добавлено через админку
                      {hiddenCount > 0 && <> · скрыто: {hiddenCount}</>}.
                    </p>

                    <ul className="mt-8 space-y-3">
                      <AnimatePresence initial={false}>
                        {all.map((product) => (
                          <ProductRow
                            key={product.id}
                            product={product}
                            editing={editing?.id === product.id}
                            onEdit={() => startEdit(product)}
                            onDelete={() => removeProduct(product.id)}
                            onRestore={() => restore(product.id)}
                          />
                        ))}
                      </AnimatePresence>
                    </ul>
                  </div>
                </div>
              </section>
            ) : (
              <section aria-label="Промокоды">
                <h1 className="display-3">Промокоды</h1>
                <p className="mt-2 max-w-xl text-[0.92rem] text-muted">
                  Скидка считается от суммы товаров, до доставки. Покупатель вводит
                  код на шаге оформления.
                </p>
                <div className="mt-10">
                  <PromoPanel initial={promos} />
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
