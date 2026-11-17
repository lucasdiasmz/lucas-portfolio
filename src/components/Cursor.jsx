import { useEffect, useRef } from 'react'
import { finePointer, reducedMotion } from '../motion/env.js'
import { loop } from '../motion/frame.js'

const HOT = 'a, button, label, summary, [role="button"], [role="tab"]'
const TEXT = 'input:not([type="checkbox"], [type="radio"]), textarea'

/*
 * Cursor neon: ponto que segue o mouse, anel que vem atrás com atraso e uma
 * mancha de luz mais lenta ainda, por baixo do conteúdo, que acende a grade do
 * fundo por onde o cursor passa.
 *
 * O laço de animação só roda enquanto algo ainda está se aproximando do mouse;
 * com o mouse parado ele se desliga. O anel muda de forma sobre links e botões
 * e some sobre campos de texto (ali vale o cursor de texto nativo).
 * Só liga em telas com mouse e sem preferência por menos movimento.
 */
export default function Cursor() {
  const box = useRef(null)
  const dot = useRef(null)
  const ring = useRef(null)
  const light = useRef(null)

  useEffect(() => {
    if (!finePointer.get() || reducedMotion.get()) return

    const root = document.documentElement
    root.classList.add('has-cursor')
    let x = -100
    let y = -100
    let rx = x
    let ry = y
    let lx = x
    let ly = y
    let placed = false

    const follow = loop(() => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      lx += (x - lx) * 0.07
      ly += (y - ly) * 0.07
      dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ring.current.style.translate = `${rx.toFixed(2)}px ${ry.toFixed(2)}px`
      light.current.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0)`
      // tudo chegou no mouse: o laço para até o próximo movimento
      return Math.abs(x - rx) + Math.abs(y - ry) > 0.1 || Math.abs(x - lx) + Math.abs(y - ly) > 0.5
    })

    follow.start() // um quadro para tirar ponto e anel da tela até o primeiro movimento

    const move = (e) => {
      x = e.clientX
      y = e.clientY
      if (!placed) {
        placed = true
        rx = lx = x
        ry = ly = y
      }
      follow.start()
    }
    const over = (e) => {
      const el = e.target instanceof Element ? e.target : null
      const mode = el?.closest(TEXT) ? 'text' : el?.closest(HOT) ? 'hot' : ''
      box.current.dataset.mode = mode
      ring.current.dataset.mode = mode
    }
    const down = () => (ring.current.dataset.press = '')
    const up = () => delete ring.current.dataset.press
    const hide = () => root.classList.add('cursor-out')
    const show = () => root.classList.remove('cursor-out')

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('pointerdown', down, { passive: true })
    document.addEventListener('pointerup', up, { passive: true })
    root.addEventListener('pointerleave', hide)
    root.addEventListener('pointerenter', show)
    return () => {
      follow.stop()
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerdown', down)
      document.removeEventListener('pointerup', up)
      root.removeEventListener('pointerleave', hide)
      root.removeEventListener('pointerenter', show)
      root.classList.remove('has-cursor', 'cursor-out')
    }
  }, [])

  return (
    <>
      <div ref={light} aria-hidden="true" className="cursor-light" />
      <div
        ref={box}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] hidden transition-opacity duration-300 [.cursor-out_&]:opacity-0 [.has-cursor_&]:block data-[mode=text]:opacity-0"
      >
        <div ref={dot} className="absolute -left-1 -top-1 size-2 rounded-full bg-brand-500 shadow-[0_0_12px_var(--color-ember)]" />
        <div ref={ring} className="cursor-ring absolute -left-5 -top-5 size-10 rounded-full border border-brand-500/70" />
      </div>
    </>
  )
}
