import { mediaStore, useStore } from './store.js'

// Preferências do ambiente, num lugar só
export const reducedMotion = mediaStore('(prefers-reduced-motion: reduce)')
export const finePointer = mediaStore('(pointer: fine)')

export const useReducedMotion = () => useStore(reducedMotion)
