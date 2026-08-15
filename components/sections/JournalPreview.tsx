import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { getArticles } from "@/lib/data/journal";

export function JournalPreview() {
  const articles = getArticles().slice(0, 3);

  return (
    <section className="container-x py-24 md:py-32" aria-labelledby="journal-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-xs text-accent">Журнал</p>
          <MaskedLines
            as="h2"
            id="journal-heading"
            lines={["Как выбрать аромат"]}
            className="display-2 mt-4"
          />
        </div>
        <Link
          href="/journal"
          className="group inline-flex items-center gap-2 text-[0.85rem] text-muted transition-colors duration-300 hover:text-accent"
        >
          Читать журнал
          <ArrowRight
            size={15}
            aria-hidden="true"
            className="transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          />
        </Link>
      </div>

      <RevealGroup className="mt-14 grid gap-10 md:grid-cols-3">
        {articles.map((article) => (
          <RevealItem key={article.slug}>
            <ArticleCard article={article} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
