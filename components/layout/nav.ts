export type NavLink = { href: string; label: string };

export const primaryNav: NavLink[] = [
  { href: "/collections/women", label: "Женские" },
  { href: "/collections/men", label: "Мужские" },
  { href: "/collections/unisex", label: "Унисекс" },
  { href: "/collections", label: "Все ароматы" },
  { href: "/journal", label: "Журнал" },
  { href: "/contact", label: "Контакты" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Каталог",
    links: [
      { href: "/collections/women", label: "Женские" },
      { href: "/collections/men", label: "Мужские" },
      { href: "/collections/unisex", label: "Унисекс" },
      { href: "/collections", label: "Все ароматы" },
    ],
  },
  {
    title: "Дом",
    links: [
      { href: "/journal", label: "Журнал" },
      { href: "/contact", label: "Контакты" },
    ],
  },
];
