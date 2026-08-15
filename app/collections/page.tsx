import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionView } from "@/components/collections/CollectionView";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { getProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Все ароматы",
  description:
    "Полная линия Eldea — четырнадцать ароматов: цветочные, древесные, восточные, свежие и гурманские.",
};

export default function CollectionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Коллекция"
        lines={["Четырнадцать", "ароматов"]}
        intro="Фильтруйте по семейству, по тому, кому аромат сделан, или по цене. Всё — парфюмерная вода, в трёх объёмах."
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
