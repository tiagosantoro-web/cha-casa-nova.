"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeftIcon, CheckIcon, CloseIcon, ExternalIcon, HeartIcon, WhatsappIcon } from "@/components/icons";
import { evento } from "@/data/evento";
import { useConvidado } from "@/lib/convidado";
import { cleanText, formatPrice } from "@/lib/format";
import { reservarPresente, reservasAtivas, type ResultadoReserva } from "@/lib/reservas";
import type { Presente } from "@/lib/types";
import { linkWhatsapp, montarMensagem, whatsappValido } from "@/lib/whatsapp";

type Step = "form" | "review" | "done";
type Reserva = "livre" | "reservando" | ResultadoReserva;

/** Um presente escolhido, ou "presenca" para confirmar só a presença. */
export type Selecao = Presente | "presenca";

type Props = {
  selection: Selecao | null;
  /** true = o visitante já reservou este presente neste aparelho. */
  alreadyMine: boolean;
  onClose: () => void;
  onConfirmed: (gift: Presente) => void;
};

const inputClass =
  "w-full rounded-2xl border border-line bg-paper px-4 py-3.5 text-base text-ink placeholder:text-muted/70 focus:border-ink focus:bg-card focus:outline-none aria-[invalid=true]:border-danger";

const coupleLabel = evento.casal.replace(/\s*&\s*/, " e ");

export function ReserveDialog({ selection, alreadyMine, onClose, onConfirmed }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const companionRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  const [step, setStep] = useState<Step>("form");
  const [fullName, setFullName] = useState("");
  const [hasCompanion, setHasCompanion] = useState<boolean | null>(null);
  const [companionName, setCompanionName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shown, setShown] = useState<Selecao | null>(selection);
  const [sentAt, setSentAt] = useState<Date | null>(null);
  const [reserva, setReserva] = useState<Reserva>("livre");

  // No convite individual (?para=Nome), o nome do convidado já vem preenchido.
  const convidado = useConvidado();

  // Mantém o conteúdo visível durante o fechamento e recomeça a cada nova escolha.
  if (selection && selection !== shown) {
    setShown(selection);
    setStep("form");
    setErrors({});
    setReserva("livre");
    if (!fullName && convidado) setFullName(convidado);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selection && !dialog.open) {
      dialog.showModal();
      window.setTimeout(() => nameRef.current?.focus(), 50);
    }
    if (!selection && dialog.open) dialog.close();
  }, [selection]);

  const gift = shown && shown !== "presenca" ? shown : null;
  const name = cleanText(fullName, 120);
  const companion = cleanText(companionName, 120);
  const note = cleanText(message, 500);

  const validate = () => {
    const next: Record<string, string> = {};
    if (name.length < 3 || !name.includes(" ")) next.fullName = "Informe seu nome completo (nome e sobrenome).";
    if (hasCompanion === null) next.hasCompanion = "Conte para a gente se levará acompanhante.";
    if (hasCompanion && companion.length < 3) next.companionName = "Informe o nome do acompanhante.";
    setErrors(next);
    if (next.fullName) nameRef.current?.focus();
    else if (next.companionName) companionRef.current?.focus();
    return Object.keys(next).length === 0;
  };

  const whatsappReady = whatsappValido(evento.whatsapp);
  const waUrl =
    shown && whatsappReady
      ? linkWhatsapp(
          evento.whatsapp,
          montarMensagem({
            casal: evento.casal,
            convidado: name,
            temAcompanhante: Boolean(hasCompanion),
            acompanhante: companion,
            presente: gift?.nome ?? null,
            preco: gift?.preco ?? null,
            mensagem: note,
            data: sentAt ?? new Date(),
          }),
        )
      : null;

  const price = formatPrice(gift?.preco);

  // Com a planilha de reservas ligada, o presente é bloqueado antes de abrir o WhatsApp.
  const needsReservation = Boolean(gift) && reservasAtivas && !alreadyMine && reserva !== "ok";
  const reserve = async () => {
    if (!gift || reserva === "reservando") return;
    setReserva("reservando");
    const result = await reservarPresente(gift.id, {
      presente: gift.nome,
      convidado: name,
      acompanhante: hasCompanion ? companion : "",
      mensagem: note,
    });
    setReserva(result);
    if (result === "ok") onConfirmed(gift);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="mx-0 mb-0 mt-auto max-h-[94dvh] w-full max-w-full overflow-y-auto rounded-t-[1.75rem] bg-card p-0 text-ink shadow-lift open:animate-rise sm:m-auto sm:max-w-lg sm:rounded-[1.75rem]"
    >
      {shown ? (
        <div className="p-6 sm:p-8">
          <div className="mx-auto -mt-2 mb-4 h-1.5 w-12 rounded-full bg-line sm:hidden" aria-hidden />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink">
                {step === "form" ? "Passo 1 de 2 · Seus dados" : step === "review" ? "Passo 2 de 2 · Confirmar" : "Quase lá"}
              </p>
              <h2 id={titleId} className="mt-1 font-display text-2xl leading-tight font-medium">
                {step === "done" ? "Obrigado pelo carinho!" : gift ? gift.nome : "Confirmar presença"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-line transition-colors hover:border-ink/40"
              aria-label="Fechar"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          {step === "form" ? (
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                if (validate()) setStep("review");
              }}
              className="mt-6 space-y-5"
            >
              {!gift ? (
                <p className="rounded-2xl bg-accent-soft px-4 py-3 text-sm leading-relaxed text-accent-ink">
                  Sem compromisso com presente: o que importa é ter você com a gente.
                </p>
              ) : null}

              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold">
                  Seu nome completo
                </label>
                <input
                  ref={nameRef}
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  maxLength={120}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  className={inputClass}
                  placeholder="Ex.: Maria Oliveira"
                />
                {errors.fullName ? (
                  <p id="fullName-error" className="mt-1.5 text-sm text-danger">
                    {errors.fullName}
                  </p>
                ) : null}
              </div>

              <fieldset aria-describedby={errors.hasCompanion ? "companion-choice-error" : undefined}>
                <legend className="mb-1.5 text-sm font-semibold">Levará acompanhante?</legend>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: true, label: "Sim" },
                    { value: false, label: "Não" },
                  ].map((option) => (
                    <label
                      key={option.label}
                      className={`flex min-h-13 cursor-pointer items-center justify-center rounded-2xl border text-base font-semibold transition-colors has-focus-visible:outline-2 has-focus-visible:outline-accent ${
                        hasCompanion === option.value ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="hasCompanion"
                        className="sr-only"
                        checked={hasCompanion === option.value}
                        onChange={() => {
                          setHasCompanion(option.value);
                          setErrors((current) => ({ ...current, hasCompanion: "" }));
                          if (option.value) window.setTimeout(() => companionRef.current?.focus(), 30);
                        }}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                {errors.hasCompanion ? (
                  <p id="companion-choice-error" className="mt-1.5 text-sm text-danger">
                    {errors.hasCompanion}
                  </p>
                ) : null}
              </fieldset>

              {hasCompanion ? (
                <div className="animate-fade">
                  <label htmlFor="companionName" className="mb-1.5 block text-sm font-semibold">
                    Nome do acompanhante
                  </label>
                  <input
                    ref={companionRef}
                    id="companionName"
                    name="companionName"
                    maxLength={120}
                    value={companionName}
                    onChange={(event) => setCompanionName(event.target.value)}
                    aria-invalid={Boolean(errors.companionName)}
                    aria-describedby={errors.companionName ? "companionName-error" : undefined}
                    className={inputClass}
                  />
                  {errors.companionName ? (
                    <p id="companionName-error" className="mt-1.5 text-sm text-danger">
                      {errors.companionName}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-semibold">
                  Mensagem para o casal <span className="font-normal text-muted">(opcional)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  maxLength={500}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className={`${inputClass} resize-none`}
                />
                <p className="mt-1 text-right text-xs text-muted">{message.length}/500</p>
              </div>

              <button
                type="submit"
                className="inline-flex min-h-14 w-full cursor-pointer items-center justify-center rounded-full bg-ink px-6 text-base font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-accent"
              >
                Continuar
              </button>
              <p className="text-center text-xs leading-relaxed text-muted">
                Seus dados não ficam salvos no site: eles vão só na mensagem de WhatsApp para o casal.
              </p>
            </form>
          ) : null}

          {step === "review" ? (
            <div className="mt-6">
              <div className="rounded-3xl border border-line bg-paper p-5 text-[15px] leading-relaxed">
                {gift ? (
                  <>
                    <p>Você está escolhendo presentear {coupleLabel} com:</p>
                    <p className="mt-3 font-display text-xl font-medium">{gift.nome}</p>
                    {price ? <p className="mt-1 text-sm text-muted">Valor de referência: {price}</p> : null}
                  </>
                ) : (
                  <p>Você está confirmando presença no chá de casa nova de {coupleLabel}.</p>
                )}
                <dl className="mt-4 space-y-1 border-t border-line pt-4">
                  <div>
                    <dt className="inline font-semibold">Convidado: </dt>
                    <dd className="inline">{name}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold">Acompanhante: </dt>
                    <dd className="inline">{hasCompanion ? companion : "não levará acompanhante"}</dd>
                  </div>
                </dl>
              </div>

              {waUrl && reserva === "ok" ? (
                <p className="mt-4 flex items-start gap-2 rounded-2xl bg-ok-soft px-4 py-3 text-sm leading-relaxed text-ok" role="status">
                  <CheckIcon className="mt-0.5 size-4 shrink-0" />
                  <span>
                    Presente reservado para você: ele já aparece como indisponível para os outros convidados. Agora envie a
                    confirmação pelo WhatsApp para {coupleLabel}.
                  </span>
                </p>
              ) : waUrl && reserva === "ja-escolhido" ? (
                <p className="mt-4 rounded-2xl bg-warn-soft px-4 py-3 text-sm leading-relaxed text-warn" role="alert">
                  Poxa, outro convidado acabou de escolher este presente. Ele já aparece como indisponível na lista; se quiser,
                  escolha outro.
                </p>
              ) : waUrl && reserva === "erro" ? (
                <p className="mt-4 rounded-2xl bg-warn-soft px-4 py-3 text-sm leading-relaxed text-warn" role="alert">
                  Não conseguimos reservar o presente agora. Confira sua internet e tente de novo.
                </p>
              ) : waUrl && needsReservation ? (
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Ao confirmar, o presente fica reservado para você e some da lista dos outros convidados. Depois é só enviar
                  a mensagem pronta para {coupleLabel} no WhatsApp.
                </p>
              ) : waUrl ? (
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Ao confirmar, o WhatsApp abre com a mensagem pronta para {coupleLabel}.{" "}
                  <strong className="font-semibold text-ink">Toque em enviar</strong> para concluir.
                </p>
              ) : (
                <p className="mt-4 rounded-2xl bg-warn-soft px-4 py-3 text-sm leading-relaxed text-warn">
                  A confirmação pelo WhatsApp ainda está sendo configurada. Volte em breve para concluir.
                </p>
              )}

              <div className="mt-5 grid gap-2 sm:grid-cols-[auto_1fr]">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="inline-flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-full border border-ink/15 px-6 font-semibold"
                >
                  <ArrowLeftIcon className="size-4" />
                  Editar
                </button>
                {waUrl && needsReservation && reserva === "ja-escolhido" ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex min-h-14 cursor-pointer items-center justify-center rounded-full bg-ink px-6 text-base font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-accent"
                  >
                    Escolher outro presente
                  </button>
                ) : waUrl && needsReservation ? (
                  <button
                    type="button"
                    onClick={reserve}
                    disabled={reserva === "reservando"}
                    aria-busy={reserva === "reservando"}
                    className="inline-flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-6 text-base font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-accent disabled:cursor-wait disabled:opacity-70"
                  >
                    <HeartIcon className="size-5" />
                    {reserva === "reservando" ? "Reservando…" : reserva === "erro" ? "Tentar de novo" : "Confirmar minha escolha"}
                  </button>
                ) : waUrl ? (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setSentAt(new Date());
                      setStep("done");
                      if (gift) onConfirmed(gift);
                    }}
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
                  >
                    <WhatsappIcon className="size-5" />
                    {!gift ? "Confirmar presença" : reserva === "ok" ? "Enviar no WhatsApp" : "Confirmar minha escolha"}
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === "done" ? (
            <div className="mt-6" role="status">
              <div className="flex items-start gap-3 rounded-3xl bg-ok-soft p-5 text-ok">
                <CheckIcon className="mt-0.5 size-6 shrink-0" />
                <p className="leading-relaxed">
                  <strong>{name.split(" ")[0]}</strong>, abrimos o WhatsApp com a sua confirmação
                  {gift ? (
                    <>
                      {" "}de <strong>{gift.nome}</strong>
                    </>
                  ) : (
                    " de presença"
                  )}
                  . Não esqueça de <strong>enviar a mensagem</strong> para o casal receber.
                </p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                O WhatsApp não abriu? Use o botão abaixo.
                {gift ? " O link da loja é só uma sugestão: você pode comprar onde preferir." : ""}
              </p>
              <div className="mt-5 grid gap-2">
                {waUrl ? (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 font-semibold text-white"
                  >
                    <WhatsappIcon className="size-5" />
                    Abrir o WhatsApp de novo
                  </a>
                ) : null}
                {gift?.link ? (
                  <a
                    href={gift.link}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-ink/15 px-6 font-semibold"
                  >
                    Ver sugestão na loja
                    <ExternalIcon className="size-4" />
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full px-6 text-sm font-semibold text-muted underline underline-offset-4"
                >
                  Voltar para o convite
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
