import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col items-center justify-center py-32 text-center">
      <p className="label-xs text-accent">404</p>
      <h1 className="display-1 mt-6">Страница не найдена</h1>
      <p className="mt-6 max-w-md text-[1.02rem] text-muted">
        Проверьте адрес или вернитесь в каталог — возможно, товар снят
        с продажи.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" size="lg">
          На главную
        </ButtonLink>
        <ButtonLink href="/collections" size="lg" variant="ghost">
          В каталог
        </ButtonLink>
      </div>
    </section>
  );
}
