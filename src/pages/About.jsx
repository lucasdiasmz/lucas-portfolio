import { Link } from 'react-router-dom'
import { profile, projects } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import Mosaic from '../components/Mosaic.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import Shape from '../components/Shape.jsx'
import { parseYearMonth } from '../utils/date.js'
import { useReveal } from '../utils/useReveal.js'
import { buttonDot, primaryButton, secondaryButton, wrap } from '../utils/ui.js'

// Separadores da lista de tecnologias: alternam as cores do sistema
const dots = ['bg-red', 'bg-blue', 'bg-sun', 'bg-green']

function Hero() {
  const { t, pick } = useLanguage()
  const [firstName, ...rest] = profile.name.split(' ')

  return (
    <section aria-labelledby="nome" className={`${wrap} grid items-center gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-2 lg:gap-16`}>
      <div>
        <h1
          id="nome"
          className="type-display text-[clamp(4rem,12vw,6rem)] font-extrabold leading-[0.85] tracking-[-0.015em] lg:text-[clamp(5rem,8.5vw,6rem)]"
        >
          <span className="block animate-rise [animation-delay:80ms]">{firstName}</span>
          <span className="block animate-rise [animation-delay:160ms]">
            {rest.slice(0, -1).join(' ')} <span className="text-red">{rest.at(-1)}</span>
          </span>
        </h1>
        <p className="mt-8 animate-rise text-2xl font-semibold leading-snug [animation-delay:260ms]">
          {pick(profile.role)}
          <span className="block text-lg font-medium text-graphite">
            {profile.sheet.institution} · {pick(profile.sheet.term)}
          </span>
        </p>
        <p className="mt-3 max-w-[46ch] animate-rise text-lg text-graphite [animation-delay:320ms]">{pick(profile.tagline)}</p>
        <div className="mt-10 flex animate-rise flex-wrap items-center gap-x-8 gap-y-4 [animation-delay:400ms]">
          <Link to="/projetos" viewTransition className={primaryButton}>
            {t.about.ctaProjects}
            <span aria-hidden="true" className={buttonDot} />
          </Link>
          <Link to="/contato" viewTransition className={secondaryButton}>
            {t.about.ctaContact}
          </Link>
        </div>
      </div>

      <div>
        <Mosaic />
      </div>
    </section>
  )
}

function Summary() {
  const { t, pick } = useLanguage()
  const { about } = profile
  const ref = useReveal()
  const facts = [
    [t.about.education, about.education, 'red'],
    [t.about.focus, about.focus, 'blue'],
    [t.about.interests, about.interests, 'sun'],
    [t.about.goals, about.goals, 'green'],
  ]

  return (
    <section aria-labelledby="sobre" className="bg-white py-24">
      <div ref={ref} className={`${wrap} reveal grid gap-x-16 gap-y-10 lg:grid-cols-12`}>
        <h2 id="sobre" className="type-display text-[clamp(3rem,6vw,4.5rem)] font-extrabold leading-[0.9] tracking-[-0.015em] lg:col-span-4">
          {t.about.title}
        </h2>
        <div className="lg:col-span-8">
          <p className="max-w-[58ch] text-[1.35rem] leading-relaxed">{pick(about.summary)}</p>

          <dl className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {facts.map(([label, text, color]) => (
              <div key={label}>
                <dt className="flex items-center gap-3 text-lg font-bold">
                  <Shape kind="quarter" bg="white" fg={color} className="size-6" />
                  {label}
                </dt>
                <dd className="mt-2 text-graphite">{pick(text)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function Skills() {
  const { t } = useLanguage()
  const ref = useReveal()

  return (
    <section aria-labelledby="tecnologias" className={`${wrap} py-24`}>
      <h2 id="tecnologias" className="type-tight max-w-[20ch] text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-tight tracking-[-0.02em]">
        {t.about.skills}
      </h2>
      <ul ref={ref} className="assemble mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
        {profile.about.skills.map((skill, i) => (
          <li
            key={skill}
            style={{ '--i': i }}
            className="type-tight flex items-center gap-6 text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-tight tracking-[-0.015em]"
          >
            {/* O ponto vem antes do item: a quebra de linha nunca deixa um ponto sobrando no fim */}
            {i > 0 && <span aria-hidden="true" className={`size-3 rounded-full sm:size-4 ${dots[(i - 1) % dots.length]}`} />}
            {skill}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Featured() {
  const { t } = useLanguage()
  const latest = [...projects].sort((a, b) => parseYearMonth(b.date) - parseYearMonth(a.date)).slice(0, 2)

  return (
    <section aria-labelledby="recentes" className={`${wrap} pb-24`}>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <h2 id="recentes" className="type-display text-[clamp(3rem,6vw,4.5rem)] font-extrabold leading-[0.9] tracking-[-0.015em]">
          {t.about.featured}
        </h2>
        <Link to="/projetos" viewTransition className={secondaryButton}>
          {t.about.allProjects} ({projects.length})
        </Link>
      </div>
      <div className="grid gap-24">
        {latest.map((project, i) => (
          <ProjectCard key={project.id} project={project} flip={i % 2 === 1} headingLevel="h3" />
        ))}
      </div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <Hero />
      <Featured />
      <Summary />
      <Skills />
    </>
  )
}
