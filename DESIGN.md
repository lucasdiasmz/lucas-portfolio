---
name: Lucas Dias Melo — Portfólio
description: Página única em modo escuro, preto e branco com dois acentos neon, tipografia larga e vidro fosco. O cursor é a fonte de luz.
colors:
  night: "#000000"
  paper: "#ffffff"
  neon-cyan: "#00f0ff" # destaque principal (ember / brand-500)
  neon-magenta: "#ff2bd6" # contraponto
  glow: "#7df9ff" # brand-300
  flame: "#00b8d9" # brand-600
  mist: "#a3a3a3"
  danger: "#ff6b6b"
  success: "#4ade80"
  warning: "#fbbf24"
typography:
  family: "Michroma, ui-sans-serif, system-ui, sans-serif"
  body: "0.9375rem / 1.8"
  section-title: "clamp(2rem, 6vw, 4.5rem), branco com brilho ciano + magenta"
  hero-name: "clamp(2.3rem, 6.4vw, 4.2rem)"
  statement: "clamp(2.6rem, 11vw, 8rem), caixa alta"
  label: "0.62–0.7rem, tracking 0.2–0.4em, caixa alta"
---

# Design

## Direção

Portfólio de página única em modo escuro: fundo preto, texto branco e dois acentos neon (ciano principal, magenta de contraponto). A ideia central é uma só: **o cursor é a fonte de luz**. Ele acende a grade do fundo, a borda e o interior dos cartões de vidro, o reflexo dos botões, o vidro das pastas e a versão colorida da foto. Todo o resto fica quieto.

Os tokens de cor vivem no `@theme` de `src/index.css`; o JS lê por `src/theme.js`.

## Superfícies

- **Fundo (`.site-bg`):** quadro parado desfocado, trocado pelo vídeo desenhado num canvas de 256 × 144 ampliado (sem filtro de blur em tela cheia), grade de 56px a 4% de branco, brilho ciano no topo e uma esfera magenta em degradê radial.
- **Vidro (`.glass`):** borda branca a 8%, `backdrop-filter: blur(6px)`, raio 24px. A borda acende perto do cursor (`--lx/--ly`). Com `.glass-hover`, sobe 6px.
- **Brilhos de seção (`.aura`):** degradê radial, nunca `blur()` grande.
- **Menu cinético (`src/components/ui/KineticMenu.jsx`):** barra fixa com logo, idioma e botão "Menu". Abre um painel lateral em três camadas (ciano, magenta, fundo escuro) com os links subindo de trás de uma máscara e uma forma abstrata por link. Animado com GSAP, baixado sob demanda. No desktop também há o trilho lateral (`.rail`); no celular, botão de voltar ao topo.

## Ações

- **`.btn-fire`:** gradiente ciano → magenta com texto preto. **`.btn-ghost`:** contorno. **`.icon-tile`:** ícones de contato.
- Os três são puxados alguns pixels pelo cursor (ímã) e voltam com mola; todos têm estado de pressionado.

## Movimento

Quem decide quando algo anima é o núcleo em `src/motion/`; o CSS só descreve como.

| Módulo | Papel |
| --- | --- |
| `frame.js` | Um `requestAnimationFrame` para o site, leituras antes das escritas; sem tarefa, não há quadro |
| `scroll.js` | Um listener de scroll; assinantes recebem o estado uma vez por quadro |
| `inview.js` | `IntersectionObserver` compartilhado |
| `sections.js` | Seção ativa, hero visível e `[data-idle]` (pausa animações em laço fora da tela) |
| `pointer.js` | Luz e ímã do cursor, delegados no documento |
| `store.js`, `hooks.js` | Stores reativos e hooks (`useReveal`, `useScrollProgress`, `useFlip`, `usePointerVars`) |

- **Abertura + hero:** uma sequência só. A hero espera a cortina (`--boot`) e os blocos entram em cascata.
- **Entradas (`Reveal`, `SplitTitle`):** opacidade e transform; ao terminar (`data-seen="done"`) o elemento volta às transições dele.
- **Processo:** as três etapas acendem conforme a rolagem (`--p`).
- **Pulverização (`useDust`):** o que passa do topo vira poeira e volta ao rolar de volta.
- Curvas: `--ease-out-expo` para entradas, `--ease-spring` para o que volta ao lugar.

## Regras

- Animar só `transform` e `opacity`. Nada de `blur()` animado nem `backdrop-filter` em elemento que se move em laço.
- Estado que muda a cada quadro vai direto para o DOM (variável CSS ou transform), nunca por `setState`.
- Ciano e magenta são as únicas cores de marca; cores de outras marcas só nos ícones de tecnologia.
- Texto sobre neon é preto. Nada abaixo de `neutral-400` para texto.
- Tudo é desligado com `prefers-reduced-motion`.
- Todo texto novo precisa das versões PT e EN.
