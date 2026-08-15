import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { Reveal } from "@/components/ui/Reveal";
import { formatArticleDate, getArticleBySlug, getArticles } from "@/lib/data/journal";

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const more = getArticles()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      <article className="container-x pt-36 md:pt-44">
        <Link
          href="/journal"
          className="group inline-flex items-center gap-2 text-[0.82rem] text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft
            size={14}
            aria-hidden="true"
            className="transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
          />
          Журнал
        </Link>

        <header className="mt-10 max-w-3xl">
          <p className="label-xs text-accent">
            {article.category} · {article.readingMinutes} мин чтения
          </p>
          <MaskedLines
            as="h1"
            immediate
            delay={0.1}
            lines={[article.title]}
            className="display-2 mt-5"
          />
          <p className="mt-5 text-[0.85rem] text-muted">
            {formatArticleDate(article.date)}
          </p>
        </header>

        <div
          aria-hidden="true"
          className="mt-14 h-56 rounded-sm md:h-72"
          style={{ backgroundColor: article.tint, opacity: 0.18 }}
        />

        <div className="mx-auto mt-16 max-w-2xl space-y-7 text-[1.05rem] leading-[1.75]">
          {article.body.map((paragraph, index) => (
            <Reveal key={index} delay={0}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </article>

      <section className="container-x py-28" aria-labelledby="more-heading">
        <h2 id="more-heading" className="display-3 border-t border-line pt-12">
          Что ещё почитать
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {more.map((item) => (
            <ArticleCard key={item.slug} article={item} />
          ))}
        </div>
      </section>
    </>
  );
}
