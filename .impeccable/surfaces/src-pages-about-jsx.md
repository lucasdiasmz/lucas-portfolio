---
version: 1
slug: "src-pages-about-jsx"
primary_target: "src/pages/About.jsx"
related_targets: ["src/pages/Projects.jsx","src/pages/Contact.jsx","src/pages/Resume.jsx"]
---

# Surface brief: portfolio (all routes)

Scope: whole site redesign (Sobre, Projetos, Currículo, Contato, 404). Mode: Experience. Audience: recrutadores de estágio. Action: abrir um projeto, falar com o Lucas. Constraints: bilíngue PT/EN, EmailJS funcionando, reduced-motion respeitado, sem escuro+neon, sem cara de template.

## Direction contract

THESIS: O portfólio como um programa de identidade industrial modernista italiano (cartazes Olivetti/Pintori): cada projeto vira um cartaz de máquina composto por formas geométricas chapadas. Recusa o padrão hero-com-foto + grade de cards iguais.

OWN-WORLD: Fundo branco frio quase puro, tinta preta, e quatro cores com papéis: vermelhão (ação/destaque), ultramar (navegação/links, campos inteiros como rodapé), amarelo-sol (estado/em andamento), verde (sucesso/disponível). Círculos, meias-luas, quartos de círculo e quadrados em mosaico de módulo único. Grotesca com personalidade em escala de cartaz; datilografada só em metadados (datas, períodos, contagens). Sem sombras, sem cantos arredondados, sem cards.

STORY: Em segundos o recrutador vê o nome, o que o Lucas estuda e duas ações. Rolando, encontra os projetos como cartazes, cada um com papel, stack e links reais. Sai para um projeto ou para o contato.

FIRST VIEWPORT: Esquerda (6/12): nome gigante em duas linhas, cargo, frase, botão vermelho "Ver projetos" e link "Entrar em contato". Direita (6/12): mosaico 4x4 de formas geométricas coloridas com a foto do Lucas ocupando um dos módulos. Faixa inferior começa a revelar o primeiro cartaz de projeto.

FORM: Modernismo Industrial Italiano, posição 3 da minha lista ordenada. seed:c170b3c15d787aad. Interação assinatura: o mosaico é um campo contínuo; as formas giram em passos de 90 graus conforme a distância do ponteiro, e se montam peça a peça ao carregar. Cartazes de projeto se montam forma a forma ao entrar na tela. Transições de página com View Transitions.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
