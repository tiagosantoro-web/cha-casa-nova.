# Chá de casa nova — Tiago & Amanda

Convite digital com lista de presentes. O convidado escolhe um presente, informa nome e acompanhante, e confirma pelo WhatsApp com a mensagem pronta para o casal.

Site 100% estático: sem banco de dados, sem servidor e sem senhas. Feito com Next.js 16, React 19, TypeScript e Tailwind CSS 4.

## Como funciona

1. O convidado abre o convite e vê data, horário e endereço (botão "Como chegar" no Google Maps).
2. Na lista, filtra por categoria e toca em **Quero presentear**.
3. Informa nome completo, se leva acompanhante (e o nome dele) e uma mensagem opcional.
4. Confere o resumo e toca em **Confirmar minha escolha**. O WhatsApp abre com a mensagem pronta para o número do casal; o convidado só precisa enviar.
5. No aparelho do convidado, o presente aparece como "Você escolheu este presente".

**Importante:** sem banco de dados, o site não bloqueia o presente para os outros convidados automaticamente. Quando o casal receber a confirmação, deve marcar o presente como escolhido (veja abaixo). A partir da nova publicação, ele aparece como "Presente já escolhido" para todos.

## Onde editar

| O quê | Arquivo |
|---|---|
| Data, horário, endereço, WhatsApp, foto, textos do convite | [src/data/evento.ts](src/data/evento.ts) |
| Lista de presentes, preços, links e "já escolhido" | [src/data/presentes.ts](src/data/presentes.ts) |
| Perguntas frequentes e "Como funciona" | [src/components/site/sections.tsx](src/components/site/sections.tsx) |
| Formato da mensagem do WhatsApp | [src/lib/whatsapp.ts](src/lib/whatsapp.ts) |

### Marcar um presente como escolhido

Em `src/data/presentes.ts`, troque `escolhido: false` por `escolhido: true` no presente e publique de novo.

### Configurar o WhatsApp

Em `src/data/evento.ts`, preencha `whatsapp` com DDI 55 + DDD + número, só dígitos (ex.: `"5511987654321"`). Enquanto estiver vazio, a janela de confirmação avisa que o WhatsApp ainda está sendo configurado, e o botão "Falar com o casal" não aparece.

### Fotos

- Foto do casal: coloque o arquivo em `public/` (ex.: `public/casal.jpg`) e preencha `foto: "/casal.jpg"`.
- Foto de um presente: coloque em `public/presentes/` e acrescente `imagem: "/presentes/air-fryer.jpg"` no item. Sem foto, o card mostra um ícone da categoria.

## Rodar no computador

Requisitos: Node.js 20.9 ou superior.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera a pasta out/ com o site pronto
```

## Publicar

A pasta `out/` gerada pelo `npm run build` é o site completo.

**Vercel (mais simples):** importe o repositório em vercel.com. O Next.js é detectado sozinho, não precisa de variáveis.

**GitHub Pages:** o site fica em uma subpasta (`/nome-do-repositorio`). Gere com:

```bash
BASE_PATH=/nome-do-repositorio npm run build
```

Depois publique o conteúdo de `out/` no ramo `gh-pages`, com um arquivo `.nojekyll` vazio (sem ele, o GitHub ignora a pasta `_next`). Com `BASE_PATH`, imagens em `public/` precisam do prefixo no caminho (ex.: `"/nome-do-repositorio/casal.jpg"`).

Depois de publicar, preencha `siteUrl` em `src/data/evento.ts` com o endereço final e publique de novo. É o que faz a imagem de prévia aparecer quando o link é compartilhado no WhatsApp.

## Lista de presentes

42 itens em 5 categorias, na combinação preto, inox e prata, priorizando o menor preço com avaliações razoáveis. Pesquisa feita em 17/11/2026 em Amazon, Mercado Livre, Magazine Luiza e Carrefour.

- Preços são referências daquela data e mudam com frequência. Sem preço confirmado: "A confirmar".
- Lojas marcadas com "busca" levam a uma página de resultados, usada quando o anúncio mais barato não tinha link próprio confirmado.
- Eletroportáteis: confira a voltagem (127 V ou 220 V).
- Ferro de passar: não encontramos ferro a vapor preto econômico confirmado; ficou um modelo preto e cromado com preço a confirmar.
- Caixas organizadoras: não encontramos opção econômica em tecido preto; a sugestão é de caixas pretas com tampa.

## Testes realizados

- Fluxo completo do convidado no celular (375 px): campos obrigatórios, resumo, link `wa.me` com o número configurado e a mensagem no formato combinado, tela final, card "Você escolheu este presente" e escolha lembrada no aparelho.
- Sem rolagem horizontal em 320, 375, 480, 768, 1024 e 1440 px.
- `tsc`, ESLint e `next build` (exportação estática) sem erros.
- Lighthouse ainda não foi executado.

## Pendências do casal

1. Data e horário.
2. Endereço completo.
3. Número de WhatsApp que receberá as confirmações.
4. Endereço final do site (domínio ou link da Vercel/GitHub Pages).
5. Foto do casal (opcional).
