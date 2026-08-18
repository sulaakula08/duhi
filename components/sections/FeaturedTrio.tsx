import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { getFeaturedProducts } from "@/lib/data/store";

export async function FeaturedTrio() {
  const featured = await getFeaturedProducts(3);

  return (
    <section className="container-x py-24 md:py-32" aria-labelledby="featured-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-xs text-accent">Хиты</p>
          <MaskedLines
            as="h2"
            id="featured-heading"
            lines={["Берут чаще всего"]}
            className="display-2 mt-4"
          />
        </div>
        <Link
          href="/collections"
          className="group inline-flex items-center gap-2 text-[0.85rem] text-muted transition-colors duration-300 hover:text-accent"
        >
          Все четырнадцать
          <ArrowRight
            size={15}
            aria-hidden="true"
            className="transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Нарочно неровно: средняя карточка опущена, чтобы сбить ритм сетки. */}
      <RevealGroup className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((product, index) => (
          <RevealItem key={product.id} className={index === 1 ? "lg:mt-16" : undefined}>
            <ProductCard product={product} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
