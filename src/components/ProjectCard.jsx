import { useState } from 'react'
import { FaGithub, FaLock } from 'react-icons/fa6'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatYearMonth } from '../utils/date.js'

function initials(text) {
  return text
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function ImagePlaceholder({ name }) {
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-ink-800 via-ink-900 to-brand-500/30">
      <span className="font-mono text-4xl font-medium tracking-widest text-brand-400/70">{initials(name)}</span>
    </div>
  )
}

export default function ProjectCard({ project }) {
  const { lang, t, pick } = useLanguage()
  const [imageFailed, setImageFailed] = useState(false)
  const name = pick(project.name)
  const showImage = project.image && !imageFailed

  return (
    <article className="overflow-hidden rounded-2xl border border-ink-800 bg-ink-900/70 shadow-lg shadow-black/20 transition-colors hover:border-ink-700">
      <div className="aspect-video w-full overflow-hidden bg-ink-800">
        {showImage ? (
          <img
            src={project.image}
            alt={`${t.projects.imageAlt}: ${name}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImagePlaceholder name={name} />
        )}
      </div>

      <div className="p-5">
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
        <h3 className="mt-1 text-lg font-bold leading-snug">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">{pick(project.description)}</p>
        {project.role && (
          <p className="mt-2 text-sm leading-relaxed text-ink-300">
            <span className="font-semibold text-ink-100">{t.projects.role}:</span> {pick(project.role)}
          </p>
        )}

        <div className="mt-4">
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

        <div className="mt-5">
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
          ) : project.repoPrivate ? (
            <span className="inline-flex items-center gap-2 rounded-lg border border-dashed border-ink-700 px-3.5 py-2 text-sm text-ink-300">
              <FaLock aria-hidden="true" />
              {t.projects.privateRepo}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
