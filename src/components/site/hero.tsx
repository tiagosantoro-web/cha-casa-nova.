import { CalendarIcon, ClockIcon, GiftIcon, PinIcon } from "@/components/icons";
import { evento } from "@/data/evento";
import { formatEventDate, formatEventTime, mapsUrl } from "@/lib/format";
import { Countdown } from "./countdown";

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-line bg-card/80 p-4 backdrop-blur-sm">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-ink text-paper">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className={`mt-0.5 font-medium break-words first-letter:uppercase ${value ? "text-ink" : "text-muted italic"}`}>
          {value ?? "Em breve"}
        </p>
      </div>
    </div>
  );
}

/* Ilustração da casa com acabamento preto e inox (substituída pela foto do casal quando definida). */
function HouseArt({ coupleNames }: { coupleNames: string }) {
  const initials = coupleNames
    .split(/\s*&\s*|\s+e\s+/i)
    .map((name) => name.trim()[0])
    .filter(Boolean)
    .join(" & ");
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[420px]">
      <div className="steel absolute inset-x-6 bottom-0 top-16 rounded-[2.2rem] opacity-70 blur-2xl" aria-hidden />
      <svg viewBox="0 0 320 400" className="relative size-full drop-shadow-[0_30px_40px_rgb(27_26_24/0.25)]" role="img" aria-label="Ilustração de uma casa">
        <defs>
          <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e6e8ea" />
            <stop offset=".35" stopColor="#b6babe" />
            <stop offset=".6" stopColor="#f1f2f3" />
            <stop offset="1" stopColor="#8f9498" />
          </linearGradient>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#efebe5" />
          </linearGradient>
        </defs>
        <path d="M160 34 22 150h276L160 34Z" fill="#1b1a18" />
        <path d="M160 52 46 148h228L160 52Z" fill="url(#steel)" opacity=".9" />
        <rect x="46" y="148" width="228" height="222" rx="6" fill="url(#wall)" stroke="#1b1a18" strokeWidth="3" />
        <rect x="216" y="70" width="24" height="56" fill="#1b1a18" />
        <rect x="134" y="250" width="52" height="120" rx="26" fill="#1b1a18" />
        <circle cx="174" cy="312" r="3.5" fill="url(#steel)" />
        <rect x="72" y="182" width="52" height="52" rx="8" fill="#1b1a18" />
        <rect x="196" y="182" width="52" height="52" rx="8" fill="#1b1a18" />
        <path d="M98 184v48M74 208h48M222 184v48M198 208h48" stroke="url(#steel)" strokeWidth="3" />
        <rect x="30" y="366" width="260" height="10" rx="5" fill="#1b1a18" />
        <text x="160" y="118" textAnchor="middle" fontFamily="var(--font-fraunces), Georgia, serif" fontSize="26" fill="#1b1a18" fontStyle="italic">
          {initials || "♥"}
        </text>
      </svg>
    </div>
  );
}

export function Hero() {
  const date = formatEventDate(evento.data);
  const time = formatEventTime(evento.horario);

  return (
    <header className="grain relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-8 sm:px-8 md:pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-24">
        <div>
          <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
            <span className="steel size-2 rounded-full" aria-hidden />
            Chá de casa nova · {evento.casal}
          </p>

          <h1
            className="animate-rise mt-6 font-display text-[2.6rem] leading-[1.02] font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            {evento.titulo}
          </h1>

          <div className="animate-rise mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-ink-soft" style={{ animationDelay: "160ms" }}>
            {evento.boasVindas.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="animate-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
            <a
              href="#presentes"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-ink px-7 text-base font-semibold text-paper shadow-lift transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <GiftIcon className="size-5" />
              Ver lista de presentes
            </a>
            {evento.endereco ? (
              <a
                href={mapsUrl(evento.endereco)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-ink/15 bg-card px-7 text-base font-semibold text-ink transition-colors hover:border-ink/40"
              >
                <PinIcon className="size-5" />
                Como chegar
              </a>
            ) : null}
          </div>

          <Countdown date={evento.data} />
        </div>

        <div className="animate-rise" style={{ animationDelay: "200ms" }}>
          {evento.foto ? (
            <figure className="relative mx-auto w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[420px]">
              <div className="steel absolute -inset-3 rounded-[2.4rem] opacity-60" aria-hidden />
              {/* eslint-disable-next-line @next/next/no-img-element -- site estático, imagem em /public */}
              <img
                src={evento.foto}
                alt={`Foto de ${evento.casal}`}
                className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-lift"
                fetchPriority="high"
              />
            </figure>
          ) : (
            <HouseArt coupleNames={evento.casal} />
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-3 px-5 pb-14 sm:grid-cols-3 sm:px-8">
        <InfoItem icon={<CalendarIcon className="size-[18px]" />} label="Data" value={date} />
        <InfoItem icon={<ClockIcon className="size-[18px]" />} label="Horário" value={time} />
        <InfoItem icon={<PinIcon className="size-[18px]" />} label="Endereço" value={evento.endereco} />
      </div>
      {evento.informacoesAdicionais ? (
        <p className="mx-auto -mt-6 max-w-6xl whitespace-pre-line px-5 pb-12 text-muted sm:px-8">{evento.informacoesAdicionais}</p>
      ) : null}
    </header>
  );
}
