import { useEffect, useState } from 'react'
import { FaArrowLeft, FaCode } from 'react-icons/fa6'
import { SiCss, SiHtml5, SiJavascript, SiOpenjdk, SiPython, SiReact, SiSpringboot } from 'react-icons/si'
import SplitTitle from './SplitTitle.jsx'
import './SkillSystem.css'

// Ícone e cor de marca de cada tecnologia (a cor só aparece no destaque)
const brands = {
  Python: { Icon: SiPython, color: '#3b82f6' },
  Java: { Icon: SiOpenjdk, color: '#f89820' },
  HTML: { Icon: SiHtml5, color: '#e34f26' },
  CSS: { Icon: SiCss, color: '#2965f1' },
  JavaScript: { Icon: SiJavascript, color: '#f7df1e' },
  'Spring Boot': { Icon: SiSpringboot, color: '#6db33f' },
  React: { Icon: SiReact, color: '#61dafb' },
}

/*
 * Geometria em unidades do viewBox. O palco tem a mesma proporção do viewBox,
 * então as posições viram porcentagens sem distorcer os círculos.
 *   c: centro do planeta, r: raio do planeta, rings: raios dos anéis,
 *   angles: ângulo (graus acima da horizontal) de cada habilidade no seu anel.
 * A habilidade i fica no anel i + 1; o primeiro e os dois últimos ficam vazios.
 */
const LAYOUTS = {
  wide: {
    w: 1600,
    h: 900,
    c: [110, 820],
    r: 230,
    rings: [300, 375, 450, 525, 600, 675, 750, 825, 900, 975],
    angles: [58, 28, 70, 40, 62, 22, 46],
  },
  narrow: {
    w: 400,
    h: 660,
    c: [20, 640],
    r: 95,
    rings: [135, 177, 219, 261, 303, 345, 387, 429, 471, 513],
    angles: [60, 25, 72, 40, 66, 30, 48],
  },
}

const pct = (v, total) => `${((v / total) * 100).toFixed(3)}%`

function useNarrow() {
  const query = '(max-width: 767px)'
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setNarrow(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return narrow
}

/*
 * Habilidades como um sistema solar: o planeta no canto de baixo à esquerda,
 * anéis concêntricos saindo dele e cada tecnologia num anel, balançando devagar
 * na sua órbita. Clicar numa tecnologia troca o título da direita por uma
 * descrição curta dela; clicar de novo, em "voltar" ou Esc volta ao título.
 */
export default function SkillSystem({ skills, labels }) {
  const narrow = useNarrow()
  const L = narrow ? LAYOUTS.narrow : LAYOUTS.wide
  const [sel, setSel] = useState(null)

  const placed = skills.map((s, i) => ({ ...s, ...(brands[s.name] ?? { Icon: FaCode, color: 'var(--color-ember)' }), ring: i + 1 }))
  const current = sel !== null ? placed[sel] : null

  const toggle = (i) => setSel((s) => (s === i ? null : i))

  return (
    <div
      className="ss"
      data-open={current ? '' : undefined}
      style={{ '--ss-ratio': `${L.w} / ${L.h}`, '--tint': current?.color ?? 'var(--color-ember)' }}
      onKeyDown={(ev) => ev.key === 'Escape' && setSel(null)}
    >
      <div className="ss__stage">
        <svg className="ss__rings" viewBox={`0 0 ${L.w} ${L.h}`} aria-hidden="true">
          <defs>
            <radialGradient id="ss-fade" cx={L.c[0]} cy={L.c[1]} r={L.rings.at(-1)} gradientUnits="userSpaceOnUse">
              <stop offset="0.2" stopColor="var(--color-paper)" stopOpacity="0.32" />
              <stop offset="1" stopColor="var(--color-paper)" stopOpacity="0.07" />
            </radialGradient>
          </defs>
          {L.rings.map((r, i) => {
            const on = current && current.ring === i
            return (
              <circle
                key={r}
                className={`ss__ring${on ? ' is-on' : ''}`}
                cx={L.c[0]}
                cy={L.c[1]}
                r={r}
                stroke={on ? current.color : 'url(#ss-fade)'}
              />
            )
          })}
        </svg>

        <button
          type="button"
          className="ss__planet"
          style={{ left: pct(L.c[0], L.w), top: pct(L.c[1], L.h), width: pct(L.r * 2, L.w) }}
          aria-label={labels.back}
          tabIndex={current ? 0 : -1}
          onClick={() => setSel(null)}
        />

        <ul className="ss__moons">
          {placed.map(({ name, Icon, color, ring }, i) => (
            <li
              key={name}
              className={`ss__arm${sel === i ? ' is-sel' : ''}`}
              style={{
                left: pct(L.c[0], L.w),
                top: pct(L.c[1], L.h),
                width: pct(L.rings[ring], L.w),
                '--a': `${-L.angles[i]}deg`,
                '--dur': `${7 + (i % 3) * 2.2}s`,
                '--delay': `${-i * 1.7}s`,
                '--brand': color,
              }}
            >
              <span className="ss__moon">
                <button
                  type="button"
                  className="ss__disc"
                  aria-pressed={sel === i}
                  aria-controls="ss-panel"
                  onClick={() => toggle(i)}
                >
                  <Icon aria-hidden="true" className="ss__icon" />
                  <span className="ss__label">{name}</span>
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div id="ss-panel" className="ss__panel" aria-live="polite">
        <div className="ss__intro" aria-hidden={!!current}>
          <SplitTitle id="habilidades-titulo" text={labels.title} className="ss__title" />
          <p className="ss__subtitle">{labels.subtitle}</p>
          <p className="ss__hint">{labels.hint}</p>
        </div>

        {current && (
          <div key={current.name} className="ss__detail" style={{ '--brand': current.color }}>
            <p className="ss__kind">
              <current.Icon aria-hidden="true" />
              {current.kind}
            </p>
            <h3 className="ss__name">{current.name}</h3>
            <p className="ss__text">{current.text}</p>
            <p className="ss__meta">
              {current.projects.length > 0
                ? `${labels.usedIn} ${current.projects.length} ${current.projects.length === 1 ? labels.project : labels.projects}: ${current.projects.join(', ')}`
                : labels.noProjects}
            </p>
            <button type="button" className="ss__back" onClick={() => setSel(null)}>
              <FaArrowLeft aria-hidden="true" />
              {labels.back}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
