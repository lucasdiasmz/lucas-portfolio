import { useRef, useState } from 'react'
import { FaCode } from 'react-icons/fa6'
import { SiJavascript, SiOpenjdk, SiReact, SiSpringboot } from 'react-icons/si'
import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import './HeroPortrait.css'

// Metadados mostrados no raio-x (código, então fica em inglês)
const code = [
  ['{', null],
  ['  "dev": ', `"${profile.name}",`],
  ['  "role": ', '"Software Engineering Student",'],
  ['  "stack": ', '["Java", "Spring Boot", "React", "JS"],'],
  ['  "status": ', '"Building clean code"'],
  ['}', null],
]

// Tecnologias que flutuam em volta da moldura (posição definida no CSS)
const chips = [
  { Icon: SiOpenjdk, label: 'Java' },
  { Icon: SiSpringboot, label: 'Spring Boot' },
  { Icon: SiReact, label: 'React' },
  { Icon: SiJavascript, label: 'JavaScript' },
]

/*
 * Retrato do hero: o recorte da foto (PNG sem fundo) é mais alto que a
 * moldura, então a cabeça "sai" pela borda de cima. Atrás gira um anel de
 * órbita; em volta flutuam as tecnologias. O conjunto inclina de leve
 * seguindo o mouse (só transform, gravado uma vez por frame).
 *
 * Raio-x: um círculo segue o mouse sobre a pessoa e revela a silhueta em
 * laranja com scanlines e um bloco JSON. Clique/Enter alterna o raio-x
 * inteiro, para a interação existir também no toque.
 */
export default function HeroPortrait() {
  const { lang, pick } = useLanguage()
  const stage = useRef(null)
  const xray = useRef(null)
  const raf = useRef(0)
  const pointer = useRef({ tx: 0, ty: 0, x: 0, y: 0, inXray: false })
  const [full, setFull] = useState(false)
  const [photoOk, setPhotoOk] = useState(true)

  const write = () => {
    raf.current = 0
    const p = pointer.current
    stage.current?.style.setProperty('--tx', p.tx.toFixed(3))
    stage.current?.style.setProperty('--ty', p.ty.toFixed(3))
    if (xray.current) {
      xray.current.style.setProperty('--x', `${p.x}px`)
      xray.current.style.setProperty('--y', `${p.y}px`)
      if (p.inXray) xray.current.dataset.hover = ''
      else delete xray.current.dataset.hover
    }
  }
  const schedule = () => {
    if (!raf.current) raf.current = requestAnimationFrame(write)
  }

  const onPointerMove = (e) => {
    if (e.pointerType === 'touch') return
    const s = stage.current.getBoundingClientRect()
    const p = pointer.current
    p.tx = ((e.clientX - s.left) / s.width) * 2 - 1
    p.ty = ((e.clientY - s.top) / s.height) * 2 - 1
    if (xray.current) {
      const r = xray.current.getBoundingClientRect()
      p.x = e.clientX - r.left
      p.y = e.clientY - r.top
      p.inXray = p.x >= 0 && p.y >= 0 && p.x <= r.width && p.y <= r.height
    }
    schedule()
  }
  const onPointerLeave = () => {
    Object.assign(pointer.current, { tx: 0, ty: 0, inXray: false })
    schedule()
  }

  const toggle = () => setFull((f) => !f)
  const alt = pick({ pt: `Foto de ${profile.name}`, en: `Photo of ${profile.name}` })

  return (
    <div ref={stage} className="hp animate-rise [animation-delay:150ms]" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <div className="hp__tilt">
        <span aria-hidden="true" className="hp__orbit" />

        <div className="frame-glow hp__frame">
          <div className="hp__card">
            <span aria-hidden="true" className="hp__halo" />
            {!photoOk && <span className="grid size-full place-items-center text-8xl text-orange-500">{profile.name[0]}</span>}
          </div>
        </div>

        {photoOk && (
          <div
            ref={xray}
            role="button"
            tabIndex={0}
            aria-pressed={full}
            aria-label={lang === 'en' ? 'Toggle code X-ray view' : 'Alternar visão de raio-x de código'}
            data-full={full || undefined}
            onClick={toggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggle()
              }
            }}
            className="hp__person xray"
          >
            <img src={profile.photo} alt={alt} onError={() => setPhotoOk(false)} className="hp__img" />

            {/* silhueta em raio-x: mascarada pela própria foto, só dentro do círculo */}
            <div aria-hidden="true" className="xray__layer xray__silhouette" style={{ '--photo': `url(${profile.photo})` }}>
              <img src={profile.photo} alt="" className="hp__img xray__photo--scan" />
            </div>
            <div aria-hidden="true" className="xray__layer">
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
        )}

        <ul aria-hidden="true" className="hp__chips">
          {chips.map(({ Icon, label }, i) => (
            <li key={label} className="hp__chip" style={{ '--i': i }}>
              <Icon className="text-orange-500" />
              <span className="hp__chip-label">{label}</span>
            </li>
          ))}
        </ul>

        <p className="hp__badge">
          <FaCode aria-hidden="true" className="text-orange-500" />
          {pick(profile.badge)}
        </p>
      </div>
    </div>
  )
}
