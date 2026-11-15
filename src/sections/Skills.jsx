import { FaCode } from 'react-icons/fa6'
import { SiCss, SiHtml5, SiJavascript, SiOpenjdk, SiPython, SiReact, SiSpringboot } from 'react-icons/si'
import Reveal from '../components/Reveal.jsx'
import SplitTitle from '../components/SplitTitle.jsx'
import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

// Ícone e cor de marca de cada tecnologia (as que faltarem usam o ícone genérico)
const brands = {
  Python: { Icon: SiPython, color: '#3b82f6' },
  Java: { Icon: SiOpenjdk, color: '#f89820' },
  HTML: { Icon: SiHtml5, color: '#e34f26' },
  CSS: { Icon: SiCss, color: '#2965f1' },
  JavaScript: { Icon: SiJavascript, color: '#f7df1e' },
  'Spring Boot': { Icon: SiSpringboot, color: '#6db33f' },
  React: { Icon: SiReact, color: '#61dafb' },
}

export default function Skills() {
  const { t } = useLanguage()

  return (
    <section id="habilidades" aria-labelledby="habilidades-titulo" className="px-6 py-24">
      <SplitTitle id="habilidades-titulo" text={t.skills.title} />
      <Reveal as="p" className="mx-auto mt-6 max-w-xl text-center text-sm text-neutral-400">
        {t.skills.subtitle}
      </Reveal>

      <ul className="mx-auto mt-14 flex max-w-5xl flex-wrap justify-center gap-4 sm:gap-6">
        {profile.about.skills.map((name, i) => {
          const { Icon, color } = brands[name] ?? { Icon: FaCode, color: '#fa6e00' }
          return (
            <Reveal
              as="li"
              key={name}
              delay={(i % 4) * 90}
              className="glass glass-hover group flex aspect-[5/4] w-[calc(50%-0.5rem)] flex-col sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] items-center justify-center gap-4 rounded-2xl"
              style={{ '--brand': color }}
            >
              <Icon
                aria-hidden="true"
                className="text-4xl text-[var(--brand)] transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_14px_var(--brand)] sm:text-5xl"
              />
              <span className="text-xs text-[var(--brand)]">{name}</span>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
