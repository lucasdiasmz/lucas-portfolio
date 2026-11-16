import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import './GlassFolder.css'

/*
 * Pasta de vidro: um projeto desenhado como objeto, em três camadas.
 * Atrás, um painel com arte gerada; no meio, as folhas (links do projeto);
 * na frente, um vidro fosco que desfoca o que passa por trás.
 *
 * - Repouso: fechada, só o topo das folhas aparece.
 * - Hover/foco: o vidro inclina na dobradiça de baixo e as folhas sobem.
 * - Aberta (clique, Enter, Espaço): as folhas saem e se abrem em leque.
 *
 * Adaptado do componente "Glass Folder Cards" para o tema do site:
 * só vidro escuro, arte em laranja/vermelho, fonte do site, sem botão de
 * adicionar nem menu. A arte é pintada em canvas uma vez por receita e
 * compartilhada entre as pastas.
 */

// #region arte
const ART_PRESETS = {
  // tinta laranja dobrando em água escura
  brasa: {
    style: 'marble',
    colors: ['#05070d', '#0a1020', '#1d3670', '#080b14', '#3d73e6', '#548cff', '#93b3ff'],
    scale: 0.62,
    warp: 3.2,
    angle: -0.5,
    gloss: 0.5,
    veins: 0.55,
  },
  // exposição longa: laranja e vermelho puxados pelo quadro
  chama: {
    style: 'streak',
    colors: ['#070a12', '#0f1d3d', '#3d73e6', '#548cff', '#93b3ff', '#0a1020', '#050505'],
    scale: 0.7,
    warp: 1.5,
    angle: -0.62,
    gloss: 0.2,
    veins: 0,
  },
  // carvão com veios de cobre
  carvao: {
    style: 'marble',
    colors: ['#050505', '#141414', '#1a2030', '#0a0c10', '#274a99', '#6f9bff', '#cfe0ff'],
    scale: 0.75,
    warp: 3.6,
    angle: 0.8,
    gloss: 0.45,
    veins: 0.5,
  },
}

function hexToRgb(hex) {
  let h = hex.trim().replace(/^#/, '')
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  const n = /^[0-9a-f]{6}$/i.test(h) ? parseInt(h, 16) : 0x808080
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// PRNG pequeno e com semente (mulberry32)
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

// Ruído de gradiente com semente, somado em oitavas fractais
function makeFbm(seed) {
  const r = rng(seed)
  const perm = new Uint8Array(512)
  const grad = new Float32Array(512)
  const p = []
  for (let i = 0; i < 256; i++) p.push(i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  for (let i = 0; i < 256; i++) {
    const a = r() * Math.PI * 2
    grad[i * 2] = Math.cos(a)
    grad[i * 2 + 1] = Math.sin(a)
  }
  const noise = (x, y) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = x - xi
    const yf = y - yi
    const X = xi & 255
    const Y = yi & 255
    const h00 = perm[X + perm[Y]] * 2
    const h10 = perm[X + 1 + perm[Y]] * 2
    const h01 = perm[X + perm[Y + 1]] * 2
    const h11 = perm[X + 1 + perm[Y + 1]] * 2
    const d00 = grad[h00] * xf + grad[h00 + 1] * yf
    const d10 = grad[h10] * (xf - 1) + grad[h10 + 1] * yf
    const d01 = grad[h01] * xf + grad[h01 + 1] * (yf - 1)
    const d11 = grad[h11] * (xf - 1) + grad[h11 + 1] * (yf - 1)
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10)
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10)
    return d00 + u * (d10 - d00) + v * (d01 - d00 + u * (d11 - d01 - d10 + d00))
  }
  return (x, y, octaves) => {
    let sum = 0
    let amp = 0.5
    for (let i = 0; i < octaves; i++) {
      sum += amp * noise(x, y)
      const nx = 1.6 * x + 1.2 * y + 7.1
      y = -1.2 * x + 1.6 * y + 3.3
      x = nx
      amp *= 0.5
    }
    return sum
  }
}

/*
 * A arte como um trabalho dividido em vários frames: um campo de ruído
 * dobrado duas vezes sobre si, normalizado pelos percentis e iluminado
 * como superfície líquida. `streak` estica o campo num eixo (exposição longa).
 */
function createArtJob(width, height, recipe, seed) {
  const w = Math.max(1, Math.round(width))
  const h = Math.max(1, Math.round(height))
  const stops = recipe.colors.map((c, i) => ({ t: i / (recipe.colors.length - 1), c: hexToRgb(c) }))
  const scale = recipe.scale ?? 0.7
  const warp = recipe.warp ?? 3
  const gloss = recipe.gloss ?? 0.4
  const veins = recipe.veins ?? 0
  const streak = recipe.style === 'streak'
  const fbm = makeFbm(seed * 977 + 13)
  const r = rng(seed + 1)
  const ox = r() * 50
  const oy = r() * 50
  const angle = (recipe.angle ?? 0) + (r() - 0.5) * 0.5
  const ca = Math.cos(angle)
  const sa = Math.sin(angle)
  const m = Math.min(w, h)
  // campo amostrado em meia resolução e ampliado com Catmull-Rom
  const gw = Math.ceil(w / 2) + 3
  const gh = Math.ceil(h / 2) + 3
  const G = new Float32Array(gw * gh)
  const GQ = new Float32Array(gw * gh)
  const F = new Float32Array(w * h)
  const Q = new Float32Array(w * h)
  const pixels = new Uint8ClampedArray(w * h * 4)
  let row = 0

  const field = (gy) => {
    for (let gx = 0; gx < gw; gx++) {
      const u = ((gx - 1) * 2 - w / 2) / m
      const v = ((gy - 1) * 2 - h / 2) / m
      let px = (u * ca - v * sa) * scale
      let py = (u * sa + v * ca) * scale
      if (streak) {
        px *= 0.14
        py *= 2.2
      }
      px += ox
      py += oy
      const qx = fbm(px, py, 3)
      const qy = fbm(px + 5.2, py + 1.3, 3)
      const rx = fbm(px + warp * qx + 1.7, py + warp * qy + 9.2, 3)
      const ry = fbm(px + warp * qx + 8.3, py + warp * qy + 2.8, 3)
      G[gy * gw + gx] = fbm(px + warp * rx, py + warp * ry, 4)
      GQ[gy * gw + gx] = Math.sqrt(qx * qx + qy * qy)
    }
  }

  const upsample = () => {
    const cr = (a, b, c, d) => (-a + 9 * b + 9 * c - d) / 16
    const T = new Float32Array(w * gh)
    for (let gy = 0; gy < gh; gy++) {
      const r0 = gy * gw
      for (let x = 0; x < w; x++) {
        const c = (x >> 1) + 1
        T[gy * w + x] = x & 1 ? cr(G[r0 + c - 1], G[r0 + c], G[r0 + c + 1], G[r0 + c + 2]) : G[r0 + c]
      }
    }
    for (let y = 0; y < h; y++) {
      const c = (y >> 1) + 1
      for (let x = 0; x < w; x++) {
        F[y * w + x] = y & 1 ? cr(T[(c - 1) * w + x], T[c * w + x], T[(c + 1) * w + x], T[(c + 2) * w + x]) : T[c * w + x]
        const gx = (x >> 1) + 1
        const q0 = GQ[c * gw + gx]
        const qx = x & 1 ? (q0 + GQ[c * gw + gx + 1]) / 2 : q0
        const q1 = y & 1 ? (x & 1 ? (GQ[(c + 1) * gw + gx] + GQ[(c + 1) * gw + gx + 1]) / 2 : GQ[(c + 1) * gw + gx]) : qx
        Q[y * w + x] = (qx + q1) / 2
      }
    }
  }

  const colorize = () => {
    const sample = []
    const stride = Math.max(1, Math.floor(F.length / 4096))
    for (let i = 0; i < F.length; i += stride) sample.push(F[i])
    sample.sort((a, b) => a - b)
    const lo = sample[Math.floor(sample.length * 0.02)]
    const hi = sample[Math.floor(sample.length * 0.98)]
    const k = 1 / (hi - lo || 1)
    const [lx, ly, lz] = [-0.55, -0.65, 0.52]
    const slope = k * m * 0.012
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x
        let t = (F[i] - lo) * k
        t = t < 0 ? 0 : t > 1 ? 1 : t
        let j = 1
        while (j < stops.length - 1 && stops[j].t < t) j++
        const a = stops[j - 1]
        const b = stops[j]
        let f = (t - a.t) / (b.t - a.t || 1)
        f = f < 0 ? 0 : f > 1 ? 1 : f
        f = f * f * (3 - 2 * f)
        const gx = (F[x < w - 1 ? i + 1 : i] - F[x > 0 ? i - 1 : i]) * slope
        const gy = (F[y < h - 1 ? i + w : i] - F[y > 0 ? i - w : i]) * slope
        const nd = (-gx * lx - gy * ly + lz) / Math.sqrt(gx * gx + gy * gy + 1)
        const spec = Math.pow(nd > 0 ? nd : 0, 24) * gloss * 255
        const silk = 1 + 0.035 * Math.sin(t * 150 + Q[i] * 24)
        const vein = veins * Math.max(0, 1 - Math.abs(Q[i] - 0.42) * 14) * 0.6
        const lit = (0.82 + 0.28 * nd) * silk * (1 - vein)
        pixels[i * 4] = (a.c[0] + (b.c[0] - a.c[0]) * f) * lit + spec
        pixels[i * 4 + 1] = (a.c[1] + (b.c[1] - a.c[1]) * f) * lit + spec
        pixels[i * 4 + 2] = (a.c[2] + (b.c[2] - a.c[2]) * f) * lit + spec
        pixels[i * 4 + 3] = 255
      }
    }
  }

  const step = (rows) => {
    if (row >= gh) return true
    const end = Math.min(gh, row + Math.max(1, rows))
    while (row < end) field(row++)
    if (row < gh) return false
    upsample()
    colorize()
    return true
  }

  return { width: w, height: h, pixels, step }
}

// Posição no leque: -1 … 1 ao longo da pilha, 0 para uma folha só
const fanSlot = (index, count) => (count <= 1 ? 0 : (index / (count - 1)) * 2 - 1)
// #endregion

// Um pintor só para a página: gasta poucos ms por frame, sem travar a rolagem
const artCache = new Map()
const queue = []
let pumping = false

function pump() {
  if (pumping) return
  pumping = true
  const tick = () => {
    const until = performance.now() + 7
    while (queue.length && performance.now() < until) {
      const head = queue[0]
      if (head.job.step(4)) {
        queue.shift()
        const c = document.createElement('canvas')
        c.width = head.job.width
        c.height = head.job.height
        c.getContext('2d')?.putImageData(new ImageData(head.job.pixels, c.width, c.height), 0, 0)
        head.done(c)
      }
    }
    if (queue.length) requestAnimationFrame(tick)
    else pumping = false
  }
  requestAnimationFrame(tick)
}

// Prioridade menor pinta primeiro: painéis de trás (0) antes das folhas (1)
function paint(recipe, seed, w, h, priority) {
  const key = JSON.stringify([recipe, seed, w, h])
  let p = artCache.get(key)
  if (!p) {
    p = new Promise((done) => {
      let at = queue.length
      while (at > 1 && queue[at - 1].priority > priority) at--
      queue.splice(at, 0, { job: createArtJob(w, h, recipe, seed), priority, done })
      pump()
    })
    artCache.set(key, p)
  }
  return p
}

function ArtCanvas({ art, seed, w, h, density, priority, className }) {
  const ref = useRef(null)
  const [ready, setReady] = useState(false)
  const recipe = typeof art === 'string' ? ART_PRESETS[art] : art
  const pw = Math.round(w * density)
  const ph = Math.round(h * density)

  useEffect(() => {
    let live = true
    paint(recipe, seed, pw, ph, priority).then((src) => {
      const c = ref.current
      if (!live || !c) return
      c.width = src.width
      c.height = src.height
      c.getContext('2d')?.drawImage(src, 0, 0)
      setReady(true)
    })
    return () => {
      live = false
    }
  }, [recipe, seed, pw, ph, priority])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      data-ready={ready || undefined}
      style={{ width: w, height: h, maxWidth: 'none' }}
    />
  )
}

// Geometria nas unidades da própria pasta: desenhada em 340 × 272 e escalada
const W = 340
const H = 272
const HEADROOM = 54 // espaço acima do painel de trás para as folhas subirem
const FRONT_H = 198
const SHEET_W = 272
const SHEET_H = 184

const BACK_PATH =
  'M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z'
const FRONT_PATH = `M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 ${FRONT_H - 22}A22 22 0 0 1 318 ${FRONT_H}L22 ${FRONT_H}A22 22 0 0 1 0 ${FRONT_H - 22}Z`

const MAX_VISIBLE = 4

/**
 * files: [{ name, meta?, href?, art?, onSelect? }] — com `href` vira link
 * (abre em nova aba); com `art` vira uma folha com arte em vez de papel.
 */
export default function GlassFolder({
  label,
  meta,
  badge,
  art = 'brasa',
  seed = 3,
  files = [],
  open = false,
  onOpenChange,
  maxWidth = 340,
  appearDelay = 0,
  nudgeDelay = 0,
  openLabel = 'Abrir',
  closeLabel = 'Fechar',
  contentsLabel = 'Conteúdo',
  className = '',
}) {
  const uid = useId().replace(/:/g, '')
  const boxRef = useRef(null)
  const rootRef = useRef(null)
  const filesRef = useRef(null)
  const hitRef = useRef(null)
  const [width, setWidth] = useState(maxWidth)
  const [entered, setEntered] = useState(false)

  // Largura fluida: ocupa a coluna até `maxWidth`, o resto escala junto
  useLayoutEffect(() => {
    const el = boxRef.current
    if (!el) return
    const measure = () => setWidth(Math.min(maxWidth, el.clientWidth || maxWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [maxWidth])

  const k = width / W
  const density = Math.min(1.5, Math.max(1, window.devicePixelRatio || 1)) * k

  // Entrada: a pasta se monta na primeira vez que aparece na tela
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let t = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        t = window.setTimeout(() => setEntered(true), appearDelay)
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [appearDelay])

  // Luz e paralaxe seguem o cursor, sem re-render
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let raf = 0
    let px = 0
    let py = 0
    const write = () => {
      raf = 0
      el.style.setProperty('--gf-px', px.toFixed(3))
      el.style.setProperty('--gf-py', py.toFixed(3))
    }
    const move = (e) => {
      if (e.pointerType === 'touch') return
      const r = el.getBoundingClientRect()
      px = ((e.clientX - r.left) / r.width) * 2 - 1
      py = ((e.clientY - r.top) / r.height) * 2 - 1
      if (!raf) raf = requestAnimationFrame(write)
    }
    const leave = () => {
      px = 0
      py = 0
      if (!raf) raf = requestAnimationFrame(write)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Folhas da pasta fechada ficam fora da ordem de tabulação
  useEffect(() => {
    filesRef.current?.toggleAttribute('inert', !open)
  }, [open])

  // Esc fecha
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      onOpenChange?.(false)
      hitRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  // As folhas mais novas ficam na frente da pilha, perto do vidro
  const start = Math.max(0, files.length - MAX_VISIBLE)
  const visible = files.slice(start)

  return (
    <div ref={boxRef} className={`w-full ${className}`} style={{ maxWidth }}>
      <div
        ref={rootRef}
        className="gf-root"
        data-open={open || undefined}
        data-entered={entered || undefined}
        style={{ width, height: (H + HEADROOM) * k, '--gf-nudge-delay': `${nudgeDelay}ms` }}
      >
        <div className="gf-stage" style={{ transform: `translateY(${HEADROOM * k}px) scale(${k})` }}>
          <div className="gf-tilt">
            <div className="gf-shadow" aria-hidden="true" />

            {/* painel de trás com a arte */}
            <div className="gf-back" style={{ clipPath: `path('${BACK_PATH}')` }} aria-hidden="true">
              <ArtCanvas className="gf-art" art={art} seed={seed} w={W + 24} h={H + 24} density={density} priority={0} />
              <div className="gf-back-sheen" />
            </div>
            <svg className="gf-rim gf-back-rim" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
              <path d={BACK_PATH} />
            </svg>

            {/* vidro da frente, com dobradiça embaixo */}
            <div className="gf-front" style={{ clipPath: `path('${FRONT_PATH}')` }}>
              <div className="gf-tint" aria-hidden="true" />
              <div className="gf-spec" aria-hidden="true" />
              <svg className="gf-rim gf-front-rim" viewBox={`0 0 ${W} ${FRONT_H}`} aria-hidden="true">
                <defs>
                  <linearGradient id={`gf-rim-${uid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#93b3ff" stopOpacity="0.9" />
                    <stop offset="0.35" stopColor="#fff" stopOpacity="0.25" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0.08" />
                  </linearGradient>
                </defs>
                <path d={FRONT_PATH} stroke={`url(#gf-rim-${uid})`} />
              </svg>
              <button
                ref={hitRef}
                type="button"
                className="gf-hit"
                aria-expanded={open}
                aria-label={`${open ? closeLabel : openLabel}: ${label}`}
                onClick={() => onOpenChange?.(!open)}
              />
              {badge && (
                <span className="gf-badge">
                  <i aria-hidden="true" /> {badge}
                </span>
              )}
              <div className="gf-label">
                <span className="gf-title">{label}</span>
                {meta && <span className="gf-meta">{meta}</span>}
              </div>
            </div>

            {/* conteúdo: depois do vidro na tabulação, por baixo dele na tela */}
            <div ref={filesRef} className="gf-files" role="list" aria-label={`${contentsLabel}: ${label}`}>
              {visible.map((file, v) => {
                const jitter = rng(hashString(file.name))
                const picture = !!file.art
                const inner = (
                  <>
                    {picture ? (
                      <ArtCanvas
                        className="gf-sheet-art"
                        art={file.art}
                        seed={hashString(file.name + seed) % 997}
                        w={SHEET_W}
                        h={SHEET_H}
                        density={Math.min(density, 1.25)}
                        priority={1}
                      />
                    ) : (
                      <span className="gf-lines" aria-hidden="true">
                        <i style={{ width: '86%' }} />
                        <i style={{ width: '92%' }} />
                        <i style={{ width: '64%' }} />
                        <i style={{ width: '88%' }} />
                        <i style={{ width: '42%' }} />
                      </span>
                    )}
                    <span className="gf-sheet-head">
                      <span className="gf-sheet-name">{file.name}</span>
                      {file.meta && <span className="gf-sheet-meta">{file.meta}</span>}
                    </span>
                  </>
                )
                const common = {
                  className: `gf-sheet${picture ? ' gf-sheet--art' : ''}`,
                  style: {
                    '--gf-slot': fanSlot(v, visible.length),
                    '--gf-depth': visible.length - 1 - v,
                    '--gf-jx': `${((jitter() - 0.5) * 10).toFixed(2)}px`,
                    '--gf-jr': `${((jitter() - 0.5) * 3.2).toFixed(2)}deg`,
                    zIndex: v + 1,
                  },
                  onClick: file.onSelect,
                }
                return (
                  <div key={file.name} role="listitem" className="gf-sheet-slot">
                    {file.href ? (
                      <a {...common} href={file.href} target="_blank" rel="noopener noreferrer">
                        {inner}
                      </a>
                    ) : (
                      <button {...common} type="button">
                        {inner}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
