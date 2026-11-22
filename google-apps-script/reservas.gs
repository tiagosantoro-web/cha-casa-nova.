/*
  RESERVAS DO CHÁ DE CASA NOVA
  Script da planilha do Google que guarda os presentes já escolhidos.
  Como instalar: veja "Bloquear presentes automaticamente" no README.

  Guarda só o id do presente e a data da reserva (nenhum dado do convidado).
  Para liberar um presente, apague a linha dele na aba "Reservas".
*/
const ABA = "Reservas";

function aba_() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.insertSheet(ABA);
    aba.appendRow(["Presente (id)", "Reservado em"]);
  }
  return aba;
}

function reservados_(aba) {
  const linhas = aba.getLastRow();
  if (linhas < 2) return [];
  return aba
    .getRange(2, 1, linhas - 1, 1)
    .getValues()
    .map((linha) => String(linha[0]).trim())
    .filter(Boolean);
}

function json_(dados) {
  return ContentService.createTextOutput(JSON.stringify(dados)).setMimeType(ContentService.MimeType.JSON);
}

/** Lista dos presentes reservados. */
function doGet() {
  return json_({ ok: true, escolhidos: reservados_(aba_()) });
}

/** Reserva um presente: { "id": "air-fryer" }. Recusa se alguém já reservou. */
function doPost(e) {
  let id = "";
  try {
    id = String(JSON.parse(e.postData.contents).id || "");
  } catch (erro) {
    // corpo inválido: tratado abaixo
  }
  if (!/^[a-z0-9-]{1,80}$/.test(id)) return json_({ ok: false, motivo: "invalido" });

  // A trava impede que duas pessoas reservem o mesmo item ao mesmo tempo.
  const trava = LockService.getScriptLock();
  if (!trava.tryLock(10000)) return json_({ ok: false, motivo: "ocupado" });
  try {
    const aba = aba_();
    const lista = reservados_(aba);
    if (lista.indexOf(id) !== -1) return json_({ ok: false, motivo: "ja-escolhido", escolhidos: lista });
    aba.appendRow([id, new Date()]);
    return json_({ ok: true, escolhidos: lista.concat(id) });
  } finally {
    trava.releaseLock();
  }
}
