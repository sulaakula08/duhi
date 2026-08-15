import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col items-center justify-center py-32 text-center">
      <p className="label-xs text-accent">404</p>
      <h1 className="display-1 mt-6">Здесь ничего нет.</h1>
      <p className="mt-6 max-w-md text-[1.02rem] text-muted">
        Такой страницы не существует — или она была, а потом дом перестал делать
        то, что на ней лежало.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" size="lg">
          На главную
        </ButtonLink>
        <ButtonLink href="/collections" size="lg" variant="ghost">
          Смотреть коллекцию
        </ButtonLink>
      </div>
    </section>
  );
}
