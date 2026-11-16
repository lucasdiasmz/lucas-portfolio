import { useEffect } from 'react'

// Peças que pulverizam: blocos de conteúdo. Só a peça mais externa conta
// (um parágrafo dentro de um cartão vai junto com o cartão).
const PIECES = [
  // li.ss__arm é o braço da órbita (altura zero): a peça é o disco dentro dele
  'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'li:not(.ss__arm)', 'img', 'picture', 'video', 'canvas', 'svg',
  'figure', 'blockquote', 'button', 'a', 'label', 'input', 'textarea', 'select', 'form',
  '.glass', '.ss__sky', '.ss__ground',
].join(',')

const LINE = 0.1 // linha do "limite superior": 10% da altura da tela

function collect(root) {
  const pieces = []
  for (const section of root.querySelectorAll(':scope > section')) {
    for (const el of section.querySelectorAll(PIECES)) {
      const outer = el.parentElement.closest(PIECES)
      if (outer && section.contains(outer)) continue
      if (!el.dataset.dustInit) {
        // cada peça se espalha para um lado e começa um pouco antes ou depois
        el.style.setProperty('--dx', `${(Math.random() * 2 - 1) * 28}px`)
        el.style.setProperty('--dy', `${-30 - Math.random() * 45}px`)
        el.style.setProperty('--dd', `${Math.round(Math.random() * 140)}ms`)
        el.dataset.dustInit = ''
      }
      pieces.push(el)
    }
  }
  return pieces
}

/*
 * Pulverização: quando o meio de uma peça passa do limite superior da tela,
 * ela vira poeira (data-dust="out", animação no index.css). Rolando de volta,
 * todas reaparecem juntas e por igual (data-dust="in").
 * Um listener de scroll lê as posições uma vez por quadro; a lista de peças é
 * refeita quando o React troca o conteúdo (abas, painel das Habilidades).
 */
export default function useDust(deps) {
  useEffect(() => {
    const root = document.getElementById('conteudo')
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let pieces = collect(root)
    let dirty = false
    let frame = 0

    const update = () => {
      frame = 0
      if (dirty) {
        pieces = collect(root)
        dirty = false
      }
      const vh = window.innerHeight
      const line = vh * LINE
      for (const el of pieces) {
        const r = el.getBoundingClientRect()
        if (!r.height) continue
        // peça pequena: conta o meio. Peça grande (anéis e planeta das
        // Habilidades): conta a base, para voltar junto com o que está nela
        const anchor = r.height > vh * 0.4 ? r.bottom - vh * 0.12 : r.top + r.height / 2
        const gone = anchor < line
        const state = el.dataset.dust
        if (gone && state !== 'out') el.dataset.dust = 'out'
        else if (!gone && state === 'out') el.dataset.dust = 'in'
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const mo = new MutationObserver(() => {
      dirty = true
      schedule()
    })
    mo.observe(root, { childList: true, subtree: true })
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()

    return () => {
      cancelAnimationFrame(frame)
      mo.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      for (const el of root.querySelectorAll('[data-dust]')) delete el.dataset.dust
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
