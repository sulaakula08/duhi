import { Package, RotateCcw, Truck } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { formatMoney } from "@/lib/data/currency";
import { getSettings } from "@/lib/data/store";
import { SHIPPING_FEE, SHIPPING_THRESHOLD } from "@/lib/data/shipping";

const items = (money: (n: number) => string) => [
  {
    icon: Truck,
    title: "Доставка",
    body: `От ${money(SHIPPING_THRESHOLD)} бесплатно, иначе ${money(SHIPPING_FEE)}. Отправляем в течение двух рабочих дней, с трек-номером.`,
  },
  {
    icon: Package,
    title: "Пробники",
    body: "Два пробника на выбор кладём в каждый заказ — можно попробовать что-то ещё до покупки флакона.",
  },
  {
    icon: RotateCcw,
    title: "Возврат",
    body: "Невскрытый флакон принимаем обратно 30 дней. Если открыли и не подошло — напишите, разберёмся.",
  },
];

export async function StoreInfo() {
  const { currency } = await getSettings();
  const money = (n: number) => formatMoney(n, currency);
  const ITEMS = items(money);

  return (
    <section
      className="border-y border-line bg-surface py-20 md:py-24"
      aria-labelledby="store-info"
    >
      <div className="container-x">
        <Reveal>
          <h2 id="store-info" className="label-xs text-accent">
            Как мы работаем
          </h2>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-10 md:grid-cols-3 md:gap-12">
          {ITEMS.map((item) => (
            <RevealItem key={item.title}>
              <item.icon
                size={22}
                aria-hidden="true"
                className="text-accent"
                strokeWidth={1.4}
              />
              <h3 className="mt-4 font-display text-2xl font-light">{item.title}</h3>
              <p className="mt-2 text-[0.95rem] text-muted">{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
