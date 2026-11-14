import { useEffect, useRef } from 'react'

// Marca o elemento com .is-in na primeira vez que ele entra na tela (ver .reveal e .assemble no CSS)
export function useReveal(threshold = 0.2) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return ref
}
