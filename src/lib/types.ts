export type Categoria = {
  slug: string;
  nome: string;
};

export type Presente = {
  id: string;
  categoria: string;
  nome: string;
  cor: string | null;
  descricao: string | null;
  /** Centavos. null = "A confirmar". */
  preco: number | null;
  consultadoEm: string | null;
  loja: string | null;
  link: string | null;
  outraLoja: string | null;
  outroLink: string | null;
  outroPreco: number | null;
  /** true = já escolhido por alguém (o casal marca depois de receber a confirmação). */
  escolhido: boolean;
  /** Opcional: foto em /public (ex.: "/presentes/air-fryer.jpg"), sem o BASE_PATH. */
  imagem?: string;
  /** true = a foto é do anúncio da "outra opção", não do link principal. */
  imagemDaOutraOpcao?: boolean;
};
