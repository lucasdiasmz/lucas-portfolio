---
name: Lucas Dias Melo — Portfólio
description: Portfólio como programa de identidade industrial modernista italiano; cada projeto é um cartaz de máquina feito de formas chapadas.
colors:
  red: "#d23a16"
  blue: "#2337c6"
  sun: "#f5b31a"
  green: "#0f7a51"
  sky: "#c9d3ff"
  paper: "#f4f5f7"
  white: "#ffffff"
  ink: "#151515"
  graphite: "#4f535a"
  rule: "#d6d9de"
  danger: "#b42318"
  success: "#0f7a51"
  warning: "#8a5a00"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(4rem, 12vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.85
    letterSpacing: "-0.015em"
    fontVariation: "\"opsz\" 96, \"wdth\" 85"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.015em"
    fontVariation: "\"opsz\" 96, \"wdth\" 85"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.015em"
    fontVariation: "\"opsz\" 48, \"wdth\" 88"
  body:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Courier Prime, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: "0px"
  full: "9999px"
spacing:
  gutter: "16px"
  gutter-sm: "32px"
  container: "72rem"
  section: "96px"
  poster-gap: "96px"
  poster-gap-md: "128px"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  button-on-blue:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  button-on-blue-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
  button-secondary:
    textColor: "{colors.ink}"
    padding: "14px 4px"
  button-secondary-hover:
    textColor: "{colors.blue}"
  chip-filter:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "6px 14px"
  chip-filter-hover:
    backgroundColor: "{colors.sky}"
  chip-filter-active:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
  chip-status-progress:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.ink}"
    padding: "2px 8px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  input-field-focus:
    backgroundColor: "{colors.sky}"
  nav-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    height: "64px"
  footer-field:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
---

# Design System: Lucas Dias Melo — Portfólio

## Overview

**Creative North Star: "O Cartaz de Máquina"**

O site funciona como o programa de identidade de uma fábrica italiana dos anos 50-60 (Olivetti, Pintori): fundo branco frio, tinta preta e quatro cores chapadas que nunca se misturam em gradiente. Toda a imagem do site é construída com um único módulo quadrado 100x100 em que cabe uma forma geométrica (círculo, ponto, anel, meia-lua, arco, quarto de círculo, folha, quadrado, barras) girada em passos de 90°. Esse módulo compõe o mosaico 4x4 da abertura, o cartaz de cada projeto, a faixa de formas dos cabeçalhos internos e o canto do rodapé.

A tipografia fala em escala de cartaz: uma grotesca larga e pesada, comprimida pelo eixo de largura, para títulos; a mesma família em peso normal para leitura; e uma datilografada reservada para metadados (datas, períodos, contagens, legenda de composição). A densidade é baixa e o ritmo é vertical, com seções de 96px e cartazes alternando de lado.

O movimento é mecânico e com mola: formas entram girando e crescendo, peça a peça; o mosaico gira módulos perto do ponteiro; páginas trocam com View Transitions. Tudo isso desliga com prefers-reduced-motion. Rejeições confirmadas: visual escuro com neon e qualquer cara de template genérico (hero com foto + grade de cards iguais).

**Key Characteristics:**
- Cores chapadas com papéis fixos; nenhuma sombra, nenhum gradiente.
- Um módulo geométrico único, girado em quartos de volta.
- Retângulos sempre em canto vivo; curvas só como formas inteiras.
- Grotesca extra-negrito comprimida em escala de cartaz; datilografada só em metadados.
- Movimento com mola, montado peça a peça, sempre opcional.

## Colors

Paleta de cartaz industrial: papel frio, tinta preta e quatro cores puras, cada uma com um trabalho.

### Primary
- **Vermelhão de Ação** (red): ação e destaque. Botão principal, sobrenome no título de abertura, marcadores losango da stack, o "404", ponto da página Sobre na navegação, sublinhado do link "Embaralhar".

### Secondary
- **Ultramar Industrial** (blue): navegação e campos inteiros. Links de projeto, sublinhado do link secundário, contorno de foco, filtro ativo, campo de fundo do rodapé inteiro.
- **Céu Diluído** (sky): o ultramar diluído. Texto secundário sobre o rodapé azul, hover dos chips de filtro, fundo de campo em foco (a 40%).

### Tertiary
- **Amarelo-Sol** (sun): estado e andamento. Selo "em andamento", fundo da foto no mosaico, seleção de texto, ponto que corre dentro do botão principal, CTA sobre o rodapé azul, bloco de aviso do currículo.
- **Verde de Máquina** (green): sucesso e disponibilidade. Seção Contato, mensagem de envio concluído (via `success`, mesmo valor).

### Neutral
- **Papel Frio** (paper): fundo de página, barra de navegação translúcida (95%), fundo dos campos de formulário.
- **Branco** (white): superfícies elevadas por tom (seção Resumo, formulário, chips inativos) e texto sobre vermelhão/ultramar.
- **Tinta** (ink): texto principal, hover do botão principal, idioma ativo, sublinhado dos campos.
- **Grafite** (graphite): texto de apoio, links inativos de navegação, metadados.
- **Fio** (rule): divisórias de 1px na navegação, barra de filtros e lista de canais.
- **Estados de formulário**: `danger` para erros, `warning` para aviso de configuração, `success` para envio concluído.

### Named Rules
**A Regra do Papel Fixo.** Cada cor tem um trabalho e não o troca: vermelhão age, ultramar conduz, sol sinaliza estado, verde confirma. Uma cor nova de destaque não entra; um papel novo reutiliza a cor do papel mais próximo.

**A Regra da Seção com Cor.** Cada rota tem uma cor: Sobre = vermelhão, Projetos = ultramar, Currículo = sol, Contato = verde. Ela aparece no ponto da navegação e na faixa de formas do cabeçalho da página.

**A Regra da Tinta Chapada.** Cores são aplicadas em campos sólidos. Não há gradiente, transparência decorativa nem brilho; a única mistura é a foto em tons de cinza multiplicada sobre o amarelo-sol.

## Typography

**Display Font:** Bricolage Grotesque (com ui-sans-serif, system-ui)
**Body Font:** Bricolage Grotesque (mesma família, eixo óptico automático)
**Label/Mono Font:** Courier Prime (com ui-monospace)

**Character:** Uma grotesca com personalidade, apertada pelo eixo de largura até virar letra de cartaz, conversando com uma datilografada de ficha técnica que só aparece para fatos medidos.

### Hierarchy
- **Display** (800, clamp(4rem, 12vw, 6rem), 0.85): nome na abertura, títulos de página (variação clamp(3.5rem, 11vw, 6rem), 0.88), "404". Usa o eixo de cartaz (opsz 96, largura 85%).
- **Headline** (800, clamp(3rem, 6vw, 4.5rem), 0.9): títulos de seção da página inicial; o título do rodapé sobe para clamp(2.75rem, 7vw, 5.5rem).
- **Title** (800, clamp(2.25rem, 5vw, 3.5rem), 0.95): nome do projeto no cartaz. Usa o eixo compacto (opsz 48, largura 88%). Títulos menores de bloco usam 2rem com tracking -0.02em.
- **Body** (400, 1.0625rem, 1.6): texto corrido, em linhas de 46 a 62ch. Textos de abertura sobem para 1.125rem (lead) e 1.35rem (resumo).
- **Label** (Courier Prime 400, 0.875rem): datas, períodos, contagens dos filtros (0.75rem), legenda "Composição 01". Nunca em títulos nem em botões.
- **Interface** (Bricolage 600-700, 0.875-1rem): navegação, botões, chips, rótulos de campo.

### Named Rules
**A Regra da Ficha Técnica.** A datilografada só carrega fatos medidos: datas, períodos, números. Se o texto não é uma medida, ele é grotesca.

**A Regra do Peso Único de Cartaz.** Todo título é 800 com tracking negativo (-0.015em a -0.02em) e entrelinha abaixo de 1. Não há títulos em peso médio.

## Layout

Container único centralizado de 72rem com margem lateral de 16px (32px a partir de 640px). Seções respiram com 96px verticais; a lista de projetos separa cartazes com 96px (128px a partir de 768px). A grade é de 12 colunas: abertura em 6/6 (texto e mosaico) a partir de 1024px; cartaz de projeto em 5/7, alternando o lado do cartaz a cada item; resumo em 4/8; contato em 2/3 de 5. Abaixo dos breakpoints tudo empilha em uma coluna, com o mosaico após o texto.

A navegação fica fixa no topo (64px) e a barra de filtros de Projetos gruda logo abaixo dela (top 64px). A página inicial segue a ordem Abertura → Projetos recentes → Resumo (em faixa branca de largura total) → Tecnologias; o rodapé ultramar fecha todas as rotas.

**A Regra do Módulo Único.** Toda composição de formas é uma grade de quadrados iguais (mosaico 4x4, cartaz 3x3 com um módulo 2x2, faixa de 3 módulos). Formas não flutuam soltas nem mudam de proporção.

## Elevation & Depth

O sistema é plano. Não existe nenhuma `box-shadow` no código. Profundidade vem por tom (papel → branco para superfícies de conteúdo, papel → ultramar para o rodapé) e pela sobreposição de campos chapados nas composições. A única translucidez é funcional: navegação e barra de filtros em papel 95% com desfoque leve para manter a leitura ao rolar.

**A Regra Sem Sombra.** Nada se levanta com sombra. Para destacar uma superfície, troque o tom do campo (branco sobre papel, ultramar sob conteúdo).

## Shapes

Dois vocabulários coexistem e não se misturam. Retângulos de interface (botões, chips, campos, formulário, bloco de aviso, selo) têm canto vivo, raio 0. Curvas aparecem só como formas geométricas inteiras do módulo: círculos completos (pontos da navegação, ponto do botão, separadores de tecnologia), quartos de círculo (canto superior esquerdo ou inferior direito em raio total, como na marca e nos ícones de contato) e as formas SVG do componente de formas. Pequenos losangos (quadrado girado 45°) marcam itens de stack.

**A Regra do Canto Vivo.** Nenhum retângulo recebe raio parcial (4px, 8px, 12px). Ou é canto vivo, ou é forma geométrica completa: círculo, meio círculo ou quarto de círculo.

## Components

### Buttons
Mecânicos e diretos: bloco chapado, texto negrito, um ponto que corre.
- **Shape:** canto vivo (0px).
- **Primary:** vermelhão com texto branco, 700, padding 14px 24px, com um ponto amarelo-sol de 10px à direita do rótulo.
- **Hover / Focus:** fundo vira tinta em 300ms; o ponto avança 4px e cresce 1.5x com mola; ao pressionar, escala 0.97. Foco é o contorno global de 3px ultramar com afastamento de 3px.
- **Sobre o rodapé ultramar:** mesma forma em amarelo-sol com texto tinta e ponto vermelhão; hover vira branco.
- **Secondary:** link textual em negrito, tinta, sublinhado ultramar de 3px com afastamento de 6px; hover pinta o texto de ultramar.

### Chips
- **Filtro (Projetos):** branco com texto tinta, 600, 0.875rem, padding 6px 14px, contagem em datilografada grafite. Hover em céu; ativo em ultramar com texto branco e contagem em céu; pressionar escala 0.95.
- **Selo de andamento:** amarelo-sol com texto tinta e um ponto tinta pulsando; único uso de estado "em andamento".

### Cards / Containers
O sistema não usa cards. Projetos são cartazes (abaixo). Superfícies de conteúdo são campos brancos de canto vivo sem borda nem sombra (formulário com padding 24px/40px, visualizador do PDF com 12px); o aviso do currículo é um campo amarelo-sol com padding 32px/48px.

### Inputs / Fields
- **Style:** fundo papel, sem borda exceto um traço inferior de 3px em tinta, canto vivo, padding 12px 16px, rótulo negrito acima.
- **Focus:** traço inferior vira ultramar e o fundo ganha céu a 40%; sem contorno extra.
- **Error:** traço inferior em `danger` e mensagem 0.875rem em `danger` abaixo, ligada por aria-describedby.

### Navigation
- **Barra:** fixa, 64px, papel 95% com desfoque, fio inferior de 1px. Marca à esquerda (quatro quartos geométricos 2x2 que giram 90° no hover) com o nome em negrito.
- **Links:** 600, ~0.95rem; inativo em grafite, ativo em tinta com um ponto de 10px na cor da seção; no hover o ponto aparece a 75%.
- **Idioma:** PT/EN em caixa alta, o ativo em bloco tinta com texto branco.
- **Mobile:** botão de menu de 40px; lista em coluna com links de 1.875rem, cada item subindo em sequência (50ms).

### Formas (assinatura)
Módulo quadrado com fundo chapado e uma forma SVG girada em quartos de volta. Pares fundo/forma são fixos por fundo: ultramar→sol, vermelhão→papel, sol→vermelhão, verde→papel, tinta→sol, papel→ultramar. Transição de giro em 700ms com mola.

### Mosaico (assinatura)
Grade 4x4 quadrada na abertura com a foto (cinza, contraste 125%, multiplicada sobre sol) ocupando o bloco 2x2 central-direito. Módulos entram com "pop" escalonado (45ms) e giram um quarto de volta quando o ponteiro chega a 0.75 da largura do módulo. Legenda em datilografada com contador de composição e um link "Embaralhar".

### Cartaz de projeto (assinatura)
Grade 3x3 quadrada com um módulo 2x2 e cinco 1x1, gerada de forma determinística pelo id do projeto (mesmo id, mesmo cartaz; fundos vizinhos nunca repetem). Monta-se peça a peça ao entrar na tela (70ms por peça). Ao lado, a ficha: título, data em datilografada, descrição, papel, stack com losangos vermelhão e links ultramar sublinhados.

### Rodapé
Campo ultramar de largura total com quatro módulos de formas cortados no canto superior direito, título de cartaz, texto em céu, CTA amarelo-sol e ícones de contato brancos que sobem 4px e ficam amarelos no hover.

## Do's and Don'ts

### Do:
- **Do** construir qualquer ilustração nova com o módulo de formas, em grade de quadrados iguais e giros de 90°.
- **Do** manter cada cor no seu papel: vermelhão para a ação principal, ultramar para links e foco, sol para estado, verde para sucesso.
- **Do** usar canto vivo em todo retângulo e curvas apenas como círculo, meio círculo ou quarto de círculo completos.
- **Do** escrever títulos em Bricolage 800 com tracking negativo e entrelinha abaixo de 1, usando o eixo de largura de cartaz.
- **Do** reservar Courier Prime para datas, períodos e contagens.
- **Do** dar a toda animação nova uma versão parada em prefers-reduced-motion.

### Don't:
- **Don't** usar box-shadow, gradientes ou brilhos; profundidade é troca de tom.
- **Don't** aplicar raio parcial (4px, 8px, 12px) em botões, campos ou superfícies.
- **Don't** usar fundo escuro com neon.
- **Don't** montar listas como grade de cards iguais; projetos são cartazes alternados.
- **Don't** usar a datilografada em títulos, botões ou texto corrido.
