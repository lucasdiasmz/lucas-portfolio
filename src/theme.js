/*
 * Ponte entre os tokens de cor (@theme em src/index.css) e o JavaScript.
 * Canvas e SVG não entendem var() em todo lugar, então aqui a cor é lida do
 * CSS já resolvida. Nenhuma cor é definida neste arquivo: trocar a paleta é
 * mexer só no @theme.
 *
 *   token('ember')        -> 'rgb(0, 240, 255)'
 *   rgba('ember', 0.3)    -> 'rgb(0 240 255 / 0.3)'
 *   rgbOf('ember')        -> [0, 240, 255]
 *   cssVar('ember')       -> 'var(--color-ember)'  (para style/SVG no React)
 */

const cache = new Map()
let probe = null

const name = (t) => (t.startsWith('--') ? t : `--color-${t}`)

export const cssVar = (t) => `var(${name(t)})`

// Resolve o token num elemento oculto: o navegador entrega sempre "rgb(r, g, b)"
export function rgbOf(t) {
  const key = name(t)
  let rgb = cache.get(key)
  if (rgb) return rgb
  if (!probe) {
    probe = document.createElement('span')
    probe.style.display = 'none'
    document.documentElement.appendChild(probe)
  }
  probe.style.color = ''
  probe.style.color = `var(${key})`
  rgb = (getComputedStyle(probe).color.match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map(Number)
  cache.set(key, rgb)
  return rgb
}

export const token = (t) => `rgb(${rgbOf(t).join(', ')})`

export const rgba = (t, a) => `rgb(${rgbOf(t).join(' ')} / ${a})`
