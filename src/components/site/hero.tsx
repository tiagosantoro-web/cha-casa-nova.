import { CalendarIcon, ClockIcon, GiftIcon, PinIcon } from "@/components/icons";
import { evento } from "@/data/evento";
import { formatEventDate, formatEventTime } from "@/lib/format";
import { publicPath } from "@/lib/paths";
import { Countdown } from "./countdown";
import { GuestGreeting } from "./guest-greeting";

function InfoItem({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
      <span className="steel mt-0.5 grid size-9 shrink-0 place-items-center rounded-full text-ink">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">{label}</p>
        <p className={`mt-0.5 font-medium break-words first-letter:uppercase ${value ? "text-white" : "text-white/60 italic"}`}>
          {value ?? "Em breve"}
        </p>
        {children}
      </div>
    </div>
  );
}

/** Programação do dia: atividade à esquerda, horário à direita. */
function Programacao() {
  if (!evento.programacao.length) return null;
  return (
    <ul className="mt-3 space-y-2 border-t border-white/10 pt-3">
      {evento.programacao.map((item) => (
        <li key={item.nome} className="flex items-baseline justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.08em] text-glow">
            <span className="size-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_#b65a37]" aria-hidden />
            {item.nome}
          </span>
          <span className="whitespace-nowrap tabular-nums text-white/80">
            {formatEventTime(item.inicio)} às {formatEventTime(item.fim)}
          </span>
        </li>
      ))}
    </ul>
  );
}

// [esquerda %, topo %, tamanho px, duração s, atraso s]
const BOKEH: [number, number, number, number, number][] = [
  [8, 70, 90, 16, 0],
  [22, 30, 40, 12, 3],
  [38, 82, 60, 18, 6],
  [55, 20, 110, 20, 2],
  [68, 60, 50, 14, 8],
  [80, 35, 80, 17, 4],
  [92, 75, 36, 13, 10],
];

export function Hero() {
  const date = formatEventDate(evento.data);
  const ultimo = evento.programacao.at(-1);
  const time =
    evento.horario && ultimo
      ? `Das ${formatEventTime(evento.horario)} às ${formatEventTime(ultimo.fim)}`
      : formatEventTime(evento.horario);
  const [titleStart, ...titleRest] = evento.titulo.split(", ");

  return (
    <header className="night-sky relative isolate overflow-hidden text-white">
      {/* Foto do casal cobrindo o bloco inteiro (no celular, nítida no alto e desfocada no resto), sob véus escuros. */}
      {evento.foto ? (
        <figure
          className="hero-photo pointer-events-none absolute inset-0 -z-10 m-0"
          style={{ "--hero-photo": `url(${publicPath(evento.foto)})` } as React.CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- site estático, imagem em /public */}
          <img
            src={publicPath(evento.foto)}
            alt={`Foto de ${evento.casal}`}
            width={1200}
            height={900}
            className="hero-photo-img photo-settle"
            fetchPriority="high"
            decoding="async"
          />
        </figure>
      ) : null}
      <div className={`mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 pt-8 sm:px-8 md:pt-16 lg:gap-16 lg:pb-20 ${evento.foto ? "lg:min-h-[640px]" : "md:pb-16"}`}>
        <span className="hero-aurora pointer-events-none absolute -z-10" aria-hidden />
        {/* Pontos de luz decorativos (só transform e opacity). */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          {BOKEH.map(([left, top, size, time, delay]) => (
            <span
              key={`${left}-${top}`}
              className="bokeh"
              style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, "--bokeh-time": `${time}s`, "--bokeh-delay": `${delay}s` } as React.CSSProperties}
            />
          ))}
        </div>
        <div className={evento.foto ? "pt-[58vw] sm:pt-[34vw] lg:pt-0 lg:max-w-[34rem]" : undefined}>
          <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur">
            <span className="size-2 rounded-full bg-glow shadow-[0_0_12px_#ffd9a8]" aria-hidden />
            Chá de casa nova · {evento.casal}
          </p>

          <GuestGreeting />

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
            <a
              href="#presentes"
              className="btn-shine inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-accent px-7 text-base font-semibold text-white shadow-[0_14px_30px_-12px_rgb(182_90_55/0.8)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <GiftIcon className="size-5" />
              Ver ideias de presentes
            </a>
            {evento.endereco ? (
              <a
                href="#local"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-7 text-base font-semibold text-white backdrop-blur transition-colors hover:border-white/45"
              >
                <PinIcon className="size-5" />
                Como chegar
              </a>
            ) : null}
          </div>

          <Countdown date={evento.data} time={evento.horario} />
        </div>

      </div>

      <div className="mx-auto grid max-w-6xl gap-3 px-5 pb-14 sm:grid-cols-3 sm:px-8">
        <InfoItem icon={<CalendarIcon className="size-[18px]" />} label="Data" value={date} />
        <InfoItem icon={<ClockIcon className="size-[18px]" />} label="Horário" value={time}>
          <Programacao />
        </InfoItem>
        <InfoItem icon={<PinIcon className="size-[18px]" />} label="Endereço" value={evento.endereco}>
          {evento.endereco ? (
            <a href="#local" className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-glow underline decoration-glow/40 underline-offset-4 hover:decoration-glow">
              Ver no mapa
            </a>
          ) : null}
        </InfoItem>
      </div>
      {evento.informacoesAdicionais ? (
        <p className="mx-auto -mt-6 max-w-6xl whitespace-pre-line px-5 pb-12 text-white/70 sm:px-8">{evento.informacoesAdicionais}</p>
      ) : null}
    </header>
  );
}
