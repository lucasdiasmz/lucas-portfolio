import { useEffect, useLayoutEffect, useRef } from 'react'
import { reducedMotion } from './env.js'
import { frame } from './frame.js'
import { watch } from './inview.js'
import { onScroll } from './scroll.js'

/*
 * Entrada ao rolar: marca o elemento com data-seen na primeira vez que ele
 * aparece (ver .reveal, .split e .draw no CSS). Depois de `settle` ms o valor
 * vira "done" e as regras de entrada saem de cena, devolvendo ao elemento as
 * transições dele (hover de cartão, por exemplo).
 */
export function useReveal(threshold = 0.2, settle = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || el.dataset.seen) return
    let timer = 0
    const stop = watch(
      el,
      () => {
        el.dataset.seen = 'in'
        if (settle) timer = window.setTimeout(() => (el.dataset.seen = 'done'), settle)
      },
      { threshold, once: true },
    )
    return () => {
      stop()
      window.clearTimeout(timer)
    }
  }, [threshold, settle])
  return ref
}

// Chama `fn(visivel)` sempre que o elemento entra ou sai da tela
export function useInView(ref, fn, margin = '0px') {
  const saved = useRef(fn)
  useLayoutEffect(() => {
    saved.current = fn
  })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    return watch(el, (hit) => saved.current(hit), { margin })
  }, [ref, margin])
}

/*
 * Posição do ponteiro dentro do elemento, de -1 a 1, gravada em duas variáveis
 * CSS no máximo uma vez por quadro (inclinação da foto e das pastas). Ao sair,
 * volta a zero. Toque não conta.
 */
export function usePointerVars(ref, xVar, yVar) {
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion.get()) return
    let px = 0
    let py = 0
    const write = () => {
      el.style.setProperty(xVar, px.toFixed(3))
      el.style.setProperty(yVar, py.toFixed(3))
    }
    const move = (e) => {
      if (e.pointerType === 'touch') return
      const r = el.getBoundingClientRect()
      px = ((e.clientX - r.left) / r.width) * 2 - 1
      py = ((e.clientY - r.top) / r.height) * 2 - 1
      frame.write(write)
    }
    const leave = () => {
      px = py = 0
      frame.write(write)
    }
    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      frame.cancel(write)
    }
  }, [ref, xVar, yVar])
}

/*
 * Progresso do elemento pela tela, 0..1, gravado em --p: 0 quando o topo dele
 * está em `from` (fração da altura da janela) e 1 quando chega em `to`.
 * Só mede enquanto o elemento está visível.
 */
export function useScrollProgress(ref, { from = 0.85, to = 0.35 } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reducedMotion.get()) {
      el.style.setProperty('--p', '1')
      return
    }
    let last = -1
    let value = 0
    let off = null
    const write = () => el.style.setProperty('--p', value.toFixed(3))
    const update = ({ vh }) => {
      const p = (from * vh - el.getBoundingClientRect().top) / ((from - to) * vh)
      value = Math.min(1, Math.max(0, p))
      if (Math.abs(value - last) < 0.002) return
      last = value
      frame.write(write)
    }
    const stop = watch(
      el,
      (hit) => {
        if (hit && !off) off = onScroll(update)
        else if (!hit && off) off = void off()
      },
      { margin: '10% 0px' },
    )
    return () => {
      stop()
      off?.()
      frame.cancel(write)
    }
  }, [ref, from, to])
}

/*
 * FLIP: quando `deps` muda, os filhos diretos que mudaram de lugar deslizam da
 * posição antiga para a nova (só transform); os que acabaram de entrar surgem.
 * Cada filho precisa de um data-flip estável.
 */
export function useFlip(ref, deps) {
  const boxes = useRef({ width: 0, at: new Map() })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const { width, at: prev } = boxes.current
    // posição de layout dentro da lista: não depende da rolagem nem de transform
    const next = new Map()
    for (const child of el.children) {
      const key = child.dataset.flip
      if (key) next.set(key, { left: child.offsetLeft, top: child.offsetTop })
    }
    boxes.current = { width: el.clientWidth, at: next }
    // janela redimensionada desde a última troca: as posições antigas não valem
    if (!prev.size || width !== el.clientWidth || reducedMotion.get()) return
    for (const child of el.children) {
      const key = child.dataset.flip
      const to = next.get(key)
      const before = prev.get(key)
      if (!to) continue
      if (!before) {
        child.animate([{ opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1 }], { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' })
        continue
      }
      const dx = before.left - to.left
      const dy = before.top - to.top
      if (!dx && !dy) continue
      child.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0 0' }], { duration: 520, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
