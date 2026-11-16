import { FaGraduationCap } from 'react-icons/fa6'
import Reveal from '../components/Reveal.jsx'
import SplitTitle from '../components/SplitTitle.jsx'
import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function About() {
  const { pick, t } = useLanguage()
  const { about } = profile

  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="px-6 py-14 sm:px-10 md:py-16">
      <SplitTitle id="sobre-titulo" text={t.about.title} />

      <div className="mx-auto mt-10 grid max-w-6xl items-start gap-10 sm:mt-12 lg:grid-cols-[1.25fr_1fr]">
        <div className="space-y-6 text-[0.95rem] leading-[1.9] text-neutral-200">
          <Reveal as="p">{pick(about.summary)}</Reveal>
          <Reveal as="p" delay={100}>
            {pick(about.focus)}
          </Reveal>
          <Reveal as="p" delay={200}>
            {pick(about.goals)}
          </Reveal>

          <ul className="grid gap-4 pt-4 sm:grid-cols-2">
            {profile.highlights.map((h, i) => (
              <Reveal as="li" key={i} delay={i * 90} className="glass glass-hover p-6">
                <p className="text-lg leading-snug text-orange-500">{pick(h.title)}</p>
                <p className="mt-2 text-xs text-neutral-400">{pick(h.text)}</p>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Cartão com formação e interesses, no lugar da segunda foto do modelo */}
        <Reveal delay={150} className="glass relative overflow-hidden p-8 lg:sticky lg:top-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-orange-500/20 blur-[90px]"
          />
          <FaGraduationCap aria-hidden="true" className="relative text-4xl text-orange-500" />
          <p className="relative mt-6 text-[0.65rem] tracking-[0.3em] text-neutral-500 uppercase">
            {pick({ pt: 'Formação', en: 'Education' })}
          </p>
          <p className="relative mt-2 text-sm leading-relaxed text-white">{pick(about.education)}</p>
          <p className="relative mt-8 text-[0.65rem] tracking-[0.3em] text-neutral-500 uppercase">
            {pick({ pt: 'Interesses', en: 'Interests' })}
          </p>
          <p className="relative mt-2 text-sm leading-relaxed text-white">{pick(about.interests)}</p>
          <ul className="relative mt-8 flex flex-wrap gap-2">
            {about.skills.map((s) => (
              <li key={s} className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[0.65rem] text-orange-300">
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
