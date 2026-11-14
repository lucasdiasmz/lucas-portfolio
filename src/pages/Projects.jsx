import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { projects } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { parseYearMonth } from '../utils/date.js'
import { wrap } from '../utils/ui.js'

export default function Projects() {
  const { t } = useLanguage()
  const [filter, setFilter] = useState('all')

  // Do mais recente ao mais antigo: o trabalho mais novo aparece primeiro
  const sorted = useMemo(
    () => [...projects].sort((a, b) => parseYearMonth(b.date) - parseYearMonth(a.date)),
    [],
  )

  const technologies = useMemo(
    () => [...new Set(sorted.flatMap((p) => p.technologies))].sort((a, b) => a.localeCompare(b)),
    [sorted],
  )

  const visible = filter === 'all' ? sorted : sorted.filter((p) => p.technologies.includes(filter))

  return (
    <>
      <PageHeader title={t.projects.title} subtitle={t.projects.subtitle} color="blue" shapes={['quarter', 'circle', 'bars']} />

      <div className={wrap}>
        <div role="group" aria-label={t.projects.filterLabel} className="sticky top-16 z-30 -mx-4 mb-16 flex flex-wrap gap-2 border-y border-rule bg-paper/95 px-4 py-3 backdrop-blur-sm sm:mx-0 sm:px-0">
          {['all', ...technologies].map((tech) => {
            const active = filter === tech
            const count = tech === 'all' ? sorted.length : sorted.filter((p) => p.technologies.includes(tech)).length
            return (
              <button
                key={tech}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(tech)}
                className={[
                  'inline-flex items-center gap-2 px-3.5 py-1.5 text-sm font-semibold transition-[background-color,color,transform] duration-300 active:scale-95',
                  active ? 'bg-blue text-white' : 'bg-white text-ink hover:bg-sky',
                ].join(' ')}
              >
                {tech === 'all' ? t.projects.filterAll : tech}
                <span className={['font-type text-xs', active ? 'text-sky' : 'text-graphite'].join(' ')}>{count}</span>
              </button>
            )
          })}
        </div>

        {visible.length === 0 ? (
          <p className="text-graphite">{t.projects.empty}</p>
        ) : (
          <div className="grid gap-24 md:gap-32">
            {visible.map((project, i) => (
              <ProjectCard key={project.id} project={project} flip={i % 2 === 1} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
