/*
  RESERVAS DO CHÁ DE CASA NOVA
  Script da planilha do Google que guarda os presentes já escolhidos.
  Como instalar: veja "Bloquear presentes automaticamente" no README.

  Abas criadas sozinhas:
  - "Reservas": uma linha por reserva (presente, quem escolheu, acompanhante, recado e data).
    Para liberar um presente, apague a linha dele.
  - "Lista": todos os presentes, com a situação de cada um (Livre ou Reservado, e por quem).
    Ela se refaz a cada reserva e ao abrir a planilha; também pelo menu "Chá > Atualizar lista".
*/
const ABA = "Reservas";
const ABA_LISTA = "Lista";
const CABECALHO = ["Presente (id)", "Presente", "Quem escolheu", "Acompanhante", "Recado", "Reservado em"];

function aba_() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.insertSheet(ABA);
    aba.appendRow(CABECALHO);
    aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight("bold");
    aba.setFrozenRows(1);
  }
  return aba;
}

/** Linhas da aba Reservas (sem o cabeçalho). */
function linhas_(aba) {
  const total = aba.getLastRow();
  if (total < 2) return [];
  return aba.getRange(2, 1, total - 1, CABECALHO.length).getValues();
}

function reservados_(aba) {
  return linhas_(aba)
    .map((linha) => String(linha[0]).trim())
    .filter(Boolean);
}

function json_(dados) {
  return ContentService.createTextOutput(JSON.stringify(dados)).setMimeType(ContentService.MimeType.JSON);
}

/** Texto do convidado: limita o tamanho e impede que vire fórmula na planilha. */
function texto_(valor, max) {
  const limpo = String(valor || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
  return /^[=+\-@]/.test(limpo) ? "'" + limpo : limpo;
}

/** Lista dos presentes reservados. */
function doGet() {
  return json_({ ok: true, escolhidos: reservados_(aba_()) });
}

/** Reserva um presente: { "id": "air-fryer", "presente", "convidado", "acompanhante", "mensagem" }. */
function doPost(e) {
  let dados = {};
  try {
    dados = JSON.parse(e.postData.contents) || {};
  } catch (erro) {
    // corpo inválido: tratado abaixo
  }
  const id = String(dados.id || "");
  if (!/^[a-z0-9-]{1,80}$/.test(id)) return json_({ ok: false, motivo: "invalido" });

  // A trava impede que duas pessoas reservem o mesmo item ao mesmo tempo.
  const trava = LockService.getScriptLock();
  if (!trava.tryLock(10000)) return json_({ ok: false, motivo: "ocupado" });
  try {
    const aba = aba_();
    const lista = reservados_(aba);
    if (lista.indexOf(id) !== -1) return json_({ ok: false, motivo: "ja-escolhido", escolhidos: lista });
    const nome = (PRESENTES.find((p) => p[0] === id) || [])[2] || texto_(dados.presente, 120);
    aba.appendRow([
      id,
      nome,
      texto_(dados.convidado, 120),
      texto_(dados.acompanhante, 120),
      texto_(dados.mensagem, 500),
      new Date(),
    ]);
    try {
      atualizarLista();
    } catch (erro) {
      // A reserva já foi gravada; a aba Lista se refaz na próxima vez.
    }
    return json_({ ok: true, escolhidos: lista.concat(id) });
  } finally {
    trava.releaseLock();
  }
}

/** Refaz a aba "Lista" com todos os presentes e quem escolheu cada um. */
function atualizarLista() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const porId = {};
  linhas_(aba_()).forEach((linha) => {
    const id = String(linha[0]).trim();
    if (id && !porId[id]) porId[id] = linha;
  });

  let lista = planilha.getSheetByName(ABA_LISTA);
  if (!lista) lista = planilha.insertSheet(ABA_LISTA, 0);
  lista.clear();

  const cabecalho = ["Categoria", "Presente", "Valor de referência", "Situação", "Quem escolheu", "Acompanhante", "Reservado em"];
  const linhas = PRESENTES.map((p) => {
    const reserva = porId[p[0]];
    return [
      p[1],
      p[2],
      p[3] === null ? "A confirmar" : p[3] / 100,
      reserva ? "Reservado" : "Livre",
      reserva ? reserva[2] : "",
      reserva ? reserva[3] : "",
      reserva ? reserva[5] : "",
    ];
  });
  const livres = linhas.filter((l) => l[3] === "Livre").length;

  lista.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]).setFontWeight("bold");
  lista.getRange(2, 1, linhas.length, cabecalho.length).setValues(linhas);
  lista.getRange(2, 3, linhas.length, 1).setNumberFormat('"R$" #,##0.00');
  lista.getRange(2, 7, linhas.length, 1).setNumberFormat("dd/mm/yyyy hh:mm");
  lista.setFrozenRows(1);

  // Reservados em verde, livres sem cor.
  lista.getRange(2, 1, linhas.length, cabecalho.length).setBackgrounds(
    linhas.map((l) => new Array(cabecalho.length).fill(l[3] === "Reservado" ? "#e6f0ea" : null)),
  );

  const resumo = linhas.length + 3;
  lista.getRange(resumo, 1, 2, 2).setValues([
    ["Reservados", linhas.length - livres],
    ["Livres", livres],
  ]);
  lista.getRange(resumo, 1, 2, 1).setFontWeight("bold");
  lista.autoResizeColumns(1, cabecalho.length);
}

/** Ao abrir a planilha: menu do chá e lista atualizada (pega linhas apagadas à mão). */
function onOpen() {
  SpreadsheetApp.getUi().createMenu("Chá").addItem("Atualizar lista", "atualizarLista").addToUi();
  atualizarLista();
}

/*
  LISTA DE PRESENTES DO SITE: [id, categoria, nome, preço em centavos ou null].
  Gerada a partir de src/data/presentes.ts com `npm run planilha`. Não edite à mão.
*/
// INICIO-PRESENTES
const PRESENTES = [
  ["jogo-de-panelas","Cozinha","Jogo de panelas antiaderente 5 peças",35624],
  ["frigideira","Cozinha","Kit de frigideiras antiaderentes (3 peças)",6400],
  ["air-fryer","Cozinha","Air fryer 6,5 litros com visor",null],
  ["liquidificador","Cozinha","Liquidificador 2,7 litros",10473],
  ["batedeira","Cozinha","Batedeira planetária",26305],
  ["cafeteira","Cozinha","Cafeteira elétrica 15 xícaras",10441],
  ["chaleira-eletrica","Cozinha","Chaleira elétrica 1,8 litro",3990],
  ["jogo-de-pratos","Cozinha","Jogo de pratos (aparelho de jantar 20 peças)",26650],
  ["jogo-de-pratos-pretos","Cozinha","Jogo de pratos rasos pretos (6 peças)",14129],
  ["jogo-de-copos","Cozinha","Jogo de copos de vidro 6 peças",2890],
  ["canecas","Cozinha","Canecas de porcelana (kit com 6)",7290],
  ["faqueiro","Cozinha","Faqueiro 24 peças",6049],
  ["escorredor","Cozinha","Escorredor de louça 20 pratos",8168],
  ["potes","Cozinha","Potes herméticos (kit com 10)",7713],
  ["porta-temperos","Cozinha","Porta-temperos giratório (12 potes)",5990],
  ["lixeira-cozinha","Cozinha","Lixeira de cozinha com pedal 12 litros",9500],
  ["utensilios","Cozinha","Utensílios de cozinha em silicone (kit 12 peças)",3379],
  ["tabua-de-corte","Cozinha","Tábuas de corte (kit com 3)",7290],
  ["jogo-de-facas","Cozinha","Jogo de facas com cepo (6 peças)",7319],
  ["panela-de-pressao","Cozinha","Panela de pressão antiaderente 4,5 litros",16190],
  ["assadeiras","Cozinha","Jogo de assadeiras antiaderentes (2 peças)",6987],
  ["refratarios","Cozinha","Refratários de vidro (kit com 3)",7949],
  ["micro-ondas","Cozinha","Micro-ondas 20 litros",41422],
  ["tacas","Cozinha","Taças de vinho (kit com 6)",4490],
  ["garrafa-termica","Cozinha","Garrafa térmica 1 litro",null],
  ["panos-de-prato","Cozinha","Panos de copa (kit com 6)",6231],
  ["jogo-americano","Cozinha","Jogo americano (kit com 6)",3089],
  ["escorredor-de-massa","Cozinha","Escorredores de macarrão e de arroz (kit com 2)",5498],
  ["ralador","Cozinha","Ralador 4 faces com coletor",3390],
  ["jogo-de-cama","Quarto","Jogo de cama casal 4 peças",7119],
  ["edredom","Quarto","Edredom casal queen com porta-travesseiros (3 peças)",7109],
  ["cobertor","Quarto","Cobertor casal de microfibra",5700],
  ["caixas-organizadoras","Quarto","Caixas organizadoras dobráveis (kit com 4)",6890],
  ["cabides","Quarto","Cabides de veludo (kit com 50)",6989],
  ["protetor-de-colchao","Quarto","Protetor de colchão impermeável casal",9688],
  ["sapateira","Quarto","Sapateira de 3 andares",5568],
  ["jogo-de-toalhas","Banheiro","Jogo de toalhas 4 peças",7551],
  ["tapete-banheiro","Banheiro","Tapetes de banheiro (kit com 2)",3238],
  ["kit-acessorios-banheiro","Banheiro","Kit de acessórios de parede 5 peças",4290],
  ["porta-sabonete","Banheiro","Kit para banheiro 6 peças (com porta-sabonete líquido)",7490],
  ["lixeira-banheiro","Banheiro","Lixeira de banheiro com pedal 5 litros",4499],
  ["prateleiras-banheiro","Banheiro","Prateleiras sem furo (kit com 2)",3590],
  ["varal","Lavanderia e limpeza","Varal sanfonado de parede 1 metro",12990],
  ["ferro-a-vapor","Lavanderia e limpeza","Ferro a vapor",17746],
  ["cesto-de-roupas","Lavanderia e limpeza","Cesto de roupas com tampa",5047],
  ["baldes","Lavanderia e limpeza","Baldes 20 litros (kit com 2)",6999],
  ["kit-limpeza","Lavanderia e limpeza","Kit de limpeza: mop giratório com balde",5267],
  ["aspirador","Lavanderia e limpeza","Aspirador de pó vertical 2 em 1",16490],
  ["kit-vassoura-rodo","Lavanderia e limpeza","Kit vassoura, rodo e pá",9898],
  ["prendedores","Lavanderia e limpeza","Kit de prendedores de roupa emborrachados (24 unidades)",3290],
  ["lampadas-led","Utilidades","Lâmpadas LED 9 W (kit com 10)",3499],
  ["luminaria","Sala e decoração","Luminária de mesa",3990],
  ["relogio","Sala e decoração","Relógio de parede silencioso",9999],
  ["almofadas","Sala e decoração","Almofadas 45 x 45 (kit com 4)",8990],
  ["manta-sofa","Sala e decoração","Manta para sofá",6288],
  ["cesto-organizador","Sala e decoração","Cestos organizadores aramados (kit com 2)",7000],
  ["ventilador","Sala e decoração","Ventilador de coluna 40 cm",21900],
  ["tapete-sala","Sala e decoração","Tapete para sala 2,00 x 1,40 m",7649],
  ["mesa-de-centro","Sala e decoração","Mesa de centro redonda com cesto",27520],
  ["mesas-de-apoio","Sala e decoração","Mesas de apoio (kit com 2)",13890],
  ["luminaria-de-chao","Sala e decoração","Luminária de chão articulada 1,9 m",15547],
  ["espelho-redondo","Sala e decoração","Espelho redondo decorativo 61 cm",16999],
  ["porta-retratos","Sala e decoração","Porta-retratos 10 x 15 (kit com 10)",7890],
  ["puff","Sala e decoração","Puff redondo",6990],
  ["difusor-de-aromas","Sala e decoração","Kit de difusores de aromas com varetas (3 unidades)",5690],
];
// FIM-PRESENTES
