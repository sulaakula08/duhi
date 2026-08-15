import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionView } from "@/components/collections/CollectionView";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { getProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Все ароматы",
  description:
    "Каталог Eldea: четырнадцать ароматов для женщин и мужчин — цветочные, древесные, восточные, свежие и гурманские. Объёмы 30, 50 и 100 мл.",
};

export default function CollectionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Каталог"
        lines={["Все ароматы"]}
        intro="Четырнадцать позиций. Фильтруйте по семейству, полу или цене. Везде парфюмерная вода, объёмы 30, 50 и 100 мл."
      />
      <Suspense fallback={<GridFallback />}>
        <CollectionView products={getProducts()} />
      </Suspense>
    </>
  );
}

function GridFallback() {
  return (
    <div className="container-x grid gap-x-8 gap-y-14 pb-24 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
