import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";

const MAX_BYTES = 6 * 1024 * 1024;

/** Расширение выводим из типа файла, а не из имени: имя приходит от клиента. */
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Нет доступа." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не передан." }, { status: 400 });
  }

  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Нужен JPG, PNG, WEBP или AVIF." },
      { status: 415 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Файл больше 6 МБ." }, { status: 413 });
  }

  // Имя генерируем сами — так исключены и обход каталога, и коллизии.
  const name = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "products", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ path: `/products/uploads/${name}` }, { status: 201 });
}
