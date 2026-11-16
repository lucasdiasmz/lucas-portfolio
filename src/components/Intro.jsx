import { useEffect, useState } from 'react'
import Logo from './Logo.jsx'
import { profile } from '../data/profile.js'

const KEY = 'portfolio-intro'

function seenIntro() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return true
  }
}

// Abertura curta com a marca; aparece uma vez por sessão e some sozinha
export default function Intro() {
  const [show] = useState(() => !seenIntro())
  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      // sem sessionStorage a abertura só aparece de novo na próxima visita
    }
  }, [])
  if (!show) return null
  return (
    <div
      aria-hidden="true"
      className="intro fixed inset-0 z-[90] grid place-items-center bg-night bg-[radial-gradient(circle_at_50%_45%,color-mix(in_srgb,var(--color-ember)_22%,transparent),transparent_45%)]"
    >
      <div className="flex flex-col items-center gap-8">
        <Logo className="intro-mark size-24 drop-shadow-[0_0_24px_color-mix(in_srgb,var(--color-ember)_70%,transparent)]" />
        <p className="intro-word text-5xl tracking-[0.25em] text-neutral-200 sm:text-7xl">{profile.shortName.toUpperCase()}</p>
      </div>
    </div>
  )
}
