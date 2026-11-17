"use client";

import type { ReactNode } from "react";

/** Evento que abre a janela de confirmação só de presença (escutado pela lista de presentes). */
export const PRESENCE_EVENT = "cha-casa-nova:confirmar-presenca";

export function PresenceButton({ className, children }: { className: string; children: ReactNode }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(PRESENCE_EVENT))} className={`cursor-pointer ${className}`}>
      {children}
    </button>
  );
}
