import { evento } from "@/data/evento";

/** true quando o endereço do Apps Script de reservas foi configurado em evento.ts. */
export const reservasAtivas = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(evento.reservasUrl);
