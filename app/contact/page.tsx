import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Напишите в Eldea о заказе, о подборе аромата или о том, что аромат вам не подошёл.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Контакты"
        lines={["Напишите", "нам"]}
        intro="Отвечаем на каждое письмо сами, обычно в течение двух рабочих дней. Если аромат не подошёл — расскажите, что он делает, и мы предложим тот, который подойдёт."
      />

      <div className="container-x grid gap-14 pb-28 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <ContactForm />

        <aside className="space-y-10">
          <div>
            <h2 className="label-xs text-muted">Студия</h2>
            <p className="mt-4 text-[0.98rem]">
              Rua da Boavista 84
              <br />
              1200-069 Лиссабон
              <br />
              Португалия
            </p>
          </div>
          <div>
            <h2 className="label-xs text-muted">Часы</h2>
            <p className="mt-4 text-[0.98rem] text-muted">
              Понедельник — пятница, 09:00–18:00 по Лиссабону. Стол в Грассе для
              посетителей закрыт.
            </p>
          </div>
          <div>
            <h2 className="label-xs text-muted">Заказы</h2>
            <p className="mt-4 text-[0.98rem] text-muted">
              Это демонстрационный магазин: заказы не собираются, адрес выше
              вымышленный.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
