import type { Metadata } from "next";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { getArticles } from "@/lib/data/journal";

export const metadata: Metadata = {
  title: "Журнал",
  description:
    "Как устроен аромат, как его носить и как собиралась линия Eldea.",
};

export default function JournalPage() {
  const articles = getArticles();

  return (
    <>
      <PageHeader
        eyebrow="Журнал"
        lines={["Про то,", "как это носят"]}
        intro="Изредка пишем о том, как аромат ведёт себя на самом деле, — и время от времени о том, как делались наши."
      />

      <RevealGroup className="container-x grid gap-x-10 gap-y-16 pb-28 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <RevealItem key={article.slug}>
            <ArticleCard article={article} />
          </RevealItem>
        ))}
      </RevealGroup>
    </>
  );
}
