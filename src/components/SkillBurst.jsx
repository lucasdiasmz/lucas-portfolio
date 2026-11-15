import { useEffect, useRef, useState } from 'react'
import { FaCode } from 'react-icons/fa6'
import { SiCss, SiHtml5, SiJavascript, SiOpenjdk, SiPython, SiReact, SiSpringboot } from 'react-icons/si'
import './SkillBurst.css'

// Ícone e cor de marca de cada tecnologia (as que faltarem usam o ícone genérico)
const brands = {
  Python: { Icon: SiPython, color: '#3b82f6' },
  Java: { Icon: SiOpenjdk, color: '#f89820' },
  HTML: { Icon: SiHtml5, color: '#e34f26' },
  CSS: { Icon: SiCss, color: '#2965f1' },
  JavaScript: { Icon: SiJavascript, color: '#f7df1e' },
  'Spring Boot': { Icon: SiSpringboot, color: '#6db33f' },
  React: { Icon: SiReact, color: '#61dafb' },
}

// Elipses onde as habilidades pousam: larga (desktop) e alta (celular), em % do palco
const WIDE = { rx: 39, ry: 35 }
const TALL = { rx: 35, ry: 37 }
const GLYPHS = ['{ }', '</>', 'API', '[ ]', '=>', '( )', '::', '#', '&&', '<>', '[]', '{}', '//', '0x']
const clamp = (v) => Math.min(94, Math.max(6, v))

function point(i, n, f, { rx, ry }, offset = 0) {
  const a = ((-90 + ((i + offset) * 360) / n) * Math.PI) / 180
  return { x: clamp(50 + Math.cos(a) * rx * f), y: clamp(50 + Math.sin(a) * ry * f) }
}

const place = (i, n, f, offset, fTall = f) => {
  const w = point(i, n, f, WIDE, offset)
  const t = point(i, n, fTall, TALL, offset)
  return { w, t, style: { '--x': w.x, '--y': w.y, '--mx': t.x, '--my': t.y } }
}

// Faíscas da explosão: direções fixas para não mudar a cada render
const SPARKS = Array.from({ length: 28 }, (_, i) => {
  const a = (i / 28) * Math.PI * 2 + (i % 3) * 0.17
  const d = 26 + ((i * 37) % 22)
  return { '--sx': `${(Math.cos(a) * d).toFixed(1)}cqmin`, '--sy': `${(Math.sin(a) * d).toFixed(1)}cqmin`, '--sd': `${(i % 5) * 40}ms` }
})

// Linha do tempo da animação (ms)
const T_CHARGE = 750
const T_BURST = 1450
const T_REPLAY = 650

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/*
 * Pasta "HABILIDADES" que racha, carrega energia e explode, espalhando as
 * habilidades numa rede ligada ao núcleo. Toca sozinha quando entra na tela;
 * clicar na pasta adianta, e clicar no núcleo depois explode de novo.
 *
 * Só translate/scale/opacity animam (compositor); as linhas são SVG simples.
 */
export default function SkillBurst({ skills, label, openLabel, replayLabel }) {
  const ref = useRef(null)
  const timers = useRef([])
  const [phase, setPhase] = useState(() => (prefersReduced() ? 'done' : 'idle'))
  const n = skills.length
  const busy = phase !== 'idle' && phase !== 'done'

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms))

  const play = () => {
    clear()
    if (prefersReduced()) return setPhase('done')
    setPhase('crack')
    at(T_CHARGE, () => setPhase('charge'))
    at(T_BURST, () => setPhase('burst'))
    at(T_BURST + 1100 + n * 90, () => setPhase('done'))
  }

  const playRef = useRef(play)
  useEffect(() => {
    playRef.current = play
  })

  // Toca uma vez quando o palco aparece de verdade na tela
  useEffect(() => {
    const el = ref.current
    if (!el || phase !== 'idle') return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect()
          at(350, () => playRef.current())
        }
      },
      { threshold: 0.55 },
    )
    io.observe(el)
    return () => io.disconnect()
    // só no primeiro idle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => clear, [])

  const onFolder = () => {
    if (busy) return
    if (phase === 'idle') return play()
    // Implode de volta para o núcleo e explode de novo
    clear()
    setPhase('idle')
    at(T_REPLAY, play)
  }

  const items = skills.map((name, i) => ({ name, ...place(i, n, i % 2 ? 0.84 : 1, 0, 1) })) // no celular, elipse regular para os cards não se tocarem
  const glyphs = GLYPHS.slice(0, n * 2).map((g, i) => ({ g, ...place(i % n, n, i < n ? 1.24 : 0.52, 0.5) }))
  const open = phase === 'burst' || phase === 'done'

  const links = (key) => (
    <svg className={`sb__links sb__links--${key}`} aria-hidden="true">
      {items.map(({ name, ...p }, i) => {
        const end = { x1: '50%', y1: '50%', x2: `${p[key].x}%`, y2: `${p[key].y}%`, pathLength: 1 }
        return (
          <g key={name} style={{ '--d': `${i * 90}ms` }}>
            <line className="sb__line" {...end} />
            <line className="sb__pulse" {...end} style={{ '--pd': `${(i * 530) % 2400}ms` }} />
          </g>
        )
      })}
    </svg>
  )

  return (
    <div ref={ref} className="sb" data-phase={phase} data-open={open || undefined}>
      {links('w')}
      {links('t')}

      <div className="sb__fx" aria-hidden="true">
        <span className="sb__rays" />
        <span className="sb__orbit">
          <span />
        </span>
        <span className="sb__orbit sb__orbit--b">
          <span />
        </span>
        <span className="sb__flash" />
        {SPARKS.map((s, i) => (
          <span key={i} className="sb__spark" style={s} />
        ))}
      </div>

      {glyphs.map(({ g, style }, i) => (
        <span key={i} aria-hidden="true" className="sb__glyph" style={{ ...style, '--d': `${200 + i * 60}ms` }}>
          {g}
        </span>
      ))}

      <ul className="sb__skills">
        {items.map(({ name, style }, i) => {
          const { Icon, color } = brands[name] ?? { Icon: FaCode, color: '#fa6e00' }
          return (
            <li key={name} className="sb__skill" style={{ ...style, '--d': `${i * 90}ms`, '--brand': color }}>
              <div className="sb__float" style={{ '--fd': `${-i * 700}ms` }}>
                <div className="glass glass-hover group flex size-full flex-col items-center justify-center gap-2 !rounded-2xl sm:gap-3">
                  <Icon
                    aria-hidden="true"
                    className="text-3xl text-[var(--brand)] transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_14px_var(--brand)] sm:text-4xl lg:text-5xl"
                  />
                  <span className="text-[0.55rem] whitespace-nowrap text-[var(--brand)] sm:text-xs">{name}</span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        className="sb__folder"
        onClick={onFolder}
        aria-label={phase === 'done' ? replayLabel : openLabel}
        title={phase === 'done' ? replayLabel : undefined}
      >
        <span className="sb__body">
          <svg viewBox="0 0 320 200" className="sb__svg" aria-hidden="true">
            <path className="sb__panel" d="M10 44 L30 22 L128 22 L144 38 L290 38 L310 58 L310 170 L290 190 L30 190 L10 170 Z" />
            <path className="sb__edge" d="M10 44 L30 22 L128 22 L144 38 L290 38 L310 58 L310 170 L290 190 L30 190 L10 170 Z" />
            <path className="sb__bar" d="M38 22 L120 22 M90 190 L230 190 M310 80 L310 140" />
            <g className="sb__cracks">
              {[
                'M160 114 L140 100 L128 104 L104 82 L80 72 L50 52',
                'M160 114 L182 98 L196 102 L222 78 L250 66 L284 52',
                'M160 114 L138 130 L120 126 L96 152 L70 164 L38 180',
                'M160 114 L184 132 L202 128 L226 154 L256 166 L292 180',
                'M104 82 L98 60 M222 78 L234 58 M96 152 L104 176 M226 154 L218 178',
              ].map((d) => (
                <path key={d} d={d} pathLength="1" />
              ))}
            </g>
          </svg>
          <span className="sb__label">{label}</span>
        </span>
      </button>
    </div>
  )
}
