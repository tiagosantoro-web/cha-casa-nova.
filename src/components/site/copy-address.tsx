"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";

/** Copia o endereço (para colar no Uber, 99 ou mandar para alguém). */
export function CopyAddress({ endereco }: { endereco: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(endereco);
          setCopiado(true);
          window.setTimeout(() => setCopiado(false), 2500);
        } catch {
          // Sem acesso à área de transferência: o endereço continua visível na tela.
        }
      }}
      className="mt-2 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 text-sm font-semibold text-white/75 underline decoration-white/30 underline-offset-4 hover:text-white"
      aria-live="polite"
    >
      {copiado ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
      {copiado ? "Endereço copiado!" : "Copiar endereço (para Uber ou 99)"}
    </button>
  );
}
