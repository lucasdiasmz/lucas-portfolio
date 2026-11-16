import Reveal from '../components/Reveal.jsx'
import SkillBurst from '../components/SkillBurst.jsx'
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

      <div className="mt-10">
        <SkillBurst
          skills={profile.about.skills}
          label={t.skills.title}
          countLabel={t.skills.files.replace('{n}', profile.about.skills.length)}
          openLabel={t.skills.open}
          replayLabel={t.skills.replay}
          holdHint={t.skills.hold}
          closeHint={t.skills.close}
        />
      </div>
    </section>
  )
}
