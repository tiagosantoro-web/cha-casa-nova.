"use client";

import { useConvidado } from "@/lib/convidado";

/** Saudação do convite individual ("Olá, Maria!"). Some quando o link é o geral. */
export function GuestGreeting() {
  const nome = useConvidado();
  if (!nome) return null;
  return (
    <p className="animate-rise mt-6 font-display text-2xl leading-snug text-glow sm:text-3xl">
      Olá, {nome}! <span className="text-white/85">Este convite é para você.</span>
    </p>
  );
}
