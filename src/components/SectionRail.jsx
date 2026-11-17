import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SectionLink from './SectionLink.jsx'
import { sections } from '../data/sections.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { frame } from '../motion/frame.js'
import { onScroll } from '../motion/scroll.js'
import { activeSection } from '../motion/sections.js'
import { useStore } from '../motion/store.js'

/*
 * Trilho lateral: a linha de progresso de leitura que também é o índice da
 * página. Cada seção tem um ponto na altura proporcional ao lugar dela na
 * página, então o preenchimento chega ao ponto quando a seção chega ao topo.
 * Passar o mouse mostra os nomes; clicar leva até a seção.
 *
 * O preenchimento é um transform gravado direto no DOM pelo scroll do site,
 * sem passar pelo React. Fora da home fica só a linha de progresso.
 */
export default function SectionRail() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const home = pathname === '/'
  const active = useStore(activeSection)
  const fill = useRef(null)
  const [marks, setMarks] = useState({})

  useEffect(() => {
    let p = -1
    const write = () => {
      if (fill.current) fill.current.style.transform = `scaleY(${p.toFixed(4)})`
    }
    return onScroll(({ progress }) => {
      if (Math.abs(progress - p) < 0.0005) return
      p = progress
      frame.write(write)
    })
  }, [])

  // Altura de cada ponto: refeita quando a página muda de altura (pasta aberta, janela)
  useEffect(() => {
    if (!home) return
    const root = document.getElementById('conteudo')
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const next = {}
      for (const { id } of sections) {
        const el = document.getElementById(id)
        if (el) next[id] = Math.min(1, Math.max(0, (el.getBoundingClientRect().top + window.scrollY) / max))
      }
      setMarks((prev) => (sections.every(({ id }) => Math.abs((prev[id] ?? -1) - (next[id] ?? -1)) < 0.002) ? prev : next))
    }
    const schedule = () => frame.read(measure)
    const ro = new ResizeObserver(schedule)
    ro.observe(root)
    window.addEventListener('resize', schedule)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', schedule)
      frame.cancel(measure)
    }
  }, [home])

  const stops = home ? sections.filter((s) => s.id in marks) : []

  return (
    <nav aria-label={t.nav.sections} className="rail">
      <div aria-hidden="true" className="rail__track">
        <div ref={fill} className="rail__fill" />
      </div>
      {stops.map((s) => (
        <SectionLink
          key={s.id}
          id={s.id}
          className="rail__stop"
          style={{ '--at': `${(marks[s.id] * 100).toFixed(2)}%` }}
          aria-current={active === s.id ? 'location' : undefined}
        >
          <span aria-hidden="true" className="rail__dot" />
          <span className="rail__label">{t.nav[s.key]}</span>
        </SectionLink>
      ))}
    </nav>
  )
}
