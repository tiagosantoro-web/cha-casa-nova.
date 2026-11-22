// Atualiza a lista de presentes dentro de google-apps-script/reservas.gs a partir de src/data/presentes.ts.
// Uso: npm run planilha  (depois, cole o reservas.gs de novo no Apps Script e implante uma nova versão).
import { readFileSync, writeFileSync } from "node:fs";
import { presentes, categorias } from "../src/data/presentes.ts";

const arquivo = new URL("../google-apps-script/reservas.gs", import.meta.url);
const nomeDaCategoria = Object.fromEntries(categorias.map((c) => [c.slug, c.nome]));

const linhas = presentes.map((p) => "  " + JSON.stringify([p.id, nomeDaCategoria[p.categoria] ?? p.categoria, p.nome, p.preco ?? null]) + ",");
const bloco = ["// INICIO-PRESENTES", "const PRESENTES = [", ...linhas, "];", "// FIM-PRESENTES"].join("\n");

const original = readFileSync(arquivo, "utf8");
const crlf = original.includes("\r\n");
const texto = original.replace(/\r\n/g, "\n");
const novo = texto.replace(/\/\/ INICIO-PRESENTES[\s\S]*?\/\/ FIM-PRESENTES/, bloco);
if (novo === texto && !texto.includes(bloco)) throw new Error("Marcadores INICIO-PRESENTES/FIM-PRESENTES não encontrados.");
writeFileSync(arquivo, crlf ? novo.replace(/\n/g, "\r\n") : novo);
console.log(`${presentes.length} presentes gravados em google-apps-script/reservas.gs`);
