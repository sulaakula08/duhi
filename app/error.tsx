"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-x flex min-h-[80svh] flex-col items-center justify-center py-32 text-center">
      <p className="label-xs text-accent">Что-то сломалось</p>
      <h1 className="display-2 mt-6">Не сработало.</h1>
      <p className="mt-6 max-w-md text-[1.02rem] text-muted">
        Страница не отрисовалась из-за неожиданной ошибки. Обычно достаточно
        попробовать ещё раз.
      </p>
      {error.digest && (
        <p className="mt-4 text-[0.78rem] text-muted">Код ошибки: {error.digest}</p>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={reset}>
          Попробовать снова
        </Button>
        <ButtonLink href="/" size="lg" variant="ghost">
          На главную
        </ButtonLink>
      </div>
    </section>
  );
}
