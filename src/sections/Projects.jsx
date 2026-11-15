import { useState } from 'react'
import { FaArrowUpRightFromSquare, FaGithub } from 'react-icons/fa6'
import Reveal from '../components/Reveal.jsx'
import SplitTitle from '../components/SplitTitle.jsx'
import { projects } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatYearMonth } from '../utils/date.js'

// Mais recente primeiro
const ordered = [...projects].sort((a, b) => b.date.localeCompare(a.date))

function ProjectCard({ project, index }) {
  const { lang, pick, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const name = pick(project.name)
  const descId = `${project.id}-desc`

  return (
    <Reveal as="li" delay={(index % 3) * 110} className="glass glass-hover group flex flex-col overflow-hidden">
      {/* Capa: imagem do projeto quando existir, senão um painel com número e período */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/5 bg-[radial-gradient(circle_at_30%_20%,rgb(250_110_0/0.35),transparent_55%),linear-gradient(135deg,#1a0d05,#0b0b0b)]">
        {project.image ? (
          <img
            src={project.image}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div aria-hidden="true" className="flex size-full flex-col justify-between p-6">
            <span className="text-5xl text-orange-500/80 transition-transform duration-700 group-hover:translate-x-2">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-[0.6rem] tracking-[0.25em] text-white/25 uppercase">{project.technologies.join(' / ')}</span>
          </div>
        )}
        <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
          <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[0.6rem] text-neutral-300 backdrop-blur">
            {project.period ?? formatYearMonth(project.date, lang)}
          </span>
          {project.status === 'in-progress' && (
            <span className="rounded-full bg-orange-500 px-3 py-1 text-[0.6rem] text-black">{t.projects.inProgress}</span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg text-orange-400">{name}</h3>
        <p id={descId} className={`mt-3 text-xs leading-relaxed text-neutral-300 ${open ? '' : 'line-clamp-3'}`}>
          {pick(project.description)}
        </p>
        {open && project.role && (
          <p className="mt-3 text-xs leading-relaxed text-neutral-400">
            <span className="text-orange-400">{t.projects.role}:</span> {pick(project.role)}
          </p>
        )}

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.6rem] text-neutral-300">
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center gap-4 pt-6">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={descId}
            className="btn-ghost px-4 py-2 text-[0.65rem]"
          >
            {open ? t.projects.less : t.projects.more}
          </button>
          {project.site && (
            <a
              href={project.site}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.projects.site}: ${name}`}
              className="text-neutral-400 transition-colors hover:text-orange-400"
            >
              <FaArrowUpRightFromSquare aria-hidden="true" />
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.projects.repo}: ${name}`}
              className="text-lg text-neutral-400 transition-colors hover:text-orange-400"
            >
              <FaGithub aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </Reveal>
  )
}

export default function Projects() {
  const { t } = useLanguage()
  return (
    <section id="projetos" aria-labelledby="projetos-titulo" className="px-6 py-24 md:px-16">
      <SplitTitle id="projetos-titulo" text={t.projects.title} />
      <ul className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </ul>
    </section>
  )
}
