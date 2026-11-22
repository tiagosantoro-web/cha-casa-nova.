import { ExternalIcon, HeartIcon } from "@/components/icons";
import { publicPath } from "@/lib/paths";
import { PresenceButton } from "./presence-button";
import { Reveal } from "./reveal";

const CARRO_URL =
  "https://www.webmotors.com.br/comprar/bmw/m2/30-24v-i6-gasolina-competition-coupe-m-dct/2-portas/2018-2019/82428376";

/** Piada no meio da lista (depois da categoria do meio): não entra nas reservas nem na contagem de presentes. */
export function CarJoke() {
  return (
    <Reveal>
      <article id="carro" className="scroll-mt-28 night-sky relative overflow-hidden rounded-[2rem] text-white shadow-lift">
        <div className="grid lg:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-[16/10] lg:aspect-auto">
            {/* eslint-disable-next-line @next/next/no-img-element -- site estático, imagem em /public */}
            <img
              src={publicPath("/carro.jpg")}
              alt="BMW M2 Competition vermelha estacionada"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-[75%_60%]"
            />
            <span className="absolute left-3 top-3 rounded-full bg-glow px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
              Sugestão bônus
            </span>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Uma pausa na lista</p>
            <h3 className="mt-2 font-display text-3xl leading-tight font-medium text-balance">
              Chegou até aqui e ainda não gostou de nada?
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-white/80">
              Tudo bem, a gente entende. Para esses casos, temos uma sugestão alternativa: uma{" "}
              <strong className="font-semibold text-white">BMW M2 Competition 2019</strong>. Aceitamos com laço vermelho
              e tanque cheio. 😅
            </p>

            <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/15 pt-4 text-xs text-white/60">
              <p>
                Valor de referência
                <span className="block text-base font-semibold text-white">Melhor nem olhar</span>
              </p>
              <p className="text-right">Webmotors</p>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <a
                href={CARRO_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-[15px] font-semibold text-ink transition hover:-translate-y-0.5"
              >
                Ver o carro
                <ExternalIcon className="size-4" />
              </a>
              <PresenceButton className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-[15px] font-semibold text-white transition-colors hover:border-white/50">
                <HeartIcon className="size-[18px]" />
                Prefiro só ir à festa
              </PresenceButton>
            </div>
            <p className="mt-4 text-sm text-white/60">Brincadeira! Sua presença já é o melhor presente.</p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
