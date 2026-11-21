import { CheckIcon, GiftIcon, HeartIcon, WhatsappIcon } from "@/components/icons";
import { evento } from "@/data/evento";
import { reservasAtivas } from "@/lib/reservas-ativas";
import { linkWhatsapp, whatsappValido } from "@/lib/whatsapp";
import { PresenceButton } from "./presence-button";
import { Reveal } from "./reveal";

const coupleLabel = evento.casal.replace(/\s*&\s*/, " e ");

const steps = [
  {
    icon: <CheckIcon className="size-5" />,
    title: "Confirme que vem",
    text: "Informe seu nome e se levará acompanhante. Leva menos de um minuto.",
  },
  {
    icon: <GiftIcon className="size-5" />,
    title: "Presente, se quiser",
    text: "Dê uma olhada nas ideias da lista. Se algo combinar com você, é só escolher; se não, tudo bem.",
  },
  {
    icon: <WhatsappIcon className="size-5" />,
    title: "Envie pelo WhatsApp",
    text: `A mensagem abre pronta para ${coupleLabel}. É só tocar em enviar.`,
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="como-funciona" className="bg-paper pt-16 sm:pt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            Como funciona
          </p>
          <h2 id="como-funciona" className="mt-3 font-display text-3xl font-medium sm:text-4xl">
            Simples e sem compromisso
          </h2>
        </Reveal>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 120} className="h-full">
                <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-line/70 bg-card p-6 shadow-card">
                  <span className="pointer-events-none absolute right-6 top-4 font-display text-6xl leading-none text-stone-soft" aria-hidden>
                    {index + 1}
                  </span>
                  <span className="relative grid size-11 place-items-center rounded-2xl bg-ink text-paper">{step.icon}</span>
                  <h3 className="relative mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="relative mt-2 leading-relaxed text-muted">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const faq = [
  {
    q: "Preciso levar presente?",
    a: "Não. O que mais queremos é ter você com a gente. A lista existe só para quem quiser presentear e ajuda a evitar presentes repetidos.",
  },
  {
    q: "Preciso comprar na loja do link?",
    a: "Não. Os links são sugestões para facilitar; você pode comprar onde preferir. Se puder, prefira as cores indicadas (preto, inox ou prata), que combinam com a casa.",
  },
  {
    q: "O preço pode estar diferente?",
    a: "Pode. Os valores são referências consultadas nas lojas e mudam com frequência. Vale conferir antes de comprar.",
  },
  {
    q: "E se outra pessoa escolher o mesmo presente?",
    a: reservasAtivas
      ? "Não tem como. Assim que alguém confirma a escolha, o presente fica indisponível na lista para todos os outros convidados."
      : `Assim que recebem as confirmações, ${coupleLabel} marcam o presente como escolhido na lista. Se duas pessoas escolherem o mesmo item antes disso, o casal combina com vocês pelo WhatsApp.`,
  },
  {
    q: "E a voltagem dos eletroportáteis?",
    a: "Alguns itens existem em 127 V e 220 V. Na dúvida, pergunte ao casal na própria mensagem de confirmação.",
  },
  {
    q: "Meus dados ficam salvos no site?",
    a: "Não. Nome, acompanhante e mensagem vão apenas na mensagem de WhatsApp que você envia ao casal.",
  },
];

export function Faq() {
  return (
    <section aria-labelledby="duvidas" className="border-t border-line bg-card py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            Dúvidas
          </p>
          <h2 id="duvidas" className="mt-3 font-display text-3xl font-medium sm:text-4xl">
            Perguntas frequentes
          </h2>
          {whatsappValido(evento.whatsapp) ? (
            <a
              href={linkWhatsapp(evento.whatsapp, `Oi, ${coupleLabel}! Tenho uma dúvida sobre o chá de casa nova.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-5 font-semibold text-white"
            >
              <WhatsappIcon className="size-5" />
              Falar com o casal
            </a>
          ) : null}
        </Reveal>
        <div className="divide-y divide-line rounded-[1.75rem] border border-line bg-paper px-5 sm:px-6">
          {faq.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-card text-lg leading-none text-accent shadow-card transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="pb-2 pt-1 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Fechamento: convite para confirmar presença, sem falar de presente. */
export function ClosingInvite() {
  return (
    <section className="bg-card pb-16 sm:pb-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="night-sky relative overflow-hidden rounded-[2rem] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
            <HeartIcon className="mx-auto size-8 text-glow" />
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight font-medium text-balance sm:text-5xl">
              O mais importante é <em className="shine-text pr-[0.12em] font-normal">celebrar juntos</em>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/75">
              Vai ser uma alegria receber você na nossa casa nova. Confirme sua presença para a gente se organizar.
            </p>
            <PresenceButton className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-accent px-8 text-base font-semibold text-white transition-transform hover:-translate-y-0.5">
              Confirmar presença
            </PresenceButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
