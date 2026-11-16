import { FaBrain, FaCubes, FaGamepad, FaGraduationCap, FaLaptopCode, FaRocket, FaServer } from 'react-icons/fa6'
import Reveal from '../components/Reveal.jsx'
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

// Equivalente à seção de serviços do modelo: as áreas que estudo e pratico
export default function Focus() {
  const { pick, t } = useLanguage()

  return (
    <section id="foco" aria-labelledby="foco-titulo" className="relative px-6 py-14 md:px-16 md:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 size-[400px] rounded-full bg-brand-500/10 blur-[160px]"
      />
      <SplitTitle id="foco-titulo" text={t.focus.title} />

      <ul className="relative mx-auto mt-10 grid max-w-6xl gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
        {profile.focusAreas.map((area, i) => {
          const { Icon, color } = icons[area.icon] ?? icons.frontend
          return (
            <Reveal as="li" key={i} delay={(i % 3) * 110} className="glass glass-hover group p-8">
              <Icon aria-hidden="true" className={`text-2xl ${color} transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110`} />
              <h3 className="mt-6 text-lg leading-snug text-white">{pick(area.title)}</h3>
              <p className="mt-3 text-xs leading-relaxed text-neutral-400">{pick(area.text)}</p>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
