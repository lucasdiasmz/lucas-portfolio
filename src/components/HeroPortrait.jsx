import { useEffect, useRef, useState } from 'react'
import { FaCode } from 'react-icons/fa6'
import { SiJavascript, SiOpenjdk, SiReact, SiSpringboot } from 'react-icons/si'
import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import './HeroPortrait.css'

// Tecnologias que flutuam em volta da moldura (posição definida no CSS)
const chips = [
  { Icon: SiOpenjdk, label: 'Java' },
  { Icon: SiSpringboot, label: 'Spring Boot' },
  { Icon: SiReact, label: 'React' },
  { Icon: SiJavascript, label: 'JavaScript' },
]

const CYBER = '/foto-cyber.webp'
const PHOTO_RATIO = 853 / 720 // altura/largura do recorte (igual ao --ph do CSS)
const LEAVE_MS = 550 // tempo para o rastro sumir depois que o mouse sai

/*
 * Retrato do hero: o recorte da foto (PNG sem fundo) é mais alto que a
 * moldura, então a cabeça "sai" pela borda de cima. Atrás gira um anel de
 * órbita; em volta flutuam as tecnologias. O conjunto inclina de leve
 * seguindo o mouse (só transform, gravado uma vez por frame).
 *
 * Máscara fluida: um canvas por cima da foto desenha a versão cyberpunk só
 * onde o mouse passou. O rastro vem de círculos com borda suave carimbados
 * numa máscara (com inércia no ponteiro) que vai se apagando a cada frame.
 * O loop de requestAnimationFrame só roda com o cursor em cima ou com rastro
 * ainda dissipando; parado, não consome nada.
 */
export default function HeroPortrait() {
  const { pick } = useLanguage()
  const stage = useRef(null)
  const person = useRef(null)
  const canvas = useRef(null)
  const raf = useRef(0)
  const pointer = useRef({ tx: 0, ty: 0 })
  const reveal = useRef(null) // { start(x, y, touch), move(x, y), leave() }
  const [photoOk, setPhotoOk] = useState(true)

  const write = () => {
    raf.current = 0
    const p = pointer.current
    stage.current?.style.setProperty('--tx', p.tx.toFixed(3))
    stage.current?.style.setProperty('--ty', p.ty.toFixed(3))
  }
  const schedule = () => {
    if (!raf.current) raf.current = requestAnimationFrame(write)
  }

  const onStageMove = (e) => {
    if (e.pointerType === 'touch') return
    const s = stage.current.getBoundingClientRect()
    pointer.current.tx = ((e.clientX - s.left) / s.width) * 2 - 1
    pointer.current.ty = ((e.clientY - s.top) / s.height) * 2 - 1
    schedule()
  }
  const onStageLeave = () => {
    Object.assign(pointer.current, { tx: 0, ty: 0 })
    schedule()
  }

  // ---- máscara fluida (canvas) ----
  useEffect(() => {
    const el = person.current
    const cv = canvas.current
    if (!photoOk || !el || !cv) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = cv.getContext('2d')
    const mask = document.createElement('canvas')
    const mctx = mask.getContext('2d')
    const img = new Image()
    let ready = false
    let w = 0
    let h = 0
    let dpr = 1
    let frame = 0
    const s = { inside: false, tx: 0, ty: 0, x: 0, y: 0, last: 0, leftAt: 0, boost: 1 }

    const resize = () => {
      w = el.clientWidth
      h = el.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      for (const c of [cv, mask]) {
        c.width = Math.round(w * dpr)
        c.height = Math.round(h * dpr)
      }
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // mesma geometria do .hp__img: 120% da largura, centrada em 51,2% e colada na base
    const drawCyber = () => {
      const iw = w * 1.2
      ctx.drawImage(img, w / 2 - iw * 0.512, h - iw * PHOTO_RATIO, iw, iw * PHOTO_RATIO)
    }

    const stamp = (x, y, r, a) => {
      const g = mctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, `rgba(0,0,0,${a})`)
      g.addColorStop(0.55, `rgba(0,0,0,${a * 0.6})`)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      mctx.fillStyle = g
      mctx.beginPath()
      mctx.arc(x, y, r, 0, Math.PI * 2)
      mctx.fill()
    }

    const clearAll = () => {
      mctx.clearRect(0, 0, w, h)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, cv.width, cv.height)
    }

    const tick = (now) => {
      frame = 0
      const dt = Math.min(now - (s.last || now), 50)
      s.last = now

      // rastro apagando (mais rápido depois que o mouse sai)
      const tau = s.inside ? 420 : 130
      mctx.globalCompositeOperation = 'destination-out'
      mctx.fillStyle = `rgba(0,0,0,${1 - Math.exp(-dt / tau)})`
      mctx.fillRect(0, 0, w, h)
      mctx.globalCompositeOperation = 'source-over'

      if (s.inside) {
        // ponteiro com inércia; carimba ao longo do caminho para não abrir buracos
        const k = 1 - Math.exp(-dt / 75)
        const px = s.x
        const py = s.y
        s.x += (s.tx - s.x) * k
        s.y += (s.ty - s.y) * k
        const dist = Math.hypot(s.x - px, s.y - py)
        const base = Math.max(64, w * 0.3) * s.boost
        const r = base * (1 + Math.min(dist, 36) / 70)
        const steps = Math.max(1, Math.ceil(dist / (r * 0.3)))
        for (let i = 1; i <= steps; i++) stamp(px + ((s.x - px) * i) / steps, py + ((s.y - py) * i) / steps, r, 0.6)
      }

      if (!s.inside && now - s.leftAt > LEAVE_MS) {
        clearAll()
        s.last = 0
        return // ocioso: o loop para aqui
      }

      // desenha a foto cyber e recorta pela máscara
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, w, h)
      if (ready) drawCyber()
      ctx.globalCompositeOperation = 'destination-in'
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.drawImage(mask, 0, 0)
      ctx.globalCompositeOperation = 'source-over'

      frame = requestAnimationFrame(tick)
    }
    const run = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const api = {
      start(x, y, touch) {
        s.tx = x
        s.ty = y
        if (!s.inside) {
          s.x = x
          s.y = y
        }
        s.inside = true
        s.boost = touch ? 1.5 : 1
        run()
      },
      move(x, y) {
        if (!s.inside) api.start(x, y, false)
        else {
          s.tx = x
          s.ty = y
        }
      },
      leave() {
        if (!s.inside) return
        s.inside = false
        s.leftAt = performance.now()
        run()
      },
    }
    reveal.current = api

    img.onload = () => {
      ready = true
    }
    img.src = CYBER
    resize()
    const ro = new ResizeObserver(() => {
      resize()
      if (!frame) clearAll()
    })
    ro.observe(el)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      reveal.current = null
    }
  }, [photoOk])

  const local = (e) => {
    const r = person.current.getBoundingClientRect()
    return [e.clientX - r.left, e.clientY - r.top]
  }
  const onMove = (e) => {
    const [x, y] = local(e)
    reveal.current?.move(x, y)
  }
  const onDown = (e) => {
    if (e.pointerType !== 'touch') return
    const [x, y] = local(e)
    reveal.current?.start(x, y, true)
  }
  const onLeave = () => reveal.current?.leave()

  const alt = pick({ pt: `Foto de ${profile.name}`, en: `Photo of ${profile.name}` })

  return (
    <div ref={stage} className="hp animate-rise [animation-delay:150ms]" onPointerMove={onStageMove} onPointerLeave={onStageLeave}>
      <div className="hp__tilt">
        <span aria-hidden="true" className="hp__orbit" />

        <div className="frame-glow hp__frame">
          <div className="hp__card">
            <span aria-hidden="true" className="hp__halo" />
            {!photoOk && <span className="grid size-full place-items-center text-8xl text-brand-500">{profile.name[0]}</span>}
          </div>
        </div>

        {photoOk && (
          <div
            ref={person}
            className="hp__person"
            onPointerMove={onMove}
            onPointerDown={onDown}
            onPointerUp={onLeave}
            onPointerCancel={onLeave}
            onPointerLeave={onLeave}
          >
            <img src={profile.photo} alt={alt} onError={() => setPhotoOk(false)} className="hp__img" />
            <canvas ref={canvas} aria-hidden="true" className="hp__reveal" />
          </div>
        )}

        <ul aria-hidden="true" className="hp__chips">
          {chips.map(({ Icon, label }, i) => (
            <li key={label} className="hp__chip" style={{ '--i': i }}>
              <Icon className="text-brand-500" />
              <span className="hp__chip-label">{label}</span>
            </li>
          ))}
        </ul>

        <p className="hp__badge">
          <FaCode aria-hidden="true" className="text-brand-500" />
          {pick(profile.badge)}
        </p>
      </div>
    </div>
  )
}
