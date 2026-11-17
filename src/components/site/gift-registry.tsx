"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { CategoryIcon } from "@/components/icons";
import { categorias, presentes } from "@/data/presentes";
import type { Presente } from "@/lib/types";
import { GiftCard } from "./gift-card";
import { ReserveDialog } from "./reserve-dialog";

const STORAGE_KEY = "cha-casa-nova:minhas-escolhas";
const CHOICES_EVENT = "cha-casa-nova:escolhas";
let memoryChoices = "[]";

// Lembra neste aparelho os presentes que o visitante confirmou.
function readRawChoices(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? memoryChoices;
  } catch {
    return memoryChoices;
  }
}

function parseChoices(raw: string): string[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function saveChoice(giftId: string) {
  memoryChoices = JSON.stringify([...new Set([...parseChoices(readRawChoices()), giftId])]);
  try {
    window.localStorage.setItem(STORAGE_KEY, memoryChoices);
  } catch {
    // Armazenamento indisponível (modo privado): lembra só enquanto a página estiver aberta.
  }
  window.dispatchEvent(new Event(CHOICES_EVENT));
}

function subscribeChoices(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHOICES_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHOICES_EVENT, callback);
  };
}

export function GiftRegistry() {
  const [active, setActive] = useState<string>("todos");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selected, setSelected] = useState<Presente | null>(null);
  const rawChoices = useSyncExternalStore(subscribeChoices, readRawChoices, () => "[]");
  const myChoices = useMemo(() => parseChoices(rawChoices), [rawChoices]);

  const categoryName = useMemo(() => new Map(categorias.map((category) => [category.slug, category.nome])), []);
  const available = presentes.filter((gift) => !gift.escolhido).length;
  const chosenGifts = presentes.filter((gift) => myChoices.includes(gift.id));

  const visibleCategories = categorias.filter((category) => active === "todos" || category.slug === active);
  const giftsFor = (slug: string) =>
    presentes.filter((gift) => gift.categoria === slug && (!onlyAvailable || !gift.escolhido));

  return (
    <section id="presentes" className="scroll-mt-4 border-t border-line bg-card/60 pb-24 pt-16 sm:pt-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Nossa lista de presentes</p>
            <h2 className="mt-3 font-display text-4xl leading-tight font-medium text-balance sm:text-5xl">
              Escolha um presente para o nosso cantinho
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Estamos montando a casa em <strong className="font-semibold text-ink">preto e inox</strong>, e as sugestões
              seguem essa combinação. Os links são só referências: compre onde preferir, desde que mantenha a cor.
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-card px-5 py-4 shadow-card">
            <p className="text-3xl font-semibold tabular-nums">
              {available}
              <span className="text-lg font-medium text-muted">/{presentes.length}</span>
            </p>
            <p className="text-sm text-muted">presentes disponíveis</p>
          </div>
        </div>

        {chosenGifts.length ? (
          <p className="mt-8 rounded-2xl border border-ok/20 bg-ok-soft px-5 py-4 text-ok">
            Você escolheu: <strong>{chosenGifts.map((gift) => gift.nome).join(", ")}</strong>. Obrigado!
          </p>
        ) : null}

        {/* Filtros: rolam na horizontal no celular e ficam presos ao topo. */}
        <div className="sticky top-0 z-20 -mx-5 mt-10 border-b border-line bg-paper/90 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
          <div className="-my-1 flex gap-2 overflow-x-auto py-1 [scrollbar-width:none]" role="group" aria-label="Filtrar por categoria">
            {[{ slug: "todos", nome: "Todos" }, ...categorias].map((category) => {
              const selectedTab = active === category.slug;
              return (
                <button
                  key={category.slug}
                  type="button"
                  aria-pressed={selectedTab}
                  onClick={() => setActive(category.slug)}
                  className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
                    selectedTab ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink-soft hover:border-ink/40"
                  }`}
                >
                  {category.slug !== "todos" ? <CategoryIcon slug={category.slug} className="size-4" /> : null}
                  {category.nome}
                </button>
              );
            })}
          </div>
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-soft">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(event) => setOnlyAvailable(event.target.checked)}
              className="size-4 accent-ink"
            />
            Mostrar só os disponíveis
          </label>
        </div>

        <div className="mt-10 space-y-16">
          {visibleCategories.map((category) => {
            const list = giftsFor(category.slug);
            const total = presentes.filter((gift) => gift.categoria === category.slug);
            if (!total.length) return null;
            const free = total.filter((gift) => !gift.escolhido).length;
            return (
              <div key={category.slug}>
                <div className="mb-6 flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-ink text-paper">
                    <CategoryIcon slug={category.slug} className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-medium">{category.nome}</h3>
                    <p className="text-sm text-muted">
                      {free} de {total.length} disponíveis
                    </p>
                  </div>
                </div>
                {list.length ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((gift) => (
                      <GiftCard
                        key={gift.id}
                        gift={gift}
                        categoryName={categoryName.get(gift.categoria) ?? ""}
                        chosenByMe={myChoices.includes(gift.id)}
                        onChoose={setSelected}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-line px-5 py-6 text-muted">
                    Todos os presentes desta categoria já foram escolhidos. Obrigado!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ReserveDialog gift={selected} onClose={() => setSelected(null)} onConfirmed={(gift) => saveChoice(gift.id)} />
    </section>
  );
}
