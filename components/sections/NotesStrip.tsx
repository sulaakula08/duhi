"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

const PANELS = [
  {
    tier: "Верх",
    time: "0–10 минут",
    heading: "Первое впечатление",
    body: "Самые летучие ноты: цитрусы, зелень, специи. Именно их вы чувствуете в магазине — но через десять минут от них уже ничего не останется.",
    notes: ["Бергамот", "Лист инжира", "Морская соль", "Розовый перец", "Петитгрейн"],
  },
  {
    tier: "Сердце",
    time: "10 минут – 2 часа",
    heading: "Основная часть",
    body: "Цветы, специи и смолы. Это то, чем аромат пахнет большую часть времени, — по сердцу и стоит выбирать.",
    notes: ["Тубероза", "Турецкая роза", "Ирис", "Гваяк", "Копчёный чай"],
  },
  {
    tier: "База",
    time: "От двух часов",
    heading: "Шлейф к вечеру",
    body: "Дерево, амбра, мускус, ваниль. Испаряются медленно, поэтому именно база отвечает за стойкость — и остаётся на одежде.",
    notes: ["Корень ветивера", "Лабданум", "Тонка", "Амбра", "Берёзовый дёготь"],
  },
];

/**
 * На десктопе — закреплённая горизонтальная прокрутка. На узких экранах и при
 * включённом «уменьшить движение» это обычный столбец: перехватывать скролл там
 * было бы просто неудобно.
 */
export function NotesStrip() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const pinned = isDesktop && !reduced;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);

  if (!pinned) {
    return (
      <section
        className="container-x space-y-12 py-24"
        aria-labelledby="notes-strip-heading"
      >
        <header>
          <p className="label-xs text-accent">Как читать состав</p>
          <h2 id="notes-strip-heading" className="display-2 mt-4">
            Верх, сердце, база
          </h2>
        </header>
        {PANELS.map((panel) => (
          <Panel key={panel.tier} panel={panel} />
        ))}
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative h-[300vh]"
      aria-labelledby="notes-strip-heading"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <header className="container-x shrink-0 pb-10">
          <p className="label-xs text-accent">Как читать состав</p>
          <h2 id="notes-strip-heading" className="display-2 mt-4">
            Верх, сердце, база
          </h2>
        </header>

        <motion.div className="flex w-[300vw]" style={{ x }}>
          {PANELS.map((panel) => (
            <div key={panel.tier} className="flex w-screen items-start px-10 xl:px-16">
              <Panel panel={panel} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Panel({ panel }: { panel: (typeof PANELS)[number] }) {
  return (
    <article className="max-w-xl">
      <div className="flex items-baseline gap-4">
        <span className="font-display text-6xl font-light text-accent-soft">
          {panel.tier}
        </span>
        <span className="label-xs text-muted">{panel.time}</span>
      </div>
      <h3 className="display-3 mt-6">{panel.heading}</h3>
      <p className="mt-4 text-[1rem] text-muted">{panel.body}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {panel.notes.map((note) => (
          <li
            key={note}
            className="rounded-full border border-line px-3 py-1.5 text-[0.82rem]"
          >
            {note}
          </li>
        ))}
      </ul>
    </article>
  );
}
