import { useSyncExternalStore } from 'react'

/*
 * Store mínimo: um valor, quem assina é avisado quando ele muda de verdade.
 * É a base reativa do site: o DOM escreve aqui (scroll, viewport, mídia) e
 * os componentes leem com useStore, sem listener próprio.
 */
export function createStore(initial) {
  let value = initial
  const subs = new Set()
  return {
    get: () => value,
    set(next) {
      if (Object.is(next, value)) return
      value = next
      for (const fn of subs) fn(value)
    },
    subscribe(fn) {
      subs.add(fn)
      return () => subs.delete(fn)
    },
  }
}

// Media query como store (acompanha a mudança da preferência com a página aberta)
export function mediaStore(query) {
  const mq = window.matchMedia(query)
  return {
    get: () => mq.matches,
    subscribe(fn) {
      mq.addEventListener('change', fn)
      return () => mq.removeEventListener('change', fn)
    },
  }
}

export const useStore = (store) => useSyncExternalStore(store.subscribe, store.get)
