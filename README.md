# Chá de casa nova — Tiago & Amanda

Convite digital com lista de presentes opcional. O convidado confirma presença (com ou sem presente), informa nome e acompanhante, e envia pelo WhatsApp a mensagem pronta para o casal.

Site 100% estático: sem banco de dados, sem servidor e sem senhas. Feito com Next.js 16, React 19, TypeScript e Tailwind CSS 4.

## Como funciona

1. O convidado abre o convite e vê data, horário e endereço (botão "Como chegar" no Google Maps).
2. Toca em **Confirmar presença** (sem presente) ou, se quiser presentear, filtra a lista por categoria e toca em **Escolher este presente**.
3. Informa nome completo, se leva acompanhante (e o nome dele) e uma mensagem opcional.
4. Confere o resumo e toca em **Confirmar minha escolha**. O WhatsApp abre com a mensagem pronta para o número do casal; o convidado só precisa enviar.
5. No aparelho do convidado, o presente escolhido aparece como "Você escolheu este presente".

O site deixa claro que o presente é opcional: no convite, no quadro "Presente é opcional" da lista, nas perguntas frequentes e no convite final.

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

- Foto do casal: `public/casal.jpg` (1200×900), ligada em `foto` no `evento.ts`. No topo, ela se funde ao fundo escuro (classe `hero-photo` em `globals.css`); para trocar, substitua o arquivo mantendo o nome.
- Presentes: as fotos ficam em `public/presentes/` e foram baixadas do anúncio principal de cada item na Amazon (conferidas uma a uma). Sem foto, o card mostra um painel neutro com "Veja as fotos na loja". Para pôr uma foto, salve o arquivo em `public/presentes/` com o `id` do item no nome (ex.: `almofadas.jpg`; aceita .jpg, .jpeg, .png e .webp) e gere o site de novo: a foto entra sozinha, sem editar código. Item sem foto hoje: `almofadas` (64 dos 65 itens têm foto).

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

Depois publique o conteúdo de `out/` no ramo `gh-pages`, com um arquivo `.nojekyll` vazio (sem ele, o GitHub ignora a pasta `_next`). As fotos em `public/` recebem o prefixo do `BASE_PATH` automaticamente.

Depois de publicar, preencha `siteUrl` em `src/data/evento.ts` com o endereço final e publique de novo. É o que faz a imagem de prévia aparecer quando o link é compartilhado no WhatsApp.

## Lista de presentes

65 itens em 6 categorias: Cozinha, Quarto, Banheiro, Lavanderia e limpeza, Ferramentas e utilidades e Sala e decoração.

Os critérios são:

- Combinação preto, inox e prata.
- Menor preço com avaliações razoáveis.
- Kit como sugestão principal sempre que o item é vendido em kit. Exemplos: o porta-sabonete líquido virou um kit de banheiro com 6 peças; a tábua de corte e o cesto aramado também viraram kits.

A lista original foi validada em 19/11/2026.

Em 21/11/2026 entraram 23 itens pensando na primeira casa, sem repetir os anteriores. Cada link foi conferido da mesma forma.

- **Cozinha:** facas com cepo, panela de pressão, assadeiras, refratários, micro-ondas, taças, garrafa térmica, panos de copa, jogo americano, escorredores e ralador.
- **Quarto:** protetor de colchão, cortina blackout e sapateira.
- **Lavanderia e limpeza:** aspirador vertical, kit vassoura, rodo e pá e prendedores.
- **Ferramentas e utilidades (categoria nova):** maleta de ferramentas, furadeira, filtro de linha e lâmpadas LED.
- **Sala:** ventilador de coluna e tapete.

Alguns itens fogem da paleta porque só existem nessas cores: a furadeira laranja, o kit de limpeza verde e os prendedores coloridos.

Uma escada de 3 degraus ficou de fora, porque a Amazon bloqueou a conferência na hora.

- Todos os links principais são da Amazon e foram abertos em 19/11/2026 para conferir produto, cor, estoque e preço. Preços mudam com frequência.
- Mercado Livre e Magazine Luiza bloqueiam a conferência automática (tela de verificação ou erro 403). Links do Mercado Livre ficaram só como "outra opção", sem preço. Links da Magazine Luiza e do Carrefour (um deles quebrado) foram removidos.
- Eletroportáteis: confira a voltagem (127 V ou 220 V).
- Itens com poucas unidades em estoque na consulta trazem esse aviso na descrição: canecas, porta-temperos, varal, cesto de roupas e escorredores de massa.
- Micro-ondas: a versão 110 V estava sem oferta direta da Amazon, então o link principal é a 220 V, e a 110 V fica como outra opção.
- O kit de banheiro de 6 peças já inclui uma lixeira pequena; a lixeira com pedal continua na lista como presente separado.

## Testes realizados

- Fluxo completo do convidado no celular (375 px): campos obrigatórios, resumo, link `wa.me` com o número configurado e a mensagem no formato combinado, tela final, card "Você escolheu este presente" e escolha lembrada no aparelho.
- Redesign (17/11/2026): capturas no celular (375 px) e desktop (1280 px) de todas as seções, dos cards e da janela de confirmação; mensagem do WhatsApp conferida nos modos "só presença" e "com presente".
- Lista (19/11/2026): 79 links abertos; corrigidos 2 produtos esgotados (panelas e escorredor), 1 sem estoque na Amazon (batedeira), 3 links quebrados (lixeira de cozinha, prateleiras, utensílios), 1 cor errada (relógio branco no lugar de preto) e 1 página de busca no lugar de produto (toalhas). As 41 fotos citadas existem e carregam no navegador.
- Inclusão de 21/11/2026:
  - 23 páginas de produto abertas para conferir produto, cor, estoque, preço e avaliações.
  - As 64 fotos carregam no navegador, em 375 e 1440 px.
  - A aba "Ferramentas e utilidades" filtra corretamente.
  - Nenhum erro no console.
- Sem rolagem horizontal em 320, 375, 480, 768, 1024 e 1440 px.
- `tsc`, ESLint e `next build` (exportação estática) sem erros.
- Lighthouse ainda não foi executado.

## Pendências do casal

1. Data e horário.
2. Endereço completo.
3. Número de WhatsApp que receberá as confirmações.
4. Endereço final do site (domínio ou link da Vercel/GitHub Pages).

## Publicação atual

No ar em https://tiagosantoro-web.github.io/cha-casa-nova./ (GitHub Pages, ramo `gh-pages` do repositório `tiagosantoro-web/cha-casa-nova.`).

Para atualizar depois de editar os dados: gere com `BASE_PATH=/cha-casa-nova. npm run build` (no Git Bash do Windows, prefixe com `MSYS_NO_PATHCONV=1`), copie o conteúdo de `out/` para o ramo `gh-pages` junto com um `.nojekyll` vazio e envie. O GitHub atualiza o site em cerca de 1 minuto.

Se o repositório for renomeado (por exemplo, para tirar o ponto do fim), o `BASE_PATH` e o endereço mudam junto: gere de novo com o nome novo.
