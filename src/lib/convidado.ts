"use client";

import { useSyncExternalStore } from "react";
import { cleanText } from "./format";

/**
 * Convite individual: o link leva o nome do convidado, ex.: ?para=Maria%20Silva.
 * Lido só no navegador (o site é estático), sem salvar nada.
 */
function lerConvidado(): string {
  try {
    return cleanText(new URLSearchParams(window.location.search).get("para") ?? "", 80);
  } catch {
    return "";
  }
}

const semInscricao = () => () => {};

/** Nome do convidado vindo do link, ou "" quando o link é o geral. */
export function useConvidado(): string {
  return useSyncExternalStore(semInscricao, lerConvidado, () => "");
}
