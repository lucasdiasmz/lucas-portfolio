import { frame } from './frame.js'

/*
 * Rolagem: um listener passivo para o site todo. Quem assina recebe o estado
 * uma vez por quadro, na fase de leitura; escritas no DOM vão por frame.write.
 *   y: posição | max: rolagem máxima | progress: 0..1 | dir: 1 desce, -1 sobe
 *   vh, vw: tamanho da janela
 */
const state = { y: 0, max: 1, progress: 0, dir: 0, vh: 0, vw: 0 }
const subs = new Set()

function measure() {
  const y = window.scrollY
  if (y !== state.y) state.dir = y > state.y ? 1 : -1
  state.y = y
  state.vh = window.innerHeight
  state.vw = window.innerWidth
  state.max = Math.max(1, document.documentElement.scrollHeight - state.vh)
  state.progress = Math.min(1, Math.max(0, y / state.max))
  for (const fn of subs) fn(state)
}

const schedule = () => frame.read(measure)

export function onScroll(fn) {
  if (!subs.size) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  }
  subs.add(fn)
  schedule()
  return () => {
    subs.delete(fn)
    if (subs.size) return
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    frame.cancel(measure)
  }
}

// Pede uma nova medição (ex.: o conteúdo mudou de altura sem rolar)
export const refreshScroll = schedule
