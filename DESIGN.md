---
name: Lucas Dias Melo — Portfólio
description: Página única em modo escuro, com grade fina, brilho laranja, tipografia larga e cartões de vidro.
colors:
  night: "#090909"
  coal: "#121212"
  ember: "#fa6e00"
  flame: "#e60026"
  glow: "#ff9a3c"
  accent-text: "#fb923c" # orange-400 (títulos de seção)
  accent-strong: "#f97316" # orange-500 (nome, ícones)
  text: "#ffffff"
  text-muted: "#a3a3a3"
  danger: "#ff6b6b"
  success: "#4ade80"
  warning: "#fbbf24"
typography:
  family: "Michroma, ui-sans-serif, system-ui, sans-serif"
  body: "0.9375rem / 1.8"
  section-title: "clamp(2rem, 6vw, 4.5rem), orange-400, brilho laranja"
  hero-name: "clamp(2.1rem, 6vw, 3.9rem), orange-500"
  statement: "clamp(2.6rem, 11vw, 8rem), caixa alta"
  label: "0.65–0.7rem, tracking 0.3–0.4em, caixa alta"
---

# Design

## Direção

Portfólio de página única em modo escuro, no estilo de estúdio digital: fundo quase preto, uma única cor de destaque (laranja) e movimento em quase tudo que entra na tela. A estrutura segue um modelo de referência (topo → sobre → processo → habilidades → serviços/foco → projetos → contato → rodapé), com o conteúdo e os textos do Lucas.

## Superfícies

- **Fundo (`.site-bg`):** `#090909` + grade de 56px a 3,5% de branco + dois brilhos radiais (laranja no topo, vermelho no canto) + uma esfera laranja desfocada que passeia devagar.
- **Vidro (`.glass`):** borda branca a 8%, gradiente de branco 6% para preto 35%, `backdrop-filter: blur(6px)`, raio 24px. Com `.glass-hover`, sobe 6px e ganha borda e sombra laranja.
- **Navbar (`.navbar`):** pílula de vidro flutuante com brilho que atravessa a cada 5s; borda e sombra laranja no hover. Some ao rolar para baixo e volta ao subir.

## Ações

- **`.btn-fire`:** pílula com gradiente `ember → flame`, sombra laranja, sobe 2px no hover. Ação principal (contato, enviar).
- **`.btn-ghost`:** pílula transparente com borda branca a 25%; borda e texto laranja no hover. Ação secundária.
- Botão de idioma: mesma pílula em gradiente, menor.

## Movimento

- **Abertura (`Intro`):** marca e nome com desfoque, cortina sobe em 1,3s. Uma vez por sessão.
- **`SplitTitle`:** títulos de seção surgem letra a letra (subida + desfoque, 35ms entre letras).
- **`Reveal`:** blocos sobem 32px e perdem desfoque ao entrar na tela; atrasos em passos de ~100ms.
- **`RollText`:** links da navbar trocam a letra de cima pela de baixo, em laranja, no hover.
- **Texto digitado** no topo, **cursor laranja** (ponto + anel com atraso; só com mouse), **barra de progresso** de leitura na lateral direita e **moldura com brilho** em movimento na foto.
- Curva padrão: `cubic-bezier(0.16, 1, 0.3, 1)`. Tudo é desligado com `prefers-reduced-motion`.

## Regras

- Laranja é a única cor de marca; as cores de outras marcas aparecem só nos ícones de tecnologia.
- Texto corrido em `neutral-200/300`, apoio em `neutral-400`; nada abaixo de `neutral-500` para texto.
- Sem texto em gradiente: títulos usam laranja sólido com `text-shadow` de brilho (`.glow-text`).
