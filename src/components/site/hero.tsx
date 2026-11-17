import { CalendarIcon, ClockIcon, GiftIcon, HeartIcon, PinIcon } from "@/components/icons";
import { evento } from "@/data/evento";
import { formatEventDate, formatEventTime, mapsUrl } from "@/lib/format";
import { publicPath } from "@/lib/paths";
import { Countdown } from "./countdown";
import { PresenceButton } from "./presence-button";

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
      <span className="steel mt-0.5 grid size-9 shrink-0 place-items-center rounded-full text-ink">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">{label}</p>
        <p className={`mt-0.5 font-medium break-words first-letter:uppercase ${value ? "text-white" : "text-white/60 italic"}`}>
          {value ?? "Em breve"}
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  const date = formatEventDate(evento.data);
  const time = formatEventTime(evento.horario);
  const [titleStart, ...titleRest] = evento.titulo.split(", ");

  return (
    <header className="night-sky relative overflow-hidden text-white">
      <div className={`mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 pt-8 sm:px-8 md:pt-16 lg:gap-16 lg:pb-20 ${evento.foto ? "lg:grid-cols-[1.1fr_0.9fr]" : "md:pb-16"}`}>
        <div>
          <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur">
            <span className="size-2 rounded-full bg-glow shadow-[0_0_12px_#ffd9a8]" aria-hidden />
            Chá de casa nova · {evento.casal}
          </p>

          <h1
            className="animate-rise mt-6 font-display text-[2.3rem] leading-[1.06] min-[400px]:text-[2.6rem] font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            {titleRest.length ? (
              <>
                {titleStart},{" "}
                <em className="shine-text pr-[0.12em] font-normal">{titleRest.join(", ")}</em>
              </>
            ) : (
              evento.titulo
            )}
          </h1>

          <div className="animate-rise mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-white/75" style={{ animationDelay: "160ms" }}>
            {evento.boasVindas.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="animate-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ animationDelay: "240ms" }}>
            <PresenceButton className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-accent px-7 text-base font-semibold text-white shadow-[0_14px_30px_-12px_rgb(182_90_55/0.8)] transition-transform hover:-translate-y-0.5 active:translate-y-0">
              <HeartIcon className="size-5" />
              Confirmar presença
            </PresenceButton>
            <a
              href="#presentes"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-7 text-base font-semibold text-white backdrop-blur transition-colors hover:border-white/45"
            >
              <GiftIcon className="size-5" />
              Ver ideias de presentes
            </a>
            {evento.endereco ? (
              <a
                href={mapsUrl(evento.endereco)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-5 text-base font-semibold text-white/85 underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                <PinIcon className="size-5" />
                Como chegar
              </a>
            ) : null}
          </div>

          <Countdown date={evento.data} />
        </div>

        {/* Foto do casal (sem foto, o topo fica só com o texto). */}
        {evento.foto ? (
          <figure className="animate-rise relative mx-auto w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[440px]" style={{ animationDelay: "200ms" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- site estático, imagem em /public */}
            <img
              src={publicPath(evento.foto)}
              alt={`Foto de ${evento.casal}`}
              className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-lift ring-1 ring-white/15"
              fetchPriority="high"
            />
          </figure>
        ) : null}
      </div>

      <div className="mx-auto grid max-w-6xl gap-3 px-5 pb-14 sm:grid-cols-3 sm:px-8">
        <InfoItem icon={<CalendarIcon className="size-[18px]" />} label="Data" value={date} />
        <InfoItem icon={<ClockIcon className="size-[18px]" />} label="Horário" value={time} />
        <InfoItem icon={<PinIcon className="size-[18px]" />} label="Endereço" value={evento.endereco} />
      </div>
      {evento.informacoesAdicionais ? (
        <p className="mx-auto -mt-6 max-w-6xl whitespace-pre-line px-5 pb-12 text-white/70 sm:px-8">{evento.informacoesAdicionais}</p>
      ) : null}
    </header>
  );
}
