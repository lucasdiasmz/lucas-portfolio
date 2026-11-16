# Design System "Neon" — especificação para implementar no portfólio

Repositório: `lucasdiasmz/lucas-portfolio` (site publicado em https://lucas-dias-dev.vercel.app/).

## Objetivo

Trocar a identidade de cores do site (hoje: azul `#548cff` sobre `#050505`) por **preto e branco com acentos neon (ciano + magenta)**, sem mudar layout, animações, textos ou comportamento. Um protótipo ao vivo já foi validado visualmente: foto do herói em preto e branco, e no hover da foto o rosto "acende" com magenta e ciano neon.

## Contexto técnico (levantado do build publicado, confirme no código-fonte)

- Tailwind v4 com tokens em `@theme`: `--color-night`, `--color-ember`, `--color-flame`, `--color-glow`, `--color-brand-300/400/500/600/700`, `--color-danger/success/warning`.
- CSS customizado: `.site-bg` (+ `__video`, `::before`, `::after`), `.frame-glow`, `.hp__*` (herói: `.hp__orbit`, `.hp__halo`, `.hp__card`, `.hp__img`, `.hp__chip`), `.btn-fire`, `.gf-*`, `.so`.
- Há cores **hardcoded no JS/TSX** (SVG `stopColor`, canvas `rgb(84 140 255 / …)`, arrays de partículas, classes Tailwind arbitrárias como `shadow-[0_0_10px_#548cff]`).
- O efeito de máscara do herói é um `<canvas class="hp__reveal">` que revela `/foto-cyber.webp`. **As cores do hover vêm dessa imagem**, não do CSS.
- Fonte: Michroma (manter).

## Paleta

| Papel | Token sugerido | Valor |
|---|---|---|
| Fundo | `--color-night` | `#000000` |
| Texto | (branco) | `#ffffff` |
| Neon principal (ciano) | `--color-neon-cyan` (= brand-500 / ember) | `#00f0ff` |
| Neon secundário (magenta) | `--color-neon-magenta` (novo) | `#ff2bd6` |
| Texto sobre neon | — | `#000000` |

Escala do antigo azul, agora em ciano: `brand-300/glow #7df9ff`, `brand-400 #33f5ff`, `brand-500/ember #00f0ff`, `brand-600/flame #00b8d9`, `brand-700 #0094b0`.

Manter como estão: `--color-danger`, `--color-success`, `--color-warning` e as cores das logos de tecnologia (Java laranja, React ciano etc.).

## Mapa de substituição

Aplicar em CSS, TSX/JSX e arrays de cores. Preservar o sufixo de alpha nos hex de 8 dígitos (ex.: `#548cff59` vira `#00f0ff59`).

| Antigo | Novo |
|---|---|
| `#548cff` | `#00f0ff` |
| `#93b3ff` | `#7df9ff` |
| `#3d73e6` | `#00b8d9` |
| `#7199ff` | `#33f5ff` |
| `#2f5bbf` | `#0094b0` |
| `#cfe0ff` | `#e6fdff` |
| `#e6efff` | `#ffffff` |
| `#050505` | `#000000` |
| `#0d1119` | `#0d0d0d` |
| `#0b1222` | `#0a0a0a` |
| `#181e2c` | `#1a1a1a` |
| `#10141d` | `#111111` |
| `#080c18` | `#080808` |
| `#0b0d12` | `#0a0a0a` |
| `#0e1118` | `#0d0d0d` |
| `#1d3670` | `#262626` |

Formas `rgb()` (CSS e canvas):

| Antigo | Novo |
|---|---|
| `rgb(84 140 255 …)` | `rgb(0 240 255 …)` |
| `rgb(147 179 255 …)` | `rgb(125 249 255 …)` |
| `rgb(186 208 255 …)` | `rgb(190 251 255 …)` |
| `rgb(14 22 44)` | `rgb(20 20 20)` |
| `rgb(6 8 16)` | `rgb(8 8 8)` |
| `rgb(5 8 18 …)` | `rgb(8 8 8 …)` |

Atenção: classes Tailwind arbitrárias contêm o hex no nome (`shadow-[0_0_10px_#548cff]`). Troque no TSX **e** deixe o Tailwind regenerar o CSS.

## Regras de implementação (importante)

1. **Centralize.** Não faça só busca e troca de hex. Os valores novos devem viver nos tokens do `@theme`, e o JS/TSX deve usar os tokens (via classes Tailwind ou constantes em um único arquivo, por exemplo `theme.ts`). O objetivo é que uma futura troca de paleta mexa em um lugar só.
2. **Texto sobre fundos neon é preto.** Onde hoje há texto branco sobre azul sólido ou gradiente (botão `.btn-fire`, pill "PT", botão "Enviar mensagem", `bg-brand-500`), use `#000` para manter contraste.
3. **Títulos `h1` e `h2` em branco** com brilho: `text-shadow: 0 0 22px rgba(0,240,255,.45), 0 0 60px rgba(255,43,214,.18)`. Spans de destaque dentro dos títulos continuam neon.
4. **Foto do herói em preto e branco:** `.hp__img { filter: grayscale(1) contrast(1.08); }`.
5. **Gradiente neon (ciano → magenta)** nos pontos de destaque:
   - `.btn-fire`: `linear-gradient(90deg, #00f0ff, #ff2bd6)`, texto `#000`, sombra `0 6px 28px rgba(0,240,255,.35)`; no hover, sombra `0 10px 38px rgba(255,43,214,.5)`.
   - `.frame-glow::before`: `linear-gradient(45deg, #00b8d9, #00f0ff, #ff2bd6, #00f0ff, #00b8d9)` com `background-size: 300% auto`.
   - Barra de progresso de rolagem: de `brand-400` até magenta (`--tw-gradient-to: #ff2bd6`).
   - Ponto da órbita `.hp__orbit::after`: fundo `#ff2bd6`, `box-shadow: 0 0 14px 3px rgba(255,43,214,.85)`.
   - `::selection`: fundo `#ff2bd6`, texto `#000`.
6. **Fundo (`.site-bg`):**
   - Base `#000`; vídeo com `opacity: .22` e `filter: blur(6px) grayscale(1) contrast(1.15)` (remover o `hue-rotate`).
   - `::before`: glow radial no topo `rgba(0,240,255,.10)`, grade branca a 4% de opacidade (56px), vinheta `radial-gradient(rgba(0,0,0,.45), rgba(0,0,0,.88))`.
   - `::after` (orbe desfocado): `rgba(255,43,214,.07)`.
7. `theme-color` no `index.html`: `#000000`.

## Imagem do efeito de máscara (obrigatório)

`public/foto-cyber.webp` (720×853) tem hoje rosa e ciano. É preciso **gerar uma nova versão** com a paleta neon, mantendo dimensões, enquadramento e transparência:

- Pixels rosados (matiz 280°–360° e 0°–6°, saturação > 0,30): levar o matiz para **312°** (magenta `#ff2bd6`), aumentando a saturação ~8% e a luminosidade ~5% (teto 0,85).
- Pixels ciano (matiz 150°–225°, saturação > 0,25): levar o matiz para **183°** (`#00f0ff`).
- Demais pixels (pele, roupa, fundo): intactos. Preservar o canal alfa.
- Exportar como WebP com qualidade alta. Pode usar Python com Pillow e `colorsys`, ou outra ferramenta de sua escolha.

## Verificação (rodar antes de entregar)

1. `npm run build` sem erros e sem avisos novos.
2. Busca final no código-fonte por restos do azul antigo: `548cff`, `93b3ff`, `3d73e6`, `84 140 255`, `147 179 255`, `186 208 255`. Só podem sobrar as cores das logos de tecnologia.
3. Conferir visualmente no desktop e no mobile: herói (incluindo hover do rosto, que deve mostrar magenta de um lado e ciano do outro), Sobre, "Ideias → Código", órbita "O que estudo", Projetos e Contato (formulário).
4. Contraste: todo texto com razão mínima de 4,5:1 (3:1 para texto grande). Ponto de atenção: botões em gradiente com texto preto.
5. Não alterar layout, textos, rotas nem lógica.

## Entrega

- Trabalhar em uma **branch nova** (ex.: `feat/design-system-neon`). Não commitar na `main` nem fazer push sem aprovação.
- Commits pequenos e descritivos (tokens, componentes, imagem).
- No final, resumir: arquivos alterados, o que foi centralizado em tokens e qualquer cor que ficou de fora e por quê.
