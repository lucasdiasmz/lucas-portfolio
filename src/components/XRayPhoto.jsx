import { useRef, useState } from 'react'
import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

// Metadados mostrados no raio-x (código, então fica em inglês)
const code = [
  ['{', null],
  ['  "dev": ', `"${profile.name}",`],
  ['  "role": ', '"Software Engineering Student",'],
  ['  "stack": ', '["Java", "Spring Boot", "REST API", "JS"],'],
  ['  "status": ', '"Building clean code"'],
  ['}', null],
]

/*
 * Foto com "raio-x de código": um círculo segue o mouse e revela, por baixo,
 * a foto em laranja com scanlines e um bloco JSON. Toque/clique (ou Enter)
 * alterna o raio-x inteiro, para não perder a interação no celular.
 *
 * Desempenho: o mousemove só grava --x/--y uma vez por frame (rAF); o filtro
 * da foto é estático e o anel se move com transform, sem blur em tempo real.
 */
export default function XRayPhoto({ src, alt, onError, className = '' }) {
  const { lang } = useLanguage()
  const ref = useRef(null)
  const raf = useRef(0)
  const pos = useRef({ x: 0, y: 0 })
  const [full, setFull] = useState(false)

  const write = () => {
    raf.current = 0
    const el = ref.current
    if (!el) return
    el.style.setProperty('--x', `${pos.current.x}px`)
    el.style.setProperty('--y', `${pos.current.y}px`)
  }

  const onPointerMove = (e) => {
    if (e.pointerType === 'touch') return
    const r = ref.current.getBoundingClientRect()
    pos.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    ref.current.dataset.hover = ''
    if (!raf.current) raf.current = requestAnimationFrame(write)
  }

  const onPointerLeave = () => {
    delete ref.current.dataset.hover
  }

  const toggle = () => setFull((f) => !f)

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-pressed={full}
      aria-label={lang === 'en' ? 'Toggle code X-ray view' : 'Alternar visão de raio-x de código'}
      data-full={full || undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggle()
        }
      }}
      className={`xray group ${className}`}
    >
      <img src={src} alt={alt} onError={onError} className="xray__photo size-full object-cover grayscale-[15%]" />

      {/* camada oculta: aparece só dentro do círculo */}
      <div aria-hidden="true" className="xray__layer">
        <img src={src} alt="" className="xray__photo xray__photo--scan size-full object-cover" />
        <div className="xray__scan" />
        <pre className="xray__code">
          {code.map(([k, v]) => (
            <span key={k} className="block">
              <span className="text-orange-300">{k}</span>
              {v && <span className="text-white/90">{v}</span>}
            </span>
          ))}
        </pre>
      </div>

      <span aria-hidden="true" className="xray__ring" />
    </div>
  )
}
