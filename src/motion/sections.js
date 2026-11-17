import { watch } from './inview.js'
import { createStore } from './store.js'

// Seção que cruza a linha de leitura (45% da altura da tela); null fora da home
export const activeSection = createStore(null)
// A hero ainda ocupa a parte de cima da tela? (controla a navbar na home)
export const heroInView = createStore(true)

/*
 * Liga o acompanhamento das seções da página atual:
 * - [data-idle] em toda seção fora da tela: o CSS pausa as animações em laço
 *   dela (órbitas, flutuações, brilhos), que só voltam quando ela reaparece;
 * - activeSection e heroInView, para o trilho lateral e a navbar.
 */
export function trackSections(root) {
  const stops = []
  const blocks = [...root.querySelectorAll(':scope > section'), ...document.querySelectorAll('footer')]

  for (const el of blocks) {
    stops.push(watch(el, (hit) => el.toggleAttribute('data-idle', !hit), { margin: '15% 0px' }))
    if (el.id && el.tagName === 'SECTION') {
      stops.push(watch(el, (hit) => hit && activeSection.set(el.id), { margin: '-45% 0px -55% 0px' }))
    }
  }

  const hero = root.querySelector('#inicio')
  if (hero) stops.push(watch(hero, (hit) => heroInView.set(hit), { margin: '-35% 0px 0px 0px' }))
  heroInView.set(Boolean(hero))

  return () => {
    for (const stop of stops) stop()
    for (const el of blocks) el.removeAttribute('data-idle')
    activeSection.set(null)
  }
}
