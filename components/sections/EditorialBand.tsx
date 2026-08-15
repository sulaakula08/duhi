"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const STATEMENT =
  "Не добавляем ничего, что делает аромат только приятнее. Половина ранних формул становилась хуже ровно в тот момент, когда мы шли на поводу у этого инстинкта. Уцелевшие четырнадцать и стоят на полке.";

/**
 * Текст проявляется по мере прокрутки: слова по очереди набирают цвет, пока
 * полоса проходит через экран.
 */
export function EditorialBand() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });

  const words = STATEMENT.split(" ");

  return (
    <section ref={ref} className="border-y border-line bg-surface py-28 md:py-36">
      <div className="container-x">
        <p className="label-xs mb-10 text-accent">Правило</p>
        <p className="display-2 max-w-5xl">
          {words.map((word, i) => (
            <Word
              key={`${word}-${i}`}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1.5) / words.length]}
              reduced={Boolean(reduced)}
            >
              {word}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  reduced,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, [0.22, 1]);

  return (
    <span className="inline-block">
      <motion.span style={reduced ? undefined : { opacity }}>{children}</motion.span>
      <span>&nbsp;</span>
    </span>
  );
}
