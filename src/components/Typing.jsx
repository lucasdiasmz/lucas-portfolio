import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../motion/env.js'
import { useInView } from '../motion/hooks.js'

/*
 * Escreve e apaga as frases, uma de cada vez. O estado fica aqui dentro: só
 * este parágrafo re-renderiza a cada letra, não a seção inteira. Fora da tela
 * a digitação para e retoma de onde estava ao voltar.
 */
export default function Typing({ phrases, className = '' }) {
  const calm = useReducedMotion()
  const ref = useRef(null)
  const [text, setText] = useState('')
  const [visible, setVisible] = useState(true)
  const pos = useRef({ index: 0, length: 0, deleting: false })

  useInView(ref, setVisible)

  useEffect(() => {
    if (calm || !visible) return
    const s = pos.current
    let timer
    const step = () => {
      const full = phrases[s.index % phrases.length]
      s.length = Math.min(full.length, Math.max(0, s.length + (s.deleting ? -1 : 1)))
      setText(full.slice(0, s.length))
      let wait = s.deleting ? 40 : 85
      if (!s.deleting && s.length === full.length) {
        s.deleting = true
        wait = 1800
      } else if (s.deleting && s.length === 0) {
        s.deleting = false
        s.index = (s.index + 1) % phrases.length
        wait = 400
      }
      timer = setTimeout(step, wait)
    }
    timer = setTimeout(step, 600)
    return () => clearTimeout(timer)
  }, [phrases, calm, visible])

  return (
    <p ref={ref} className={className} aria-label={phrases.join(', ')}>
      <span aria-hidden="true">{calm ? phrases[0] : text}</span>
      <span aria-hidden="true" className="ml-1 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-blink bg-brand-500" />
    </p>
  )
}
