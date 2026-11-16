import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaComputerMouse, FaDownload } from 'react-icons/fa6'
import ContactIcon from '../components/ContactIcon.jsx'
import HeroPortrait from '../components/HeroPortrait.jsx'
import { contacts, profile, resume } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

// Escreve e apaga as frases de profile.typing, uma de cada vez
const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useTyping(phrases) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (calm) return
    let index = 0
    let length = 0
    let deleting = false
    let timer
    const step = () => {
      const full = phrases[index]
      length += deleting ? -1 : 1
      setText(full.slice(0, length))
      let wait = deleting ? 40 : 85
      if (!deleting && length === full.length) {
        deleting = true
        wait = 1800
      } else if (deleting && length === 0) {
        deleting = false
        index = (index + 1) % phrases.length
        wait = 400
      }
      timer = setTimeout(step, wait)
    }
    timer = setTimeout(step, 600)
    return () => clearTimeout(timer)
  }, [phrases])
  return calm ? phrases[0] : text
}

export default function Hero() {
  const { lang, pick, t } = useLanguage()
  const phrases = useMemo(() => profile.typing.map((p) => p[lang] ?? p.pt), [lang])
  const typed = useTyping(phrases)
  const [first, ...rest] = profile.name.split(' ')

  return (
    <section
      id="inicio"
      className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col-reverse items-center justify-center gap-12 px-6 pb-16 pt-32 lg:flex-row lg:justify-between lg:gap-16 lg:pt-28"
    >
      <div className="w-full max-w-xl animate-rise text-center lg:text-left">
        <p className="text-sm text-neutral-300 sm:text-base">{t.hero.greeting}</p>
        <h1 className="glow-text mt-2 text-[clamp(2.1rem,6vw,3.9rem)] leading-[1.05] tracking-wide text-brand-500">
          {first} <span className="block">{rest.join(' ')}</span>
        </h1>
        <p className="mt-5 min-h-[1.8em] text-base text-white sm:text-xl" aria-label={phrases.join(', ')}>
          <span aria-hidden="true">{typed}</span>
          <span aria-hidden="true" className="ml-1 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-blink bg-brand-500" />
        </p>
        <p className="mx-auto mt-5 max-w-[46ch] text-sm text-neutral-400 lg:mx-0">{pick(profile.tagline)}</p>

        <ul className="mt-7 flex justify-center gap-4 lg:justify-start">
          {contacts.map((c) => (
            <li key={c.type}>
              <a
                href={c.href}
                target={c.type === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={c.label}
                className="grid size-10 place-items-center rounded-lg border border-brand-500/30 bg-brand-500/10 text-lg text-brand-500 transition-[transform,background-color,color] duration-300 hover:-translate-y-1 hover:bg-brand-500 hover:text-white"
              >
                <ContactIcon type={c.type} />
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
          <a href="#contato" className="btn-fire">
            {t.hero.hire}
          </a>
          {resume.file ? (
            <a href={resume.file} download className="btn-ghost">
              <FaDownload aria-hidden="true" /> {t.hero.cv}
            </a>
          ) : (
            <Link to="/curriculo" className="btn-ghost">
              {t.hero.cv}
            </Link>
          )}
        </div>
      </div>

      {/* Retrato que sai da moldura, com órbita, tecnologias e raio-x */}
      <HeroPortrait />

      <a
        href="#sobre"
        aria-label={t.hero.scroll}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] tracking-[0.3em] text-neutral-500 uppercase transition-colors hover:text-brand-400 lg:flex"
      >
        <FaComputerMouse aria-hidden="true" className="animate-bounce text-lg text-brand-500" />
        {t.hero.scroll}
      </a>
    </section>
  )
}
