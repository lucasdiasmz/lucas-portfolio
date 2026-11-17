import { useRef, useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import SplitTitle from '../components/SplitTitle.jsx'
import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

// Brilho do cartão alterna entre ciano e magenta a cada aba
const glows = ['var(--color-ember)', 'var(--color-neon-magenta)']

export default function About() {
  const { pick, t } = useLanguage()
  const { tabs } = profile.about
  const [active, setActive] = useState(0)
  const tabRefs = useRef([])
  const tab = tabs[active]

  // Setas trocam de aba, como pede o padrão de abas acessíveis
  function onKeyDown(e, i) {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    const next = (i + step + tabs.length) % tabs.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="px-6 py-14 sm:px-10 md:py-16">
      <SplitTitle id="sobre-titulo" text={t.about.title} />

      <div className="mx-auto mt-10 grid max-w-6xl items-start gap-10 sm:mt-12 lg:grid-cols-[1fr_1.15fr] lg:gap-18">
        <Reveal role="tablist" aria-label={t.about.title} aria-orientation="vertical" className="grid gap-1">
          {tabs.map((item, i) => (
            <button
              key={i}
              ref={(el) => (tabRefs.current[i] = el)}
              role="tab"
              id={`sobre-aba-${i}`}
              aria-controls="sobre-painel"
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className="about-tab"
            >
              {pick(item.label)}
            </button>
          ))}
        </Reveal>

        <Reveal delay={150}>
          <div
            role="tabpanel"
            id="sobre-painel"
            aria-labelledby={`sobre-aba-${active}`}
            className="glass relative min-h-[21rem] overflow-hidden p-8 sm:p-9"
          >
            {glows.map((color, i) => (
              <div
                key={color}
                aria-hidden="true"
                className="aura -right-56 -top-60 size-[34rem] transition-opacity duration-700"
                style={{ '--aura': color, opacity: active % glows.length === i ? 0.16 : 0 }}
              />
            ))}
            {/* key remonta o conteúdo para a troca de aba animar */}
            <div key={active} className="about-swap relative">
              <p className="text-[clamp(2.2rem,5.5vw,3.5rem)] leading-[1.05] text-brand-500">{pick(tab.big)}</p>
              <p className="mt-3 text-xs leading-relaxed text-neutral-400">{pick(tab.sub)}</p>
              <p className="mt-8 max-w-[38ch] text-[0.95rem] leading-[1.9] text-neutral-100">{pick(tab.text)}</p>
              {tab.pill && (
                <p className="mt-7 inline-flex rounded-full border border-brand-500/35 bg-brand-500/10 px-4 py-2 text-xs text-brand-300">
                  {pick(tab.pill)}
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
