"use client";

import { useEffect, useSyncExternalStore } from "react";
import { evento } from "@/data/evento";
import { reservasAtivas } from "./reservas-ativas";

/**
 * Reservas compartilhadas entre todos os convidados, guardadas numa planilha do Google
 * (veja google-apps-script/reservas.gs). Sem `reservasUrl`, o site funciona só com o
 * `escolhido` marcado à mão em presentes.ts.
 */
export { reservasAtivas };

const ATUALIZAR_A_CADA = 30_000;
const EVENTO = "cha-casa-nova:reservas";
let reservados: string[] = [];

function definir(ids: unknown) {
  if (!Array.isArray(ids)) return;
  const lista = ids.filter((id): id is string => typeof id === "string").sort();
  if (lista.join() === reservados.join()) return;
  reservados = lista;
  window.dispatchEvent(new Event(EVENTO));
}

export async function carregarReservas(): Promise<void> {
  if (!reservasAtivas) return;
  try {
    const resposta = await fetch(evento.reservasUrl, { cache: "no-store" });
    const dados = await resposta.json();
    if (dados?.ok) definir(dados.escolhidos);
  } catch {
    // Sem conexão: mantém a última lista conhecida e tenta de novo na próxima atualização.
  }
}

export type ResultadoReserva = "ok" | "ja-escolhido" | "erro";

/** Reserva o presente na planilha. Só uma pessoa consegue reservar cada item. */
export async function reservarPresente(id: string): Promise<ResultadoReserva> {
  try {
    // text/plain evita a checagem prévia de CORS, que o Apps Script não responde.
    const resposta = await fetch(evento.reservasUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ id }),
    });
    const dados = await resposta.json();
    definir(dados?.escolhidos);
    if (dados?.ok) return "ok";
    return dados?.motivo === "ja-escolhido" ? "ja-escolhido" : "erro";
  } catch {
    return "erro";
  }
}

function inscrever(callback: () => void) {
  window.addEventListener(EVENTO, callback);
  return () => window.removeEventListener(EVENTO, callback);
}

/** Ids reservados por qualquer convidado, atualizados a cada 30 s e ao voltar para a aba. */
export function useReservas(): string[] {
  useEffect(() => {
    if (!reservasAtivas) return;
    carregarReservas();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") carregarReservas();
    }, ATUALIZAR_A_CADA);
    const aoVoltar = () => {
      if (document.visibilityState === "visible") carregarReservas();
    };
    document.addEventListener("visibilitychange", aoVoltar);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", aoVoltar);
    };
  }, []);
  return useSyncExternalStore(inscrever, () => reservados, () => reservados);
}
