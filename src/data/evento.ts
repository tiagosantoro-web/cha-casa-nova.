/*
  CONFIGURAÇÃO DO EVENTO
  Edite os valores abaixo e publique de novo o site.
  Campos com null aparecem como "Em breve" no convite.
*/
export const evento = {
  casal: "Tiago & Amanda",
  titulo: "Nosso novo lar, uma nova história!",
  boasVindas: [
    "Estamos começando uma nova etapa e queremos compartilhar esse momento especial com pessoas que fazem parte da nossa história.",
    "Sua presença é o que mais importa. Se quiser nos presentear, separamos algumas ideias para o nosso cantinho, sem nenhum compromisso.",
  ],

  // Data no formato "AAAA-MM-DD".
  data: "2026-12-13" as string | null,
  // Horário de início no formato "HH:MM".
  horario: "09:00" as string | null,
  // Endereço completo (usado no botão "Como chegar").
  endereco: "Rua Ayub Abib Riskallah, 38 - Sebandilha, Mairinque - SP" as string | null,
  // Opcional: estacionamento, interfone, traje etc.
  informacoesAdicionais: null as string | null,

  // PENDENTE: WhatsApp que recebe as confirmações. DDI 55 + DDD + número, só dígitos.
  whatsapp: "",

  // PENDENTE: endereço do Apps Script que bloqueia o presente assim que alguém escolhe
  // (termina em /exec; veja o README). Vazio = o casal marca "escolhido" à mão em presentes.ts.
  reservasUrl: "https://script.google.com/macros/s/AKfycbyrDETthGcNe2OwZa-6NStVpDj9A3NugBXFKGkRcB7EASsdVr_AYHqQnB60m6rSp1CQ/exec",

  // Opcional: foto do casal em /public (ex.: "/casal.jpg"). Sem foto, o topo fica só com o texto.
  foto: "/casal.jpg" as string | null,

  // Endereço público do site (sem barra no final). Usado na imagem de prévia quando o link
  // é compartilhado no WhatsApp. Troque se o site mudar de endereço.
  siteUrl: "https://tiagosantoro-web.github.io/cha-casa-nova.",
};
