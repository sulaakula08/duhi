import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Оформление",
  description: "Демонстрационное оформление заказа. Оплата не проводится.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader eyebrow="Заказ" lines={["Оформление"]} />
      <CheckoutFlow />
    </>
  );
}
