import { reducedMotion } from './env.js'

/*
 * Abertura do site: aparece uma vez por sessão. Enquanto ela cobre a tela, a
 * hero segura a própria entrada (--boot), para as duas formarem uma sequência
 * só em vez de a hero animar escondida atrás da cortina.
 */
const KEY = 'portfolio-intro'
export const BOOT_DELAY = '1.25s'

function seen() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return true // sem sessionStorage, melhor não repetir a abertura a cada página
  }
}

let playing = !seen() && !reducedMotion.get()

export const introPlaying = () => playing

export function endIntro() {
  playing = false
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    // a abertura só aparece de novo na próxima visita
  }
}
