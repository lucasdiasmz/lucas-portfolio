# 💼 Portfólio Profissional — Lucas Dias Melo 👨‍💻

> Website de portfólio profissional bilíngue (PT/EN) que apresenta minha trajetória, projetos, experiências e formas de contato de maneira moderna, responsiva e acessível.

[![React](https://img.shields.io/badge/React-19-007ec6?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-007ec6?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-007ec6?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-007ec6?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<!-- TODO: adicione uma logo/captura de tela principal aqui, ex.:
![Capa do portfólio](docs/capa.png) -->

---

## 🚧 Status do Projeto

✅ **Concluído** — Laboratório 01 (Sprints 01, 02 e 03) da disciplina de Desenvolvimento e Integração de Aplicações Web (DIAW), Engenharia de Software, PUC Minas.

| Sprint | Entrega | Status |
| ------ | ------- | ------ |
| S01 | Repositório, README inicial, wireframes (Figma), protótipo, navegação e layout | ✅ |
| S02 | Páginas Sobre Mim (PT/EN), Projetos (timeline), Experiências e Contato (formulário) | ✅ |
| S03 | Deploy na nuvem, ajustes finais, imagens/GIFs e README final | ✅ |

---

## 📚 Índice

- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
- [Deploy](#-deploy)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Testes](#-testes)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 🔗 Links Úteis

- 🎨 **Protótipos no Figma:** [Abrir wireframes](https://www.figma.com/) <!-- TODO: link real do Figma -->
- 🗂️ **Repositório:** [github.com/lucasdiasmz/portfolio](https://github.com/lucasdiasmz/portfolio) <!-- TODO -->

---

## 📝 Sobre o Projeto

Este projeto é o meu **portfólio profissional**, desenvolvido como trabalho do Laboratório 01 de DIAW. O objetivo é reunir em um só lugar quem eu sou, o que já construí e como entrar em contato comigo, de forma que recrutadores, professores e colegas consigam entender meu perfil rapidamente.

- **Por que existe:** apresentar minha trajetória e meus projetos de forma organizada e acessível, e servir de vitrine para oportunidades de estágio e trabalho (inclusive no exterior, por isso o site é bilíngue).
- **Contexto:** acadêmico (PUC Minas, Engenharia de Software) e profissional.
- **Decisão de design:** tema escuro, tipografia Inter, cores índigo/ciano e layout enxuto, para passar uma identidade técnica e limpa sem distrair do conteúdo.

---

## ✨ Funcionalidades Principais

- 🧭 **Navegação por menu** entre quatro páginas (Sobre mim, Projetos, Experiências e Contato), com menu responsivo no celular.
- 🌐 **Internacionalização (i18n) PT/EN:** a troca de idioma vale para o site inteiro e é lembrada no navegador. O idioma inicial segue o do navegador.
- 🕒 **Linha do tempo dinâmica de projetos**, ordenada do mais antigo ao mais recente, gerada a partir de um único arquivo de dados.
- 🔎 **Filtro por tecnologia** na página de projetos.
- 💼 **Experiências** com instituição, cargo/atividade, período e descrição.
- 📨 **Formulário de contato funcional** com envio por e-mail (EmailJS), validação de campos, mensagens de erro acessíveis e proteção simples contra robôs (honeypot).
- 🔗 **Ícones clicáveis** para e-mail, WhatsApp, LinkedIn e GitHub.
- 📱 **Design responsivo** (mobile first) e acessível (link "pular para o conteúdo", foco visível, `aria-*`, respeito a `prefers-reduced-motion`).
- ✏️ **Conteúdo editável em um só lugar:** `src/data/profile.js`.

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end

- **Biblioteca:** [React 19](https://react.dev/)
- **Linguagem:** JavaScript (ES2022+)
- **Roteamento:** [React Router 7](https://reactrouter.com/)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/) (tokens de tema em `src/index.css`)
- **Ícones:** [React Icons](https://react-icons.github.io/react-icons/) (Font Awesome 6)
- **Gerenciamento de estado:** Context API (idioma) e `useState` local
- **Envio de e-mail:** [EmailJS](https://www.emailjs.com/) (`@emailjs/browser`)
- **Build tool:** [Vite 8](https://vite.dev/)
- **Linter:** [Oxlint](https://oxc.rs/docs/guide/usage/linter)

### ⚙️ Infraestrutura

- **Hospedagem:** [Vercel](https://vercel.com/) (plano gratuito)
- **Versionamento:** Git e GitHub
- **Protótipos:** Figma

### 📦 Dependências

| Pacote | Versão | Uso |
| ------ | ------ | --- |
| `react` / `react-dom` | ^19.2 | Interface |
| `react-router-dom` | ^7.18 | Rotas entre páginas |
| `tailwindcss` / `@tailwindcss/vite` | ^4.3 | Estilos utilitários |
| `@emailjs/browser` | ^5.0 | Envio do formulário por e-mail |
| `react-icons` | ^5.7 | Ícones |
| `vite` / `@vitejs/plugin-react` | ^8.3 / ^6.1 | Build e dev server |
| `oxlint` | ^1.81 | Análise estática do código |

---

## 🏗 Arquitetura

Aplicação **SPA (Single Page Application)** somente de front-end, sem back-end próprio: o envio de e-mail é delegado ao EmailJS, e o conteúdo vem de um arquivo de dados local.

- **Camada de dados (`src/data`):** `profile.js` guarda perfil, projetos, experiências e contatos. Textos em `{ pt, en }`.
- **Camada de i18n (`src/i18n`):** `LanguageContext` expõe `t` (textos fixos da interface), `pick()` (escolhe `pt` ou `en` em objetos de conteúdo) e `setLang()`.
- **Camada de apresentação:** `pages/` (uma por rota) compostas por `components/` reutilizáveis (`Timeline`, `ProjectCard`, `Navbar`...).
- **Roteamento:** `BrowserRouter` com um `Layout` comum (navbar, rodapé, `<Outlet />`). O `vercel.json` redireciona qualquer rota para `index.html`, para que o acesso direto a `/projetos` funcione.

**Decisões e trade-offs**

- *Dados em arquivo JS, não em API:* simples e rápido de editar para um portfólio pessoal. O custo é precisar de um novo deploy para atualizar o conteúdo.
- *EmailJS no front-end:* dispensa servidor, mas a chave pública fica visível no navegador (é o comportamento esperado do EmailJS; o controle de abuso é feito no painel dele).
- *Sem biblioteca de i18n:* só há dois idiomas e poucas strings, então um Context próprio resolve sem dependência extra.

---

## 🔧 Instalação e Execução

### Pré-requisitos

- **Node.js** versão LTS (v20 ou superior)
- **npm** (já vem com o Node.js)
- **Git**

### 🔑 Variáveis de Ambiente

O formulário de contato usa o EmailJS. Crie o arquivo **`.env.local`** na raiz do projeto (use o `.env.example` como modelo):

| Variável | Descrição | Exemplo |
| -------- | --------- | ------- |
| `VITE_EMAILJS_SERVICE_ID` | ID do serviço de e-mail conectado no EmailJS | `service_abc123` |
| `VITE_EMAILJS_TEMPLATE_ID` | ID do template de mensagem | `template_xyz789` |
| `VITE_EMAILJS_PUBLIC_KEY` | Chave pública da conta | `AbCdEfGhIjKlMnOp` |

> **Obs:** em projetos Vite, só variáveis que começam com `VITE_` ficam disponíveis no código do navegador. Sem essas variáveis o site funciona normalmente, mas o formulário avisa que o envio ainda não foi configurado.

**Como configurar o EmailJS (grátis):**

1. Crie uma conta em [emailjs.com](https://www.emailjs.com/) e, em **Email Services**, conecte seu Gmail (ou outro provedor). Anote o *Service ID*.
2. Em **Email Templates**, crie um template. No campo **To Email**, coloque o e-mail que vai *receber* as mensagens. No corpo, use as variáveis `{{from_name}}`, `{{from_email}}` e `{{message}}`, e em **Reply To** use `{{reply_to}}`. Anote o *Template ID*.
3. Em **Account → General**, copie a *Public Key*.

### 📦 Instalação de Dependências

```bash
git clone https://github.com/lucasdiasmz/portfolio.git
cd portfolio
npm install
```

### ⚡ Como Executar a Aplicação

```bash
npm run dev
```

🎨 O site estará disponível em **http://localhost:5173**.

Outros comandos:

| Comando | O que faz |
| ------- | --------- |
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Gera a versão de produção na pasta `dist/` |
| `npm run preview` | Serve localmente a versão de produção |
| `npm run lint` | Analisa o código com o Oxlint |

### ✏️ Como editar o conteúdo

Abra `src/data/profile.js` e troque nome, textos de "Sobre mim", projetos, experiências e links de contato. Para mostrar uma imagem ou GIF em um projeto, coloque o arquivo em `public/projetos/` e use `image: '/projetos/nome-do-arquivo.png'`.

---

## 🚀 Deploy

O site é publicado gratuitamente na **Vercel**.

1. Envie o projeto para o GitHub.
2. Em [vercel.com](https://vercel.com/), clique em **Add New → Project** e importe o repositório.
3. A Vercel detecta o Vite sozinha (*Build Command:* `npm run build`, *Output Directory:* `dist`).
4. Em **Settings → Environment Variables**, adicione as três variáveis `VITE_EMAILJS_*` descritas acima.
5. Clique em **Deploy**. A cada `git push` na branch principal, um novo deploy é feito automaticamente (e cada Pull Request ganha um *preview*).

O arquivo `vercel.json` já configura o redirecionamento das rotas para o `index.html`.

🔗 **Site publicado:** https://SEU-PROJETO.vercel.app <!-- TODO -->

---

## 📂 Estrutura de Pastas

```
.
├── .env.example              # 🧩 Modelo das variáveis de ambiente (sem valores reais)
├── .gitignore                # 🧹 Ignora node_modules, dist e arquivos .env
├── index.html                # 📄 Documento base (fontes, metadados)
├── package.json              # 📦 Dependências e scripts
├── vercel.json               # ☁️ Redirecionamento das rotas da SPA
├── vite.config.js            # ⚙️ Configuração do Vite (React + Tailwind)
├── public/
│   ├── favicon.svg           # 🖼️ Ícone do site
│   └── projetos/             # 🖼️ Imagens/GIFs dos projetos (adicione aqui)
├── docs/
│   └── wireframes/           # 🎨 Exportações do Figma usadas neste README
└── src/
    ├── main.jsx              # 🚀 Ponto de entrada (Router + LanguageProvider)
    ├── App.jsx               # 🧭 Definição das rotas
    ├── index.css             # 🎨 Tailwind e tokens de tema (cores, fontes, animação)
    ├── components/           # 🧱 Componentes reutilizáveis
    │   ├── Layout.jsx        #    Estrutura comum às páginas
    │   ├── Navbar.jsx        #    Menu de navegação e troca de idioma
    │   ├── Footer.jsx        #    Rodapé com ícones de contato
    │   ├── Timeline.jsx      #    Linha do tempo vertical
    │   ├── ProjectCard.jsx   #    Card de projeto
    │   ├── ContactIcon.jsx   #    Mapa tipo de contato → ícone
    │   └── PageHeader.jsx    #    Título e subtítulo das páginas
    ├── pages/                # 📄 Uma página por rota
    │   ├── About.jsx         #    /              Sobre mim
    │   ├── Projects.jsx      #    /projetos      Timeline de projetos
    │   ├── Experiences.jsx   #    /experiencias  Experiências
    │   ├── Contact.jsx       #    /contato       Canais e formulário
    │   └── NotFound.jsx      #    *              Página 404
    ├── data/
    │   └── profile.js        # ✏️ Todo o conteúdo editável do portfólio
    ├── i18n/
    │   ├── LanguageContext.jsx  # 🌐 Provider e hook useLanguage()
    │   └── translations.js      # 🌐 Textos da interface em PT e EN
    └── utils/
        └── date.js           # 🛠️ Formatação de datas por idioma
```

---

## 🎥 Demonstração

> **TODO antes de entregar:** exporte os wireframes do Figma para `docs/wireframes/`, tire prints/GIFs do site rodando e troque os placeholders abaixo. Dica: no Windows, a ferramenta de Captura (`Win + Shift + S`) resolve os prints, e o [ScreenToGif](https://www.screentogif.com/) grava GIFs.

### 🎨 Protótipos (Figma — média fidelidade)

| Sobre mim | Projetos |
| --------- | -------- |
| ![Wireframe Sobre mim](docs/wireframes/sobre-mim.png) | ![Wireframe Projetos](docs/wireframes/projetos.png) |
| **Experiências** | **Contato** |
| ![Wireframe Experiências](docs/wireframes/experiencias.png) | ![Wireframe Contato](docs/wireframes/contato.png) |

### 🌐 Site em funcionamento

| Tela | Captura |
| ---- | ------- |
| **Sobre mim** | ![Sobre mim](docs/sobre-mim.png) |
| **Projetos (timeline)** | ![Projetos](docs/projetos.png) |
| **Troca de idioma PT/EN** | ![Troca de idioma](docs/idioma.gif) |
| **Formulário de contato** | ![Contato](docs/contato.gif) |
| **Versão mobile** | ![Mobile](docs/mobile.png) |

---

## 🧪 Testes

O projeto não possui testes automatizados. A verificação foi feita com:

```bash
npm run lint    # análise estática (sem erros)
npm run build   # build de produção
```

E com testes manuais em Chrome (desktop e viewport de celular de 390 px): navegação entre as páginas, troca de idioma, filtro de tecnologias, validação do formulário (campos vazios e inválidos) e ausência de rolagem horizontal.

---

## 🔗 Documentações utilizadas

- 📖 [React](https://react.dev/reference/react)
- 📖 [Vite](https://vite.dev/guide/)
- 📖 [Tailwind CSS](https://tailwindcss.com/docs)
- 📖 [React Router](https://reactrouter.com/home)
- 📖 [EmailJS — SDK para navegador](https://www.emailjs.com/docs/sdk/installation/)
- 📖 [Deploy do Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite)

---

## 👥 Autores

| 👤 Nome | GitHub | LinkedIn | E-mail |
| ------- | ------ | -------- | ------ |
| Lucas Dias Melo | [@lucasdiasmz](https://github.com/lucasdiasmz) | [lucasdiasmz](https://www.linkedin.com/in/lucasdiasmz/) | [lucasdiasmelo4@gmail.com](mailto:lucasdiasmelo4@gmail.com) |

---

## 🙏 Agradecimentos

- [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) — pelo apoio institucional e estrutura acadêmica.
- [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) — pelo template de README e pelas orientações da disciplina de DIAW.

---

## 📄 Licença

Este projeto é distribuído sob a **Licença MIT**.
