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

  // PENDENTE: data no formato "AAAA-MM-DD". Ex.: "2026-12-12"
  data: null as string | null,
  // PENDENTE: horário no formato "HH:MM". Ex.: "15:00"
  horario: null as string | null,
  // PENDENTE: endereço completo (usado no botão "Como chegar").
  endereco: null as string | null,
  // Opcional: estacionamento, interfone, traje etc.
  informacoesAdicionais: null as string | null,

  // PENDENTE: WhatsApp que recebe as confirmações. DDI 55 + DDD + número, só dígitos.
  whatsapp: "",

  // Opcional: foto do casal em /public (ex.: "/casal.jpg"). Sem foto, o topo fica só com o texto.
  foto: null as string | null,

  // PENDENTE: endereço público do site depois de publicado (sem barra no final).
  // Usado na imagem de prévia quando o link é compartilhado no WhatsApp.
  siteUrl: "",
};
