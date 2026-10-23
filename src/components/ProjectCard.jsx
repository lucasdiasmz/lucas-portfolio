import { FaArrowUpRightFromSquare, FaGithub, FaLock } from 'react-icons/fa6'
import { useLanguage } from '../i18n/LanguageContext.jsx'

// Conteúdo de um projeto dentro da linha do tempo (a data fica na coluna da Timeline)
export default function ProjectCard({ project }) {
  const { t, pick } = useLanguage()

  return (
    <article>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h3 className="type-condensed text-[2.5rem] font-extrabold leading-none tracking-tight">
          {pick(project.name)}
        </h3>
        {project.status === 'in-progress' && (
          <span className="bg-marker px-2 py-0.5 text-sm font-semibold text-ink">{t.projects.inProgress}</span>
        )}
      </div>

      <p className="mt-4 max-w-[62ch] text-graphite">{pick(project.description)}</p>

      {project.role && (
        <p className="mt-3 max-w-[62ch] text-graphite">
          <span className="font-semibold text-ink">{t.projects.role}:</span> {pick(project.role)}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap gap-2" aria-label={t.projects.technologies}>
          {project.technologies.map((tech) => (
            <li key={tech} className="type-wide border border-ink px-2.5 py-0.5 text-sm font-medium">
              {tech}
            </li>
          ))}
        </ul>

        {project.repo ? (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-cobalt underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            <FaGithub aria-hidden="true" />
            {t.projects.repo}
            <FaArrowUpRightFromSquare aria-hidden="true" className="text-xs" />
          </a>
        ) : (
          project.repoPrivate && (
            <span className="inline-flex items-center gap-2 text-graphite">
              <FaLock aria-hidden="true" />
              {t.projects.privateRepo}
            </span>
          )
        )}
      </div>
    </article>
  )
}
