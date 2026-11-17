import { CheckIcon, GiftIcon, WhatsappIcon } from "@/components/icons";
import { evento } from "@/data/evento";
import { linkWhatsapp, whatsappValido } from "@/lib/whatsapp";
import { Reveal } from "./reveal";

const coupleLabel = evento.casal.replace(/\s*&\s*/, " e ");

const steps = [
  {
    icon: <GiftIcon className="size-5" />,
    title: "Escolha um presente",
    text: "Navegue pelas categorias e toque em “Quero presentear” no item que combina com você.",
  },
  {
    icon: <CheckIcon className="size-5" />,
    title: "Conte quem vem",
    text: "Informe seu nome e se levará acompanhante. Leva menos de um minuto.",
  },
  {
    icon: <WhatsappIcon className="size-5" />,
    title: "Envie pelo WhatsApp",
    text: `A mensagem abre pronta para ${coupleLabel}. É só enviar para confirmar sua escolha.`,
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="como-funciona" className="border-t border-line bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Como funciona</p>
          <h2 id="como-funciona" className="mt-3 font-display text-3xl font-medium sm:text-4xl">
            Três passos e pronto
          </h2>
        </Reveal>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 120} className="h-full">
                <div className="h-full rounded-3xl border border-line bg-card p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-full bg-ink text-paper">{step.icon}</span>
                    <span className="font-display text-4xl text-line" aria-hidden>
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
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
    q: "Preciso comprar na loja do link?",
    a: "Não. Os links são sugestões para facilitar; você pode comprar onde preferir. Só pedimos que o presente siga as cores indicadas (preto, inox ou prata), para combinar com a casa.",
  },
  {
    q: "O preço pode estar diferente?",
    a: "Pode. Os valores são referências consultadas nas lojas e mudam com frequência. Vale conferir antes de comprar.",
  },
  {
    q: "E se outra pessoa escolher o mesmo presente?",
    a: `Assim que recebem as confirmações, ${coupleLabel} marcam o presente como escolhido na lista. Se duas pessoas escolherem o mesmo item antes disso, o casal combina com vocês pelo WhatsApp.`,
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
    <section aria-labelledby="duvidas" className="border-t border-line bg-paper py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Dúvidas</p>
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
        <div className="divide-y divide-line rounded-3xl border border-line bg-card px-5 sm:px-6">
          {faq.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-lg leading-none transition-transform group-open:rotate-45"
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
