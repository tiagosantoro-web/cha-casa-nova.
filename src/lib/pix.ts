/**
 * Pix "copia e cola" (BR Code estático, padrão EMV do Banco Central).
 * O convidado cola o código no app do banco e o valor já vem preenchido.
 */

/** Campo EMV: id + tamanho com 2 dígitos + valor. */
function campo(id: string, valor: string): string {
  return id + String(valor.length).padStart(2, "0") + valor;
}

/** Sem acentos, só caracteres aceitos pelos bancos, em maiúsculas. */
function limpar(texto: string, max: number): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .trim()
    .toUpperCase()
    .slice(0, max);
}

/** CRC16-CCITT (polinômio 0x1021, início 0xFFFF), exigido no fim do código. */
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

type DadosPix = {
  chave: string;
  nome: string;
  cidade: string;
  /** Centavos. null = o convidado digita o valor no banco. */
  valor: number | null;
  /** Identificador que aparece no extrato (até 25 letras e números). */
  identificador?: string;
};

export function codigoPix({ chave, nome, cidade, valor, identificador }: DadosPix): string {
  const conta = campo("00", "br.gov.bcb.pix") + campo("01", chave);
  const txid = limpar(identificador ?? "", 25).replace(/ /g, "") || "***";
  const payload =
    campo("00", "01") +
    campo("26", conta) +
    campo("52", "0000") +
    campo("53", "986") +
    (valor ? campo("54", (valor / 100).toFixed(2)) : "") +
    campo("58", "BR") +
    campo("59", limpar(nome, 25)) +
    campo("60", limpar(cidade, 15)) +
    campo("62", campo("05", txid)) +
    "6304";
  return payload + crc16(payload);
}

/** true quando a chave Pix foi preenchida em evento.ts. */
export function pixValido(chave: string): boolean {
  return chave.trim().length > 0;
}
