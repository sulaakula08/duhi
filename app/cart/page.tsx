import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Проверьте заказ перед оформлением.",
};

export default function CartPage() {
  return (
    <>
      <PageHeader eyebrow="Корзина" lines={["Что вы", "выбрали"]} />
      <CartView />
    </>
  );
}
