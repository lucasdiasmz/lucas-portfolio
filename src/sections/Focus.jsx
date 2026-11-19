import { FaBrain, FaCubes, FaGamepad, FaGraduationCap, FaLaptopCode, FaRocket, FaServer } from 'react-icons/fa6'
import Reveal from '../components/Reveal.jsx'
import StaggerCards from '../components/ui/StaggerCards.jsx'
import SplitTitle from '../components/SplitTitle.jsx'
import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const icons = {
  backend: { Icon: FaServer, color: 'text-sky-400' },
  frontend: { Icon: FaLaptopCode, color: 'text-brand-400' },
  oop: { Icon: FaCubes, color: 'text-violet-400' },
  web: { Icon: FaRocket, color: 'text-brand-300' },
  ai: { Icon: FaBrain, color: 'text-emerald-400' },
  games: { Icon: FaGamepad, color: 'text-emerald-400' },
  api: { Icon: FaGraduationCap, color: 'text-rose-400' },
}

// As áreas que estudo e pratico, num carrossel escalonado
export default function Focus() {
  const { pick, t } = useLanguage()
  const items = profile.focusAreas.map((area, i) => {
    const { Icon, color } = icons[area.icon] ?? icons.frontend
    return { id: i, Icon, iconClass: color, title: pick(area.title), text: pick(area.text) }
  })

  return (
    <section id="foco" aria-labelledby="foco-titulo" className="relative py-14 md:py-16">
      <div aria-hidden="true" className="aura -left-[26rem] top-[12%] size-[56rem] [--aura-a:0.08]" />
      <div className="px-6 md:px-16">
        <SplitTitle id="foco-titulo" text={t.focus.title} />
        <Reveal as="p" delay={100} className="mx-auto mt-6 max-w-xl text-center text-xs text-neutral-400">
          {t.focus.hint}
        </Reveal>
      </div>

      <Reveal delay={150} className="relative mt-6">
        <StaggerCards
          items={items}
          labels={{
            region: t.focus.title,
            prev: t.focus.prev,
            next: t.focus.next,
            position: (i, n) => `${i} / ${n}`,
          }}
        />
      </Reveal>
    </section>
  )
}
