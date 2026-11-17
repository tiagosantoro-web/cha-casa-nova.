"use client";

import { CheckIcon, ExternalIcon, GiftIcon } from "@/components/icons";
import { formatPrice, formatShortDate } from "@/lib/format";
import type { Presente } from "@/lib/types";
import { GiftImage } from "./gift-image";

type Props = {
  gift: Presente;
  categoryName: string;
  chosenByMe: boolean;
  onChoose: (gift: Presente) => void;
};

export function GiftCard({ gift, categoryName, chosenByMe, onChoose }: Props) {
  const reserved = gift.escolhido;
  const price = formatPrice(gift.preco);
  const altPrice = formatPrice(gift.outroPreco);
  const checkedAt = formatShortDate(gift.consultadoEm);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-card transition duration-300 ${
        reserved ? "border-line" : "border-transparent hover:-translate-y-1 hover:shadow-lift"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-soft">
        <div className={`size-full transition duration-500 ${reserved ? "opacity-45 grayscale" : "group-hover:scale-[1.03]"}`}>
          <GiftImage src={gift.imagem ?? null} alt={gift.nome} category={gift.categoria} />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft backdrop-blur">
          {categoryName}
        </span>
        {reserved || chosenByMe ? (
          <span className="absolute inset-x-3 bottom-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-3 py-2 text-sm font-semibold text-paper">
            <CheckIcon className="size-4" />
            {chosenByMe ? "Você escolheu este presente" : "Presente já escolhido"}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl leading-snug font-medium">{gift.nome}</h3>
        {gift.cor ? (
          <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-ink-soft">
            <span className="size-2.5 rounded-full bg-ink ring-2 ring-steel" aria-hidden />
            {gift.cor}
          </p>
        ) : null}
        {gift.descricao ? <p className="mt-3 text-[15px] leading-relaxed text-muted">{gift.descricao}</p> : null}

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-line pt-4">
            <div>
              <p className="text-xs text-muted">Preço de referência</p>
              <p className="text-lg font-semibold">{price ?? "A confirmar"}</p>
            </div>
            {gift.loja ? (
              <p className="text-right text-xs text-muted">
                {gift.loja}
                {checkedAt ? <span className="block">consultado em {checkedAt}</span> : null}
              </p>
            ) : null}
          </div>

          {gift.outroLink && gift.outraLoja ? (
            <a
              href={gift.outroLink}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-2 inline-flex items-center gap-1 text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink"
            >
              Outra opção: {gift.outraLoja}
              {altPrice ? ` · ${altPrice}` : ""}
            </a>
          ) : null}

          <div className="mt-4 grid gap-2">
            {reserved ? (
              <span className="inline-flex min-h-12 items-center justify-center rounded-full bg-stone-soft px-4 text-sm font-semibold text-muted">
                Indisponível
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onChoose(gift)}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-4 text-[15px] font-semibold text-paper transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <GiftIcon className="size-[18px]" />
                {chosenByMe ? "Enviar confirmação de novo" : "Quero presentear"}
              </button>
            )}
            {gift.link ? (
              <a
                href={gift.link}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full border border-ink/15 px-4 text-sm font-semibold transition-colors hover:border-ink/45"
              >
                Ver produto
                <ExternalIcon className="size-4" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
