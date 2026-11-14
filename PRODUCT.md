# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recrutadores de estágio (RH e tech leads) avaliando estudantes de Engenharia de Software para vagas de estágio/trainee. Abrem o link a partir do LinkedIn, GitHub ou de uma candidatura, normalmente com pouco tempo, e precisam entender rápido quem é o Lucas, o que ele já construiu e como contatá-lo.

## Product Purpose

Portfólio pessoal de Lucas Dias Melo, estudante do 2º período de Engenharia de Software na PUC Minas. Apresenta trajetória, projetos, currículo e contato. Sucesso = o recrutador sai convencido de que o Lucas é cuidadoso, curioso e capaz de entregar, e clica para ver um projeto, baixar o currículo ou entrar em contato.

## Positioning

Um estudante no início do curso que já entrega projetos reais (incluindo um site publicado para cliente) e se importa com o porquê das decisões de design no código, não só em fazer funcionar. O próprio portfólio é a prova de capricho técnico.

## Operating Context

- SPA em React 19 + Vite + Tailwind 4, deploy na Vercel (lucas-dias-dev.vercel.app), push em main publica.
- Rotas: Sobre (/), Projetos (/projetos), Currículo, Contato (/contato), 404.
- Conteúdo centralizado em src/data/profile.js; textos de interface em src/i18n/translations.js.
- Formulário de contato envia via EmailJS.

## Capabilities and Constraints

- Bilíngue PT/EN obrigatório: todo texto novo precisa das duas versões.
- O formulário EmailJS e os links de contato devem continuar funcionando.
- Currículo em PDF ainda não publicado (`resume.file` é null); a página mostra aviso.
- Respeitar prefers-reduced-motion.

## Brand Commitments

- Nome: Lucas Dias Melo. Foto em public/foto.jpg.
- Visual atual (folha de desenho técnico) pode ser substituído por completo.
- Evitar: visual escuro com neon ("hacker") e qualquer cara de template genérico.

## Evidence on Hand

- 4 projetos reais em src/data/profile.js: Overengineering (Pygame, em grupo), Primeira Rest API (Spring Boot), AcessaMob (em andamento, PUC), Luiza Dias Makeup (landing page publicada para cliente).
- Pasta public/projetos (imagens de projetos).
- Não há depoimentos, métricas, empresas ou experiência profissional: não inventar.

## Product Principles

- Clareza para o recrutador antes de qualquer efeito: em segundos ele sabe quem é, o que faz e onde clicar.
- Mostrar, não afirmar: projetos reais com links e contexto honesto do papel do Lucas.
- O capricho do próprio site é a demonstração de competência.

## Accessibility & Inclusion

Navegação por teclado, foco visível, contraste AA, skip link e prefers-reduced-motion já existem e devem ser mantidos.
