// =============================================================================
//  CONTEÚDO DO PORTFÓLIO — edite este arquivo para trocar textos, projetos,
//  currículo e links de contato. Nenhuma outra parte do código precisa mudar.
//
//  Campos de texto em { pt, en } aparecem no idioma escolhido no site.
//  Procure por "TODO" para achar o que ainda precisa de ajuste.
// =============================================================================

export const profile = {
  name: 'Lucas Dias Melo',
  shortName: 'Lucas', // usado no logo do menu
  role: {
    pt: 'Estudante de Engenharia de Software',
    en: 'Software Engineering Student',
  },
  tagline: {
    pt: 'Construo software com foco em código limpo, boas práticas e aprendizado constante.',
    en: 'I build software with a focus on clean code, good practices and constant learning.',
  },
  // Salve sua foto como public/foto.png. Enquanto o arquivo não existir,
  // o site mostra a inicial do nome no lugar da foto.
  photo: '/foto.webp',

  // Frases que se alternam no topo da página, como se fossem digitadas.
  typing: [
    { pt: 'Engenharia de Software', en: 'Software Engineering' },
    { pt: 'Back-end com Java', en: 'Back-end with Java' },
    { pt: 'Front-end com React', en: 'Front-end with React' },
  ],
  // Selo que aparece sobre a foto no topo da página
  badge: { pt: 'Estudante de Software', en: 'Software Student' },

  // Áreas que estudo e pratico. `icon`: backend | frontend | oop | ai | games | api | web
  focusAreas: [
    {
      icon: 'backend',
      title: { pt: 'Back-end com Java', en: 'Back-end with Java' },
      text: { pt: 'APIs REST com Java e Spring Boot, do controlador à persistência.', en: 'REST APIs with Java and Spring Boot, from controller to persistence.' },
    },
    {
      icon: 'frontend',
      title: { pt: 'Front-end com React', en: 'Front-end with React' },
      text: { pt: 'Interfaces responsivas com HTML, CSS, JavaScript e React.', en: 'Responsive interfaces with HTML, CSS, JavaScript and React.' },
    },
    {
      icon: 'oop',
      title: { pt: 'Orientação a objetos', en: 'Object-oriented design' },
      text: { pt: 'Classes, herança e responsabilidades bem divididas, com código limpo.', en: 'Classes, inheritance and well-split responsibilities, with clean code.' },
    },
    {
      icon: 'web',
      title: { pt: 'Landing pages', en: 'Landing pages' },
      text: { pt: 'Páginas únicas publicadas, com foco em conversão e contato rápido.', en: 'Published single pages focused on conversion and quick contact.' },
    },
    {
      icon: 'ai',
      title: { pt: 'Desenvolvimento avançado com IA', en: 'AI-assisted development' },
      text: {
        pt: 'Agentes de IA no fluxo de trabalho: planejamento, geração e revisão de código, testes e automação, sempre com validação humana.',
        en: 'AI agents across the workflow: planning, code generation and review, testing and automation, always with human validation.',
      },
    },
    {
      icon: 'api',
      title: { pt: 'Projetos acadêmicos', en: 'Academic projects' },
      text: { pt: 'Sistemas em equipe nas disciplinas de TI da PUC Minas.', en: 'Team systems for the IT courses at PUC Minas.' },
    },
  ],

  about: {
    // Abas da seção "Sobre mim": uma pergunta, um dado em destaque e uma frase curta.
    // `pill` é opcional.
    tabs: [
      {
        label: { pt: 'Quem sou', en: 'Who I am' },
        big: { pt: '2º período', en: '2nd semester' },
        sub: { pt: 'Engenharia de Software, PUC Minas', en: 'Software Engineering, PUC Minas' },
        text: {
          pt: 'Gosto de entender por que o código é escrito de um jeito, não só de fazer funcionar.',
          en: 'I like to understand why code is written a certain way, not just to make it work.',
        },
      },
      {
        label: { pt: 'O que estudo agora', en: 'What I study now' },
        big: 'Java + React',
        sub: { pt: 'Back-end com Spring Boot, front-end com React', en: 'Back-end with Spring Boot, front-end with React' },
        text: {
          pt: 'Antes passei por Python, orientação a objetos e web. Fora das aulas, gosto de desenvolvimento de jogos.',
          en: 'Before that I went through Python, object-oriented design and web. Outside class, I enjoy game development.',
        },
      },
      {
        label: { pt: 'O que procuro', en: "What I'm looking for" },
        big: { pt: 'Estágio', en: 'Internship' },
        sub: { pt: 'Disponível agora', en: 'Available now' },
        text: {
          pt: 'Quero crescer em equipes grandes, de preferência multinacionais. Já uso inglês no dia a dia de estudo.',
          en: 'I want to grow in large teams, ideally at multinational companies. I already use English in my daily studies.',
        },
        pill: { pt: 'Português e inglês', en: 'Portuguese and English' },
      },
    ],
    skills: ['Python', 'Java', 'HTML', 'CSS', 'JavaScript', 'Spring Boot', 'React'],
  },
}

// Descrição curta de cada habilidade, mostrada no painel da aba Habilidades
export const skillInfo = {
  Python: {
    kind: { pt: 'Linguagem', en: 'Language' },
    text: {
      pt: 'Linguagem de sintaxe limpa e direta, boa para lógica, automação, scripts e jogos.',
      en: 'A language with clean, direct syntax, great for logic, automation, scripts and games.',
    },
  },
  Java: {
    kind: { pt: 'Linguagem', en: 'Language' },
    text: {
      pt: 'Linguagem orientada a objetos e fortemente tipada, muito usada no back-end e em sistemas corporativos.',
      en: 'An object-oriented, strongly typed language, widely used for back-end and enterprise systems.',
    },
  },
  HTML: {
    kind: { pt: 'Marcação', en: 'Markup' },
    text: {
      pt: 'Dá estrutura e significado às páginas web: títulos, seções, formulários e acessibilidade.',
      en: 'Gives web pages structure and meaning: headings, sections, forms and accessibility.',
    },
  },
  CSS: {
    kind: { pt: 'Estilos', en: 'Styling' },
    text: {
      pt: 'Define cores, tipografia, layout e animações das páginas, do celular ao desktop.',
      en: 'Defines the colors, typography, layout and animations of a page, from phone to desktop.',
    },
  },
  JavaScript: {
    kind: { pt: 'Linguagem', en: 'Language' },
    text: {
      pt: 'A linguagem do navegador: dá interatividade às páginas, reage a eventos e conversa com APIs.',
      en: 'The language of the browser: it makes pages interactive, reacts to events and talks to APIs.',
    },
  },
  'Spring Boot': {
    kind: { pt: 'Framework', en: 'Framework' },
    text: {
      pt: 'Framework Java para criar APIs REST e serviços back-end com pouca configuração.',
      en: 'A Java framework for building REST APIs and back-end services with little configuration.',
    },
  },
  React: {
    kind: { pt: 'Biblioteca', en: 'Library' },
    text: {
      pt: 'Biblioteca JavaScript para montar interfaces com componentes reutilizáveis e estado.',
      en: 'A JavaScript library for building interfaces from reusable components and state.',
    },
  },
}

// -----------------------------------------------------------------------------
//  PROJETOS — os cards aparecem do mais recente ao mais antigo (pelo campo `date`).
//  `date` ('AAAA-MM') só serve para ordenar. O que aparece no card é `period`
//  (ex.: '2026/1' = 1º semestre de 2026); sem `period`, aparece mês e ano de `date`.
// -----------------------------------------------------------------------------
export const projects = [
  {
    id: 'overengineering',
    date: '2026-06',
    period: '2026/1',
    name: { pt: 'Overengineering', en: 'Overengineering' },
    description: {
      pt: 'Jogo de tower defense em grupo, feito com Pygame. A arquitetura orientada a objetos usa classes base e subclasses para torres e projéteis, e o jogo conta com um inimigo do tipo chefe.',
      en: 'Group tower defense game built with Pygame. The object-oriented architecture uses base classes and subclasses for towers and projectiles, and the game features a boss enemy.',
    },
    role: {
      pt: 'Resolução de issues do projeto.',
      en: 'Resolving project issues.',
    },
    technologies: ['Python', 'Pygame'],
    repo: 'https://github.com/lucasdiasmz/-Overengeneering-',
  },
  {
    id: 'primeira-rest-api',
    date: '2026-08',
    period: '2026/2',
    name: { pt: 'Primeira Rest API', en: 'First REST API' },
    description: {
      pt: 'API REST de lista de tarefas, meu primeiro projeto com Java e Spring Boot.',
      en: 'To-do list REST API, my first project with Java and Spring Boot.',
    },
    technologies: ['Java', 'Spring Boot'],
    repo: 'https://github.com/lucasdiasmz/firstRestAPI-Spring',
  },
  {
    id: 'acessa-mob',
    date: '2026-09',
    period: '2026/2',
    name: { pt: 'AcessaMob', en: 'AcessaMob' },
    description: {
      pt: 'Site para cuidado de idosos, desenvolvido na disciplina de TI2 do curso de Engenharia de Software da PUC Minas.',
      en: 'Website for elderly care, developed for the TI2 course of the Software Engineering program at PUC Minas.',
    },
    status: 'in-progress', // mostra a etiqueta "Em desenvolvimento"
    technologies: ['HTML', 'CSS', 'JavaScript', 'Java'],
    repo: 'https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti2-8183100-acessa-mob',
  },
  {
    id: 'lp-luizadiasmakeup',
    date: '2026-11',
    period: '2026/2',
    name: { pt: 'Luiza Dias Makeup', en: 'Luiza Dias Makeup' },
    description: {
      pt: 'Landing page da Luiza Dias, maquiadora de noivas em Divinópolis-MG. Página única com vídeo de fundo, portfólio, depoimentos e agendamento pelo WhatsApp, com a mensagem já preenchida com nome, telefone e data do evento.',
      en: 'Landing page for Luiza Dias, a bridal makeup artist in Divinópolis, Brazil. A single page with a background video, portfolio, testimonials and WhatsApp booking, with the message already filled in with name, phone and event date.',
    },
    role: {
      pt: 'Projeto individual: design system, desenvolvimento e publicação.',
      en: 'Solo project: design system, development and deployment.',
    },
    technologies: ['HTML', 'CSS', 'JavaScript'],
    repo: 'https://github.com/lucasdiasmz/lp-luizadiasmakeup',
    site: 'https://luizadiasmakeup.vercel.app', // opcional: link do site publicado
  },
]

// -----------------------------------------------------------------------------
//  CURRÍCULO — salve o PDF em public/ (ex.: public/curriculo.pdf) e coloque o
//  caminho em `file` (ex.: '/curriculo.pdf'). Enquanto `file` for null, a página
//  mostra um aviso de que o currículo será publicado em breve.
//  `updated` ('AAAA-MM') é a data da última versão do currículo.
// -----------------------------------------------------------------------------
export const resume = {
  file: null, // TODO: adicionar o PDF do currículo
  updated: null,
}

// -----------------------------------------------------------------------------
//  CONTATO — `type` define o ícone; `href` é o link aberto ao clicar.
// -----------------------------------------------------------------------------
export const contacts = [
  {
    type: 'email',
    label: 'E-mail',
    value: 'lucasdiasmelo4@gmail.com',
    href: 'mailto:lucasdiasmelo4@gmail.com',
  },
  {
    type: 'whatsapp',
    label: 'WhatsApp',
    value: '+55 (37) 99840-7715',
    href: 'https://wa.me/5537998407715',
  },
  {
    type: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/lucasdiasmz',
    href: 'https://www.linkedin.com/in/lucasdiasmz/',
  },
  {
    type: 'github',
    label: 'GitHub',
    value: 'github.com/lucasdiasmz',
    href: 'https://github.com/lucasdiasmz',
  },
]