import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionView } from "@/components/collections/CollectionView";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import {
  GENDERS,
  GENDER_LABEL,
  type Gender,
  getProductsByGender,
} from "@/lib/data/products";

const COPY: Record<Gender, { eyebrow: string; lines: string[]; intro: string }> = {
  women: {
    eyebrow: "Каталог",
    lines: ["Женские"],
    intro:
      "Пять ароматов: тубероза, роза, мёд, амбра и цитрус. От €86 за 30 мл.",
  },
  men: {
    eyebrow: "Каталог",
    lines: ["Мужские"],
    intro:
      "Пять ароматов: ветивер, кедр, чай, кожа и табак. От €92 за 30 мл.",
  },
  unisex: {
    eyebrow: "Каталог",
    lines: ["Унисекс"],
    intro:
      "Четыре аромата, которые одинаково подходят всем: груша с дымком, нероли, ладан и инжир.",
  },
};

export function generateStaticParams() {
  return GENDERS.map((gender) => ({ gender }));
}

function isGender(value: string): value is Gender {
  return (GENDERS as string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gender: string }>;
}): Promise<Metadata> {
  const { gender } = await params;
  if (!isGender(gender)) return {};

  return {
    title: `${GENDER_LABEL[gender]} ароматы`,
    description: COPY[gender].intro,
  };
}

export default async function GenderCollectionPage({
  params,
}: {
  params: Promise<{ gender: string }>;
}) {
  const { gender } = await params;
  if (!isGender(gender)) notFound();

  const copy = COPY[gender];

  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} lines={copy.lines} intro={copy.intro} />
      <Suspense fallback={<GridFallback />}>
        <CollectionView products={getProductsByGender(gender)} lockedGender={gender} />
      </Suspense>
    </>
  );
}

function GridFallback() {
  return (
    <div className="container-x grid gap-x-8 gap-y-14 pb-24 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
