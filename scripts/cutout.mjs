/**
 * Вырезает фон у фотографий флаконов.
 *
 *   node scripts/cutout.mjs <входная-папка> [выходная-папка]
 *   npm run cutout -- raw-photos
 *
 * На выходе — PNG 4:5 с прозрачным фоном, поэтому одна и та же картинка
 * одинаково хорошо ложится и на светлую, и на тёмную тему.
 *
 * Как это работает. Наивный порог «убрать всё белое» съедает светлое стекло и
 * белые буквы на этикетке, потому что они тоже белые. Поэтому фон ищется
 * заливкой от краёв кадра: прозрачным становится только то, что связано с
 * границей изображения. Всё, что окружено флаконом, остаётся на месте.
 *
 * Подходит для съёмки на ровном однотонном фоне — то есть для обычного
 * каталожного кадра. Для фотографий в интерьере это работать не будет.
 */

import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const INPUT = process.argv[2] ?? "raw-photos";
const OUTPUT = process.argv[3] ?? "public/products";

/** Насколько пиксель может отличаться от фона и всё ещё считаться фоном. */
const TOLERANCE = 34;
/** Ширина мягкого края в единицах допуска — убирает «ореол» по контуру. */
const FEATHER = 26;
/**
 * Заливка не переходит через пиксели с сильным перепадом яркости.
 *
 * Без этого она протекает внутрь прозрачного стекла: оно почти того же цвета,
 * что и белый фон съёмки, и алгоритм считает его фоном. Флакон получается
 * пустым и на тёмной теме выглядит чёрным. Контур стекла даёт заметный
 * градиент — по нему заливка и останавливается.
 */
const EDGE_LIMIT = 16;
/** Отступ вокруг флакона в процентах от большей стороны. */
const PADDING = 0.06;
/** Итоговый размер. Пропорции 4:5, как у сетки карточек. */
const OUT_WIDTH = 1200;
const OUT_HEIGHT = 1500;

const SUPPORTED = new Set([".jpg", ".jpeg", ".jfif", ".png", ".webp", ".avif", ".tif", ".tiff"]);

function colorDistance(data, i, r, g, b) {
  const dr = data[i] - r;
  const dg = data[i + 1] - g;
  const db = data[i + 2] - b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/** Средний цвет четырёх углов — это и есть фон. */
function sampleBackground(data, width, height, channels) {
  const box = Math.max(2, Math.round(Math.min(width, height) * 0.02));
  const corners = [
    [0, 0],
    [width - box, 0],
    [0, height - box],
    [width - box, height - box],
  ];

  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;

  for (const [cx, cy] of corners) {
    for (let y = cy; y < cy + box; y++) {
      for (let x = cx; x < cx + box; x++) {
        const i = (y * width + x) * channels;
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        n++;
      }
    }
  }

  return { r: r / n, g: g / n, b: b / n };
}

/** Карта перепадов яркости: по ней заливка понимает, где проходит контур. */
function buildEdges(data, width, height, channels) {
  const lum = new Float32Array(width * height);
  for (let p = 0; p < width * height; p++) {
    const i = p * channels;
    lum[p] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  }

  const edge = new Float32Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p = y * width + x;
      const gx = Math.abs(lum[p - 1] - lum[p + 1]);
      const gy = Math.abs(lum[p - width] - lum[p + width]);
      edge[p] = Math.max(gx, gy);
    }
  }
  return edge;
}

/**
 * Заливка от краёв. Возвращает альфа-канал: 0 — фон, 255 — объект,
 * промежуточные значения — мягкая кромка.
 */
function buildAlpha(data, width, height, channels, bg, edge) {
  const alpha = new Uint8Array(width * height).fill(255);
  const visited = new Uint8Array(width * height);
  // Очередь на плоском массиве: у больших снимков рекурсия переполнит стек.
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const push = (x, y, fromBorder) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (visited[p]) return;
    const dist = colorDistance(data, p * channels, bg.r, bg.g, bg.b);
    if (dist > TOLERANCE + FEATHER) return;
    // Контур не переходим — иначе заливка уходит внутрь стекла.
    // Стартовые пиксели по рамке кадра пропускаем без проверки.
    if (!fromBorder && edge[p] > EDGE_LIMIT) return;

    visited[p] = 1;
    // Внутри допуска — чистый фон; дальше плавный переход к непрозрачному.
    alpha[p] = dist <= TOLERANCE ? 0 : Math.round(((dist - TOLERANCE) / FEATHER) * 255);
    queue[tail++] = p;
  };

  for (let x = 0; x < width; x++) {
    push(x, 0, true);
    push(x, height - 1, true);
  }
  for (let y = 0; y < height; y++) {
    push(0, y, true);
    push(width - 1, y, true);
  }

  while (head < tail) {
    const p = queue[head++];
    const x = p % width;
    const y = (p - x) / width;
    push(x + 1, y, false);
    push(x - 1, y, false);
    push(x, y + 1, false);
    push(x, y - 1, false);
  }

  return alpha;
}

/**
 * Возвращает внутренность силуэта заливке.
 *
 * У прозрачного стекла тот же цвет, что и у фона, и плавные переходы внутри,
 * поэтому заливка всё равно затекает в бутылку — даже с проверкой контура.
 * Приём стандартный для предметной съёмки: для каждой строки берём крайние
 * непрозрачные пиксели, для каждого столбца — тоже, и считаем объектом всё,
 * что попало и в горизонтальный, и в вертикальный промежуток. Пересечение (а
 * не объединение) важно: иначе заполнится пустота рядом с кисточкой и ручками.
 *
 * Стекло при этом сохраняет исходные светлые пиксели — и на тёмной теме
 * читается как светлый флакон, а не как чёрное пятно.
 */
function fillSilhouette(alpha, width, height) {
  const OPAQUE = 128;
  const rowMin = new Int32Array(height).fill(-1);
  const rowMax = new Int32Array(height).fill(-1);
  const colMin = new Int32Array(width).fill(-1);
  const colMax = new Int32Array(width).fill(-1);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha[y * width + x] <= OPAQUE) continue;
      if (rowMin[y] < 0) rowMin[y] = x;
      rowMax[y] = x;
      if (colMin[x] < 0) colMin[x] = y;
      colMax[x] = y;
    }
  }

  for (let y = 0; y < height; y++) {
    if (rowMin[y] < 0) continue;
    for (let x = rowMin[y]; x <= rowMax[y]; x++) {
      if (colMin[x] < 0 || y < colMin[x] || y > colMax[x]) continue;
      const p = y * width + x;
      if (alpha[p] < 255) alpha[p] = 255;
    }
  }

  return alpha;
}

/** Границы непрозрачной части, чтобы обрезать пустое поле вокруг флакона. */
function contentBounds(alpha, width, height) {
  let top = height;
  let left = width;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha[y * width + x] > 24) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }

  if (right < 0) return null;
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

async function processFile(file, outDir) {
  const image = sharp(file).rotate();
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const bg = sampleBackground(data, width, height, channels);
  const edge = buildEdges(data, width, height, channels);
  const alpha = fillSilhouette(
    buildAlpha(data, width, height, channels, bg, edge),
    width,
    height,
  );

  // Вписываем новую альфу в исходные пиксели.
  for (let p = 0; p < width * height; p++) {
    data[p * channels + 3] = Math.min(data[p * channels + 3], alpha[p]);
  }

  const bounds = contentBounds(alpha, width, height);
  if (!bounds) {
    console.warn(`  пропуск: не нашёл объект на однотонном фоне`);
    return false;
  }

  const pad = Math.round(Math.max(bounds.width, bounds.height) * PADDING);

  // Два прохода намеренно: sharp выполняет extend уже ПОСЛЕ resize, поэтому в
  // одном конвейере отступ добавился бы к готовому размеру и сломал его.
  const padded = await sharp(data, { raw: { width, height, channels } })
    .extract(bounds)
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const outFile = path.join(
    outDir,
    `${path.basename(file, path.extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.png`,
  );

  await sharp(padded)
    .resize(OUT_WIDTH, OUT_HEIGHT, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9, palette: false })
    .toFile(outFile);

  console.log(`  → ${path.relative(process.cwd(), outFile)}`);
  return true;
}

async function main() {
  let files;
  try {
    files = await readdir(INPUT);
  } catch {
    console.error(`Папка "${INPUT}" не найдена.`);
    console.error(`Положите исходные снимки туда и запустите: npm run cutout -- ${INPUT}`);
    process.exit(1);
  }

  const images = files.filter((f) => SUPPORTED.has(path.extname(f).toLowerCase()));
  if (images.length === 0) {
    console.error(`В "${INPUT}" нет изображений.`);
    process.exit(1);
  }

  await mkdir(OUTPUT, { recursive: true });
  console.log(`Обрабатываю ${images.length} шт. из "${INPUT}":`);

  let ok = 0;
  for (const name of images) {
    console.log(name);
    try {
      if (await processFile(path.join(INPUT, name), OUTPUT)) ok++;
    } catch (error) {
      console.warn(`  ошибка: ${error.message}`);
    }
  }

  console.log(`\nГотово: ${ok} из ${images.length}.`);
  console.log(`Пропишите пути к файлам в поле "photos" в lib/data/products.ts.`);
}

main();
