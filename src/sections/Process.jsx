import { useRef } from 'react'
import { FaCode, FaLightbulb, FaRocket } from 'react-icons/fa6'
import Reveal from '../components/Reveal.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useReveal, useScrollProgress } from '../motion/hooks.js'

const stepIcons = [FaLightbulb, FaCode, FaRocket]
// ponto do progresso (0..1) em que cada etapa acende
const stepAt = [0.06, 0.5, 0.96]

// "Ideias → Código" e o bloco grande "Não só código."
export default function Process() {
  const { t } = useLanguage()
  const arrow = useReveal(0.5)
  const steps = useRef(null)

  // As três etapas acendem em ordem conforme a lista sobe pela tela (--p)
  useScrollProgress(steps, { from: 0.82, to: 0.42 })

  return (
    <section aria-labelledby="processo-titulo" className="relative overflow-hidden px-6 py-14 text-center md:py-16">
      <div aria-hidden="true" className="aura inset-x-0 top-[8%] mx-auto h-[46rem] max-w-[86rem] [--aura-a:0.09] [--aura:var(--color-flame)]" />

      <Reveal as="p" className="text-[0.7rem] tracking-[0.4em] text-neutral-400 uppercase">
        {t.process.kicker}
      </Reveal>
      <Reveal as="h2" id="processo-titulo" delay={100} className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[clamp(1.7rem,7vw,5.5rem)] leading-none uppercase sm:gap-x-6">
        <span className="glow-text text-brand-500">{t.process.left}</span>
        <span aria-hidden="true" className="text-brand-500">
          →
        </span>
        <span className="text-white">{t.process.right}</span>
      </Reveal>
      <Reveal as="p" delay={200} className="mx-auto mt-8 max-w-2xl text-sm text-neutral-300">
        {t.process.text} <strong className="font-normal text-white">{t.process.strong}</strong>
      </Reveal>

      <svg ref={arrow} viewBox="0 0 300 24" className="draw mx-auto mt-10 w-64 text-ember sm:w-80" aria-hidden="true">
        <line x1="2" y1="12" x2="292" y2="12" stroke="currentColor" strokeWidth="1.5" pathLength="1" />
        <path d="M280 2 L294 12 L280 22" fill="none" stroke="currentColor" strokeWidth="1.5" pathLength="1" />
      </svg>

      <ol ref={steps} className="steps mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4">
        <li aria-hidden="true" className="steps__track">
          <span className="steps__fill" />
        </li>
        {t.process.steps.map((step, i) => {
          const Icon = stepIcons[i]
          return (
            <li key={step} className="step flex flex-col items-center gap-4" style={{ '--at': stepAt[i] }}>
              <span className="step__tile">
                <Icon aria-hidden="true" />
              </span>
              <span className="step__name text-[0.62rem] tracking-[0.1em] text-neutral-200 uppercase sm:text-xs sm:tracking-[0.3em]">{step}</span>
            </li>
          )
        })}
      </ol>

      <div className="mx-auto mt-20 max-w-5xl md:mt-24">
        <Reveal as="p" className="text-[clamp(2.6rem,11vw,8rem)] leading-[0.95] text-white uppercase">
          {t.process.bigTop}
        </Reveal>
        <Reveal as="p" delay={150} className="glow-text text-[clamp(2.6rem,11vw,8rem)] leading-[0.95] text-brand-500 uppercase">
          {t.process.bigBottom}
        </Reveal>
        <Reveal as="p" delay={300} className="mx-auto mt-10 max-w-2xl text-sm text-neutral-300">
          {t.process.bigText}
        </Reveal>
      </div>
    </section>
  )
}
