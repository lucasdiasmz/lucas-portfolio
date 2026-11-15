import { useEffect, useRef } from 'react'

// Cursor laranja: ponto que segue o mouse e anel que vem atrás com atraso.
// Só liga em telas com mouse e sem preferência por menos movimento.
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || calm) return

    const root = document.documentElement
    root.classList.add('has-cursor')
    let x = -100
    let y = -100
    let rx = x
    let ry = y
    let raf = 0

    const move = (e) => {
      x = e.clientX
      y = e.clientY
      const hot = e.target.closest?.('a, button, input, textarea, label, [role="button"]')
      ring.current?.classList.toggle('scale-150', Boolean(hot))
      ring.current?.classList.toggle('bg-orange-500/15', Boolean(hot))
    }
    const tick = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (ring.current) ring.current.style.translate = `${rx}px ${ry}px`
      raf = requestAnimationFrame(tick)
    }
    const hide = () => root.classList.add('cursor-out')
    const show = () => root.classList.remove('cursor-out')

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', hide)
    document.addEventListener('pointerenter', show)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
      document.removeEventListener('pointerenter', show)
      root.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden [.has-cursor_&]:block [.cursor-out_&]:opacity-0">
      <div ref={dot} className="absolute -left-1 -top-1 size-2 rounded-full bg-orange-500 shadow-[0_0_12px_#fa6e00]" />
      <div
        ref={ring}
        className="absolute -left-5 -top-5 size-10 rounded-full border border-orange-500/70 transition-[scale,background-color] duration-300"
      />
    </div>
  )
}
