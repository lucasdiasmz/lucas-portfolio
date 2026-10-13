import { Link } from 'react-router-dom'
import { FaBuildingColumns } from 'react-icons/fa6'
import PageHeader from '../components/PageHeader.jsx'
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
        <div className="rounded-2xl border border-dashed border-ink-700 bg-ink-900/50 p-6 sm:p-8">
          <p className="max-w-2xl leading-relaxed text-ink-300">{t.experiences.empty}</p>
          <Link
            to="/projetos"
            className="mt-5 inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
          >
            {t.experiences.emptyCta}
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5">
          {sorted.map((exp) => (
            <li
              key={exp.id}
              className="flex gap-4 rounded-2xl border border-ink-800 bg-ink-900/70 p-5 sm:p-6"
            >
              <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-800 text-brand-400 sm:grid">
                <FaBuildingColumns aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-accent-400">
                  {formatYearMonth(exp.start, lang)} — {exp.end ? formatYearMonth(exp.end, lang) : presentLabel[lang]}
                </p>
                <h2 className="mt-1 text-lg font-bold leading-snug">{pick(exp.role)}</h2>
                <p className="text-sm font-medium text-brand-400">{pick(exp.organization)}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">{pick(exp.description)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
