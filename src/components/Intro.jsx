import { useEffect, useState } from 'react'
import Logo from './Logo.jsx'
import { profile } from '../data/profile.js'
import { endIntro, introPlaying } from '../motion/boot.js'

// Abertura curta com a marca; aparece uma vez por sessão e sai do DOM ao terminar
export default function Intro() {
  const [show, setShow] = useState(introPlaying)

  useEffect(() => {
    if (!show) return
    // reserva caso o fim da animação não chegue (aba em segundo plano, por exemplo)
    const timer = setTimeout(() => setShow(false), 2600)
    return () => clearTimeout(timer)
  }, [show])

  useEffect(() => {
    if (!show) endIntro()
  }, [show])

  if (!show) return null
  return (
    <div
      aria-hidden="true"
      onAnimationEnd={(e) => e.animationName === 'intro-out' && setShow(false)}
      className="intro fixed inset-0 z-[90] grid place-items-center bg-night bg-[radial-gradient(circle_at_50%_45%,color-mix(in_srgb,var(--color-ember)_22%,transparent),transparent_45%)]"
    >
      <div className="flex flex-col items-center gap-8">
        <Logo className="intro-mark size-24 drop-shadow-[0_0_24px_color-mix(in_srgb,var(--color-ember)_70%,transparent)]" />
        <p className="intro-word text-5xl tracking-[0.25em] text-neutral-200 sm:text-7xl">{profile.shortName.toUpperCase()}</p>
      </div>
    </div>
  )
}
