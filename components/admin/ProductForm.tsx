"use client";

import { ImageUp, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { GENDER_LABEL, type Gender } from "@/lib/data/products";
import { cn } from "@/lib/utils";

/** Те же коэффициенты, что и на сервере, — только чтобы показать подсказку. */
const FACTOR = { 30: 0.65, 100: 1.45 } as const;
const priceFor = (base: number, ml: 30 | 100) =>
  Number.isFinite(base) ? Math.round(base * FACTOR[ml]) : 0;
import { PublishOverlay } from "./PublishOverlay";

const EMPTY = {
  name: "",
  subtitle: "",
  description: "",
  gender: "women" as Gender,
  price: "",
  story: "",
  inStock: true,
  featured: false,
  isNew: true,
};

export type FormValues = typeof EMPTY & { photo?: string };

export function ProductForm({
  onSaved,
  editing,
  onCancelEdit,
}: {
  onSaved: () => void;
  /** Заполненная форма и id — режим правки вместо создания. */
  editing?: { id: string; values: FormValues };
  onCancelEdit?: () => void;
}) {
  const [form, setForm] = useState(EMPTY);
  const [photo, setPhoto] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [publishing, setPublishing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Подставляем значения, когда нажали «Изменить» у товара в списке.
  useEffect(() => {
    if (!editing) return;
    const { photo: p, ...rest } = editing.values;
    setForm({ ...EMPTY, ...rest });
    setPhoto(p);
    setError(undefined);
  }, [editing]);

  function set<K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (error) setError(undefined);
  }

  async function onPickFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(undefined);

    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await response.json().catch(() => ({}));

    if (response.ok) setPhoto(data.path);
    else setError(data.error ?? "Не удалось загрузить фото.");

    setUploading(false);
    // Позволяет выбрать тот же файл повторно после ошибки.
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);

    const response = await fetch(
      editing ? `/api/admin/products?id=${encodeURIComponent(editing.id)}` : "/api/admin/products",
      {
        method: editing ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, photo }),
      },
    );
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      // Оверлей показываем после успеха: он объясняет, что уже произошло.
      setPublishing(true);
    } else {
      setError(data.error ?? "Не удалось сохранить.");
    }

    setBusy(false);
  }

  function finishPublish() {
    setPublishing(false);
    if (!editing) {
      setForm(EMPTY);
      setPhoto(undefined);
    }
    onSaved();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Название">
          <Input
            required
            placeholder="Vesper Bloom"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field label="Коротко" hint="Пара нот через запятую">
          <Input
            required
            placeholder="Тубероза и жасмин"
            value={form.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Описание" hint="Чем пахнет, две-три фразы">
        <Textarea
          required
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div className="grid gap-7 sm:grid-cols-2">
        <Choice
          label="Кому"
          value={form.gender}
          options={Object.entries(GENDER_LABEL)}
          onChange={(v) => set("gender", v as Gender)}
        />
        <Field
          label="Цена за 50 мл, €"
          hint={
            form.price
              ? `30 мл — €${priceFor(Number(form.price), 30)}, 100 мл — €${priceFor(Number(form.price), 100)}`
              : "Цены за 30 и 100 мл посчитаем сами"
          }
        >
          <Input
            required
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="0"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Как носить" hint="Сезон, стойкость, сколько наносить">
        <Textarea
          className="min-h-24"
          value={form.story}
          onChange={(e) => set("story", e.target.value)}
        />
      </Field>

      {/* ------------------------------------------------------------- фото -- */}
      <div>
        <span className="label-xs text-muted">Фото</span>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-sm border border-line bg-surface">
            {photo ? (
              <>
                <Image src={photo} alt="" fill sizes="96px" className="object-contain p-1" />
                <button
                  type="button"
                  onClick={() => setPhoto(undefined)}
                  aria-label="Убрать фото"
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-bg/90 text-ink transition-colors hover:text-accent"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              </>
            ) : (
              <span className="flex h-full items-center justify-center text-muted">
                <ImageUp size={20} aria-hidden="true" strokeWidth={1.4} />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={onPickFile}
              className="sr-only"
              id="admin-photo"
            />
            <label
              htmlFor="admin-photo"
              className={cn(
                "label-xs inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-5",
                "border-line transition-colors hover:border-accent hover:text-accent",
                uploading && "pointer-events-none opacity-60",
              )}
            >
              {uploading ? (
                <Loader2 size={14} aria-hidden="true" className="animate-spin" />
              ) : (
                <ImageUp size={14} aria-hidden="true" />
              )}
              {uploading ? "Загружаем…" : photo ? "Заменить" : "Загрузить"}
            </label>
            <p className="mt-2 text-[0.78rem] text-muted">
              JPG, PNG, WEBP или AVIF, до 6 МБ. Без фото покажем рисованный флакон.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Toggle label="В наличии" on={form.inStock} onClick={() => set("inStock", !form.inStock)} />
        <Toggle label="Новинка" on={form.isNew} onClick={() => set("isNew", !form.isNew)} />
        <Toggle
          label="На главную"
          on={form.featured}
          onClick={() => set("featured", !form.featured)}
        />
      </div>

      {error && (
        <p role="alert" className="text-[0.85rem] text-feminine">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={busy || uploading}>
          {busy ? "Сохраняем…" : editing ? "Сохранить изменения" : "Добавить аромат"}
        </Button>

        {editing && (
          <Button type="button" variant="quiet" onClick={onCancelEdit}>
            Отмена
          </Button>
        )}
      </div>

      <PublishOverlay
        open={publishing}
        title={editing ? "Изменения сохранены" : "Аромат в каталоге"}
        onDone={finishPublish}
      />
    </form>
  );
}

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="label-xs text-muted">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map(([key, title]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={value === key}
            className={cn(
              "label-xs min-h-11 rounded-full border px-4 transition-colors duration-300",
              value === key
                ? "border-accent bg-accent text-accent-contrast"
                : "border-line text-muted hover:border-accent-soft hover:text-ink",
            )}
          >
            {title}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Toggle({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "label-xs inline-flex min-h-11 items-center gap-2 rounded-full border px-4 transition-colors duration-300",
        on ? "border-accent text-accent" : "border-line text-muted hover:text-ink",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-2 w-2 rounded-full transition-colors",
          on ? "bg-accent" : "bg-line",
        )}
      />
      {label}
    </button>
  );
}
