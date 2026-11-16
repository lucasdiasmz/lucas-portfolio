import { useMemo, useState } from 'react'
import { FaArrowUpRightFromSquare, FaGithub, FaXmark } from 'react-icons/fa6'
import GlassFolder from '../components/GlassFolder.jsx'
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
const ARTS = ['brasa', 'chama', 'carvao']
const num = (p) => String(ordered.indexOf(p) + 1).padStart(2, '0')

// Detalhes completos do projeto aberto, logo abaixo das pastas
function ProjectDetail({ project, onClose }) {
  const { lang, pick, t } = useLanguage()

  return (
    <article id="proj-detail" className="glass relative mx-auto mt-16 max-w-3xl animate-rise p-6 sm:p-8">
      <button
        type="button"
        onClick={onClose}
        aria-label={`${t.projects.close}: ${pick(project.name)}`}
        className="absolute top-4 right-4 grid size-9 place-items-center rounded-full border border-white/10 text-neutral-400 transition-colors hover:border-brand-500/60 hover:text-white"
      >
        <FaXmark aria-hidden="true" />
      </button>

      <div className="flex flex-wrap items-center gap-2 pr-10 text-[0.6rem]">
        <span className="text-brand-500">{num(project)}</span>
        <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-neutral-300">
          {project.period ?? formatYearMonth(project.date, lang)}
        </span>
        {project.status === 'in-progress' && (
          <span className="flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1 text-black">
            <span className="size-1.5 animate-pulse rounded-full bg-black" /> {t.projects.inProgress}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-[clamp(1.3rem,3vw,1.8rem)] leading-tight text-white">{pick(project.name)}</h3>
      <p className="mt-4 text-sm leading-relaxed text-neutral-300">{pick(project.description)}</p>

      {project.role && (
        <p className="mt-5 border-l-2 border-brand-500/70 pl-4 text-xs leading-relaxed text-neutral-400">
          <span className="block text-[0.6rem] uppercase tracking-[0.2em] text-brand-400">{t.projects.role}</span>
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
    </article>
  )
}

export default function Projects() {
  const { pick, t } = useLanguage()
  const [filter, setFilter] = useState('all')
  const [openId, setOpenId] = useState(null)

  const visible = useMemo(
    () => (filter === 'all' ? ordered : ordered.filter((p) => groupsOf(p).includes(filter))),
    [filter],
  )
  // Se o filtro esconder a pasta aberta, o painel some junto
  const openProject = visible.find((p) => p.id === openId)
  const counts = useMemo(
    () => Object.fromEntries(GROUPS.map((g) => [g, g === 'all' ? ordered.length : ordered.filter((p) => groupsOf(p).includes(g)).length])),
    [],
  )

  const showDetail = () =>
    requestAnimationFrame(() => document.getElementById('proj-detail')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))

  // Folhas de cada pasta: detalhes + links do projeto
  const filesOf = (p, i) => [
    { name: t.projects.details, meta: p.technologies.slice(0, 2).join(' · '), onSelect: showDetail },
    ...(p.repo ? [{ name: 'GitHub', meta: 'repo', href: p.repo }] : []),
    ...(p.site ? [{ name: 'Site', meta: 'live', href: p.site, art: ARTS[(i + 1) % ARTS.length] }] : []),
  ]

  return (
    <section id="projetos" aria-labelledby="projetos-titulo" className="px-6 py-14 md:px-16 md:py-16">
      <SplitTitle id="projetos-titulo" text={t.projects.title} />

      <Reveal className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-center gap-2" role="group" aria-label={t.projects.filter}>
        {GROUPS.filter((g) => counts[g] > 0).map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={filter === g}
            onClick={() => setFilter(g)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[0.65rem] transition-[background-color,border-color,color] duration-300 ${
              filter === g
                ? 'border-brand-500 bg-brand-500 text-black'
                : 'border-white/10 bg-black/40 text-neutral-300 backdrop-blur hover:border-brand-500/60 hover:text-white'
            }`}
          >
            {t.projects.groups[g]}
            <span className={filter === g ? 'text-black/60' : 'text-neutral-500'}>{counts[g]}</span>
          </button>
        ))}
      </Reveal>

      <ul className="mx-auto mt-10 grid max-w-6xl justify-items-center gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
        {visible.map((p, i) => {
          const idx = ordered.indexOf(p)
          return (
            <li key={p.id} className="w-full">
              <GlassFolder
                label={pick(p.name)}
                meta={`${num(p)} · ${p.period}`}
                badge={p.status === 'in-progress' ? t.projects.inProgress : undefined}
                art={ARTS[idx % ARTS.length]}
                seed={idx * 7 + 3}
                files={filesOf(p, idx)}
                open={p.id === openId}
                onOpenChange={(o) => setOpenId(o ? p.id : null)}
                appearDelay={i * 120}
                nudgeDelay={800 + i * 300}
                openLabel={t.projects.open}
                closeLabel={t.projects.close}
                contentsLabel={t.projects.contents}
              />
            </li>
          )
        })}
      </ul>

      {openProject ? (
        <ProjectDetail key={openProject.id} project={openProject} onClose={() => setOpenId(null)} />
      ) : (
        <p className="mt-8 text-center text-[0.6rem] uppercase tracking-[0.2em] text-neutral-500">{t.projects.hint}</p>
      )}
    </section>
  )
}
