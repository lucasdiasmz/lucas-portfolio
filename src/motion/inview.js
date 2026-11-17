/*
 * Visibilidade: um IntersectionObserver por combinação de opções, dividido
 * entre todos os elementos (antes era um observer para cada bloco animado).
 *   watch(el, (visivel) => ..., { threshold, margin, once })
 * Devolve a função que para de observar.
 */
const pools = new Map()

function poolFor(threshold, margin) {
  const key = `${threshold}|${margin}`
  let pool = pools.get(key)
  if (!pool) {
    const targets = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const fns = targets.get(e.target)
          if (fns) for (const fn of [...fns]) fn(e.isIntersecting)
        }
      },
      { threshold, rootMargin: margin },
    )
    pool = { io, targets }
    pools.set(key, pool)
  }
  return pool
}

export function watch(el, fn, { threshold = 0, margin = '0px', once = false } = {}) {
  const { io, targets } = poolFor(threshold, margin)
  let fns = targets.get(el)
  if (!fns) {
    fns = new Set()
    targets.set(el, fns)
    io.observe(el)
  }
  const stop = () => {
    fns.delete(handler)
    if (fns.size) return
    targets.delete(el)
    io.unobserve(el)
  }
  const handler = once
    ? (hit) => {
        if (!hit) return
        stop()
        fn(true)
      }
    : fn
  fns.add(handler)
  return stop
}
