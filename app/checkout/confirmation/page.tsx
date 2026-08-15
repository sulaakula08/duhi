import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Confetti } from "@/components/checkout/Confetti";

export const metadata: Metadata = {
  title: "Заказ подтверждён",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col items-center justify-center py-32 text-center">
      <Confetti />

      <p className="label-xs mt-8 text-accent">Заказ ELD-2026-0431</p>
      <h1 className="display-1 mt-6 max-w-3xl">Спасибо.</h1>
      <p className="mt-7 max-w-md text-[1.02rem] text-muted">
        Заказ принят. Мы напишем, когда он уедет, — обычно это два рабочих дня.
        Пробники к нему выбираем руками.
      </p>

      <p className="mt-8 max-w-md rounded-sm border border-line bg-surface px-5 py-4 text-[0.85rem] text-muted">
        Это демонстрационный магазин. Оплата не прошла, заказ не создан, ничего
        не поедет.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/collections" size="lg">
          Смотреть дальше
        </ButtonLink>
        <ButtonLink href="/journal" size="lg" variant="ghost">
          Читать журнал
        </ButtonLink>
      </div>
    </section>
  );
}
