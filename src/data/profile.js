// =============================================================================
//  CONTEÚDO DO PORTFÓLIO — edite este arquivo para trocar textos, projetos,
//  experiências e links de contato. Nenhuma outra parte do código precisa mudar.
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
  // Salve sua foto como public/foto.jpg. Enquanto o arquivo não existir,
  // o site mostra a inicial do nome no lugar da foto.
  photo: '/foto.jpg',

  about: {
    summary: {
      pt: 'Sou estudante de Engenharia de Software na PUC Minas, no 2º período. Gosto de entender o porquê das decisões de design por trás do código, não só de fazer funcionar. Já passei por Python, orientação a objetos e desenvolvimento web, e hoje aprofundo meus estudos em Java, Spring Boot e React.',
      en: "I'm a Software Engineering student at PUC Minas, currently in my 2nd semester. I like understanding the reasoning behind design decisions in code, not just making it work. I've worked with Python, object-oriented design and web development, and I'm now going deeper into Java, Spring Boot and React.",
    },
    education: {
      pt: 'Bacharelado em Engenharia de Software — PUC Minas (2º período, em andamento).',
      en: "Bachelor's degree in Software Engineering — PUC Minas (2nd semester, in progress).",
    },
    focus: {
      pt: 'Ainda explorando as áreas da engenharia de software. Hoje estudo back-end com Java e Spring Boot e front-end com HTML, CSS, JavaScript e React.',
      en: "Still exploring the areas of software engineering. Right now I study back-end with Java and Spring Boot and front-end with HTML, CSS, JavaScript and React.",
    },
    // TODO: você deixou "Interesses" em branco. Este texto é um rascunho — troque pelo seu.
    interests: {
      pt: 'Projetos que unem criatividade e técnica, como desenvolvimento de jogos, além de boas práticas de engenharia de software.',
      en: 'Projects that blend creativity and technique, such as game development, plus software engineering best practices.',
    },
    goals: {
      pt: 'Crescer na área e financeiramente, trabalhar em empresas multinacionais e, no futuro, também em empresas do exterior. Também considero o serviço público, por meio de concursos. Já uso o inglês no dia a dia de estudo, em um nível entre intermediário e avançado.',
      en: 'Grow in the field and financially, work for multinational companies and, in the future, for companies abroad. I also consider a public service career through civil service exams. I already use English in my daily studies, at an upper-intermediate to advanced level.',
    },
    skills: ['Python', 'Java', 'HTML', 'CSS', 'JavaScript', 'Spring Boot', 'React'],
  },
}

// -----------------------------------------------------------------------------
//  PROJETOS — a linha do tempo ordena por `date` (do mais antigo ao mais recente).
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
]

// -----------------------------------------------------------------------------
//  EXPERIÊNCIAS — estágios, freelas, open source, eventos, projetos de extensão.
//  Hoje está vazia. Para adicionar, siga o modelo (descomente e preencha):
//
//  {
//    id: 'exemplo',
//    organization: { pt: 'Nome da instituição', en: 'Institution name' },
//    role: { pt: 'Cargo ou atividade', en: 'Role or activity' },
//    start: '2026-08',   // 'AAAA-MM'
//    end: null,          // 'AAAA-MM' ou null para "atual"
//    description: { pt: 'Descrição curta.', en: 'Short description.' },
//  },
// -----------------------------------------------------------------------------
export const experiences = []

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