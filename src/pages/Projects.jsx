import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import Timeline from '../components/Timeline.jsx'
import { projects } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { parseYearMonth } from '../utils/date.js'

export default function Projects() {
  const { t } = useLanguage()
  const [filter, setFilter] = useState('all')

  // Do mais antigo ao mais recente
  const sorted = useMemo(
    () => [...projects].sort((a, b) => parseYearMonth(a.date) - parseYearMonth(b.date)),
    [],
  )

  const technologies = useMemo(
    () => [...new Set(sorted.flatMap((p) => p.technologies))].sort((a, b) => a.localeCompare(b)),
    [sorted],
  )

  const visible = filter === 'all' ? sorted : sorted.filter((p) => p.technologies.includes(filter))

  return (
    <>
      <PageHeader title={t.projects.title} subtitle={t.projects.subtitle} />

      <div role="group" aria-label={t.projects.filterLabel} className="mb-10 flex flex-wrap gap-2">
        {['all', ...technologies].map((tech) => {
          const active = filter === tech
          return (
            <button
              key={tech}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(tech)}
              className={[
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                active
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-ink-700 text-ink-300 hover:border-ink-300 hover:text-white',
              ].join(' ')}
            >
              {tech === 'all' ? t.projects.filterAll : tech}
            </button>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <p className="text-ink-300">{t.projects.empty}</p>
      ) : (
        <Timeline items={visible.map((project) => ({ id: project.id, content: <ProjectCard project={project} /> }))} />
      )}
    </>
  )
}
