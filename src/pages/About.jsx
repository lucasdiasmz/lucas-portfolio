import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa6'
import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

function InfoCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-ink-800 bg-ink-900/70 p-5 sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-400">{title}</h2>
      <p className="mt-2 leading-relaxed text-ink-100/90">{children}</p>
    </section>
  )
}

function Avatar() {
  // Se a foto não existir (ainda não foi adicionada em public/), mostra a inicial do nome
  const [failed, setFailed] = useState(false)

  if (profile.photo && !failed) {
    return (
      <img
        src={profile.photo}
        alt={profile.name}
        onError={() => setFailed(true)}
        className="h-40 w-40 rounded-3xl object-cover ring-4 ring-brand-500/30 sm:h-48 sm:w-48"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="grid h-40 w-40 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-accent-400 text-6xl font-extrabold text-ink-950 ring-4 ring-brand-500/30 sm:h-48 sm:w-48"
    >
      {profile.shortName.charAt(0)}
    </div>
  )
}

export default function About() {
  const { t, pick } = useLanguage()
  const { about } = profile

  return (
    <>
      <section className="flex animate-fade-up flex-col items-center gap-8 text-center sm:flex-row sm:text-left">
        <Avatar />
        <div>
          <p className="font-mono text-sm text-accent-400">{t.about.greeting}</p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">{profile.name}</h1>
          <p className="mt-2 text-lg font-medium text-brand-400">{pick(profile.role)}</p>
          <p className="mt-4 max-w-xl text-ink-300">{pick(profile.tagline)}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
            <Link
              to="/projetos"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
            >
              {t.about.ctaProjects}
              <FaArrowRight aria-hidden="true" />
            </Link>
            <Link
              to="/contato"
              className="rounded-lg border border-ink-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
            >
              {t.about.ctaContact}
            </Link>
          </div>
        </div>
      </section>

      <h2 className="sr-only">{t.about.title}</h2>
      <p className="mt-14 max-w-3xl text-lg leading-relaxed text-ink-100/90">{pick(about.summary)}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <InfoCard title={t.about.education}>{pick(about.education)}</InfoCard>
        <InfoCard title={t.about.focus}>{pick(about.focus)}</InfoCard>
        <InfoCard title={t.about.interests}>{pick(about.interests)}</InfoCard>
        <InfoCard title={t.about.goals}>{pick(about.goals)}</InfoCard>
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-400">{t.about.skills}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {about.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-ink-700 bg-ink-800/70 px-3.5 py-1.5 text-sm text-ink-100"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
