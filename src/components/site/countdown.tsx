"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** "Faltam X dias", calculado no navegador para não congelar na data da publicação. */
export function Countdown({ date }: { date: string | null }) {
  const days = useSyncExternalStore(
    noop,
    () => {
      if (!date) return null;
      const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
      return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
    },
    () => null,
  );

  if (days === null || days < 0) return null;
  return (
    <p className="mt-6 text-sm font-medium text-muted">
      {days === 0 ? "É hoje! Estamos esperando você." : days === 1 ? "Falta 1 dia." : `Faltam ${days} dias.`}
    </p>
  );
}
