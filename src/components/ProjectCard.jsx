import { FaGithub, FaLock } from 'react-icons/fa6'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatYearMonth } from '../utils/date.js'

export default function ProjectCard({ project }) {
  const { lang, t, pick } = useLanguage()
  const name = pick(project.name)

  return (
    <article className="flex flex-col rounded-2xl border border-ink-800 bg-ink-900/70 shadow-lg shadow-black/20 transition-colors hover:border-ink-700">
      <div className="flex-1 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <time className="font-mono text-xs uppercase tracking-wider text-accent-400" dateTime={project.date}>
            {project.period ?? formatYearMonth(project.date, lang)}
          </time>
          {project.status === 'in-progress' && (
            <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-xs font-medium text-amber-300">
              {t.projects.inProgress}
            </span>
          )}
        </div>

        <h3 className="mt-2 text-xl font-bold leading-snug">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">{pick(project.description)}</p>

        {project.role && (
          <p className="mt-4 border-l-2 border-brand-500/60 pl-3 text-sm leading-relaxed text-ink-300">
            <span className="font-semibold text-ink-100">{t.projects.role}:</span> {pick(project.role)}
          </p>
        )}

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-300/70">
            {t.projects.technologies}
          </p>
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-ink-700 bg-ink-800/70 px-2.5 py-1 text-xs text-ink-100"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {(project.repo || project.repoPrivate) && (
        <div className="border-t border-ink-800 px-5 py-4 sm:px-6">
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-ink-800 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500"
            >
              <FaGithub aria-hidden="true" />
              {t.projects.repo}
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-lg border border-dashed border-ink-700 px-3.5 py-2 text-sm text-ink-300">
              <FaLock aria-hidden="true" />
              {t.projects.privateRepo}
            </span>
          )}
        </div>
      )}
    </article>
  )
}