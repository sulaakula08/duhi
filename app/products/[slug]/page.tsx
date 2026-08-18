import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyPanel } from "@/components/product/BuyPanel";
import { Gallery } from "@/components/product/Gallery";
import { IntensityMeter } from "@/components/product/IntensityMeter";
import { NotesPyramid } from "@/components/product/NotesPyramid";
import { ProductCard } from "@/components/product/ProductCard";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { StarRating } from "@/components/ui/StarRating";
import {
  FAMILY_LABEL,
  GENDER_LABEL,
  getProducts,
  priceRange,
} from "@/lib/data/products";
import { findProduct, getRelatedProducts } from "@/lib/data/store";

/**
 * Пререндерим только то, что зашито в код. Товары из админки появляются на
 * диске уже после сборки, поэтому их страницы отрисуются по первому запросу.
 */
export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) return {};

  return {
    title: `${product.name} — ${product.subtitle}`,
    description: product.description,
    openGraph: {
      title: `${product.name} — Eldea`,
      description: product.description,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const { min, max } = priceRange(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: "Eldea" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: min,
      highPrice: max,
      offerCount: product.sizes.length,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-x pt-28 md:pt-32">
        <nav aria-label="Хлебные крошки" className="mb-8 text-[0.8rem] text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/collections" className="transition-colors hover:text-accent">
                Каталог
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/collections/${product.gender}`}
                className="transition-colors hover:text-accent"
              >
                {GENDER_LABEL[product.gender]}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* На десктопе прилипает: правая колонка прокручивается вдоль неё. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Gallery product={product} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">{FAMILY_LABEL[product.family]}</Badge>
              <Badge tone="muted">{GENDER_LABEL[product.gender]}</Badge>
              {product.isNew && <Badge>Новинка</Badge>}
            </div>

            <h1 className="display-2 mt-6">{product.name}</h1>
            <p className="mt-2 text-[1.05rem] text-muted">{product.subtitle}</p>

            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
              className="mt-5"
            />

            <p className="mt-8 text-[1.02rem]">{product.description}</p>

            <div className="mt-10 border-t border-line pt-10">
              <BuyPanel product={product} />
            </div>

            <section className="mt-16" aria-labelledby="notes-heading">
              <h2 id="notes-heading" className="label-xs text-muted">
                Ноты
              </h2>
              <div className="mt-8">
                <NotesPyramid product={product} />
              </div>
            </section>

            <section className="mt-16" aria-labelledby="intensity-heading">
              <h2 id="intensity-heading" className="label-xs text-muted">
                Стойкость и шлейф
              </h2>
              <div className="mt-8">
                <IntensityMeter intensity={product.intensity} />
              </div>
            </section>

            <section className="mt-16" aria-labelledby="detail-heading">
              <h2 id="detail-heading" className="sr-only">
                Подробности о товаре
              </h2>
              <Accordion
                items={[
                  {
                    title: "Как носить",
                    content: <p>{product.story}</p>,
                  },
                  {
                    title: "Состав",
                    content: (
                      <div className="space-y-3">
                        <p>
                          Alcohol denat., parfum (fragrance), aqua, limonene, linalool,
                          citral, geraniol, coumarin.
                        </p>
                        <p>
                          Парфюмерная вода, концентрация 15%. На животных не
                          тестируется. Срок годности — 3 года с даты вскрытия.
                        </p>
                      </div>
                    ),
                  },
                  {
                    title: "Доставка",
                    content: (
                      <p>
                        От €120 бесплатно, иначе €8. Отправляем в течение двух рабочих
                        дней, с трек-номером. К каждому заказу кладём два пробника
                        на выбор.
                      </p>
                    ),
                  },
                  {
                    title: "Возврат",
                    content: (
                      <p>
                        Невскрытый флакон принимаем обратно 30 дней, деньги возвращаем
                        полностью. Если открыли и аромат не подошёл — напишите нам,
                        поможем подобрать другой.
                      </p>
                    ),
                  },
                ]}
              />
            </section>
          </div>
        </div>
      </div>

      <section className="container-x py-28" aria-labelledby="related-heading">
        <Reveal>
          <p className="label-xs text-accent">Похожее</p>
          <h2 id="related-heading" className="display-3 mt-4">
            Смотрят вместе с этим
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <RevealItem key={item.id}>
              <ProductCard product={item} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
