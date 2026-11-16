import Reveal from '../components/Reveal.jsx'
import SkillOrbit from '../components/SkillOrbit.jsx'
import SplitTitle from '../components/SplitTitle.jsx'
import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Skills() {
  const { t } = useLanguage()

  return (
    <section id="habilidades" aria-labelledby="habilidades-titulo" className="overflow-x-clip px-4 py-24 sm:px-6">
      <SplitTitle id="habilidades-titulo" text={t.skills.title} />
      <Reveal as="p" className="mx-auto mt-6 max-w-xl text-center text-sm text-neutral-400">
        {t.skills.subtitle}
      </Reveal>

      <Reveal delay={150} className="mt-4">
        <SkillOrbit skills={profile.about.skills} />
      </Reveal>
    </section>
  )
}
