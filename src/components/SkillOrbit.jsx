import { useEffect, useRef, useState } from 'react'
import { FaCode } from 'react-icons/fa6'
import { SiCss, SiHtml5, SiJavascript, SiOpenjdk, SiPython, SiReact, SiSpringboot } from 'react-icons/si'
import './SkillOrbit.css'

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

// Paleta do projeto (index.css): ember, glow, um pêssego claro e branco raro
const DOT_COLORS = ['#fa6e00', '#ff9a3c', '#ffd6a8', '#ffffff']

// Três anéis: raio (fração da largura) e velocidade (rad/s). O do meio gira ao contrário.
const RINGS = [
  { r: 0.24, rm: 0.28, speed: 0.2 },
  { r: 0.34, rm: 0.37, speed: -0.13 },
  { r: 0.45, rm: 0.44, speed: 0.085 },
]

// Pontos da cúpula: espiral de Fibonacci na esfera (fixos)
const SPHERE = (() => {
  const n = 1500
  const pts = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const rad = Math.sqrt(1 - y * y)
    const a = i * golden
    const c = i % 11 === 0 ? 3 : i % 3 === 0 ? 2 : i % 2 ? 1 : 0
    pts.push({ x: Math.cos(a) * rad, y, z: Math.sin(a) * rad, c, s: i % 7 === 0 ? 1.7 : 1.1 })
  }
  return pts
})()

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Geometria da cena a partir do tamanho do palco
function geometry(w, h) {
  const mobile = w < 640
  const cx = w / 2
  const cy = h * (mobile ? 0.52 : 0.56)
  const k = mobile ? 0.48 : 0.36 // achatamento das elipses (inclinação da câmera)
  const rd = w * (mobile ? 0.3 : 0.2) // cúpula: esfera com o centro na base, só a metade de cima aparece
  return {
    w,
    h,
    cx,
    cy,
    k,
    rd,
    dx: cx,
    dy: h * (mobile ? 0.97 : 0.99),
    rings: RINGS.map((ring) => ({ rx: w * (mobile ? ring.rm : ring.r), ry: w * (mobile ? ring.rm : ring.r) * k })),
  }
}

/*
 * Órbita das habilidades: uma cúpula de partículas na base e três anéis em
 * perspectiva, com as tecnologias orbitando em badges de vidro que sempre
 * olham para a frente.
 *
 * Camadas (de trás para frente): canvas de trás (poeira e metade de trás dos
 * anéis) → badges de trás → canvas da frente (cúpula e metade da frente) →
 * badges da frente. Assim a cúpula esconde o que passa atrás dela.
 *
 * Um único requestAnimationFrame desenha os canvas e move os badges com
 * translate3d; para fora da tela e com "reduzir movimento".
 * Passar o mouse (ou focar) num badge desacelera a órbita e mostra o nome.
 */
export default function SkillOrbit({ skills }) {
  const stage = useRef(null)
  const back = useRef(null)
  const front = useRef(null)
  const badges = useRef([])
  const hoverRef = useRef(false)
  const [hot, setHot] = useState(null)

  // Distribui as habilidades pelos anéis: 2, 2 e o resto no de fora
  const placed = skills.map((name, i) => {
    const ring = i < 6 ? i % 3 : 2
    return { name, ring, ...(brands[name] ?? { Icon: FaCode, color: '#fa6e00' }) }
  })
  const perRing = [0, 1, 2].map((r) => placed.filter((p) => p.ring === r).length)
  const slot = [0, 0, 0]
  placed.forEach((p) => {
    p.phase = (slot[p.ring]++ / perRing[p.ring]) * Math.PI * 2 + p.ring * 0.9 + 0.4
  })
  const placedRef = useRef(placed)
  useEffect(() => {
    placedRef.current = placed
  })

  useEffect(() => {
    const el = stage.current
    const cb = back.current.getContext('2d')
    const cf = front.current.getContext('2d')
    const reduced = prefersReduced()
    let g = null
    let ringCache = null
    let raf = 0
    let visible = false
    let last = 0
    let t = 0
    let mul = 1
    const angles = RINGS.map(() => 0)
    const dust = Array.from({ length: 70 }, (_, i) => ({
      x: ((i * 97) % 100) / 100,
      y: ((i * 61) % 100) / 100,
      v: 0.004 + ((i * 13) % 10) / 1600,
      a: 0.08 + ((i * 7) % 10) / 28,
      p: i,
    }))

    // Anéis são estáticos: desenhados uma vez por tamanho em dois canvas fora da tela
    const paintRings = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const make = () => {
        const c = document.createElement('canvas')
        c.width = g.w * dpr
        c.height = g.h * dpr
        const x = c.getContext('2d')
        x.scale(dpr, dpr)
        return [c, x]
      }
      const [bc, bx] = make()
      const [fc, fx] = make()
      const N = 160
      g.rings.forEach(({ rx, ry }) => {
        for (let i = 0; i < N; i++) {
          const a0 = (i / N) * Math.PI * 2
          const a1 = ((i + 1) / N) * Math.PI * 2
          const z = Math.sin((a0 + a1) / 2) // > 0: metade da frente
          const depth = (z + 1) / 2
          const ctx = z >= 0 ? fx : bx
          const p0 = [g.cx + Math.cos(a0) * rx, g.cy + Math.sin(a0) * ry]
          const p1 = [g.cx + Math.cos(a1) * rx, g.cy + Math.sin(a1) * ry]
          ctx.strokeStyle = `rgb(255 154 60 / ${(0.05 + depth * 0.1).toFixed(3)})`
          ctx.lineWidth = 5
          ctx.beginPath()
          ctx.moveTo(...p0)
          ctx.lineTo(...p1)
          ctx.stroke()
          ctx.strokeStyle = `rgb(255 190 130 / ${(0.16 + depth * 0.5).toFixed(3)})`
          ctx.lineWidth = 0.8 + depth * 0.9
          ctx.beginPath()
          ctx.moveTo(...p0)
          ctx.lineTo(...p1)
          ctx.stroke()
        }
      })
      ringCache = { bc, fc }
    }

    const resize = () => {
      const r = el.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      g = geometry(r.width, r.height)
      for (const [c, x] of [
        [back.current, cb],
        [front.current, cf],
      ]) {
        c.width = r.width * dpr
        c.height = r.height * dpr
        x.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      paintRings()
      draw(0)
    }

    const draw = (dt) => {
      if (!g) return
      t += dt
      mul += ((hoverRef.current ? 0.12 : 1) - mul) * Math.min(1, dt * 3)
      RINGS.forEach((ring, i) => (angles[i] += ring.speed * mul * dt))
      const { w, h } = g

      // --- Fundo: poeira e metade de trás dos anéis ---
      cb.clearRect(0, 0, w, h)
      cb.fillStyle = '#ff9a3c'
      for (const d of dust) {
        d.y -= d.v * dt
        if (d.y < -0.02) d.y = 1.02
        cb.globalAlpha = d.a * (0.6 + 0.4 * Math.sin(t * 1.3 + d.p))
        cb.fillRect(d.x * w, d.y * h, 1.4, 1.4)
      }
      cb.globalAlpha = 1
      cb.drawImage(ringCache.bc, 0, 0, w, h)

      // --- Frente: cúpula de partículas e metade da frente dos anéis ---
      cf.clearRect(0, 0, w, h)
      const { dx, dy, rd } = g
      const body = cf.createRadialGradient(dx, dy - rd * 0.2, rd * 0.1, dx, dy, rd * 1.05)
      body.addColorStop(0, 'rgb(250 110 0 / 0.28)')
      body.addColorStop(0.6, 'rgb(20 10 4 / 0.92)')
      body.addColorStop(1, 'rgb(9 9 9 / 0.96)')
      cf.fillStyle = body
      cf.beginPath()
      cf.arc(dx, dy, rd, 0, Math.PI * 2)
      cf.fill()

      const halo = cf.createRadialGradient(dx, dy, rd * 0.9, dx, dy, rd * 1.6)
      halo.addColorStop(0, 'rgb(250 110 0 / 0.22)')
      halo.addColorStop(1, 'rgb(250 110 0 / 0)')
      cf.fillStyle = halo
      cf.beginPath()
      cf.arc(dx, dy, rd * 1.6, 0, Math.PI * 2)
      cf.fill()

      const yaw = t * 0.12
      const cyw = Math.cos(yaw)
      const syw = Math.sin(yaw)
      const pitch = -0.38 // mostra o topo da cúpula
      const cp = Math.cos(pitch)
      const sp = Math.sin(pitch)
      for (let c = 0; c < DOT_COLORS.length; c++) {
        cf.fillStyle = DOT_COLORS[c]
        for (const p of SPHERE) {
          if (p.c !== c) continue
          const x1 = p.x * cyw + p.z * syw
          const z1 = -p.x * syw + p.z * cyw
          const y2 = p.y * cp - z1 * sp
          const z2 = p.y * sp + z1 * cp
          const sy = dy - y2 * rd
          if (sy > h + 2) continue
          const depth = (z2 + 1) / 2
          cf.globalAlpha = 0.12 + depth * 0.78
          const s = p.s * (0.7 + depth * 0.6)
          cf.fillRect(dx + x1 * rd - s / 2, sy - s / 2, s, s)
        }
      }
      cf.globalAlpha = 1
      cf.drawImage(ringCache.fc, 0, 0, w, h)

      // Brilho correndo em cada anel (cabeça + rastro), no canvas da sua profundidade
      g.rings.forEach(({ rx, ry }, i) => {
        const head = -angles[i] * 2.4 + i * 2.1
        const dir = Math.sign(RINGS[i].speed) || 1
        for (let k = 0; k < 18; k++) {
          const a = head + dir * k * 0.03
          const z = Math.sin(a)
          const ctx = z >= 0 ? cf : cb
          ctx.globalAlpha = (1 - k / 18) * (0.25 + 0.6 * ((z + 1) / 2))
          ctx.fillStyle = k === 0 ? '#fff1dc' : '#ffb066'
          const s = k === 0 ? 3 : 2
          ctx.fillRect(g.cx + Math.cos(a) * rx - s / 2, g.cy + Math.sin(a) * ry - s / 2, s, s)
        }
      })
      cf.globalAlpha = 1
      cb.globalAlpha = 1

      // --- Badges: posição, escala e camada pela profundidade ---
      placedRef.current.forEach((p, i) => {
        const b = badges.current[i]
        if (!b) return
        const { rx, ry } = g.rings[p.ring]
        const a = p.phase + angles[p.ring]
        const z = Math.sin(a)
        const depth = (z + 1) / 2
        const x = g.cx + Math.cos(a) * rx
        const y = g.cy + z * ry
        b.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${(0.72 + depth * 0.4).toFixed(3)})`
        b.style.setProperty('--depth', depth.toFixed(3))
        const layer = z >= 0 ? 'front' : 'back'
        if (b.dataset.layer !== layer) b.dataset.layer = layer
      })
    }

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0)
      last = now
      draw(dt)
      raf = visible ? requestAnimationFrame(loop) : 0
    }
    const start = () => {
      if (raf || reduced) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start()
    })
    io.observe(el)
    resize()

    return () => {
      ro.disconnect()
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  const focusOn = (i) => {
    hoverRef.current = true
    setHot(i)
  }
  const focusOff = (i) => {
    setHot((h) => {
      if (h !== i) return h
      hoverRef.current = false
      return null
    })
  }

  return (
    <div ref={stage} className="so" data-hot={hot !== null || undefined}>
      <canvas ref={back} className="so__canvas so__canvas--back" aria-hidden="true" />
      <canvas ref={front} className="so__canvas so__canvas--front" aria-hidden="true" />

      <ul className="so__badges">
        {placed.map(({ name, Icon, color }, i) => (
          <li
            key={name}
            ref={(n) => (badges.current[i] = n)}
            tabIndex={0}
            className={`so__badge${hot === i ? ' is-hot' : ''}`}
            style={{ '--brand': color }}
            data-layer="back"
            onPointerEnter={() => focusOn(i)}
            onPointerLeave={() => focusOff(i)}
            onFocus={() => focusOn(i)}
            onBlur={() => focusOff(i)}
          >
            <span className="so__disc">
              <Icon aria-hidden="true" className="so__icon" />
            </span>
            <span className="so__tip">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
