import { readdirSync } from "node:fs";
import { join, parse } from "node:path";

const EXTENSOES = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Fotos salvas em public/presentes/ com o id do item no nome (ex.: air-fryer.jpg).
 * Lido na hora do build: basta salvar o arquivo e gerar o site de novo.
 */
export function fotosDosPresentes(): Record<string, string> {
  try {
    return Object.fromEntries(
      readdirSync(join(process.cwd(), "public", "presentes"))
        .filter((file) => EXTENSOES.includes(parse(file).ext.toLowerCase()))
        .map((file) => [parse(file).name, `/presentes/${file}`]),
    );
  } catch {
    return {};
  }
}
