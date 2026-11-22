"use client";

import { Fragment, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { CategoryIcon, HeartIcon } from "@/components/icons";
import { categorias, presentes as listaDePresentes } from "@/data/presentes";
import { useReservas } from "@/lib/reservas";
import { CarJoke } from "./car-joke";
import { GiftCard } from "./gift-card";
import { Reveal } from "./reveal";
import { PRESENCE_EVENT, PresenceButton } from "./presence-button";
import { ReserveDialog, type Selecao } from "./reserve-dialog";

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

export function GiftRegistry({ fotos }: { fotos: Record<string, string> }) {
  // Item sem "imagem" nos dados usa a foto salva com o id dele em public/presentes/.
  // Também fica indisponível o que outro convidado já reservou na planilha.
  const reservados = useReservas();
  const presentes = useMemo(
    () =>
      listaDePresentes.map((gift) => ({
        ...gift,
        imagem: gift.imagem ?? fotos[gift.id],
        escolhido: gift.escolhido || reservados.includes(gift.id),
      })),
    [fotos, reservados],
  );
  const [active, setActive] = useState<string>("todos");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selected, setSelected] = useState<Selecao | null>(null);
  // true = o convidado abriu pelo "Em dúvida? Presentear com Pix".
  const [pixInicial, setPixInicial] = useState(false);
  const rawChoices = useSyncExternalStore(subscribeChoices, readRawChoices, () => "[]");
  const myChoices = useMemo(() => parseChoices(rawChoices), [rawChoices]);

  // Botões "Confirmar presença" de outras seções abrem a mesma janela, sem presente.
  useEffect(() => {
    const openPresence = () => {
      setPixInicial(false);
      setSelected("presenca");
    };
    window.addEventListener(PRESENCE_EVENT, openPresence);
    return () => window.removeEventListener(PRESENCE_EVENT, openPresence);
  }, []);

  const categoryName = useMemo(() => new Map(categorias.map((category) => [category.slug, category.nome])), []);
  const chosenGifts = presentes.filter((gift) => myChoices.includes(gift.id));

  const visibleCategories = categorias.filter((category) => active === "todos" || category.slug === active);
  const giftsFor = (slug: string) =>
    presentes.filter((gift) => gift.categoria === slug && (!onlyAvailable || !gift.escolhido));

  return (
    <section id="presentes" className="scroll-mt-4 bg-paper pb-24 pt-16 sm:pt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              Lista de presentes
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight font-medium text-balance sm:text-5xl">
              Algumas ideias para o nosso cantinho
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Se quiser nos presentear, separamos sugestões em <strong className="font-semibold text-ink">preto e inox</strong>,
              as cores da casa nova. Os links são só referências: fique à vontade para comprar onde preferir.
            </p>
          </div>
          <aside className="rounded-[1.75rem] border border-accent/20 bg-accent-soft p-5">
            <p className="flex items-center gap-2 font-display text-xl font-medium text-ink">
              <HeartIcon className="size-5 text-accent" />
              Presente é opcional
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              Sua presença já é o melhor presente. Se preferir, é só confirmar que vem.
            </p>
            <PresenceButton className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-ink/15 bg-card px-5 text-[15px] font-semibold transition-colors hover:border-ink/40">
              Só confirmar presença
            </PresenceButton>
          </aside>
        </div>

        {chosenGifts.length ? (
          <p className="mt-8 rounded-2xl border border-ok/20 bg-ok-soft px-5 py-4 text-ok">
            Você escolheu: <strong>{chosenGifts.map((gift) => gift.nome).join(", ")}</strong>. Obrigado pelo carinho!
          </p>
        ) : null}

        {/* Filtros: rolam na horizontal no celular e ficam presos ao topo. */}
        <div className="sticky top-0 z-20 -mx-5 mt-10 border-b border-line/80 bg-paper/85 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
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
          <label className="mt-2 inline-flex min-h-8 cursor-pointer items-center gap-2 text-sm font-medium text-ink-soft">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(event) => setOnlyAvailable(event.target.checked)}
              className="size-4 accent-accent"
            />
            Mostrar só os disponíveis
          </label>
        </div>

        <div className="mt-10 space-y-16">
          {visibleCategories.map((category, categoryIndex) => {
            const list = giftsFor(category.slug);
            const total = presentes.filter((gift) => gift.categoria === category.slug);
            if (!total.length) return null;
            const free = total.filter((gift) => !gift.escolhido).length;
            // A piada do carro entra no meio da lista (depois da categoria do meio).
            const piadaAqui = categoryIndex === Math.max(0, Math.ceil(visibleCategories.length / 2) - 1);
            return (
              <Fragment key={category.slug}>
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl border border-line bg-card text-ink">
                    <CategoryIcon slug={category.slug} className="size-6" />
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
                    {list.map((gift, index) => (
                      <Reveal key={gift.id} delay={(index % 3) * 90} className="h-full">
                        <GiftCard
                          gift={gift}
                          categoryName={categoryName.get(gift.categoria) ?? ""}
                          chosenByMe={myChoices.includes(gift.id)}
                          onChoose={(escolhido) => {
                            setPixInicial(false);
                            setSelected(escolhido);
                          }}
                          onChoosePix={(escolhido) => {
                            setPixInicial(true);
                            setSelected(escolhido);
                          }}
                        />
                      </Reveal>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-line px-5 py-6 text-muted">
                    Todos os presentes desta categoria já foram escolhidos. Obrigado!
                  </p>
                )}
              </div>
              {piadaAqui ? <CarJoke /> : null}
              </Fragment>
            );
          })}
        </div>

      </div>

      <ReserveDialog
        selection={selected}
        pixInicial={pixInicial}
        alreadyMine={selected !== null && selected !== "presenca" && myChoices.includes(selected.id)}
        onClose={() => setSelected(null)}
        onConfirmed={(gift) => saveChoice(gift.id)}
      />
    </section>
  );
}
