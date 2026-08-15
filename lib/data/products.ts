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
  description: string;
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

export const FAMILY_COPY: Record<Family, string> = {
  floral: "Лепестки, пыльца и воздух над садом.",
  woody: "Сухое дерево, смола и лесная подстилка.",
  oriental: "Амбра, ладан и пряности вплотную к коже.",
  fresh: "Цитрусовая корка, солёный воздух, холодные стебли.",
  gourmand: "Сахар, дым и что-то тёплое из духовки.",
};

function gallery(name: string): { view: string; alt: string }[] {
  return [
    { view: "bottle", alt: `Флакон ${name} прямо в кадре, на тёплом нейтральном фоне` },
    { view: "angle", alt: `Флакон ${name} вполоборота, свет ложится по одной грани` },
    { view: "detail", alt: `Крупно: крышка и плечо флакона ${name}` },
    { view: "still", alt: `${name} в натюрморте, мягкая дневная тень` },
  ];
}

const products: Product[] = [
  {
    id: "eld-01",
    slug: "vesper-bloom",
    name: "Vesper Bloom",
    subtitle: "Тубероза на закате",
    gender: "women",
    family: "floral",
    description:
      "Белый цветок, который раскрывается только затемно. Начинается прохладно и зелено, потом теплеет до туберозы со сливками и ложится на кожу, как задержанное дыхание.",
    story:
      "Всё началось с вопроса: чем пахнет сад через час после того, как все ушли в дом. Зелень в начале нарочно горчит — чтобы тубероза дальше воспринималась как облегчение, а не как заявление.",
    notes: {
      top: ["Зелёный мандарин", "Растёртый лист инжира", "Розовый перец"],
      heart: ["Абсолю туберозы", "Жасмин самбак", "Ирисовое масло"],
      base: ["Сливочный сандал", "Белый мускус", "Бензоин"],
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
    subtitle: "Корень, дым и холодное железо",
    gender: "men",
    family: "woody",
    description:
      "Гаитянский ветивер, с которого сняли всю сладость и оставили стоять в темноте. Сухой, минеральный, неторопливый, с ниткой дыма, которая так и не уходит из комнаты.",
    story:
      "Обычно ветивер уводят в цитрус, чтобы он был приветливее. Здесь его увели в землю, из которой корень вытащили: сырая почва, холодный камень и металлический край ножа.",
    notes: {
      top: ["Цедра бергамота", "Чёрный перец", "Можжевельник"],
      heart: ["Гаитянский ветивер", "Кипарис", "Сушёный табачный лист"],
      base: ["Корень ветивера", "Берёзовый дёготь", "Серая амбра"],
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
    subtitle: "Соль на тёплой коже",
    gender: "women",
    family: "fresh",
    description:
      "Последний час жаркого дня у воды. Горькие цитрусы, морская соль и мягкий мускус, из-за которого кажется, что запах идёт от вас, а не из флакона.",
    story:
      "Сладости здесь почти нет, поэтому аромат читается как чистый, а не как фруктовый. Соль работает тихо, но держит всю конструкцию: уберите её — и цитрус рассыплется за час.",
    notes: {
      top: ["Сицилийский лимон", "Корка грейпфрута", "Морская соль"],
      heart: ["Нероли", "Прибрежный розмарин", "Ирис"],
      base: ["Плавник", "Семена амбретты", "Чистый мускус"],
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
    subtitle: "Утро после костра",
    gender: "men",
    family: "woody",
    description:
      "Холодная зола, сухой кедр и след смолы. Издалека Cendre молчит, вблизи — рассказывает подробности. Для тех, кто предпочитает, чтобы их находили, а не слышали.",
    story:
      "Задание звучало так: камин через двенадцать часов после того, как он погас. Ни огня, ни гари — только серый порошок и уцелевшее дерево. Основную работу делают гваяк и сдержанный дымный аккорд.",
    notes: {
      top: ["Элеми", "Серый кардамон", "Розовый перец"],
      heart: ["Гваяковое дерево", "Кедр", "Ладанный дым"],
      base: ["Кашмеран", "Лабданум", "Пепел ветивера"],
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
    subtitle: "Мёд, табак, жжёный сахар",
    gender: "women",
    family: "gourmand",
    description:
      "Тёмный мёд, вылитый на табачный лист. Да, сладко — но снизу идёт горечь, которая не даёт этому стать десертом.",
    story:
      "Гурманские ароматы обычно останавливаются на «приятно». Miel Noir идёт дальше: карамель здесь доведена чуть дальше, чем следовало бы. Вся соль — именно на грани пригорелого.",
    notes: {
      top: ["Красный апельсин", "Шафран", "Абсолю рома"],
      heart: ["Каштановый мёд", "Табачный лист", "Иммортель"],
      base: ["Жжёный сахар", "Бобы тонка", "Сандал"],
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
    subtitle: "Дымчатое стекло и сухая груша",
    gender: "unisex",
    family: "woody",
    description:
      "Прохладный, полупрозрачный, чуть дымный. Груша, которую оставили у огня: сначала фрукт, потом минерал, потом долгое сухое дерево почти на весь день.",
    story:
      "Назван по стеклу, в которое разлит. Состав повторяет материал: сквозь него видно, но всё за ним меняет цвет.",
    notes: {
      top: ["Сухая груша", "Лист фиалки", "Бергамот"],
      heart: ["Копчёный чай", "Корень ириса", "Кедр"],
      base: ["Ветивер", "Амброксан", "Серый мускус"],
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
    subtitle: "Роза, из которой убрали сладость",
    gender: "women",
    family: "floral",
    description:
      "Турецкая роза, увезённая куда-то, где холоднее. Перечная, слегка пыльная, разрезанная ладаном — цветок читается как архитектура, а не как романтика.",
    story:
      "Ориентир был такой: роза, оставленная на ночь в каменной церкви. Дамасская роза ведёт цветок, а ирис и намёк на ладан делают так, что ему там уместно.",
    notes: {
      top: ["Розовый перец", "Почка чёрной смородины", "Личи"],
      heart: ["Турецкая роза", "Абсолю дамасской розы", "Ирис"],
      base: ["Ладан", "Пачули", "Мягкая кожа"],
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
    subtitle: "Железное дерево и чёрный чай",
    gender: "men",
    family: "woody",
    description:
      "Жёсткий, сухой, с лёгкой горчинкой. Построен на древесном аккорде, в котором нет ни грамма сливочности; сверху его поднимают чёрный чай и зелёный кардамон.",
    story:
      "Упражнение на сдержанность. Каждый сладкий материал, который пробовали в базу, делал аромат приятнее и незапоминающимся, — поэтому в итоге не осталось ни одного.",
    notes: {
      top: ["Зелёный кардамон", "Грейпфрут", "Мускатный орех"],
      heart: ["Чёрный чай", "Кипарис", "Мускатный шалфей"],
      base: ["Аккорд железного дерева", "Дубовый мох", "Сухая амбра"],
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
    subtitle: "Амбра за занавеской",
    gender: "women",
    family: "oriental",
    description:
      "Тёплая амбра, нарочно оставленная не в фокусе. Ваниль и лабданум на месте, но их закрывают ирис и пудровый мускус, поэтому вперёд не выходит ничего.",
    story:
      "Весь состав — про размытость. Материалы, которые обычно заостряют, здесь наоборот смягчали. Отсюда и скромный шлейф при выдающейся стойкости.",
    notes: {
      top: ["Бергамот", "Семена кориандра", "Давана"],
      heart: ["Ирис", "Майская роза", "Гелиотроп"],
      base: ["Лабданум", "Бурбонская ваниль", "Пудровый мускус"],
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
    subtitle: "Горький апельсин на рассвете",
    gender: "unisex",
    family: "floral",
    description:
      "Нероли, взятое в самой зелёной и наименее сахарной точке. Петитгрейн добавляет резкости, а медовый апельсиновый цвет проступает снизу минут через двадцать.",
    story:
      "Смешали три разных нероли вместо одного — зелёное тунисское, медовое египетское и мыльное марокканское. Ни одна перегонка по отдельности не держала одновременно горечь и тепло.",
    notes: {
      top: ["Петитгрейн", "Горький апельсин", "Зелёный мандарин"],
      heart: ["Нероли", "Абсолю апельсинового цвета", "Жимолость"],
      base: ["Белый мускус", "Пчелиный воск", "Светлое дерево"],
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
    subtitle: "Холодный ладан, высокие потолки",
    gender: "unisex",
    family: "oriental",
    description:
      "Ладан, взятый как свежая нота, а не как тяжёлая. Лимонная яркость сверху, смола в середине и тихая минеральность ещё на несколько часов.",
    story:
      "Ладан обычно уводят либо в церковь, либо в дым. Здесь выбрали третье направление — холодную, почти цитрусовую грань хорошей смолы, и почти ничем её не прикрыли.",
    notes: {
      top: ["Смола ладана", "Розовый грейпфрут", "Элеми"],
      heart: ["Олибанум", "Кипарис", "Дягиль"],
      base: ["Аккорд холодного камня", "Амбретта", "Сухой кедр"],
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
    subtitle: "Кожа, выделанная солью",
    gender: "men",
    family: "oriental",
    description:
      "Мягкая замшевая кожа, в которую втёрли соль. Не косуха, а скорее перчатка, которую носили каждый день лет десять.",
    story:
      "Хотелось обойтись без привычной для кожи скорописи из дёгтя и дыма. Соль не даёт замше уйти в сладость, а заменитель кастореума добавляет ощущение кожи — уже человеческой.",
    notes: {
      top: ["Морская соль", "Бергамот", "Чёрный перец"],
      heart: ["Аккорд замши", "Ирис", "Лист фиалки"],
      base: ["Мягкая кожа", "Тонка", "Аккорд амбры"],
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
    subtitle: "Инжир: лист, молочко и кора",
    gender: "unisex",
    family: "fresh",
    description:
      "Всё дерево целиком, а не плод: горький зелёный лист, млечный сок, тёплая кора и только намёк на что-то съедобное.",
    story:
      "Инжирные ароматы обычно оказываются кокосом под другим именем. Здесь на первом плане оставили сок и горечь, поэтому сладость приходит поздно и остаётся небольшой.",
    notes: {
      top: ["Лист инжира", "Зелёный миндаль", "Лимон"],
      heart: ["Млечный сок инжира", "Кокосовое дерево", "Мастика"],
      base: ["Кора инжира", "Кедр", "Мягкий мускус"],
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
    subtitle: "Трубочный табак и сушёная слива",
    gender: "men",
    family: "gourmand",
    description:
      "Сладкий, плотный и безусловно зимний. Трубочный табак, настоянный на сухофруктах и роме, со специями ровно в том количестве, чтобы это не превратилось в сироп.",
    story:
      "Единственный откровенно щедрый аромат в линии. Его оставили потому, что дому, построенному на сдержанности, нужна была одна вещь, которая просто получает удовольствие.",
    notes: {
      top: ["Сушёная слива", "Кора корицы", "Ром"],
      heart: ["Трубочный табак", "Сушёный инжир", "Какао-крупка"],
      base: ["Бобы тонка", "Абсолю ванили", "Пачули"],
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
 * только для локальной проверки вёрстки. Публиковать в таком виде нельзя.
 *
 * Как убрать: удалить этот блок целиком, файлы из public/products/ и папку
 * raw-photos/. Товары молча вернутся к рисованным флаконам.
 * ═══════════════════════════════════════════════════════════════════════════ */

// Снимков всего семь, а товаров четырнадцать, поэтому на вторую половину
// каталога кадры назначены повторно — по близкому цвету стекла. Для проверки
// вёрстки этого достаточно; с настоящей съёмкой у каждого будет свой.
const P = "/products/_demo-";

const DEMO_PHOTOS: Record<string, string> = {
  // Свои кадры.
  "vesper-bloom": `${P}vesper-bloom-1.png`,
  "noir-vetiver": `${P}noir-vetiver-1.png`,
  "ile-blanche": `${P}ile-blanche-1.png`,
  cendre: `${P}cendre-1.png`,
  "verre-fume": `${P}verre-fume-1.png`,
  "rose-cendree": `${P}rose-cendree-1.png`,
  "tabac-or": `${P}tabac-or-1.png`,

  // Повторы.
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
  // Один и тот же кадр во все четыре слота галереи: снимок пока только один,
  // а смешивать фото с рисованными ракурсами в одной галерее некрасиво.
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
