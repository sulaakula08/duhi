import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";

const MAX_BYTES = 6 * 1024 * 1024;

/**
 * Тип определяем по сигнатуре в начале файла, а не по заголовку от браузера.
 *
 * Причина практическая: у .jfif Windows часто не отдаёт image/jpeg, и файл
 * отклонялся, хотя внутри обычный JPEG. Причина вторая — то, что присылает
 * клиент, вообще нельзя считать правдой.
 */
function sniff(bytes: Uint8Array): string | null {
  const has = (offset: number, ...sig: number[]) =>
    sig.every((b, i) => bytes[offset + i] === b);

  if (has(0, 0xff, 0xd8, 0xff)) return "jpg";
  if (has(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "png";

  // RIFF....WEBP
  if (has(0, 0x52, 0x49, 0x46, 0x46) && has(8, 0x57, 0x45, 0x42, 0x50)) return "webp";

  // ....ftyp + avif/avis в бренде
  if (has(4, 0x66, 0x74, 0x79, 0x70)) {
    const brand = String.fromCharCode(...bytes.slice(8, 12));
    if (brand === "avif" || brand === "avis") return "avif";
  }

  return null;
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Нет доступа." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не передан." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Файл больше 6 МБ." }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = sniff(buffer);

  if (!ext) {
    return NextResponse.json(
      { error: "Это не картинка. Подойдёт JPG, PNG, WEBP или AVIF." },
      { status: 415 },
    );
  }

  // Имя генерируем сами — так исключены и обход каталога, и совпадения.
  const name = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "products", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);

  return NextResponse.json({ path: `/products/uploads/${name}` }, { status: 201 });
}
