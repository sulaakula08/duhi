"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Check, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { PromoField, type AppliedPromo } from "./PromoField";
import { ease, transition } from "@/lib/motion";
import { cartSubtotal, shippingFor, useCartStore, useHydratedCart } from "@/lib/store/cart";
import { cn, formatPrice } from "@/lib/utils";

/** Единственный номер карты, который принимает демо. Никуда не отправляется. */
const DEMO_CARD = "4242424242424242";

const contactSchema = z.object({
  email: z.string().email("Проверьте адрес почты."),
  firstName: z.string().min(1, "Заполните поле."),
  lastName: z.string().min(1, "Заполните поле."),
});

const shippingSchema = z.object({
  address: z.string().min(4, "Укажите улицу и дом."),
  city: z.string().min(2, "Заполните поле."),
  postcode: z.string().min(3, "Заполните поле."),
  country: z.string().min(2, "Заполните поле."),
});

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s/g, ""))
    .refine(
      (v) => v === DEMO_CARD,
      "Демо принимает только тестовый номер 4242 4242 4242 4242.",
    ),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Формат ММ/ГГ."),
  cvc: z.string().regex(/^\d{3}$/, "Три цифры."),
});

type ContactValues = z.infer<typeof contactSchema>;
type ShippingValues = z.infer<typeof shippingSchema>;

const STEPS = ["Контакты", "Доставка", "Оплата"] as const;

export function CheckoutFlow() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const router = useRouter();
  const clear = useCartStore((s) => s.clear);
  const { lines, hydrated } = useHydratedCart();
  const reduced = useReducedMotion();

  const [promo, setPromo] = useState<AppliedPromo>();

  const subtotal = cartSubtotal(lines);
  const shipping = shippingFor(subtotal);
  // Скидка считается от суммы товаров, доставку не трогаем.
  const discount = promo ? Math.round((subtotal * promo.percent) / 100) : 0;
  const total = Math.max(0, subtotal - discount) + shipping;

  function go(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  function complete() {
    clear();
    router.push("/checkout/confirmation");
  }

  if (hydrated && lines.length === 0) {
    return (
      <div className="container-x flex flex-col items-center gap-5 py-24 text-center">
        <p className="display-3">Оформлять нечего.</p>
        <Button onClick={() => router.push("/collections")}>В каталог</Button>
      </div>
    );
  }

  const slide = {
    enter: (dir: number) => ({ opacity: 0, x: reduced ? 0 : dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: reduced ? 0 : dir * -40 }),
  };

  return (
    <div className="container-x grid gap-14 pb-28 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
      <div>
        <StepIndicator step={step} />

        <div className="mt-12 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={
                reduced ? { duration: 0.01 } : { duration: 0.4, ease: ease.out }
              }
            >
              {step === 0 && <ContactStep onNext={() => go(1)} />}
              {step === 1 && <ShippingStep onNext={() => go(2)} onBack={() => go(0)} />}
              {step === 2 && (
                <PaymentStep total={total} onBack={() => go(1)} onComplete={complete} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Состав заказа">
        <h2 className="label-xs text-muted">Заказ</h2>
        <ul className="mt-6 space-y-4 border-t border-line pt-6">
          {lines.map((line) => (
            <li key={line.key} className="flex justify-between gap-4 text-[0.92rem]">
              <span className="min-w-0">
                <span className="block truncate">{line.name}</span>
                <span className="text-[0.8rem] text-muted">
                  {line.ml} мл × {line.quantity}
                </span>
              </span>
              <span className="shrink-0 tabular-nums">
                {formatPrice(line.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <PromoField
          subtotal={subtotal}
          applied={promo}
          onApply={setPromo}
          onClear={() => setPromo(undefined)}
        />

        <dl className="mt-6 space-y-3 border-t border-line pt-6 text-[0.95rem]">
          {promo && (
            <div className="flex justify-between text-accent">
              <dt>Скидка {promo.code}</dt>
              <dd className="tabular-nums">−{formatPrice(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted">Доставка</dt>
            <dd className="tabular-nums">
              {shipping === 0 ? "Включена" : formatPrice(shipping)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-line pt-4">
            <dt>К оплате</dt>
            <dd className="font-display text-3xl tabular-nums">{formatPrice(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function StepIndicator({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-3" aria-label="Шаги оформления">
      {STEPS.map((label, index) => {
        const state = index < step ? "done" : index === step ? "current" : "todo";
        return (
          <li key={label} className="flex flex-1 items-center gap-3">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[0.75rem] tabular-nums transition-colors duration-500",
                state === "done" && "border-accent bg-accent text-accent-contrast",
                state === "current" && "border-accent text-accent",
                state === "todo" && "border-line text-muted",
              )}
            >
              {state === "done" ? <Check size={13} aria-hidden="true" /> : index + 1}
            </span>
            <span
              className={cn(
                "label-xs hidden sm:block",
                state === "todo" ? "text-muted" : "text-ink",
              )}
            >
              {label}
              {state === "current" && <span className="sr-only"> (текущий шаг)</span>}
            </span>
            {index < STEPS.length - 1 && (
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ContactStep({ onNext }: { onNext: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <h2 className="display-3">Куда вам писать?</h2>

      <div className="mt-8 space-y-7">
        <Field label="Почта" error={errors.email?.message}>
          <Input
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </Field>
        <div className="grid gap-7 sm:grid-cols-2">
          <Field label="Имя" error={errors.firstName?.message}>
            <Input
              autoComplete="given-name"
              aria-invalid={Boolean(errors.firstName)}
              {...register("firstName")}
            />
          </Field>
          <Field label="Фамилия" error={errors.lastName?.message}>
            <Input
              autoComplete="family-name"
              aria-invalid={Boolean(errors.lastName)}
              {...register("lastName")}
            />
          </Field>
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-10 w-full sm:w-auto">
        Дальше — доставка
      </Button>
    </form>
  );
}

function ShippingStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingValues>({ resolver: zodResolver(shippingSchema) });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <h2 className="display-3">Куда везём?</h2>

      <div className="mt-8 space-y-7">
        <Field label="Улица, дом, квартира" error={errors.address?.message}>
          <Input
            autoComplete="street-address"
            aria-invalid={Boolean(errors.address)}
            {...register("address")}
          />
        </Field>
        <div className="grid gap-7 sm:grid-cols-3">
          <Field label="Город" error={errors.city?.message}>
            <Input
              autoComplete="address-level2"
              aria-invalid={Boolean(errors.city)}
              {...register("city")}
            />
          </Field>
          <Field label="Индекс" error={errors.postcode?.message}>
            <Input
              autoComplete="postal-code"
              aria-invalid={Boolean(errors.postcode)}
              {...register("postcode")}
            />
          </Field>
          <Field label="Страна" error={errors.country?.message}>
            <Input
              autoComplete="country-name"
              aria-invalid={Boolean(errors.country)}
              {...register("country")}
            />
          </Field>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg">
          Дальше — оплата
        </Button>
        <Button type="button" variant="quiet" onClick={onBack}>
          <ArrowLeft size={14} aria-hidden="true" />
          Назад
        </Button>
      </div>
    </form>
  );
}

function PaymentStep({
  total,
  onBack,
  onComplete,
}: {
  total: number;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ cardNumber: string; expiry: string; cvc: string }>({
    resolver: zodResolver(paymentSchema),
  });

  function onSubmit() {
    setSubmitting(true);
    // Имитация обращения к платёжному провайдеру. Из браузера ничего не уходит.
    setTimeout(onComplete, 900);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="display-3">Оплата</h2>

      <div
        role="note"
        className="mt-6 flex gap-3 rounded-sm border border-accent/40 bg-surface p-4"
      >
        <Info size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
        <p className="text-[0.88rem] text-muted">
          <strong className="font-medium text-ink">
            Это демонстрационное оформление.
          </strong>{" "}
          Оплата не проводится, данные никуда не отправляются. Не вводите настоящие
          реквизиты карты. Используйте тестовый номер{" "}
          <span className="whitespace-nowrap tabular-nums text-ink">
            4242 4242 4242 4242
          </span>{" "}
          с любым будущим сроком и любым трёхзначным кодом.
        </p>
      </div>

      <div className="mt-8 space-y-7">
        <Field label="Номер карты (только тестовый)" error={errors.cardNumber?.message}>
          <Input
            inputMode="numeric"
            autoComplete="off"
            placeholder="4242 4242 4242 4242"
            aria-invalid={Boolean(errors.cardNumber)}
            {...register("cardNumber")}
          />
        </Field>
        <div className="grid gap-7 sm:grid-cols-2">
          <Field label="Срок действия" error={errors.expiry?.message}>
            <Input
              inputMode="numeric"
              autoComplete="off"
              placeholder="04/29"
              aria-invalid={Boolean(errors.expiry)}
              {...register("expiry")}
            />
          </Field>
          <Field label="Код на обороте" error={errors.cvc?.message}>
            <Input
              inputMode="numeric"
              autoComplete="off"
              placeholder="123"
              aria-invalid={Boolean(errors.cvc)}
              {...register("cvc")}
            />
          </Field>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={submitting}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={submitting ? "working" : "idle"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition.micro}
            >
              {submitting ? "Оформляем…" : `Оформить · ${formatPrice(total)}`}
            </motion.span>
          </AnimatePresence>
        </Button>
        <Button type="button" variant="quiet" onClick={onBack} disabled={submitting}>
          <ArrowLeft size={14} aria-hidden="true" />
          Назад
        </Button>
      </div>
    </form>
  );
}
