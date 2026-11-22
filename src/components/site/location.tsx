import { CalendarIcon, ClockIcon, ExternalIcon, PinIcon } from "@/components/icons";
import { evento } from "@/data/evento";
import { formatEventDate, formatEventTime, mapaEmbedUrl, mapsUrl } from "@/lib/format";
import { CopyAddress } from "./copy-address";
import { Reveal } from "./reveal";

/** Localização em destaque: endereço grande, mapa e atalhos para Google Maps e Waze. */
export function Location() {
  if (!evento.endereco) return null;
  const endereco = evento.endereco;
  const [rua, ...resto] = endereco.split(" - ");
  const date = formatEventDate(evento.data);
  const inicio = formatEventTime(evento.horario);
  const fim = formatEventTime(evento.programacao.at(-1)?.fim ?? null);
  const mapa = mapaEmbedUrl(endereco);
  const waze = `https://waze.com/ul?q=${encodeURIComponent(endereco)}&navigate=yes`;

  return (
    <section id="local" aria-labelledby="local-titulo" className="scroll-mt-6 bg-paper pt-16 sm:pt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="night-sky relative grid overflow-hidden rounded-[2rem] text-white shadow-lift lg:grid-cols-[1fr_1.15fr]">
            <div className="relative p-7 sm:p-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-glow">
                <PinIcon className="size-4" />
                Onde vai ser
              </p>
              <h2 id="local-titulo" className="mt-5 font-display text-3xl leading-tight font-medium text-balance sm:text-4xl">
                <span className="shine-text">{rua}</span>
              </h2>
              {resto.length ? <p className="mt-2 text-lg text-white/80">{resto.join(" - ")}</p> : null}

              <ul className="mt-6 space-y-2.5 text-[15px] text-white/80">
                {date ? (
                  <li className="flex items-center gap-2.5">
                    <CalendarIcon className="size-[18px] shrink-0 text-glow" />
                    <span className="first-letter:uppercase">{date}</span>
                  </li>
                ) : null}
                {inicio ? (
                  <li className="flex items-center gap-2.5">
                    <ClockIcon className="size-[18px] shrink-0 text-glow" />
                    {fim ? `Das ${inicio} às ${fim}` : `A partir das ${inicio}`}
                  </li>
                ) : null}
              </ul>

              <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
                <a
                  href={mapsUrl(endereco)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shine inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-accent px-6 text-base font-semibold text-white shadow-[0_14px_30px_-12px_rgb(182_90_55/0.8)] transition-transform hover:-translate-y-0.5"
                >
                  <PinIcon className="size-5" />
                  Google Maps
                </a>
                <a
                  href={waze}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-6 text-base font-semibold text-white backdrop-blur transition-colors hover:border-white/45"
                >
                  <ExternalIcon className="size-5" />
                  Waze
                </a>
              </div>
              <CopyAddress endereco={endereco} />
            </div>

            <div className="relative min-h-[280px] border-t border-white/10 lg:min-h-full lg:border-t-0 lg:border-l">
              <iframe
                title={`Mapa: ${endereco}`}
                src={mapa}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0 grayscale-[0.35] contrast-[1.05]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
