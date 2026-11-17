import { useState } from 'react'
import { FaArrowLeft, FaCode } from 'react-icons/fa6'
import { SiCss, SiHtml5, SiJavascript, SiOpenjdk, SiPython, SiReact, SiSpringboot } from 'react-icons/si'
import SplitTitle from './SplitTitle.jsx'
import { mediaStore, useStore } from '../motion/store.js'
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
 * A habilidade i fica no anel i + 1. Os anéis seguem bem além do palco e vão
 * sumindo, como uma órbita sem fim.
 */
function ringsFrom(first, step, count) {
  return Array.from({ length: count }, (_, i) => first + i * step)
}

// O SVG dos anéis é maior que o palco: EXT_X de cada lado e EXT_TOP em cima
const EXT_X = 1
const EXT_TOP = 0.12
const skyW = 1 + 2 * EXT_X
const skyH = 1 + EXT_TOP

// Camadas de arcos giratórios: cada uma leva um terço dos anéis internos
const skyBox = { left: `${-EXT_X * 100}%`, top: `${-EXT_TOP * 100}%`, width: `${skyW * 100}%`, height: `${skyH * 100}%` }

const SPIN_LAYERS = [
  { dur: '140s', dir: 'normal', start: '0deg' },
  { dur: '190s', dir: 'reverse', start: '40deg' },
  { dur: '250s', dir: 'normal', start: '110deg' },
]

// Traço de cada arco giratório (pathLength = 360, então as medidas são graus)
const DASHES = ['1.5 10.5', '46 134', '14 40 4 122', '2 22', '80 280', '22 68']

const LAYOUTS = {
  wide: {
    w: 1600,
    h: 900,
    c: [110, 820],
    r: 230,
    rings: ringsFrom(300, 75, 30),
    spin: 10, // quantos anéis (de dentro para fora) têm arcos girando
    angles: [58, 28, 70, 40, 62, 22, 46],
  },
  narrow: {
    w: 400,
    h: 660,
    c: [20, 640],
    r: 95,
    rings: ringsFrom(135, 42, 22),
    spin: 9,
    angles: [60, 25, 72, 40, 66, 30, 48],
  },
}

const pct = (v, total) => `${((v / total) * 100).toFixed(3)}%`

const narrowScreen = mediaStore('(max-width: 767px)')

/*
 * Habilidades como um sistema solar: o planeta no canto de baixo à esquerda,
 * anéis concêntricos saindo dele e cada tecnologia num anel, balançando devagar
 * na sua órbita. Clicar numa tecnologia troca o título da direita por uma
 * descrição curta dela; clicar de novo, em "voltar" ou Esc volta ao título.
 */
export default function SkillSystem({ skills, labels }) {
  const narrow = useStore(narrowScreen)
  const L = narrow ? LAYOUTS.narrow : LAYOUTS.wide
  const [sel, setSel] = useState(null)

  const placed = skills.map((s, i) => ({ ...s, ...(brands[s.name] ?? { Icon: FaCode, color: 'var(--color-ember)' }), ring: i + 1 }))
  const current = sel !== null ? placed[sel] : null
  const hlR = current ? L.rings[current.ring] + 12 : 0

  const toggle = (i) => setSel((s) => (s === i ? null : i))

  return (
    <div
      className="ss"
      data-open={current ? '' : undefined}
      style={{ '--ss-ratio': `${L.w} / ${L.h}`, '--tint': current?.color ?? 'var(--color-ember)' }}
      onKeyDown={(ev) => ev.key === 'Escape' && setSel(null)}
    >
      {/* Céu: maior que o palco (anéis passam das bordas) e apagado nas pontas.
          Os anéis ficam num SVG parado; os arcos que giram vão em poucas camadas
          que giram inteiras, só com transform, sem repintar nada a cada quadro. */}
      <div
        className="ss__sky"
        style={skyBox}
        aria-hidden="true"
      >
        <svg className="ss__rings" viewBox={`${-L.w * EXT_X} ${-L.h * EXT_TOP} ${L.w * skyW} ${L.h * skyH}`}>
          <defs>
            <radialGradient id="ss-fade" cx={L.c[0]} cy={L.c[1]} r={L.rings.at(-1)} gradientUnits="userSpaceOnUse">
              <stop offset="0.1" stopColor="var(--color-paper)" stopOpacity="0.34" />
              <stop offset="0.45" stopColor="var(--color-paper)" stopOpacity="0.1" />
              <stop offset="1" stopColor="var(--color-paper)" stopOpacity="0" />
            </radialGradient>
          </defs>
          {L.rings.map((r) => (
            <circle key={r} className="ss__ring" cx={L.c[0]} cy={L.c[1]} r={r} stroke="url(#ss-fade)" />
          ))}
        </svg>

        {SPIN_LAYERS.map((layer, g) => {
          const rings = L.rings.slice(0, L.spin).filter((_, i) => i % SPIN_LAYERS.length === g)
          const R = L.rings[L.spin - 1] + 10
          return (
            <svg
              key={g}
              className="ss__spin"
              viewBox={`${L.c[0] - R} ${L.c[1] - R} ${R * 2} ${R * 2}`}
              style={{
                left: pct(L.c[0] - R + L.w * EXT_X, L.w * skyW),
                top: pct(L.c[1] - R + L.h * EXT_TOP, L.h * skyH),
                width: pct(R * 2, L.w * skyW),
                '--spin': layer.dur,
                '--dir': layer.dir,
                '--start': layer.start,
              }}
            >
              <defs>
                <radialGradient id={`ss-arc-${g}`} cx={L.c[0]} cy={L.c[1]} r={R} gradientUnits="userSpaceOnUse">
                  <stop offset="0.2" stopColor="var(--color-glow)" stopOpacity="0.6" />
                  <stop offset="0.6" stopColor="var(--color-glow)" stopOpacity="0.25" />
                  <stop offset="1" stopColor="var(--color-glow)" stopOpacity="0" />
                </radialGradient>
              </defs>
              {rings.map((r, k) => (
                <circle
                  key={r}
                  cx={L.c[0]}
                  cy={L.c[1]}
                  r={r}
                  pathLength="360"
                  stroke={`url(#ss-arc-${g})`}
                  strokeDasharray={DASHES[(g + k * SPIN_LAYERS.length) % DASHES.length]}
                  strokeDashoffset={(k * 97) % 360}
                />
              ))}
            </svg>
          )
        })}
        {current && (
          <svg
            key={current.ring}
            className="ss__hl"
            viewBox={`${L.c[0] - hlR} ${L.c[1] - hlR} ${hlR * 2} ${hlR * 2}`}
            style={{
              left: pct(L.c[0] - hlR + L.w * EXT_X, L.w * skyW),
              top: pct(L.c[1] - hlR + L.h * EXT_TOP, L.h * skyH),
              width: pct(hlR * 2, L.w * skyW),
            }}
          >
            <circle cx={L.c[0]} cy={L.c[1]} r={L.rings[current.ring]} stroke={current.color} strokeWidth="7" strokeOpacity="0.18" />
            <circle cx={L.c[0]} cy={L.c[1]} r={L.rings[current.ring]} stroke={current.color} strokeWidth="1.6" />
          </svg>
        )}
      </div>

      {/* Planeta numa camada do tamanho do céu, com o mesmo degradê na base */}
      <div className="ss__ground" style={skyBox}>
        <button
          type="button"
          className="ss__planet"
          style={{
            left: pct(L.c[0] + L.w * EXT_X, L.w * skyW),
            top: pct(L.c[1] + L.h * EXT_TOP, L.h * skyH),
            width: pct(L.r * 2, L.w * skyW),
          }}
          aria-label={labels.back}
          tabIndex={current ? 0 : -1}
          onClick={() => setSel(null)}
        />
      </div>

      <div className="ss__stage">

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
