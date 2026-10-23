import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import Sheet from '../components/Sheet.jsx'
import Timeline from '../components/Timeline.jsx'
import { experiences } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatYearMonth, parseYearMonth } from '../utils/date.js'

const presentLabel = { pt: 'atual', en: 'present' }

export default function Experiences() {
  const { lang, t, pick } = useLanguage()

  // Mais recentes primeiro
  const sorted = [...experiences].sort((a, b) => parseYearMonth(b.start) - parseYearMonth(a.start))

  return (
    <>
      <PageHeader title={t.experiences.title} subtitle={t.experiences.subtitle} />

      {sorted.length === 0 ? (
        <Sheet grid className="p-6 sm:p-10">
          <p className="max-w-[60ch] text-lg">{t.experiences.empty}</p>
          <Link
            to="/projetos"
            className="mt-6 inline-block bg-ink px-5 py-3 font-semibold text-paper transition-colors hover:bg-cobalt"
          >
            {t.experiences.emptyCta}
          </Link>
        </Sheet>
      ) : (
        <Timeline
          items={sorted.map((exp) => ({
            id: exp.id,
            marker: <span className="text-2xl">{formatYearMonth(exp.start, lang)}</span>,
            content: (
              <article>
                <h2 className="type-condensed text-[2.25rem] font-extrabold leading-none tracking-tight">
                  {pick(exp.role)}
                </h2>
                <p className="type-wide mt-2 font-semibold text-cobalt">{pick(exp.organization)}</p>
                <p className="mt-1 text-sm text-graphite">
                  {formatYearMonth(exp.start, lang)} – {exp.end ? formatYearMonth(exp.end, lang) : presentLabel[lang]}
                </p>
                <p className="mt-4 max-w-[62ch] text-graphite">{pick(exp.description)}</p>
              </article>
            ),
          }))}
        />
      )}
    </>
  )
}
