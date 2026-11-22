"use client";

import { CheckIcon, ExternalIcon, HeartIcon } from "@/components/icons";
import { formatPrice, formatShortDate } from "@/lib/format";
import type { Presente } from "@/lib/types";
import { GiftImage } from "./gift-image";

const SWATCH: [RegExp, string][] = [
  [/inox|prata|alumínio|cromado/i, "linear-gradient(135deg, #eceef0, #a9adb1)"],
  [/cinza/i, "#9a9da1"],
  [/branc/i, "#ffffff"],
  [/vidro|transparente/i, "linear-gradient(135deg, #ffffff, #cfe3ee)"],
  [/pret/i, "#1d1d1f"],
];

/** Bolinha de cor: metade de cada cor quando há duas (ex.: "Preto e inox"). */
function swatch(cor: string): string {
  const found = cor
    .split(/\s+e\s+/i)
    .map((part) => SWATCH.find(([pattern]) => pattern.test(part))?.[1])
    .filter((value): value is string => Boolean(value));
  if (!found.length) return "#1d1d1f";
  if (found.length === 1) return found[0];
  const solid = (value: string) => (value.startsWith("linear") ? "#b9bdc1" : value);
  return `linear-gradient(90deg, ${solid(found[0])} 50%, ${solid(found[1])} 50%)`;
}

type Props = {
  gift: Presente;
  categoryName: string;
  chosenByMe: boolean;
  onChoose: (gift: Presente) => void;
};

export function GiftCard({ gift, categoryName, chosenByMe, onChoose }: Props) {
  // O presente que o próprio visitante reservou continua com o botão para reenviar a confirmação.
  const reserved = gift.escolhido && !chosenByMe;
  // Escolhido por alguém (inclusive pelo próprio visitante): o cartão inteiro fica cinza.
  const taken = gift.escolhido || chosenByMe;
  const price = formatPrice(gift.preco);
  const altPrice = formatPrice(gift.outroPreco);
  const checkedAt = formatShortDate(gift.consultadoEm);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-[1.75rem] border shadow-card transition duration-300 ${
        taken ? "border-line bg-stone-soft shadow-none" : "border-line/60 bg-card hover:-translate-y-1 hover:shadow-lift"
      }`}
    >
      <div className={`relative isolate aspect-[4/3] overflow-hidden border-b border-line/70 ${taken ? "bg-stone-soft" : "bg-white"}`}>
        {/* Multiplicar faz o fundo branco das fotos sumir no cinza do cartão. */}
        <div className={`size-full transition duration-500 ${taken ? "opacity-50 grayscale mix-blend-multiply" : "group-hover:scale-[1.04]"}`}>
          <GiftImage src={gift.imagem ?? null} alt={gift.nome} category={gift.categoria} />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-stone-soft/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
          {categoryName}
        </span>
        {gift.imagem && gift.imagemDaOutraOpcao && !reserved && !chosenByMe ? (
          <span className="absolute bottom-2 right-3 text-[11px] text-muted">Foto da outra opção</span>
        ) : null}
        {reserved || chosenByMe ? (
          <span
            className={`absolute inset-x-3 bottom-3 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold ${
              chosenByMe ? "bg-steel-dark text-white" : "bg-ink-soft text-paper"
            }`}
          >
            <CheckIcon className="size-4" />
            {chosenByMe ? "Você escolheu este presente" : "Presente já escolhido"}
          </span>
        ) : null}
      </div>

      <div className={`flex flex-1 flex-col p-5 transition duration-500 ${taken ? "opacity-60 grayscale" : ""}`}>
        <h3 className="font-display text-xl leading-snug font-medium">{gift.nome}</h3>
        {gift.cor ? (
          <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-stone-soft px-2.5 py-1 text-xs font-medium text-ink-soft">
            <span className="size-3 rounded-full ring-1 ring-ink/20" style={{ background: swatch(gift.cor) }} aria-hidden />
            {gift.cor}
          </p>
        ) : null}
        {gift.descricao ? <p className="mt-3 text-[15px] leading-relaxed text-muted">{gift.descricao}</p> : null}

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-line pt-4 text-xs text-muted">
            <p>
              Valor de referência
              <span className="block text-base font-semibold text-ink">{price ?? "A confirmar"}</span>
            </p>
            {gift.loja ? (
              <p className="text-right">
                {gift.loja}
                {checkedAt ? <span className="block">consultado em {checkedAt}</span> : null}
              </p>
            ) : null}
          </div>

          <div className="mt-4 grid gap-2">
            {reserved ? (
              <span className="inline-flex min-h-12 items-center justify-center rounded-full bg-stone-soft px-4 text-sm font-semibold text-muted">
                Indisponível
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onChoose(gift)}
                className={`inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-[15px] font-semibold transition active:translate-y-0 ${
                  chosenByMe
                    ? "border border-steel-dark/40 bg-transparent text-ink-soft hover:bg-white"
                    : "bg-ink text-paper hover:-translate-y-0.5 hover:bg-accent"
                }`}
              >
                <HeartIcon className="size-[18px]" />
                {chosenByMe ? "Enviar confirmação de novo" : "Escolher este presente"}
              </button>
            )}
            {gift.link ? (
              <div className="flex flex-col items-center text-sm">
                <a
                  href={gift.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink-soft underline decoration-line underline-offset-4 hover:text-ink"
                >
                  Ver sugestão na loja
                  <ExternalIcon className="size-4" />
                </a>
                {gift.outroLink && gift.outraLoja ? (
                  <a
                    href={gift.outroLink}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="py-1 text-center text-xs text-muted underline decoration-line underline-offset-4 hover:text-ink"
                  >
                    Outra opção: {gift.outraLoja}
                    {altPrice ? ` · ${altPrice}` : ""}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
