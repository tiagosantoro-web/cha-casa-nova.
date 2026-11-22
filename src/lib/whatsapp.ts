import { formatPrice } from "@/lib/format";

type Confirmacao = {
  casal: string;
  convidado: string;
  temAcompanhante: boolean;
  acompanhante: string;
  /** null = só confirmação de presença, sem presente. */
  presente: string | null;
  preco: number | null;
  /** true = o convidado vai dar o valor do presente em Pix. */
  viaPix?: boolean;
  mensagem: string;
  data: Date;
};

/** Mensagem que o convidado envia ao casal pelo WhatsApp. */
export function montarMensagem(dados: Confirmacao): string {
  const quando = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(dados.data);

  const linhas = [
    "🏡 *NOVA CONFIRMAÇÃO — CHÁ DE CASA NOVA*",
    "",
    `👤 *Convidado:* ${dados.convidado}`,
    "",
    `👥 *Acompanhante:* ${dados.temAcompanhante ? "Sim" : "Não"}`,
  ];
  if (dados.temAcompanhante) linhas.push("", `👤 *Nome do acompanhante:* ${dados.acompanhante}`);
  if (dados.presente) {
    linhas.push(
      "",
      `🎁 *Presente escolhido:* ${dados.presente}`,
      "",
      dados.viaPix
        ? `💸 *Forma:* Pix de ${formatPrice(dados.preco) ?? "valor a combinar"} (no lugar do presente)`
        : `💰 *Preço sugerido:* ${formatPrice(dados.preco) ?? "a confirmar"}`,
    );
  } else {
    linhas.push("", "🎁 *Presente:* só confirmando presença");
  }
  linhas.push("", `📅 *Data da confirmação:* ${quando}`);
  if (dados.mensagem) linhas.push("", `💌 *Mensagem:* ${dados.mensagem}`);
  linhas.push("", `Oi, ${dados.casal.replace(/\s*&\s*/, " e ")}! Confirmo minha presença no chá de casa nova de vocês. 🥂`);
  return linhas.join("\n");
}

export function linkWhatsapp(numero: string, texto: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export function whatsappValido(numero: string): boolean {
  return /^55\d{10,11}$/.test(numero);
}
