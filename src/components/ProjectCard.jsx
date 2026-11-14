import { FaArrowUpRightFromSquare, FaGithub, FaGlobe, FaLock } from 'react-icons/fa6'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatYearMonth } from '../utils/date.js'
import { useReveal } from '../utils/useReveal.js'
import Poster from './Poster.jsx'

const linkClass =
  'inline-flex items-center gap-2 font-semibold text-blue underline decoration-2 underline-offset-[5px] transition-colors hover:text-red'

// Um projeto como cartaz: composição geométrica de um lado, ficha do projeto do outro.
// `flip` alterna o lado do cartaz para dar ritmo à lista.
export default function ProjectCard({ project, flip = false, headingLevel = 'h2' }) {
  const { lang, t, pick } = useLanguage()
  const ref = useReveal(0.15)
  const Heading = headingLevel

  return (
    <article id={project.id} ref={ref} className="reveal grid scroll-mt-24 items-center gap-8 md:grid-cols-12 md:gap-12">
      <Poster id={project.id} className={['md:col-span-5', flip ? 'md:order-2' : ''].join(' ')} />

      <div className="md:col-span-7">
        <Heading className="type-tight text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[0.95] tracking-[-0.015em]">
          {pick(project.name)}
        </Heading>

        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-type text-sm text-graphite">
          <time dateTime={project.date}>{project.period ?? formatYearMonth(project.date, lang)}</time>
          {project.status === 'in-progress' && (
            <span className="inline-flex items-center gap-2 bg-sun px-2 py-0.5 font-sans font-semibold text-ink">
              <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-ink" />
              {t.projects.inProgress}
            </span>
          )}
        </p>

        <p className="mt-5 max-w-[62ch] text-graphite">{pick(project.description)}</p>

        {project.role && (
          <p className="mt-3 max-w-[62ch] text-graphite">
            <span className="font-semibold text-ink">{t.projects.role}:</span> {pick(project.role)}
          </p>
        )}

        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold" aria-label={t.projects.technologies}>
          {project.technologies.map((tech) => (
            <li key={tech} className="flex items-center gap-2">
              <span aria-hidden="true" className="size-1.5 rotate-45 bg-red" />
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
          {project.site && (
            <a href={project.site} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <FaGlobe aria-hidden="true" />
              {t.projects.site}
              <FaArrowUpRightFromSquare aria-hidden="true" className="text-xs" />
            </a>
          )}
          {project.repo ? (
            <a href={project.repo} target="_blank" rel="noopener noreferrer" className={linkClass}>
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
      </div>
    </article>
  )
}
