/**
 * Каталог Eldea.
 *
 * Это единственное место, откуда сайт берёт товары. Замените тело
 * `getProducts` / `getProductBySlug` на запрос к API или CMS — компоненты
 * трогать не придётся.
 */

export type Gender = "women" | "men" | "unisex";
export type Family = "floral" | "woody" | "oriental" | "fresh" | "gourmand";

export type ProductSize = {
  ml: 30 | 50 | 100;
  price: number;
  sku: string;
};

/** Задаёт рисованный флакон в `components/product/ProductImage.tsx`. */
export type BottleArt = {
  shape: "tall" | "rounded" | "faceted" | "flask";
  from: string;
  to: string;
  cap: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  gender: Gender;
  family: Family;
  /** Чем пахнет — пара предложений без литературы. */
  description: string;
  /** Практика: сколько держится, сколько наносить, когда носить. */
  story: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  intensity: { longevity: number; sillage: number; warmth: number };
  sizes: ProductSize[];
  art: BottleArt;
  /**
   * Настоящие фотографии, в порядке галереи. Файлы кладутся в
   * `public/products/`, сюда пишутся пути вида "/products/vesper-bloom-1.jpg".
   * Если поле пустое — показывается рисованный флакон из `art`.
   * Подробности в `public/products/README.md`.
   */
  photos?: string[];
  images: { view: string; alt: string }[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  isNew: boolean;
  inStock: boolean;
};

export const FAMILIES: Family[] = ["floral", "woody", "oriental", "fresh", "gourmand"];
export const GENDERS: Gender[] = ["women", "men", "unisex"];

export const FAMILY_LABEL: Record<Family, string> = {
  floral: "Цветочные",
  woody: "Древесные",
  oriental: "Восточные",
  fresh: "Свежие",
  gourmand: "Гурманские",
};

export const GENDER_LABEL: Record<Gender, string> = {
  women: "Женские",
  men: "Мужские",
  unisex: "Унисекс",
};

function gallery(name: string): { view: string; alt: string }[] {
  return [
    { view: "bottle", alt: `Флакон ${name} прямо в кадре` },
    { view: "angle", alt: `Флакон ${name} вполоборота` },
    { view: "detail", alt: `Крышка и плечо флакона ${name} крупным планом` },
    { view: "still", alt: `${name} в кадре с мягкой тенью` },
  ];
}

const products: Product[] = [
  {
    id: "eld-01",
    slug: "vesper-bloom",
    name: "Vesper Bloom",
    subtitle: "Тубероза и жасмин",
    gender: "women",
    family: "floral",
    description:
      "Белые цветы со сливочной сладостью. Сначала зелёный и цитрусовый, минут через двадцать выходит тубероза с жасмином, к вечеру остаётся мягкий сандал.",
    story:
      "Вечерний вариант, лучше в тепле. Держится 7–8 часов, шлейф заметный — хватает двух нажатий. На коже раскрывается полнее, чем на одежде.",
    notes: {
      top: ["Зелёный мандарин", "Лист инжира", "Розовый перец"],
      heart: ["Тубероза", "Жасмин самбак", "Ирис"],
      base: ["Сандал", "Белый мускус", "Бензоин"],
    },
    intensity: { longevity: 82, sillage: 74, warmth: 58 },
    sizes: [
      { ml: 30, price: 96, sku: "ELD-01-30" },
      { ml: 50, price: 148, sku: "ELD-01-50" },
      { ml: 100, price: 212, sku: "ELD-01-100" },
    ],
    art: { shape: "rounded", from: "#E7C9C4", to: "#C48B8B", cap: "#8B6F47" },
    images: gallery("Vesper Bloom"),
    rating: 4.8,
    reviewCount: 214,
    featured: true,
    isNew: false,
    inStock: true,
  },
  {
    id: "eld-02",
    slug: "noir-vetiver",
    name: "Noir Vétiver",
    subtitle: "Ветивер и дым",
    gender: "men",
    family: "woody",
    description:
      "Сухой ветивер без сладости, с перцем в начале и лёгким дымом в основе. Землистый и прохладный, ближе к классике, чем к чему-то модному.",
    story:
      "Универсальный будничный аромат, круглый год. Один из самых стойких в линии — 9–10 часов, при этом шлейф умеренный, в офис подходит.",
    notes: {
      top: ["Бергамот", "Чёрный перец", "Можжевельник"],
      heart: ["Ветивер", "Кипарис", "Табачный лист"],
      base: ["Корень ветивера", "Дымный аккорд", "Амбра"],
    },
    intensity: { longevity: 91, sillage: 66, warmth: 44 },
    sizes: [
      { ml: 30, price: 104, sku: "ELD-02-30" },
      { ml: 50, price: 162, sku: "ELD-02-50" },
      { ml: 100, price: 228, sku: "ELD-02-100" },
    ],
    art: { shape: "faceted", from: "#7C8B88", to: "#3A4A48", cap: "#211D19" },
    images: gallery("Noir Vétiver"),
    rating: 4.9,
    reviewCount: 331,
    featured: true,
    isNew: false,
    inStock: true,
  },
  {
    id: "eld-03",
    slug: "ile-blanche",
    name: "Île Blanche",
    subtitle: "Цитрус и морская соль",
    gender: "women",
    family: "fresh",
    description:
      "Лимон и грейпфрут с солоноватой ноткой и мягким мускусом в основе. Почти без сладости, поэтому читается как чистый, а не фруктовый.",
    story:
      "Летний и дневной. Самый лёгкий в линии: держится 4–5 часов, освежать в течение дня — нормально. Хорошо в жару, когда плотное носить тяжело.",
    notes: {
      top: ["Лимон", "Грейпфрут", "Морская соль"],
      heart: ["Нероли", "Розмарин", "Ирис"],
      base: ["Светлое дерево", "Амбретта", "Мускус"],
    },
    intensity: { longevity: 64, sillage: 52, warmth: 28 },
    sizes: [
      { ml: 30, price: 88, sku: "ELD-03-30" },
      { ml: 50, price: 132, sku: "ELD-03-50" },
      { ml: 100, price: 186, sku: "ELD-03-100" },
    ],
    art: { shape: "tall", from: "#EAF0EF", to: "#B9CBC9", cap: "#8B6F47" },
    images: gallery("Île Blanche"),
    rating: 4.6,
    reviewCount: 178,
    featured: true,
    isNew: false,
    inStock: true,
  },
  {
    id: "eld-04",
    slug: "cendre",
    name: "Cendre",
    subtitle: "Кедр и зола",
    gender: "men",
    family: "woody",
    description:
      "Сухое дерево с дымком и щепоткой кардамона. Спокойный и негромкий: вблизи слышно хорошо, издалека почти нет.",
    story:
      "Осень и зима, вечер. Держится около восьми часов, шлейф небольшой — можно смело носить в помещении и в транспорте.",
    notes: {
      top: ["Элеми", "Кардамон", "Розовый перец"],
      heart: ["Гваяк", "Кедр", "Ладан"],
      base: ["Кашмеран", "Лабданум", "Ветивер"],
    },
    intensity: { longevity: 86, sillage: 48, warmth: 62 },
    sizes: [
      { ml: 30, price: 98, sku: "ELD-04-30" },
      { ml: 50, price: 154, sku: "ELD-04-50" },
      { ml: 100, price: 218, sku: "ELD-04-100" },
    ],
    art: { shape: "faceted", from: "#B4ADA4", to: "#6A635B", cap: "#2A251F" },
    images: gallery("Cendre"),
    rating: 4.7,
    reviewCount: 256,
    featured: false,
    isNew: false,
    inStock: true,
  },
  {
    id: "eld-05",
    slug: "miel-noir",
    name: "Miel Noir",
    subtitle: "Мёд и табак",
    gender: "women",
    family: "gourmand",
    description:
      "Тёмный мёд с табачным листом и карамелью. Сладкий, но с горчинкой, поэтому не превращается в десерт.",
    story:
      "Осенне-зимний, вечерний. Плотный и заметный: одного нажатия обычно хватает. Держится 8–9 часов, в жару может быть тяжеловат.",
    notes: {
      top: ["Красный апельсин", "Шафран", "Ром"],
      heart: ["Мёд", "Табачный лист", "Иммортель"],
      base: ["Карамель", "Бобы тонка", "Сандал"],
    },
    intensity: { longevity: 88, sillage: 81, warmth: 92 },
    sizes: [
      { ml: 30, price: 108, sku: "ELD-05-30" },
      { ml: 50, price: 168, sku: "ELD-05-50" },
      { ml: 100, price: 236, sku: "ELD-05-100" },
    ],
    art: { shape: "rounded", from: "#E5BE7E", to: "#9A6B2F", cap: "#3A2A18" },
    images: gallery("Miel Noir"),
    rating: 4.8,
    reviewCount: 189,
    featured: false,
    isNew: true,
    inStock: true,
  },
  {
    id: "eld-06",
    slug: "verre-fume",
    name: "Verre Fumé",
    subtitle: "Груша и копчёный чай",
    gender: "unisex",
    family: "woody",
    description:
      "Сухая груша сверху, копчёный чай и ирис в середине, дерево в основе. Прохладный, чуть дымный, без явной сладости.",
    story:
      "Хорошо весной и осенью, подходит и днём, и вечером. Держится 7–8 часов. Один из тех вариантов, что одинаково нормально смотрятся на мужчине и женщине.",
    notes: {
      top: ["Груша", "Лист фиалки", "Бергамот"],
      heart: ["Копчёный чай", "Ирис", "Кедр"],
      base: ["Ветивер", "Амброксан", "Мускус"],
    },
    intensity: { longevity: 79, sillage: 58, warmth: 46 },
    sizes: [
      { ml: 30, price: 94, sku: "ELD-06-30" },
      { ml: 50, price: 146, sku: "ELD-06-50" },
      { ml: 100, price: 204, sku: "ELD-06-100" },
    ],
    art: { shape: "tall", from: "#C6C2BC", to: "#7A756E", cap: "#8B6F47" },
    images: gallery("Verre Fumé"),
    rating: 4.7,
    reviewCount: 143,
    featured: true,
    isNew: true,
    inStock: true,
  },
  {
    id: "eld-07",
    slug: "rose-cendree",
    name: "Rose Cendrée",
    subtitle: "Роза с перцем и ладаном",
    gender: "women",
    family: "floral",
    description:
      "Турецкая роза без приторности: сверху перец и смородина, снизу ладан и пачули. Сдержанный вариант розы, не «мыльный» и не конфетный.",
    story:
      "Круглый год, чаще вечером. Держится 8 часов, шлейф средний. Если роза обычно кажется вам слишком сладкой — этот стоит попробовать.",
    notes: {
      top: ["Розовый перец", "Чёрная смородина", "Личи"],
      heart: ["Турецкая роза", "Дамасская роза", "Ирис"],
      base: ["Ладан", "Пачули", "Кожа"],
    },
    intensity: { longevity: 84, sillage: 69, warmth: 66 },
    sizes: [
      { ml: 30, price: 102, sku: "ELD-07-30" },
      { ml: 50, price: 158, sku: "ELD-07-50" },
      { ml: 100, price: 224, sku: "ELD-07-100" },
    ],
    art: { shape: "rounded", from: "#DCA9A9", to: "#9E5F63", cap: "#4A2E2E" },
    images: gallery("Rose Cendrée"),
    rating: 4.9,
    reviewCount: 297,
    featured: false,
    isNew: false,
    inStock: true,
  },
  {
    id: "eld-08",
    slug: "bois-de-fer",
    name: "Bois de Fer",
    subtitle: "Дерево и чёрный чай",
    gender: "men",
    family: "woody",
    description:
      "Сухая древесина с чёрным чаем и кардамоном, с лёгкой горчинкой. Строгий и простой, без сладких нот в основе.",
    story:
      "Рабочий вариант на каждый день, круглый год. Держится 8–9 часов, шлейф умеренный. Самый «незаметный» из мужских — в этом его смысл.",
    notes: {
      top: ["Кардамон", "Грейпфрут", "Мускатный орех"],
      heart: ["Чёрный чай", "Кипарис", "Шалфей"],
      base: ["Дерево", "Дубовый мох", "Амбра"],
    },
    intensity: { longevity: 87, sillage: 61, warmth: 40 },
    sizes: [
      { ml: 30, price: 92, sku: "ELD-08-30" },
      { ml: 50, price: 142, sku: "ELD-08-50" },
      { ml: 100, price: 198, sku: "ELD-08-100" },
    ],
    art: { shape: "faceted", from: "#9AA3A6", to: "#4E5659", cap: "#25292B" },
    images: gallery("Bois de Fer"),
    rating: 4.5,
    reviewCount: 122,
    featured: false,
    isNew: false,
    inStock: true,
  },
  {
    id: "eld-09",
    slug: "ambre-voile",
    name: "Ambre Voilé",
    subtitle: "Амбра и ваниль",
    gender: "women",
    family: "oriental",
    description:
      "Мягкая амбра с ванилью и пудровым ирисом. Тёплый и обволакивающий, звучит негромко, но долго.",
    story:
      "Самый стойкий в линии: легко доживает до вечера с утра. Шлейф при этом небольшой — начните с одного нажатия. Лучше в прохладную погоду.",
    notes: {
      top: ["Бергамот", "Кориандр", "Давана"],
      heart: ["Ирис", "Роза", "Гелиотроп"],
      base: ["Лабданум", "Ваниль", "Мускус"],
    },
    intensity: { longevity: 93, sillage: 55, warmth: 88 },
    sizes: [
      { ml: 30, price: 112, sku: "ELD-09-30" },
      { ml: 50, price: 174, sku: "ELD-09-50" },
      { ml: 100, price: 240, sku: "ELD-09-100" },
    ],
    art: { shape: "rounded", from: "#E8D2AE", to: "#B08A55", cap: "#4C3820" },
    images: gallery("Ambre Voilé"),
    rating: 4.8,
    reviewCount: 205,
    featured: false,
    isNew: false,
    inStock: true,
  },
  {
    id: "eld-10",
    slug: "neroli-hour",
    name: "Neroli Hour",
    subtitle: "Нероли и апельсиновый цвет",
    gender: "unisex",
    family: "floral",
    description:
      "Горьковатое нероли с петитгрейном, дальше медовый апельсиновый цвет и воск. Чистый и не сладкий.",
    story:
      "Утро, весна и лето. Держится 5–6 часов, шлейф небольшой. Хороший вариант, если нужно что-то простое и опрятное на каждый день.",
    notes: {
      top: ["Петитгрейн", "Горький апельсин", "Мандарин"],
      heart: ["Нероли", "Апельсиновый цвет", "Жимолость"],
      base: ["Мускус", "Пчелиный воск", "Светлое дерево"],
    },
    intensity: { longevity: 68, sillage: 57, warmth: 42 },
    sizes: [
      { ml: 30, price: 86, sku: "ELD-10-30" },
      { ml: 50, price: 134, sku: "ELD-10-50" },
      { ml: 100, price: 188, sku: "ELD-10-100" },
    ],
    art: { shape: "tall", from: "#F0E6C8", to: "#C9B896", cap: "#8B6F47" },
    images: gallery("Neroli Hour"),
    rating: 4.6,
    reviewCount: 164,
    featured: false,
    isNew: false,
    inStock: true,
  },
  {
    id: "eld-11",
    slug: "encens-pale",
    name: "Encens Pâle",
    subtitle: "Ладан и грейпфрут",
    gender: "unisex",
    family: "oriental",
    description:
      "Ладан взят с лёгкой, почти цитрусовой стороны, а не с тяжёлой. Сверху грейпфрут, в основе сухой кедр и минеральная нотка.",
    story:
      "Межсезонье, день. Держится около семи часов. Если ладан обычно кажется вам «церковным» и душным — здесь другой случай.",
    notes: {
      top: ["Ладан", "Грейпфрут", "Элеми"],
      heart: ["Олибанум", "Кипарис", "Дягиль"],
      base: ["Минеральный аккорд", "Амбретта", "Кедр"],
    },
    intensity: { longevity: 77, sillage: 49, warmth: 51 },
    sizes: [
      { ml: 30, price: 100, sku: "ELD-11-30" },
      { ml: 50, price: 156, sku: "ELD-11-50" },
      { ml: 100, price: 216, sku: "ELD-11-100" },
    ],
    art: { shape: "flask", from: "#DDD8CE", to: "#9C978B", cap: "#5B564C" },
    images: gallery("Encens Pâle"),
    rating: 4.7,
    reviewCount: 138,
    featured: false,
    isNew: true,
    inStock: true,
  },
  {
    id: "eld-12",
    slug: "sel-et-cuir",
    name: "Sel et Cuir",
    subtitle: "Замша и соль",
    gender: "men",
    family: "oriental",
    description:
      "Мягкая замшевая кожа с солоноватой ноткой и ирисом. Без дёгтя и жёсткого дыма, которые обычно бывают в кожаных ароматах.",
    story:
      "Осень и зима, вечер. Держится 8–9 часов, шлейф средний. Сейчас распродан — напишите нам, сообщим о поступлении.",
    notes: {
      top: ["Морская соль", "Бергамот", "Чёрный перец"],
      heart: ["Замша", "Ирис", "Лист фиалки"],
      base: ["Кожа", "Тонка", "Амбра"],
    },
    intensity: { longevity: 85, sillage: 63, warmth: 72 },
    sizes: [
      { ml: 30, price: 106, sku: "ELD-12-30" },
      { ml: 50, price: 164, sku: "ELD-12-50" },
      { ml: 100, price: 230, sku: "ELD-12-100" },
    ],
    art: { shape: "flask", from: "#C4A98D", to: "#7B5B41", cap: "#332217" },
    images: gallery("Sel et Cuir"),
    rating: 4.6,
    reviewCount: 151,
    featured: false,
    isNew: false,
    inStock: false,
  },
  {
    id: "eld-13",
    slug: "figue-sauvage",
    name: "Figue Sauvage",
    subtitle: "Инжир и зелёный лист",
    gender: "unisex",
    family: "fresh",
    description:
      "Зелёный лист инжира, млечный сок и кора — то есть дерево целиком, а не сладкий плод. Свежий, с горчинкой.",
    story:
      "Весна и лето, день. Держится 5–6 часов. Подойдёт, если инжирные ароматы обычно кажутся вам слишком кокосовыми.",
    notes: {
      top: ["Лист инжира", "Зелёный миндаль", "Лимон"],
      heart: ["Сок инжира", "Кокосовое дерево", "Мастика"],
      base: ["Кора инжира", "Кедр", "Мускус"],
    },
    intensity: { longevity: 70, sillage: 60, warmth: 48 },
    sizes: [
      { ml: 30, price: 90, sku: "ELD-13-30" },
      { ml: 50, price: 138, sku: "ELD-13-50" },
      { ml: 100, price: 194, sku: "ELD-13-100" },
    ],
    art: { shape: "tall", from: "#CFD9BE", to: "#7E8E6A", cap: "#3E4632" },
    images: gallery("Figue Sauvage"),
    rating: 4.5,
    reviewCount: 131,
    featured: false,
    isNew: false,
    inStock: true,
  },
  {
    id: "eld-14",
    slug: "tabac-or",
    name: "Tabac Or",
    subtitle: "Табак и сушёная слива",
    gender: "men",
    family: "gourmand",
    description:
      "Трубочный табак с сухофруктами, ромом и корицей. Сладкий и плотный — самый «зимний» аромат в линии.",
    story:
      "Ноябрь — февраль, вечер. Шлейф сильный, одного нажатия достаточно. Держится 9 часов и хорошо остаётся на шарфе и пальто.",
    notes: {
      top: ["Сушёная слива", "Корица", "Ром"],
      heart: ["Табак", "Сушёный инжир", "Какао"],
      base: ["Бобы тонка", "Ваниль", "Пачули"],
    },
    intensity: { longevity: 90, sillage: 84, warmth: 95 },
    sizes: [
      { ml: 30, price: 110, sku: "ELD-14-30" },
      { ml: 50, price: 170, sku: "ELD-14-50" },
      { ml: 100, price: 238, sku: "ELD-14-100" },
    ],
    art: { shape: "faceted", from: "#D2A96B", to: "#7C4E24", cap: "#2E1C0E" },
    images: gallery("Tabac Or"),
    rating: 4.8,
    reviewCount: 243,
    featured: false,
    isNew: false,
    inStock: true,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
 * ВРЕМЕННЫЙ БЛОК — УДАЛИТЬ ПЕРЕД ПУБЛИКАЦИЕЙ
 *
 * Подставляет тестовые снимки, чтобы посмотреть, как ведёт себя фото-ветка:
 * карточки, галерея, корзина, подложка в обеих темах.
 *
 * Это каталожные фотографии чужих марок (Guerlain, Chanel, Byredo, Creed,
 * Lalique, Clinique, Belle) — на флаконах видны их товарные знаки. Годится
 * только для локальной проверки вёрстки.
 *
 * Как убрать: удалить этот блок целиком, файлы public/products/_demo-* и
 * папку raw-photos/. Товары молча вернутся к рисованным флаконам.
 * ═══════════════════════════════════════════════════════════════════════════ */

// Снимков семь, а товаров четырнадцать, поэтому на вторую половину каталога
// кадры назначены повторно — по близкому цвету стекла.
const P = "/products/_demo-";

const DEMO_PHOTOS: Record<string, string> = {
  "vesper-bloom": `${P}vesper-bloom-1.png`,
  "noir-vetiver": `${P}noir-vetiver-1.png`,
  "ile-blanche": `${P}ile-blanche-1.png`,
  cendre: `${P}cendre-1.png`,
  "verre-fume": `${P}verre-fume-1.png`,
  "rose-cendree": `${P}rose-cendree-1.png`,
  "tabac-or": `${P}tabac-or-1.png`,

  "miel-noir": `${P}tabac-or-1.png`,
  "ambre-voile": `${P}vesper-bloom-1.png`,
  "bois-de-fer": `${P}noir-vetiver-1.png`,
  "neroli-hour": `${P}ile-blanche-1.png`,
  "encens-pale": `${P}verre-fume-1.png`,
  "sel-et-cuir": `${P}cendre-1.png`,
  "figue-sauvage": `${P}rose-cendree-1.png`,
};

for (const product of products) {
  const photo = DEMO_PHOTOS[product.slug];
  if (photo) product.photos = product.images.map(() => photo);
}

/* ═════════════════════════════ КОНЕЦ ВРЕМЕННОГО БЛОКА ═══════════════════════ */

/* ------------------------------------------------------------ доступ к данным -- */

export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByGender(gender: Gender): Product[] {
  return products.filter((p) => p.gender === gender);
}

export function getFeatured(limit = 3): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getRelated(product: Product, limit = 4): Product[] {
  const sameFamily = products.filter((p) => p.family === product.family && p.id !== product.id);
  const rest = products.filter((p) => p.family !== product.family && p.id !== product.id);
  return [...sameFamily, ...rest].slice(0, limit);
}

export function priceRange(product: Product): { min: number; max: number } {
  const prices = product.sizes.map((s) => s.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function findSize(product: Product, ml: number): ProductSize {
  return product.sizes.find((s) => s.ml === ml) ?? product.sizes[0];
}
