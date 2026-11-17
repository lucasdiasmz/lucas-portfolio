import { useEffect } from 'react'
import { reducedMotion } from '../motion/env.js'
import { frame } from '../motion/frame.js'
import { onScroll, refreshScroll } from '../motion/scroll.js'

// Peças que pulverizam: blocos de conteúdo. Só a peça mais externa conta
// (um parágrafo dentro de um cartão vai junto com o cartão).
const PIECES = [
  // li.ss__arm é o braço da órbita (altura zero): a peça é o disco dentro dele
  'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'li:not(.ss__arm)', 'ol', 'img', 'picture', 'video', 'canvas', 'svg',
  'figure', 'blockquote', 'button', 'a', 'label', 'input', 'textarea', 'select', 'form',
  '.glass', '.ss__sky', '.ss__ground',
].join(',')

const LINE = 0.1 // linha do "limite superior": 10% da altura da tela

// Peças agrupadas por seção: a posição da seção decide o grupo inteiro de uma
// vez quando ela está toda acima ou toda abaixo da linha
function collect(root) {
  const groups = []
  for (const section of root.querySelectorAll(':scope > section')) {
    const pieces = []
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
    // `out`: peças deste grupo que estão em poeira (evita ler o DOM para saber)
    groups.push({ section, pieces, out: new Set(pieces.filter((el) => el.dataset.dust === 'out')) })
  }
  return groups
}

/*
 * Pulverização: quando o meio de uma peça passa do limite superior da tela,
 * ela vira poeira (data-dust="out", animação no index.css). Rolando de volta,
 * todas reaparecem juntas e por igual (data-dust="in").
 *
 * Assina o scroll do site (uma leitura por quadro). Só as seções que cruzam o
 * topo da tela têm as peças medidas; as demais são resolvidas pela caixa da
 * seção. A lista é refeita quando o React troca elementos (abas, painéis), e
 * não a cada letra do texto digitado na hero.
 */
export default function useDust(deps) {
  useEffect(() => {
    const root = document.getElementById('conteudo')
    if (!root || reducedMotion.get()) return

    let groups = collect(root)
    let dirty = false
    const changes = []

    const flush = () => {
      for (const [el, state] of changes) el.dataset.dust = state
      changes.length = 0
    }
    const set = (group, el, gone) => {
      if (gone === group.out.has(el)) return
      if (gone) group.out.add(el)
      else group.out.delete(el)
      changes.push([el, gone ? 'out' : 'in'])
    }

    const update = ({ vh }) => {
      if (dirty) {
        groups = collect(root)
        dirty = false
      }
      const line = vh * LINE
      for (const group of groups) {
        const box = group.section.getBoundingClientRect()
        if (box.top > line) {
          // seção inteira abaixo da linha: nada dela pode ter passado
          for (const el of [...group.out]) set(group, el, false)
          continue
        }
        if (box.bottom < -vh * 0.2) {
          // seção inteira acima da tela: tudo dela já passou
          if (group.out.size < group.pieces.length) for (const el of group.pieces) set(group, el, true)
          continue
        }
        for (const el of group.pieces) {
          const r = el.getBoundingClientRect()
          if (!r.height) continue
          // peça pequena: conta o meio. Peça grande (anéis e planeta das
          // Habilidades): conta a base, para voltar junto com o que está nela
          const anchor = r.height > vh * 0.4 ? r.bottom - vh * 0.12 : r.top + r.height / 2
          set(group, el, anchor < line)
        }
      }
      if (changes.length) frame.write(flush)
    }

    const off = onScroll(update)
    // só interessa quando entram ou saem elementos; texto trocado não muda as peças
    const mo = new MutationObserver((records) => {
      const structural = records.some((r) => [...r.addedNodes, ...r.removedNodes].some((n) => n.nodeType === 1))
      if (!structural) return
      dirty = true
      refreshScroll()
    })
    mo.observe(root, { childList: true, subtree: true })

    return () => {
      off()
      mo.disconnect()
      frame.cancel(flush)
      for (const el of root.querySelectorAll('[data-dust]')) delete el.dataset.dust
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
