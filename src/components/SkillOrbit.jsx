import { useEffect, useRef, useState } from 'react'
import { FaCode, FaXmark } from 'react-icons/fa6'
import { SiCss, SiHtml5, SiJavascript, SiOpenjdk, SiPython, SiReact, SiSpringboot } from 'react-icons/si'
import './SkillOrbit.css'

// Ícone e cor de marca de cada tecnologia. A cor de marca só aparece no
// destaque (hover, foco ou cartão aberto); no resto do tempo o ícone é branco.
const brands = {
  Python: { Icon: SiPython, color: '#3b82f6' },
  Java: { Icon: SiOpenjdk, color: '#f89820' },
  HTML: { Icon: SiHtml5, color: '#e34f26' },
  CSS: { Icon: SiCss, color: '#2965f1' },
  JavaScript: { Icon: SiJavascript, color: '#f7df1e' },
  'Spring Boot': { Icon: SiSpringboot, color: '#6db33f' },
  React: { Icon: SiReact, color: '#61dafb' },
}

// Paleta (index.css): Flame Orange, dois tons dele e branco
const DOME_COLORS = ['#fe5101', '#ff8550', '#ffd9c7', '#ffffff']
// Globo: oceano (pontos brancos fracos), terra, terra clara e luzes das cidades
const GLOBE_COLORS = ['#ffffff', '#fe5101', '#ff8550', '#fff0e8']
const GLOBE_ALPHA = [0.08, 0.95, 1, 1]
const GLOBE_SIZE = [1.1, 2, 2, 2.6]

// Três anéis: raio como fração da largura na cúpula (d) e no globo (g),
// com variantes para celular (dm, gm), e velocidade em rad/s.
const RINGS = [
  { d: 0.24, dm: 0.28, g: 0.27, gm: 0.3, speed: 0.2 },
  { d: 0.34, dm: 0.37, g: 0.37, gm: 0.38, speed: -0.13 },
  { d: 0.45, dm: 0.44, g: 0.47, gm: 0.44, speed: 0.085 },
]

// Continentes em [longitude, latitude], bem simplificados: só precisam ler como
// "a Terra" em pontos de 2px.
const LAND = [
  // América do Norte
  [-165, 68, -140, 70, -115, 73, -95, 72, -80, 73, -65, 62, -55, 52, -66, 45, -70, 42, -76, 35, -81, 31, -80, 25, -82, 27, -85, 30, -90, 29, -97, 27, -97, 22, -92, 18, -87, 21, -88, 16, -83, 10, -79, 8, -80, 7, -85, 10, -92, 14, -105, 20, -110, 24, -112, 30, -117, 32, -122, 37, -124, 42, -124, 48, -130, 55, -140, 60, -152, 59, -160, 58, -165, 62],
  // Groenlândia
  [-55, 60, -43, 60, -20, 70, -18, 80, -35, 83, -60, 82, -70, 78, -58, 70],
  // América do Sul
  [-80, 8, -72, 12, -62, 10, -50, 0, -35, -5, -38, -13, -40, -22, -48, -26, -53, -34, -58, -38, -65, -42, -68, -50, -70, -55, -74, -52, -73, -40, -71, -30, -70, -18, -76, -14, -81, -5, -80, 0, -78, 5],
  // Eurásia
  [-10, 36, -9, 43, -2, 44, -5, 48, 0, 50, 5, 53, 8, 57, 5, 62, 15, 69, 28, 71, 40, 67, 45, 68, 60, 70, 70, 73, 80, 73, 100, 78, 115, 74, 130, 72, 145, 72, 160, 70, 170, 70, 180, 66, 175, 62, 163, 60, 160, 54, 156, 51, 150, 59, 142, 59, 135, 54, 141, 48, 135, 43, 129, 35, 126, 37, 122, 40, 121, 32, 120, 25, 110, 21, 108, 18, 106, 11, 100, 13, 100, 8, 104, 1, 100, 3, 98, 8, 98, 16, 94, 17, 92, 22, 88, 22, 80, 15, 78, 8, 73, 17, 72, 21, 67, 25, 60, 25, 57, 26, 52, 28, 48, 30, 50, 26, 56, 24, 59, 22, 55, 17, 45, 13, 43, 15, 39, 22, 35, 28, 33, 31, 35, 36, 30, 36, 27, 37, 26, 41, 22, 40, 24, 38, 20, 40, 19, 42, 13, 45, 16, 41, 18, 40, 16, 38, 12, 42, 9, 44, 3, 43, 3, 42, -1, 37, -6, 36],
  // África
  [-17, 21, -16, 28, -10, 30, -6, 36, 10, 37, 11, 33, 20, 31, 25, 32, 32, 31, 35, 24, 38, 18, 43, 12, 51, 11, 48, 5, 42, -1, 40, -10, 40, -16, 35, -24, 32, -29, 26, -34, 20, -35, 18, -32, 15, -27, 12, -18, 13, -12, 9, -1, 10, 4, 5, 5, -2, 5, -8, 4, -13, 8, -17, 14],
  // Madagascar
  [44, -25, 47, -25, 50, -16, 49, -12, 44, -17],
  // Austrália
  [114, -22, 122, -18, 130, -12, 137, -12, 136, -15, 140, -17, 142, -11, 146, -19, 153, -25, 150, -37, 141, -38, 135, -35, 131, -31, 124, -34, 115, -34, 114, -28],
  // Grã-Bretanha
  [-5, 50, 1, 51, 2, 53, -1, 55, -3, 59, -6, 58, -5, 55, -3, 54, -5, 52],
  // Japão
  [130, 31, 136, 34, 141, 38, 142, 43, 145, 44, 141, 45, 140, 40, 135, 35, 130, 34],
  // Sumatra, Bornéu e Nova Guiné
  [95, 5, 106, -6, 104, -5, 96, 2],
  [109, 1, 117, 7, 119, 1, 116, -4, 110, -3],
  [131, -1, 141, -3, 150, -10, 141, -9, 135, -4],
]

const inPoly = (lon, lat, poly) => {
  let inside = false
  for (let i = 0, j = poly.length - 2; i < poly.length; j = i, i += 2) {
    const xi = poly[i]
    const yi = poly[i + 1]
    const xj = poly[j]
    const yj = poly[j + 1]
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

const DEG = Math.PI / 180
// Vetor na esfera unitária: y para cima, longitude 0 de frente para a câmera
const toVec = (lon, lat) => [Math.cos(lat * DEG) * Math.sin(lon * DEG), Math.sin(lat * DEG), Math.cos(lat * DEG) * Math.cos(lon * DEG)]

// Pontos numa espiral de Fibonacci; `color` escolhe o balde de cor de cada um
function fibonacci(n, color) {
  const x = new Float32Array(n)
  const y = new Float32Array(n)
  const z = new Float32Array(n)
  const c = new Int8Array(n)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const yy = 1 - (i / (n - 1)) * 2
    const rad = Math.sqrt(1 - yy * yy)
    const a = i * golden
    x[i] = Math.cos(a) * rad
    y[i] = yy
    z[i] = Math.sin(a) * rad
    c[i] = color(i, x[i], yy, z[i])
  }
  return { n, x, y, z, c }
}

// Cúpula: 1500 pontos nas quatro cores da paleta
const DOME = fibonacci(1500, (i) => (i % 11 === 0 ? 3 : i % 3 === 0 ? 2 : i % 2 ? 1 : 0))

// Globo: 6500 pontos; os que caem num continente viram terra ou luz de cidade
const GLOBE = fibonacci(6500, (i, x, y, z) => {
  const lat = Math.asin(y) / DEG
  const lon = Math.atan2(x, z) / DEG
  if (LAND.some((p) => inPoly(lon, lat, p))) {
    const h = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1
    return h < 0.14 ? 3 : h < 0.5 ? 2 : 1
  }
  return i % 3 ? -1 : 0 // oceano mais ralo
})

// Arcos de luz saindo de Belo Horizonte: Lisboa, Londres, Nova York e Cidade do Cabo
const HOME = [-43.9, -19.9]
const ARCS = [
  [-9.1, 38.7],
  [-0.1, 51.5],
  [-74, 40.7],
  [18.4, -33.9],
].map((to) => {
  const a = toVec(...HOME)
  const b = toVec(...to)
  const omega = Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2])
  const steps = 48
  const pts = new Float32Array((steps + 1) * 3)
  for (let s = 0; s <= steps; s++) {
    const f = s / steps
    const k1 = Math.sin((1 - f) * omega) / Math.sin(omega)
    const k2 = Math.sin(f * omega) / Math.sin(omega)
    const lift = 1 + 0.14 * omega * Math.sin(Math.PI * f) // o arco sobe acima da superfície
    for (let d = 0; d < 3; d++) pts[s * 3 + d] = (a[d] * k1 + b[d] * k2) * lift
  }
  return pts
})

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const lerp = (a, b, f) => a + (b - a) * f
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2)
const easeOut = (x) => 1 - (1 - Math.min(1, Math.max(0, x))) ** 3

// Geometria da cena a partir do tamanho do palco
function geometry(w, h) {
  const mobile = w < 640
  const cx = w / 2
  return {
    w,
    h,
    mobile,
    cx,
    cy: h * (mobile ? 0.5 : 0.54),
    k: mobile ? 0.48 : 0.36, // achatamento das elipses (inclinação da câmera)
    rd: w * (mobile ? 0.3 : 0.2), // raio da cúpula; o centro fica na base e só a metade de cima aparece
    rg: w * (mobile ? 0.17 : 0.135), // raio do globo
    dy: h * 0.99,
    scale: Math.min(1.3, Math.max(0.65, w / 1000)),
  }
}

/*
 * Órbita das habilidades em dois estados:
 *
 * 1. Cúpula: uma meia esfera de partículas na base e três anéis em perspectiva,
 *    com as tecnologias orbitando em badges de vidro.
 * 2. Globo: ao clicar na cúpula, ela acende, solta uma onda de choque e raios
 *    de luz pelo plano dos anéis e sobe até o centro como um globo com os
 *    continentes em pontos laranja. Os anéis se abrem e cada badge ganha nome;
 *    clicar num badge abre um cartão com os projetos que usam a tecnologia.
 *
 * Camadas (de trás para frente): canvas de trás (poeira, metade de trás dos
 * anéis e dos raios) → badges de trás → canvas da frente (cúpula/globo, metade
 * da frente, efeitos) → badges da frente. Assim o globo esconde o que passa atrás.
 *
 * Um único requestAnimationFrame desenha tudo e move os badges com translate3d;
 * para fora da tela. Com "reduzir movimento" desenha um quadro só por mudança.
 */
export default function SkillOrbit({ skills, labels }) {
  const wrap = useRef(null)
  const stage = useRef(null)
  const back = useRef(null)
  const front = useRef(null)
  const core = useRef(null)
  const badges = useRef([])
  const hoverRef = useRef(false)
  const openRef = useRef(false)
  const selRef = useRef(null)
  const coreHoverRef = useRef(false)
  const kick = useRef(() => {})
  const pendingSel = useRef(0)
  const [hot, setHot] = useState(null)
  const [open, setOpen] = useState(false)
  const [sel, setSel] = useState(null) // { i, x, y, side }

  // Distribui as habilidades pelos anéis: 2, 2 e o resto no de fora
  const placed = skills.map((skill, i) => {
    const ring = i < 6 ? i % 3 : 2
    return { ...skill, ring, ...(brands[skill.name] ?? { Icon: FaCode, color: '#fe5101' }) }
  })
  const perRing = [0, 1, 2].map((r) => placed.filter((p) => p.ring === r).length)
  const slot = [0, 0, 0]
  placed.forEach((p) => {
    p.phase = (slot[p.ring]++ / perRing[p.ring]) * Math.PI * 2 + p.ring * 0.9 + 0.4
  })
  const placedRef = useRef(placed)
  useEffect(() => {
    placedRef.current = placed
    openRef.current = open
    selRef.current = sel ? sel.i : null
    kick.current()
  })

  useEffect(() => {
    const el = stage.current
    const cb = back.current.getContext('2d')
    const cf = front.current.getContext('2d')
    const reduced = prefersReduced()
    let g = null
    let raf = 0
    let visible = false
    let last = 0
    let t = 0
    let mul = 1
    let heat = 0
    let p = 0 // progresso cúpula → globo
    let wasOpen = false
    let burst = -1 // segundos desde o clique que abriu o globo
    let yaw = 0.35 // rotação do globo (começa com o Brasil virando para a frente)
    let emit = 0
    let coreBox = ''
    const angles = RINGS.map(() => 0)
    const rays = []
    const proj = { x: new Float32Array(GLOBE.n), y: new Float32Array(GLOBE.n), z: new Float32Array(GLOBE.n) }
    const dust = Array.from({ length: 70 }, (_, i) => ({
      x: ((i * 97) % 100) / 100,
      y: ((i * 61) % 100) / 100,
      v: 0.004 + ((i * 13) % 10) / 1600,
      a: 0.08 + ((i * 7) % 10) / 28,
      p: i,
    }))

    const ringRadius = (i, e) => {
      const r = RINGS[i]
      const rx = g.w * lerp(g.mobile ? r.dm : r.d, g.mobile ? r.gm : r.g, e)
      return [rx, rx * g.k]
    }

    // Raios de luz no plano dos anéis, saindo do centro
    const spawn = (count, r0, r1, vMin, vMax, lifeMin, lifeMax, bright) => {
      for (let i = 0; i < count && rays.length < 260; i++) {
        rays.push({
          a: Math.random() * Math.PI * 2,
          r: lerp(r0, r1, Math.random()),
          v: lerp(vMin, vMax, Math.random()) * g.scale,
          len: lerp(14, bright ? 90 : 38, Math.random()) * g.scale,
          life: 0,
          max: lerp(lifeMin, lifeMax, Math.random()),
          bright,
        })
      }
    }

    // Meia elipse do anel, com a profundidade virando transparência de cima (trás) para baixo (frente)
    const ring = (ctx, rx, ry, isFront, boost) => {
      const top = g.cy - ry
      const bottom = g.cy + ry
      const glow = ctx.createLinearGradient(0, top, 0, bottom)
      glow.addColorStop(0, `rgb(255 133 80 / ${0.05 * boost})`)
      glow.addColorStop(1, `rgb(255 133 80 / ${0.15 * boost})`)
      const line = ctx.createLinearGradient(0, top, 0, bottom)
      line.addColorStop(0, `rgb(255 180 145 / ${Math.min(1, 0.16 * boost)})`)
      line.addColorStop(1, `rgb(255 180 145 / ${Math.min(1, 0.66 * boost)})`)
      ctx.beginPath()
      ctx.ellipse(g.cx, g.cy, rx, ry, 0, isFront ? 0 : Math.PI, isFront ? Math.PI : Math.PI * 2)
      ctx.strokeStyle = glow
      ctx.lineWidth = 5
      ctx.stroke()
      ctx.strokeStyle = line
      ctx.lineWidth = 1.3
      ctx.stroke()
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
      coreBox = ''
      draw(0)
    }

    const draw = (dt) => {
      if (!g) return
      t += dt
      const target = openRef.current ? 1 : 0
      if (target && !wasOpen && !reduced) {
        burst = 0
        spawn(150, g.rd * 0.5, g.rd * 0.9, 380, 980, 0.7, 1.5, true)
      }
      wasOpen = !!target
      p = reduced ? target : Math.min(1, Math.max(0, p + (target ? dt / 1.6 : -dt / 0.9)))
      const e = easeInOut(p)
      if (burst >= 0) burst = burst > 1.8 ? -1 : burst + dt

      const tgtMul = selRef.current !== null ? 0 : hoverRef.current ? 0.12 : 1
      mul += (tgtMul - mul) * Math.min(1, dt * 3)
      heat += ((coreHoverRef.current && !target ? 1 : 0) - heat) * Math.min(1, dt * 6)
      RINGS.forEach((r, i) => (angles[i] += r.speed * mul * dt))
      yaw += dt * 0.1 * Math.max(0.25, mul)

      const { w, h, cx, cy, k } = g
      const R = lerp(g.rd, g.rg, e)
      const X0 = cx
      const Y0 = lerp(g.dy, cy, e)

      // Botão invisível sobre a cúpula/globo (só muda o estilo quando a caixa muda)
      const top = Math.max(0, Y0 - R)
      const box = `${(X0 - R).toFixed(0)},${top.toFixed(0)},${(2 * R).toFixed(0)},${(Math.min(h, Y0 + R) - top).toFixed(0)}`
      if (box !== coreBox && core.current) {
        coreBox = box
        const [l, tp, bw, bh] = box.split(',')
        Object.assign(core.current.style, { left: `${l}px`, top: `${tp}px`, width: `${bw}px`, height: `${bh}px` })
      }

      // --- Fundo: poeira e metade de trás dos anéis ---
      cb.clearRect(0, 0, w, h)
      cb.fillStyle = '#ff8550'
      for (const d of dust) {
        d.y -= d.v * dt
        if (d.y < -0.02) d.y = 1.02
        cb.globalAlpha = d.a * (0.6 + 0.4 * Math.sin(t * 1.3 + d.p))
        cb.fillRect(d.x * w, d.y * h, 1.4, 1.4)
      }
      cb.globalAlpha = 1
      const radii = RINGS.map((_, i) => ringRadius(i, e))
      const boost = 1 + 0.35 * e
      radii.forEach(([rx, ry]) => ring(cb, rx, ry, false, boost))

      cf.clearRect(0, 0, w, h)

      // --- Cúpula (some conforme o globo aparece) ---
      if (e < 1) {
        cf.globalAlpha = 1 - e
        const body = cf.createRadialGradient(X0, Y0 - R * 0.2, R * 0.1, X0, Y0, R * 1.05)
        body.addColorStop(0, `rgb(254 81 1 / ${0.28 + heat * 0.22})`)
        body.addColorStop(0.6, 'rgb(12 4 0 / 0.92)')
        body.addColorStop(1, 'rgb(0 0 0 / 0.96)')
        cf.fillStyle = body
        cf.beginPath()
        cf.arc(X0, Y0, R, 0, Math.PI * 2)
        cf.fill()
        const halo = cf.createRadialGradient(X0, Y0, R * 0.9, X0, Y0, R * 1.6)
        halo.addColorStop(0, `rgb(254 81 1 / ${0.22 + heat * 0.2})`)
        halo.addColorStop(1, 'rgb(254 81 1 / 0)')
        cf.fillStyle = halo
        cf.beginPath()
        cf.arc(X0, Y0, R * 1.6, 0, Math.PI * 2)
        cf.fill()

        const dyaw = t * 0.12
        const cyw = Math.cos(dyaw)
        const syw = Math.sin(dyaw)
        const cp = Math.cos(-0.38)
        const sp = Math.sin(-0.38)
        for (let c = 0; c < DOME_COLORS.length; c++) {
          cf.fillStyle = DOME_COLORS[c]
          for (let i = 0; i < DOME.n; i++) {
            if (DOME.c[i] !== c) continue
            const x1 = DOME.x[i] * cyw + DOME.z[i] * syw
            const z1 = -DOME.x[i] * syw + DOME.z[i] * cyw
            const y2 = DOME.y[i] * cp - z1 * sp
            const z2 = DOME.y[i] * sp + z1 * cp
            const sy = Y0 - y2 * R
            if (sy > h + 2) continue
            const depth = (z2 + 1) / 2
            cf.globalAlpha = (1 - e) * (0.12 + depth * 0.78)
            const s = (i % 7 === 0 ? 1.7 : 1.1) * (0.7 + depth * 0.6)
            cf.fillRect(X0 + x1 * R - s / 2, sy - s / 2, s, s)
          }
        }
      }

      // --- Globo ---
      const cyw = Math.cos(yaw)
      const syw = Math.sin(yaw)
      const cp = Math.cos(-0.38)
      const sp = Math.sin(-0.38)
      const rot = (x, y, z, out, j) => {
        const x1 = x * cyw + z * syw
        const z1 = -x * syw + z * cyw
        out.x[j] = x1
        out.y[j] = y * cp - z1 * sp
        out.z[j] = y * sp + z1 * cp
      }
      if (e > 0) {
        cf.globalAlpha = e
        const atm = cf.createRadialGradient(X0, Y0, R * 0.95, X0, Y0, R * 1.3)
        atm.addColorStop(0, 'rgb(254 81 1 / 0.32)')
        atm.addColorStop(1, 'rgb(254 81 1 / 0)')
        cf.fillStyle = atm
        cf.beginPath()
        cf.arc(X0, Y0, R * 1.3, 0, Math.PI * 2)
        cf.fill()
        const body = cf.createRadialGradient(X0 - R * 0.35, Y0 - R * 0.4, R * 0.05, X0, Y0, R)
        body.addColorStop(0, 'rgb(40 16 4)')
        body.addColorStop(0.55, 'rgb(10 4 0)')
        body.addColorStop(1, '#000000')
        cf.fillStyle = body
        cf.beginPath()
        cf.arc(X0, Y0, R, 0, Math.PI * 2)
        cf.fill()

        for (let i = 0; i < GLOBE.n; i++) rot(GLOBE.x[i], GLOBE.y[i], GLOBE.z[i], proj, i)
        for (let c = 0; c < GLOBE_COLORS.length; c++) {
          cf.fillStyle = GLOBE_COLORS[c]
          const base = GLOBE_SIZE[c] * g.scale
          for (let i = 0; i < GLOBE.n; i++) {
            if (GLOBE.c[i] !== c) continue
            const z = proj.z[i]
            if (z <= 0) continue
            cf.globalAlpha = e * Math.min(1, z * 3) * GLOBE_ALPHA[c]
            const s = base * (0.7 + z * 0.45)
            cf.fillRect(X0 + proj.x[i] * R - s / 2, Y0 - proj.y[i] * R - s / 2, s, s)
          }
        }

        // Arcos de Belo Horizonte para o mundo, com uma luz correndo em cada um
        cf.lineWidth = 1.1
        cf.strokeStyle = '#ff8550'
        const tmp = { x: [0], y: [0], z: [0] }
        ARCS.forEach((pts, a) => {
          const count = pts.length / 3
          cf.globalAlpha = 0.6 * e
          cf.beginPath()
          let pen = false
          const sx = []
          for (let s = 0; s < count; s++) {
            rot(pts[s * 3], pts[s * 3 + 1], pts[s * 3 + 2], tmp, 0)
            const px = X0 + tmp.x[0] * R
            const py = Y0 - tmp.y[0] * R
            const seen = tmp.z[0] > 0.02
            sx.push(seen ? [px, py] : null)
            if (seen && pen) cf.lineTo(px, py)
            else if (seen) cf.moveTo(px, py)
            pen = seen
          }
          cf.stroke()
          const head = sx[Math.floor(((t * 0.32 + a * 0.29) % 1) * (count - 1))]
          if (head) {
            cf.globalAlpha = e
            cf.fillStyle = '#ffffff'
            cf.fillRect(head[0] - 1.6, head[1] - 1.6, 3.2, 3.2)
          }
          const end = sx[count - 1]
          if (end) {
            const pulse = (t * 0.7 + a * 0.25) % 1
            cf.globalAlpha = e * (1 - pulse) * 0.9
            cf.strokeStyle = '#ffffff'
            cf.beginPath()
            cf.arc(end[0], end[1], 2 + pulse * 7, 0, Math.PI * 2)
            cf.stroke()
            cf.strokeStyle = '#ff8550'
          }
        })

        // Borda do globo e um brilho branco no canto de cima
        cf.globalAlpha = e
        cf.lineWidth = 1.2
        cf.strokeStyle = 'rgb(255 255 255 / 0.22)'
        cf.beginPath()
        cf.arc(X0, Y0, R, 0, Math.PI * 2)
        cf.stroke()
        cf.lineWidth = 2
        cf.strokeStyle = 'rgb(255 255 255 / 0.5)'
        cf.beginPath()
        cf.arc(X0, Y0, R - 1, Math.PI * 1.08, Math.PI * 1.42)
        cf.stroke()
      }
      cf.globalAlpha = 1
      radii.forEach(([rx, ry]) => ring(cf, rx, ry, true, boost))

      // Brilho correndo em cada anel (cabeça + rastro), no canvas da sua profundidade
      radii.forEach(([rx, ry], i) => {
        const head = -angles[i] * 2.4 + i * 2.1
        const dir = Math.sign(RINGS[i].speed) || 1
        for (let j = 0; j < 18; j++) {
          const a = head + dir * j * 0.03
          const z = Math.sin(a)
          const ctx = z >= 0 ? cf : cb
          ctx.globalAlpha = (1 - j / 18) * (0.25 + 0.6 * ((z + 1) / 2))
          ctx.fillStyle = j === 0 ? '#fff0e8' : '#ffa47a'
          const s = j === 0 ? 3 : 2
          ctx.fillRect(cx + Math.cos(a) * rx - s / 2, cy + Math.sin(a) * ry - s / 2, s, s)
        }
      })

      // --- Raios de luz no plano dos anéis ---
      if (!reduced && target && p > 0.6) {
        emit += dt * 16
        while (emit >= 1) {
          emit -= 1
          spawn(1, R * 1.05, R * 1.5, 50, 150, 1.4, 2.8, false)
        }
      }
      cb.globalCompositeOperation = 'lighter'
      cf.globalCompositeOperation = 'lighter'
      cb.lineWidth = cf.lineWidth = 1.2
      cb.strokeStyle = cf.strokeStyle = '#ff8550'
      for (let i = rays.length - 1; i >= 0; i--) {
        const r = rays[i]
        r.life += dt
        r.r += r.v * dt
        if (r.life >= r.max) {
          rays.splice(i, 1)
          continue
        }
        const ca = Math.cos(r.a)
        const sa = Math.sin(r.a)
        const ctx = sa >= 0 ? cf : cb
        const fade = 1 - r.life / r.max
        ctx.globalAlpha = fade * (r.bright ? 0.9 : 0.45) * (0.5 + 0.5 * ((sa + 1) / 2))
        const x0 = cx + ca * r.r
        const y0 = cy + sa * r.r * k
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(cx + ca * (r.r + r.len), cy + sa * (r.r + r.len) * k)
        ctx.stroke()
        ctx.fillStyle = '#fff0e8'
        ctx.fillRect(cx + ca * (r.r + r.len) - 1, cy + sa * (r.r + r.len) * k - 1, 2, 2)
      }

      // --- Explosão do clique: clarão, bolha que se expande e onda de choque ---
      if (burst >= 0) {
        const q1 = burst / 0.55
        if (q1 < 1) {
          const fl = cf.createRadialGradient(X0, Y0, 0, X0, Y0, R * (0.7 + q1 * 2.2))
          fl.addColorStop(0, `rgb(255 255 255 / ${0.9 * (1 - q1)})`)
          fl.addColorStop(0.3, `rgb(255 133 80 / ${0.7 * (1 - q1)})`)
          fl.addColorStop(1, 'rgb(254 81 1 / 0)')
          cf.globalAlpha = 1
          cf.fillStyle = fl
          cf.beginPath()
          cf.arc(X0, Y0, R * (0.7 + q1 * 2.2), 0, Math.PI * 2)
          cf.fill()
        }
        const q2 = (burst - 0.08) / 1.2
        if (q2 > 0 && q2 < 1) {
          const rb = R * (1 + 0.9 * easeOut(q2))
          const fill = cf.createRadialGradient(X0, Y0, rb * 0.5, X0, Y0, rb)
          fill.addColorStop(0, 'rgb(254 81 1 / 0)')
          fill.addColorStop(1, `rgb(254 81 1 / ${0.18 * (1 - q2)})`)
          cf.globalAlpha = 1
          cf.fillStyle = fill
          cf.beginPath()
          cf.arc(X0, Y0, rb, 0, Math.PI * 2)
          cf.fill()
          cf.globalAlpha = 0.55 * (1 - q2)
          cf.strokeStyle = '#ffffff'
          cf.lineWidth = 1.4
          cf.stroke()
        }
        const q3 = burst / 1.15
        if (q3 < 1) {
          const rs = lerp(g.rd * 0.6, w * 0.62, easeOut(q3))
          cf.save()
          cf.translate(cx, cy)
          cf.scale(1, k)
          const sh = cf.createRadialGradient(0, 0, rs * 0.3, 0, 0, rs)
          sh.addColorStop(0, 'rgb(254 81 1 / 0)')
          sh.addColorStop(0.72, `rgb(254 81 1 / ${0.4 * (1 - q3)})`)
          sh.addColorStop(0.94, `rgb(255 217 199 / ${0.85 * (1 - q3)})`)
          sh.addColorStop(1, 'rgb(254 81 1 / 0)')
          cf.globalAlpha = 1
          cf.fillStyle = sh
          cf.beginPath()
          cf.arc(0, 0, rs, 0, Math.PI * 2)
          cf.fill()
          cf.restore()
        }
      }
      cb.globalCompositeOperation = 'source-over'
      cf.globalCompositeOperation = 'source-over'
      cf.globalAlpha = 1
      cb.globalAlpha = 1

      // --- Badges: posição, escala e camada pela profundidade ---
      placedRef.current.forEach((pl, i) => {
        const b = badges.current[i]
        if (!b) return
        const [rx, ry] = radii[pl.ring]
        const a = pl.phase + angles[pl.ring]
        const z = Math.sin(a)
        const depth = (z + 1) / 2
        const x = cx + Math.cos(a) * rx
        const y = cy + z * ry
        b.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${((0.72 + depth * 0.4) * (1 + 0.16 * e)).toFixed(3)})`
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
    // Chamado a cada render do React: com movimento reduzido, redesenha o novo estado
    kick.current = () => {
      if (reduced) draw(0)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(el)
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting
      if (visible) start()
    })
    io.observe(el)
    resize()

    return () => {
      ro.disconnect()
      io.disconnect()
      cancelAnimationFrame(raf)
      kick.current = () => {}
    }
  }, [])

  useEffect(() => () => clearTimeout(pendingSel.current), [])

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

  // Abre o cartão ao lado do badge (no celular, embaixo do palco)
  const select = (i) => {
    const b = badges.current[i]
    if (!b || !wrap.current) return
    const r = b.getBoundingClientRect()
    const wr = wrap.current.getBoundingClientRect()
    const x = r.left + r.width / 2 - wr.left
    const y = r.top + r.height / 2 - wr.top
    setSel({ i, x, y: Math.min(Math.max(y, 110), wr.height - 110), side: x < wr.width / 2 ? 'right' : 'left' })
  }

  const onBadge = (i) => {
    clearTimeout(pendingSel.current)
    if (!open) {
      // Na cúpula, o clique num badge abre o globo e depois o cartão
      setOpen(true)
      pendingSel.current = setTimeout(() => select(i), 1500)
      return
    }
    if (sel?.i === i) setSel(null)
    else select(i)
  }

  const toggleCore = () => {
    clearTimeout(pendingSel.current)
    setSel(null)
    setOpen((o) => !o)
  }

  const onKeyDown = (ev) => {
    if (ev.key !== 'Escape') return
    if (sel) setSel(null)
    else if (open) setOpen(false)
  }

  const current = sel ? placed[sel.i] : null

  return (
    <div ref={wrap} className="so-wrap" onKeyDown={onKeyDown}>
      <div
        ref={stage}
        className="so"
        data-hot={hot !== null || undefined}
        data-mode={open ? 'globe' : 'dome'}
        onPointerDown={(ev) => {
          if (sel && (ev.target === stage.current || ev.target.tagName === 'CANVAS')) setSel(null)
        }}
      >
        <canvas ref={back} className="so__canvas so__canvas--back" aria-hidden="true" />
        <canvas ref={front} className="so__canvas so__canvas--front" aria-hidden="true" />

        <button
          ref={core}
          type="button"
          className="so__core"
          aria-pressed={open}
          aria-label={open ? labels.collapse : labels.expand}
          onClick={toggleCore}
          onPointerEnter={() => (coreHoverRef.current = true)}
          onPointerLeave={() => (coreHoverRef.current = false)}
          onFocus={() => (coreHoverRef.current = true)}
          onBlur={() => (coreHoverRef.current = false)}
        />

        <ul className="so__badges">
          {placed.map(({ name, Icon, color }, i) => (
            <li
              key={name}
              ref={(n) => (badges.current[i] = n)}
              className={`so__badge${hot === i ? ' is-hot' : ''}${sel?.i === i ? ' is-sel' : ''}`}
              style={{ '--brand': color }}
              data-layer="back"
              onPointerEnter={() => focusOn(i)}
              onPointerLeave={() => focusOff(i)}
              onFocus={() => focusOn(i)}
              onBlur={() => focusOff(i)}
            >
              <button type="button" className="so__disc" aria-label={name} aria-expanded={sel?.i === i} onClick={() => onBadge(i)}>
                <Icon aria-hidden="true" className="so__icon" />
              </button>
              <span className="so__tip" aria-hidden="true">
                {name}
              </span>
              <span className="so__label" aria-hidden="true">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {current && (
        <div
          key={current.name}
          className="so__card"
          data-side={sel.side}
          style={{ '--x': `${sel.x}px`, '--y': `${sel.y}px`, '--brand': current.color }}
          role="dialog"
          aria-label={current.name}
        >
          <div className="so__card-head">
            <span className="so__card-icon">
              <current.Icon aria-hidden="true" />
            </span>
            <h3 className="so__card-title">{current.name}</h3>
            <button type="button" className="so__card-close" aria-label={labels.close} onClick={() => setSel(null)}>
              <FaXmark aria-hidden="true" />
            </button>
          </div>
          {current.projects.length > 0 ? (
            <>
              <p className="so__card-meta">
                {labels.usedIn} {current.projects.length} {current.projects.length === 1 ? labels.project : labels.projects}
              </p>
              <ul className="so__card-list">
                {current.projects.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="so__card-meta">{labels.noProjects}</p>
          )}
        </div>
      )}

      <p className="so__hint" aria-live="polite">
        {open ? labels.hintOpen : labels.hint}
      </p>
    </div>
  )
}
