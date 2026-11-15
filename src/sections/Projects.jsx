import { useMemo, useState } from 'react'
import { FaArrowRight, FaArrowUpRightFromSquare, FaGithub } from 'react-icons/fa6'
import Reveal from '../components/Reveal.jsx'
import SplitTitle from '../components/SplitTitle.jsx'
import { projects } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatYearMonth } from '../utils/date.js'

// Mais recente primeiro
const ordered = [...projects].sort((a, b) => b.date.localeCompare(a.date))

// Áreas dos filtros, deduzidas das tecnologias de cada projeto
const groupsOf = (p) => {
  const tech = p.technologies.map((x) => x.toLowerCase())
  const out = []
  if (tech.some((x) => ['html', 'css', 'javascript', 'react'].includes(x))) out.push('web')
  if (tech.some((x) => ['java', 'spring boot'].includes(x))) out.push('backend')
  if (tech.includes('python')) out.push('python')
  return out
}
const GROUPS = ['all', 'web', 'backend', 'python']
const num = (p) => String(ordered.indexOf(p) + 1).padStart(2, '0')

// Detalhes completos de um projeto. Aparece no painel lateral (desktop)
// e aberto embaixo da linha escolhida (celular).
function ProjectDetail({ project, id }) {
  const { lang, pick, t } = useLanguage()
  const name = pick(project.name)

  return (
    <article id={id} className="animate-rise">
      <div className="relative aspect-[16/7] overflow-hidden rounded-2xl lg:aspect-[16/6] border border-white/10 bg-[radial-gradient(circle_at_25%_20%,rgb(250_110_0/0.4),transparent_55%),radial-gradient(circle_at_90%_100%,rgb(230_0_38/0.25),transparent_50%),linear-gradient(135deg,#1a0d05,#0b0b0b)]">
        {project.image ? (
          <img src={project.image} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <div aria-hidden="true" className="flex size-full items-end justify-between p-6">
            <span className="glow-text text-[clamp(3.5rem,8vw,6rem)] leading-none text-orange-500/90">{num(project)}</span>
            <span className="max-w-[60%] text-right text-[0.6rem] uppercase tracking-[0.25em] text-white/35">
              {project.technologies.join(' / ')}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-[0.6rem]">
        <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-neutral-300">
          {project.period ?? formatYearMonth(project.date, lang)}
        </span>
        {project.status === 'in-progress' && (
          <span className="flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 text-black">
            <span className="size-1.5 animate-pulse rounded-full bg-black" /> {t.projects.inProgress}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-[clamp(1.4rem,3vw,2rem)] leading-tight text-white">{name}</h3>
      <p className="mt-4 text-sm leading-relaxed text-neutral-300">{pick(project.description)}</p>

      {project.role && (
        <p className="mt-5 border-l-2 border-orange-500/70 pl-4 text-xs leading-relaxed text-neutral-400">
          <span className="block text-[0.6rem] uppercase tracking-[0.2em] text-orange-400">{t.projects.role}</span>
          <span className="mt-1 block">{pick(project.role)}</span>
        </p>
      )}

      <p className="mt-6 text-[0.6rem] uppercase tracking-[0.2em] text-neutral-500">{t.projects.stack}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <li key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] text-neutral-200">
            {tech}
          </li>
        ))}
      </ul>

      {(project.site || project.repo) && (
        <div className="mt-8 flex flex-wrap gap-3">
          {project.site && (
            <a href={project.site} target="_blank" rel="noopener noreferrer" className="btn-fire px-5 py-2.5 text-[0.7rem]">
              <FaArrowUpRightFromSquare aria-hidden="true" /> {t.projects.site}
            </a>
          )}
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer" className="btn-ghost px-5 py-2.5 text-[0.7rem]">
              <FaGithub aria-hidden="true" /> {t.projects.repo}
            </a>
          )}
        </div>
      )}
    </article>
  )
}

export default function Projects() {
  const { pick, t } = useLanguage()
  const [filter, setFilter] = useState('all')
  const [activeId, setActiveId] = useState(ordered[0]?.id)

  const visible = useMemo(
    () => (filter === 'all' ? ordered : ordered.filter((p) => groupsOf(p).includes(filter))),
    [filter],
  )
  const active = visible.find((p) => p.id === activeId) ?? visible[0]
  const counts = useMemo(
    () => Object.fromEntries(GROUPS.map((g) => [g, g === 'all' ? ordered.length : ordered.filter((p) => groupsOf(p).includes(g)).length])),
    [],
  )

  // Setas ↑/↓ navegam pela lista
  const onKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const i = visible.indexOf(active)
    const next = visible[(i + (e.key === 'ArrowDown' ? 1 : -1) + visible.length) % visible.length]
    setActiveId(next.id)
    document.getElementById(`proj-btn-${next.id}`)?.focus()
  }

  return (
    <section id="projetos" aria-labelledby="projetos-titulo" className="px-6 py-24 md:px-16">
      <SplitTitle id="projetos-titulo" text={t.projects.title} />

      <Reveal className="mx-auto mt-12 flex max-w-6xl flex-wrap justify-center gap-2" role="group" aria-label={t.projects.filter}>
        {GROUPS.filter((g) => counts[g] > 0).map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={filter === g}
            onClick={() => setFilter(g)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[0.65rem] transition-[background-color,border-color,color] duration-300 ${
              filter === g
                ? 'border-orange-500 bg-orange-500 text-black'
                : 'border-white/10 bg-black/40 text-neutral-300 backdrop-blur hover:border-orange-500/60 hover:text-white'
            }`}
          >
            {t.projects.groups[g]}
            <span className={filter === g ? 'text-black/60' : 'text-neutral-500'}>{counts[g]}</span>
          </button>
        ))}
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        {/* Índice de projetos */}
        <ul className="flex flex-col gap-2" onKeyDown={onKeyDown}>
          {visible.map((p, i) => {
            const isActive = p.id === active?.id
            return (
              <Reveal as="li" key={p.id} delay={i * 90}>
                <button
                  id={`proj-btn-${p.id}`}
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={`proj-m-${p.id}`}
                  onClick={() => setActiveId(p.id)}
                  onMouseEnter={() => window.matchMedia('(hover: hover) and (min-width: 1024px)').matches && setActiveId(p.id)}
                  className={`group relative flex w-full items-center gap-5 overflow-hidden rounded-2xl border px-5 py-5 text-left transition-[background-color,border-color] duration-500 ${
                    isActive ? 'border-orange-500/50 bg-orange-500/[0.08]' : 'border-white/5 bg-black/30 hover:border-white/15 hover:bg-white/[0.04]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-3 left-0 w-[3px] origin-center rounded-full bg-gradient-to-b from-orange-400 to-red-600 transition-transform duration-500 ease-out-expo ${
                      isActive ? 'scale-y-100' : 'scale-y-0'
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`text-2xl tabular-nums transition-colors duration-500 ${isActive ? 'text-orange-500' : 'text-white/20 group-hover:text-white/40'}`}
                  >
                    {num(p)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm transition-colors duration-300 ${isActive ? 'text-white' : 'text-neutral-300'}`}>
                      {pick(p.name)}
                    </span>
                    <span className="mt-1.5 flex items-center gap-2 truncate text-[0.6rem] text-neutral-500">
                      {p.status === 'in-progress' && <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-orange-500" />}
                      {p.period} · {p.technologies.slice(0, 3).join(', ')}
                    </span>
                  </span>
                  <FaArrowRight
                    aria-hidden="true"
                    className={`shrink-0 text-xs transition-[transform,color] duration-500 ease-out-expo ${
                      isActive ? 'translate-x-0 rotate-90 text-orange-500 lg:rotate-0' : '-translate-x-1 text-white/20 group-hover:translate-x-0 group-hover:text-white/50'
                    }`}
                  />
                </button>

                {/* Celular/tablet: detalhes abrem embaixo da linha */}
                {isActive && (
                  <div className="glass mt-2 p-5 lg:hidden">
                    <ProjectDetail project={p} id={`proj-m-${p.id}`} />
                  </div>
                )}
              </Reveal>
            )
          })}
        </ul>

        {/* Desktop: painel fixo com o projeto escolhido */}
        <div className="hidden lg:block">
          <div className="glass sticky top-28 p-8">
            {active && <ProjectDetail key={active.id} project={active} id={`proj-d-${active.id}`} />}
          </div>
        </div>
      </div>
    </section>
  )
}
