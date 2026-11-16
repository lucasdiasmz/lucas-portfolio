import { useEffect, useId, useRef, useState } from 'react'
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
const clamp = (v, lo = 6, hi = 94) => Math.min(hi, Math.max(lo, v))

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

// Rachaduras geradas uma vez (semente fixa) a partir de (0,0); o grupo é movido
// para o ponto onde a pessoa apertou. Troncos primeiro, galhos depois.
const CRACKS = (() => {
  let s = 11
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647
  const trunks = []
  const twigs = []
  const N = 8
  for (let i = 0; i < N; i++) {
    let a = (i / N) * Math.PI * 2 + (r() - 0.5) * 0.5
    let x = 0
    let y = 0
    let d = 'M0 0'
    for (let k = 0; k < 5; k++) {
      const len = 12 + r() * 20 + k * 7
      a += (r() - 0.5) * 0.8
      x += Math.cos(a) * len
      y += Math.sin(a) * len * 0.8
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`
      if (k >= 1 && k <= 3 && r() > 0.4) {
        const b = a + (r() > 0.5 ? 1 : -1) * (0.5 + r() * 0.6)
        const bl = 9 + r() * 15
        twigs.push(`M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(b) * bl).toFixed(1)} ${(Math.sin(b) * bl).toFixed(1)}`)
      }
    }
    trunks.push(d)
  }
  return { trunks, twigs }
})()

const FOLDER = 'M10 44 L30 22 L128 22 L144 38 L290 38 L310 58 L310 170 L290 190 L30 190 L10 170 Z'
// Capa da frente: mais baixa que o fundo, deixando a aba e os documentos à mostra
const COVER = 'M10 76 L28 58 L292 58 L310 76 L310 172 L292 190 L28 190 L10 172 Z'
const CENTER = [160, 124]

// Tempos (ms)
const HOLD_MS = 1100 // segurando
const AUTO_MS = 850 // toque rápido ou teclado: carrega sozinha
const TAP_MS = 220 // abaixo disso, conta como toque
const DECAY_MS = 450 // soltou antes da hora: a carga volta

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/*
 * Pasta "HABILIDADES" que a pessoa carrega segurando: as rachaduras nascem
 * de onde ela apertou e crescem com a carga; soltar antes da hora faz a
 * pasta se recompor. Carga cheia → explode e espalha as habilidades numa
 * rede ligada ao núcleo. Um toque rápido (ou Enter/Espaço) carrega sozinho.
 *
 * Aberta, as habilidades seguem o mouse em profundidade e, ao passar por
 * uma, a ligação dela acende na cor da marca. Clicar no núcleo guarda tudo.
 *
 * A carga vive numa variável CSS (--charge) gravada por frame; o React só
 * re-renderiza nas trocas de fase e no hover.
 */
export default function SkillBurst({ skills, label, countLabel, openLabel, replayLabel, holdHint, closeHint }) {
  const uid = useId().replace(/:/g, '')
  const wrap = useRef(null)
  const root = useRef(null)
  const cracks = useRef(null)
  const timers = useRef([])
  const charge = useRef({ v: 0, holding: false, auto: false, downAt: 0, last: 0, raf: 0 })
  const pointer = useRef({ x: 0, y: 0, raf: 0 })
  const [phase, setPhase] = useState(() => (prefersReduced() ? 'done' : 'idle'))
  const [hot, setHot] = useState(null)
  const n = skills.length

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms))

  const burst = () => {
    clear()
    setPhase('burst')
    at(1100 + n * 90, () => setPhase('done'))
  }
  const burstRef = useRef(burst)
  useEffect(() => {
    burstRef.current = burst
  })

  const tick = (now) => {
    const c = charge.current
    const el = root.current
    if (!el) return
    const dt = Math.min(50, now - c.last)
    c.last = now
    const rising = c.holding || c.auto
    c.v = rising ? Math.min(1, c.v + dt / (c.auto ? AUTO_MS : HOLD_MS)) : Math.max(0, c.v - dt / DECAY_MS)
    wrap.current?.style.setProperty('--charge', c.v.toFixed(3))
    if (rising) el.dataset.charging = ''
    else delete el.dataset.charging

    if (c.v >= 1) {
      Object.assign(c, { holding: false, auto: false, raf: 0, v: 0 })
      delete el.dataset.charging
      wrap.current?.style.setProperty('--charge', 0)
      burstRef.current()
      return
    }
    c.raf = c.v > 0 || rising ? requestAnimationFrame(tick) : 0
  }
  const run = () => {
    const c = charge.current
    if (c.raf) return
    c.last = performance.now()
    c.raf = requestAnimationFrame(tick)
  }

  // Leva o ponto de origem das rachaduras para onde a pessoa apertou
  const aim = (x, y) => {
    cracks.current?.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
  }

  const onPointerDown = (e) => {
    if (phase !== 'idle' || e.button !== 0) return
    const r = e.currentTarget.getBoundingClientRect()
    aim(clamp(((e.clientX - r.left) / r.width) * 320, 50, 270), clamp(((e.clientY - r.top) / r.height) * 200, 80, 172))
    e.currentTarget.setPointerCapture?.(e.pointerId)
    Object.assign(charge.current, { holding: true, auto: false, downAt: performance.now() })
    run()
  }
  const release = (tap) => {
    const c = charge.current
    if (!c.holding) return
    c.holding = false
    if (tap && performance.now() - c.downAt < TAP_MS) c.auto = true
    run()
  }

  const onClick = (e) => {
    if (phase === 'done') {
      // Guarda as habilidades de volta na pasta
      clear()
      setHot(null)
      setPhase('idle')
      return
    }
    // Teclado (Enter/Espaço) não tem ponteiro: carrega sozinho a partir do centro
    if (phase === 'idle' && e.detail === 0) {
      aim(...CENTER)
      charge.current.auto = true
      run()
    }
  }

  // Mouse no palco: inclina a pasta e dá profundidade à rede aberta
  const onMove = (e) => {
    if (e.pointerType === 'touch') return
    const r = root.current.getBoundingClientRect()
    const p = pointer.current
    p.x = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1)
    p.y = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1)
    if (!p.raf)
      p.raf = requestAnimationFrame(() => {
        p.raf = 0
        root.current?.style.setProperty('--px', p.x.toFixed(3))
        root.current?.style.setProperty('--py', p.y.toFixed(3))
      })
  }
  const onLeave = () => {
    Object.assign(pointer.current, { x: 0, y: 0 })
    root.current?.style.setProperty('--px', 0)
    root.current?.style.setProperty('--py', 0)
  }

  useEffect(
    () => () => {
      clear()
      cancelAnimationFrame(charge.current.raf)
      cancelAnimationFrame(pointer.current.raf)
    },
    [],
  )

  const items = skills.map((name, i) => ({ name, ...place(i, n, i % 2 ? 0.84 : 1, 0, 1) })) // no celular, elipse regular para os cards não se tocarem
  const glyphs = GLYPHS.slice(0, n * 2).map((g, i) => ({ g, ...place(i % n, n, i < n ? 1.24 : 0.52, 0.5) }))
  const open = phase === 'burst' || phase === 'done'
  const brandOf = (name) => brands[name] ?? { Icon: FaCode, color: '#fa6e00' }
  const papers = skills.slice(0, 3).map((name) => ({ name, ...brandOf(name) }))

  const links = (key) => (
    <svg className={`sb__links sb__links--${key}`} aria-hidden="true">
      {items.map(({ name, ...p }, i) => {
        const end = { x1: '50%', y1: '50%', x2: `${p[key].x}%`, y2: `${p[key].y}%`, pathLength: 1 }
        return (
          <g key={name} className={hot === i ? 'is-hot' : undefined} style={{ '--d': `${i * 90}ms`, '--brand': brandOf(name).color }}>
            <line className="sb__line" {...end} />
            <line className="sb__pulse" {...end} style={{ '--pd': `${(i * 530) % 2400}ms` }} />
          </g>
        )
      })}
    </svg>
  )

  const hint = phase === 'idle' ? holdHint : phase === 'done' ? closeHint : ''

  return (
    <div ref={wrap} className="sbw">
      <div
        ref={root}
        className="sb"
        data-phase={phase}
        data-open={open || undefined}
        data-hot={hot !== null || undefined}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
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
            const { Icon, color } = brandOf(name)
            return (
              <li
                key={name}
                className={`sb__skill${hot === i ? ' is-hot' : ''}`}
                style={{ ...style, '--d': `${i * 90}ms`, '--brand': color, '--dp': (0.55 + ((i * 3) % 5) * 0.16).toFixed(2) }}
                onPointerEnter={() => phase === 'done' && setHot(i)}
                onPointerLeave={() => setHot((h) => (h === i ? null : h))}
              >
                <div className="sb__par">
                  <div className="sb__float" style={{ '--fd': `${-i * 700}ms` }}>
                    <div className="glass glass-hover group flex size-full flex-col items-center justify-center gap-2 !rounded-2xl sm:gap-3">
                      <Icon
                        aria-hidden="true"
                        className="text-3xl text-[var(--brand)] transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_14px_var(--brand)] sm:text-4xl lg:text-5xl"
                      />
                      <span className="text-[0.55rem] whitespace-nowrap text-[var(--brand)] sm:text-xs">{name}</span>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          className="sb__folder"
          onPointerDown={onPointerDown}
          onPointerUp={() => release(true)}
          onPointerCancel={() => release(false)}
          onLostPointerCapture={() => release(false)}
          onContextMenu={(e) => e.preventDefault()}
          onClick={onClick}
          aria-label={phase === 'done' ? replayLabel : openLabel}
          title={phase === 'done' ? replayLabel : undefined}
        >
          <span className="sb__body">
            <span className="sb__stack" aria-hidden="true">
              {/* Fundo da pasta, com a aba */}
              <svg viewBox="0 0 320 200" className="sb__svg sb__back">
                <path className="sb__back-fill" d={FOLDER} />
                <path className="sb__back-edge" d={FOLDER} />
                <path className="sb__bar" d="M38 22 L120 22" />
              </svg>
              <span className="sb__tab">~/{label.toLowerCase()}</span>

              {/* Documentos guardados: espiam por cima da capa e sobem ao abrir */}
              <span className="sb__papers">
                {papers.map(({ name, Icon, color }, i) => (
                  <span key={name} className="sb__paper" style={{ '--i': i - 1, '--brand': color }}>
                    <Icon className="sb__paper-icon" />
                    <span className="sb__paper-lines" />
                  </span>
                ))}
              </span>

              {/* Capa articulada pela base: tomba no hover, abre com a carga */}
              <span className="sb__front">
                <svg viewBox="0 0 320 200" className="sb__svg">
                  <defs>
                    <clipPath id={`${uid}-clip`}>
                      <path d={COVER} />
                    </clipPath>
                    <radialGradient id={`${uid}-glow`}>
                      <stop offset="0" stopColor="#ffd9ad" stopOpacity="0.95" />
                      <stop offset="0.35" stopColor="#fa6e00" stopOpacity="0.55" />
                      <stop offset="1" stopColor="#fa6e00" stopOpacity="0" />
                    </radialGradient>
                    <pattern id={`${uid}-grid`} width="12" height="12" patternUnits="userSpaceOnUse">
                      <path d="M12 0 H0 V12" fill="none" stroke="rgb(255 154 60 / 0.07)" />
                    </pattern>
                  </defs>
                  <path className="sb__panel" d={COVER} />
                  <path d={COVER} fill={`url(#${uid}-grid)`} />
                  <g clipPath={`url(#${uid}-clip)`}>
                    <g ref={cracks} transform={`translate(${CENTER.join(' ')})`}>
                      <circle className="sb__heat" r="130" fill={`url(#${uid}-glow)`} />
                      <g className="sb__cracks">
                        {CRACKS.trunks.map((d) => (
                          <path key={d} d={d} pathLength="1" className="sb__trunk" />
                        ))}
                        {CRACKS.twigs.map((d) => (
                          <path key={d} d={d} pathLength="1" className="sb__twig" />
                        ))}
                      </g>
                    </g>
                  </g>
                  <path className="sb__edge" d={COVER} />
                  <path className="sb__bar" d="M90 190 L230 190 M310 96 L310 150 M10 112 L10 150" />
                </svg>
                <span className="sb__label">{label}</span>
                <span className="sb__count">{countLabel}</span>
              </span>
            </span>
          </span>
        </button>
      </div>

      <p className="sb-hint" data-phase={phase} aria-hidden="true">
        <span className="sb-hint__text">{hint}</span>
        <span className="sb-hint__bar" />
      </p>
    </div>
  )
}
