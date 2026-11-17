import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaComputerMouse, FaDownload } from 'react-icons/fa6'
import ContactLinks from '../components/ContactLinks.jsx'
import HeroPortrait from '../components/HeroPortrait.jsx'
import Typing from '../components/Typing.jsx'
import { profile, resume } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { BOOT_DELAY, introPlaying } from '../motion/boot.js'

export default function Hero() {
  const { lang, pick, t } = useLanguage()
  const phrases = useMemo(() => profile.typing.map((p) => p[lang] ?? p.pt), [lang])
  const [first, ...rest] = profile.name.split(' ')
  // Na primeira visita a abertura cobre a tela: a entrada da hero espera por ela
  const [boot] = useState(() => (introPlaying() ? BOOT_DELAY : '0s'))

  return (
    <section
      id="inicio"
      style={{ '--boot': boot }}
      className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col-reverse items-center justify-center gap-12 px-6 pb-16 pt-32 lg:flex-row lg:justify-between lg:gap-16 lg:pt-28"
    >
      {/* Cada bloco entra depois do anterior (ver .hero-seq) */}
      <div className="hero-seq w-full max-w-xl text-center lg:text-left">
        <p className="text-sm text-neutral-300 sm:text-base">{t.hero.greeting}</p>
        <h1 className="mt-2 text-[clamp(2.3rem,6.4vw,4.2rem)] leading-[1.02] tracking-wide">
          {first} <span className="block">{rest.join(' ')}</span>
        </h1>
        <Typing phrases={phrases} className="mt-5 min-h-[1.8em] text-base text-white sm:text-xl" />
        <p className="mx-auto mt-5 max-w-[46ch] text-sm text-neutral-400 lg:mx-0">{pick(profile.tagline)}</p>

        <ContactLinks className="mt-7 flex justify-center gap-4 lg:justify-start" />

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
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.62rem] tracking-[0.3em] text-neutral-400 uppercase transition-colors hover:text-brand-400 lg:flex"
      >
        <FaComputerMouse aria-hidden="true" className="animate-bounce text-lg text-brand-500" />
        {t.hero.scroll}
      </a>
    </section>
  )
}
