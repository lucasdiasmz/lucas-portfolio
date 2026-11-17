import { finePointer, reducedMotion } from './env.js'
import { frame } from './frame.js'

/*
 * O cursor como fonte de luz. Dois efeitos, delegados no documento (nenhum
 * componente registra listener próprio):
 *
 * - Luz: o elemento sob o cursor recebe --lx/--ly (posição do cursor dentro
 *   dele, em px). O CSS usa isso para acender a borda e o interior do vidro.
 * - Ímã: botões e ícones são puxados alguns pixels na direção do cursor
 *   (--mx/--my) e voltam com mola ao sair.
 *
 * O alvo é resolvido só quando o cursor troca de elemento (pointerover);
 * o movimento grava no máximo uma vez por quadro.
 */
const LIGHT = '.glass, .btn-fire, [data-light]'
const MAGNET = '.btn-fire, .btn-ghost, .icon-tile, [data-magnet]'
const PULL = 0.3 // fração da distância ao centro
const REACH = 9 // deslocamento máximo, em px

export function startPointerEffects() {
  if (!finePointer.get() || reducedMotion.get()) return () => {}

  let x = 0
  let y = 0
  let lit = null
  let litRect = null
  let mag = null
  let magRect = null

  const release = () => {
    mag?.style.removeProperty('--mx')
    mag?.style.removeProperty('--my')
    mag = magRect = null
  }

  const apply = () => {
    if (lit?.isConnected) {
      litRect ??= lit.getBoundingClientRect()
      lit.style.setProperty('--lx', `${(x - litRect.left).toFixed(1)}px`)
      lit.style.setProperty('--ly', `${(y - litRect.top).toFixed(1)}px`)
    }
    if (mag?.isConnected) {
      magRect ??= mag.getBoundingClientRect()
      const dx = (x - (magRect.left + magRect.width / 2)) * PULL
      const dy = (y - (magRect.top + magRect.height / 2)) * PULL
      mag.style.setProperty('--mx', `${Math.max(-REACH, Math.min(REACH, dx)).toFixed(1)}px`)
      mag.style.setProperty('--my', `${Math.max(-REACH, Math.min(REACH, dy)).toFixed(1)}px`)
    }
  }

  const onOver = (e) => {
    if (e.pointerType === 'touch') return
    const target = e.target instanceof Element ? e.target : null
    const nextLit = target?.closest(LIGHT) ?? null
    if (nextLit !== lit) {
      lit = nextLit
      litRect = null
    }
    const nextMag = target?.closest(MAGNET) ?? null
    if (nextMag !== mag) {
      release()
      if (nextMag && !nextMag.disabled) mag = nextMag
    }
  }
  const onMove = (e) => {
    if (e.pointerType === 'touch') return
    x = e.clientX
    y = e.clientY
    if (lit || mag) frame.write(apply)
  }
  // rolar muda a posição dos elementos na tela: as caixas são lidas de novo
  const onScroll = () => {
    litRect = magRect = null
  }

  document.addEventListener('pointerover', onOver, { passive: true })
  document.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', release)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)

  return () => {
    release()
    frame.cancel(apply)
    document.removeEventListener('pointerover', onOver)
    document.removeEventListener('pointermove', onMove)
    document.documentElement.removeEventListener('pointerleave', release)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }
}
