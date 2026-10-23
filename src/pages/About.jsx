import { useState } from 'react'
import { Link } from 'react-router-dom'
import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import Sheet from '../components/Sheet.jsx'
import { formatYearMonth } from '../utils/date.js'

function Photo() {
  // Se a foto não existir (ainda não foi adicionada em public/), mostra a inicial do nome
  const [failed, setFailed] = useState(false)

  if (profile.photo && !failed) {
    return (
      <img
        src={profile.photo}
        alt={profile.name}
        onError={() => setFailed(true)}
        className="aspect-[4/5] w-full border border-ink object-cover"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="type-condensed grid aspect-[4/5] w-full place-items-center border border-ink bg-paper text-8xl font-extrabold"
    >
      {profile.shortName.charAt(0)}
    </div>
  )
}

// Foto com anotações ligadas por linhas de chamada, como numa peça cotada
function AnnotatedPhoto() {
  const { pick } = useLanguage()

  return (
    <figure className="grid grid-cols-[minmax(0,8.5rem)_1fr] items-stretch sm:grid-cols-[minmax(0,13rem)_1fr]">
      <Photo />
      <ul className="flex flex-col justify-around py-4">
        {profile.callouts.map((text, i) => (
          <li key={i} className="flex items-center">
            <span aria-hidden="true" className="-ml-1 size-2 shrink-0 rounded-full bg-cobalt" />
            <span
              aria-hidden="true"
              className="h-px w-6 shrink-0 origin-left animate-draw bg-cobalt sm:w-10"
              style={{ animationDelay: `${300 + i * 180}ms` }}
            />
            <span
              className="animate-appear pl-3 text-sm font-medium leading-snug sm:text-[0.95rem]"
              style={{ animationDelay: `${700 + i * 180}ms` }}
            >
              {pick(text)}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  )
}

// Quadro de identificação, no canto da folha (como o carimbo de um desenho técnico)
function TitleBlock() {
  const { lang, t, pick } = useLanguage()
  const { sheet } = profile
  const rows = [
    [t.about.course, pick(sheet.course)],
    [t.about.institution, sheet.institution],
    [t.about.term, pick(sheet.term)],
    [t.about.languages, pick(sheet.languages)],
    [t.about.revision, formatYearMonth(sheet.revision, lang)],
  ]

  return (
    <dl aria-label={t.about.sheetTitle} className="grid grid-cols-2 border-l border-t border-ink bg-sheet">
      {rows.map(([label, value], i) => (
        <div
          key={label}
          className={['border-b border-r border-ink px-3 py-2', i === 0 ? 'col-span-2' : ''].join(' ')}
        >
          <dt className="type-wide text-xs text-graphite">{label}</dt>
          <dd className="font-semibold leading-snug">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function About() {
  const { t, pick } = useLanguage()
  const { about } = profile
  const [firstName, ...rest] = profile.name.split(' ')

  return (
    <>
      <Sheet as="section" grid aria-labelledby="nome" className="px-5 pb-5 pt-8 sm:px-10 sm:pt-12">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
          <div>
            <h1
              id="nome"
              className="type-condensed text-[clamp(4.5rem,15vw,9.5rem)] font-black uppercase leading-[0.82] tracking-tight"
            >
              {firstName}
              <span className="block">{rest.join(' ')}</span>
            </h1>
            <p className="type-wide mt-8 text-xl font-semibold text-cobalt">{pick(profile.role)}</p>
            <p className="mt-3 max-w-[46ch] text-lg text-graphite">{pick(profile.tagline)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/projetos"
                className="bg-ink px-5 py-3 font-semibold text-paper transition-colors hover:bg-cobalt"
              >
                {t.about.ctaProjects}
              </Link>
              <Link
                to="/contato"
                className="border border-ink px-5 py-3 font-semibold transition-colors hover:bg-ink hover:text-paper"
              >
                {t.about.ctaContact}
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-10">
            <AnnotatedPhoto />
            <TitleBlock />
          </div>
        </div>
      </Sheet>

      <section aria-labelledby="sobre" className="mt-20 grid gap-x-16 gap-y-10 lg:grid-cols-[1fr_2fr]">
        <h2 id="sobre" className="type-condensed text-5xl font-extrabold leading-none tracking-tight">
          {t.about.title}
        </h2>
        <div>
          <p className="max-w-[60ch] text-[1.3rem] leading-relaxed">{pick(about.summary)}</p>

          <dl className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {[
              [t.about.education, about.education],
              [t.about.focus, about.focus],
              [t.about.interests, about.interests],
              [t.about.goals, about.goals],
            ].map(([label, text]) => (
              <div key={label} className="border-t border-ink pt-4">
                <dt className="type-wide font-semibold">{label}</dt>
                <dd className="mt-2 text-graphite">{pick(text)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="tecnologias" className="mt-20 grid gap-x-16 gap-y-6 lg:grid-cols-[1fr_2fr]">
        <h2 id="tecnologias" className="type-condensed text-[2rem] font-bold leading-tight">
          {t.about.skills}
        </h2>
        <ul className="flex flex-wrap content-start gap-2">
          {about.skills.map((skill) => (
            <li key={skill} className="type-wide border border-ink bg-sheet px-3.5 py-1.5 font-medium">
              {skill}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
