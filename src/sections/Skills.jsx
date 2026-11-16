import Reveal from '../components/Reveal.jsx'
import SkillOrbit from '../components/SkillOrbit.jsx'
import SplitTitle from '../components/SplitTitle.jsx'
import { profile, projects } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Skills() {
  const { t, pick } = useLanguage()

  // Cada habilidade leva os projetos que a usam (para o cartão do globo)
  const skills = profile.about.skills.map((name) => ({
    name,
    projects: projects.filter((p) => p.technologies.includes(name)).map((p) => pick(p.name)),
  }))

  return (
    <section id="habilidades" aria-labelledby="habilidades-titulo" className="overflow-x-clip px-4 py-12 sm:px-6 md:py-14">
      <SplitTitle id="habilidades-titulo" text={t.skills.title} />
      <Reveal as="p" className="mx-auto mt-5 max-w-xl text-center text-sm text-neutral-400">
        {t.skills.subtitle}
      </Reveal>

      <Reveal delay={150} className="mt-2">
        <SkillOrbit skills={skills} labels={t.skills} />
      </Reveal>
    </section>
  )
}
