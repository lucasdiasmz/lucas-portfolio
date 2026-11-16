import Reveal from '../components/Reveal.jsx'
import SkillSystem from '../components/SkillSystem.jsx'
import { profile, projects, skillInfo } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Skills() {
  const { t, pick } = useLanguage()

  // Cada habilidade leva a descrição curta e os projetos que a usam
  const skills = profile.about.skills.map((name) => ({
    name,
    kind: pick(skillInfo[name]?.kind),
    text: pick(skillInfo[name]?.text),
    projects: projects.filter((p) => p.technologies.includes(name)).map((p) => pick(p.name)),
  }))

  return (
    <section id="habilidades" aria-labelledby="habilidades-titulo" className="overflow-x-clip px-4 py-12 sm:px-6 md:py-14">
      <Reveal>
        <SkillSystem skills={skills} labels={t.skills} />
      </Reveal>
    </section>
  )
}
