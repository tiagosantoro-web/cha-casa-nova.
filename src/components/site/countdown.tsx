"use client";

import { useSyncExternalStore } from "react";

// Relógio guardado fora do componente: a leitura só muda quando o intervalo atualiza.
let agora = Date.now();

/** Atualiza a cada segundo enquanto a página está aberta. */
function porSegundo(callback: () => void) {
  agora = Date.now();
  const id = setInterval(() => {
    agora = Date.now();
    callback();
  }, 1000);
  return () => clearInterval(id);
}

/** Momento do início da festa, no horário de Brasília (-03:00). */
function inicioDaFesta(date: string, time: string | null) {
  return Date.parse(`${date}T${time ?? "00:00"}:00-03:00`);
}

const UNIDADES = [
  { rotulo: "dias", rotuloUm: "dia" },
  { rotulo: "horas", rotuloUm: "hora" },
  { rotulo: "min", rotuloUm: "min" },
  { rotulo: "seg", rotuloUm: "seg" },
];

/** Contagem regressiva ao vivo até o início da festa, calculada no navegador. */
export function Countdown({ date, time }: { date: string | null; time: string | null }) {
  // Segundos que faltam (número inteiro, para o React só redesenhar quando muda).
  const restante = useSyncExternalStore(
    porSegundo,
    () => (date ? Math.floor((inicioDaFesta(date, time) - agora) / 1000) : null),
    () => null,
  );

  if (restante === null) return null;

  // Já começou: mostra o recado só no dia da festa.
  if (restante <= 0) {
    const hoje = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
    if (hoje !== date) return null;
    return (
      <p className="countdown-shell mt-8 inline-flex rounded-2xl px-5 py-4 font-display text-2xl">
        <span className="shine-text">É hoje! Estamos esperando você.</span>
      </p>
    );
  }

  const valores = [
    Math.floor(restante / 86_400),
    Math.floor((restante % 86_400) / 3_600),
    Math.floor((restante % 3_600) / 60),
    restante % 60,
  ];

  return (
    <div className="countdown-shell mt-8 rounded-[1.75rem] p-4 sm:p-5" role="timer" aria-label={`Faltam ${valores[0]} dias para a festa`}>
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-glow">
        <span className="countdown-dot size-2 rounded-full bg-accent" aria-hidden />
        Contagem regressiva<span className="hidden sm:inline"> para a festa</span>
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3" aria-hidden>
        {valores.map((valor, i) => (
          <div key={UNIDADES[i].rotulo} className="countdown-tile rounded-2xl px-1 py-3 text-center sm:py-4">
            <span
              key={i === 3 ? valor : undefined}
              className={`block font-display text-[2rem] leading-none font-semibold tabular-nums min-[400px]:text-4xl sm:text-5xl ${i === 0 ? "shine-text" : "text-white"} ${i === 3 ? "countdown-tick" : ""}`}
            >
              {String(valor).padStart(2, "0")}
            </span>
            <span className="mt-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/60">
              {valor === 1 ? UNIDADES[i].rotuloUm : UNIDADES[i].rotulo}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
