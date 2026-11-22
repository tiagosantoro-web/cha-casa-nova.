"use client";

import { useRef, useState } from "react";
import { CheckIcon, CopyIcon, PixIcon } from "@/components/icons";
import { evento } from "@/data/evento";
import { formatPrice } from "@/lib/format";
import { codigoPix } from "@/lib/pix";
import type { Presente } from "@/lib/types";

/** Pix "copia e cola" com o valor estimado do presente, pronto para colar no app do banco. */
export function PixBox({ gift }: { gift: Presente }) {
  const [copiado, setCopiado] = useState(false);
  const campoRef = useRef<HTMLTextAreaElement>(null);
  const codigo = codigoPix({
    chave: evento.pix.chave,
    nome: evento.pix.nome,
    cidade: evento.pix.cidade,
    valor: gift.preco,
    identificador: `CHA${gift.id}`,
  });
  const valor = formatPrice(gift.preco);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
    } catch {
      // Navegador sem acesso à área de transferência: seleciona o código para copiar à mão.
      campoRef.current?.select();
      document.execCommand?.("copy");
    }
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="mt-4 rounded-3xl border border-accent/25 bg-accent-soft/60 p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-accent-ink">
        <PixIcon className="size-5" />
        Pix {valor ? `de ${valor}` : "com valor livre"}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        {valor
          ? "Valor estimado do presente. Copie o código, abra o app do seu banco em Pix > Pix Copia e Cola e cole."
          : "Este presente ainda não tem valor estimado: copie o código e digite o valor no app do banco."}
      </p>
      <label htmlFor="pix-codigo" className="sr-only">
        Código Pix copia e cola
      </label>
      <textarea
        id="pix-codigo"
        ref={campoRef}
        readOnly
        rows={4}
        value={codigo}
        onFocus={(event) => event.currentTarget.select()}
        className="mt-3 w-full resize-none rounded-2xl border border-line bg-card px-3 py-2.5 font-mono text-xs leading-relaxed break-all text-ink-soft"
      />
      <button
        type="button"
        onClick={copiar}
        className="mt-2 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-5 text-[15px] font-semibold text-paper transition hover:bg-accent"
        aria-live="polite"
      >
        {copiado ? <CheckIcon className="size-[18px]" /> : <CopyIcon className="size-[18px]" />}
        {copiado ? "Código copiado!" : "Copiar código Pix"}
      </button>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        Recebedor: {evento.pix.nome} · chave CPF. Confira o nome no app do banco antes de pagar.
      </p>
    </div>
  );
}
