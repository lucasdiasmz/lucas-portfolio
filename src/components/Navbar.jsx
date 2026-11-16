import { useEffect, useState } from 'react'
import { FaBars, FaXmark } from 'react-icons/fa6'
import Logo from './Logo.jsx'
import RollText from './RollText.jsx'
import SectionLink from './SectionLink.jsx'
import { sections } from '../data/sections.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

// Pílula de vidro flutuante com brilho que atravessa, links com letras que rolam
// e botão de idioma em gradiente. Some ao rolar para baixo e volta ao subir.
export default function Navbar() {
  const { lang, setLang, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > 160 && y > last)
      last = y
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? y / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const links = sections.filter((s) => s.id !== 'inicio')

  return (
    <>
      {/* Barra de progresso de leitura na lateral direita */}
      <div aria-hidden="true" className="fixed right-1 top-0 z-50 hidden h-screen w-[3px] sm:block">
        <div
          className="h-full w-full origin-top rounded-full bg-gradient-to-b from-brand-400 to-brand-700 shadow-[0_0_10px_#548cff]"
          style={{ transform: `scaleY(${progress})` }}
        />
      </div>

      <header
        className={[
          'fixed inset-x-0 top-0 z-40 px-4 pt-4 transition-transform duration-500 ease-[var(--ease-out-expo)] sm:pt-5',
          hidden && !open ? '-translate-y-[130%]' : 'translate-y-0',
        ].join(' ')}
      >
        <nav
          aria-label={t.nav.home}
          className="navbar relative mx-auto flex max-w-6xl items-center justify-between rounded-full py-2.5 pl-3 pr-3 text-white sm:pl-4"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <div className="navbar-shine" />
          </div>

          <SectionLink id="inicio" className="relative flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <Logo className="size-9 drop-shadow-[0_0_10px_rgb(84_140_255/0.6)]" />
            <span className="hidden text-xs tracking-[0.3em] text-neutral-200 sm:inline">LUCAS</span>
          </SectionLink>

          <ul className="relative hidden items-center gap-6 text-[0.74rem] md:flex lg:gap-9">
            {links.map((s) => (
              <li key={s.id}>
                <SectionLink id={s.id} className="roll-host">
                  <RollText>{t.nav[s.key]}</RollText>
                </SectionLink>
              </li>
            ))}
          </ul>

          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              aria-label={t.nav.language}
              className="rounded-full bg-gradient-to-r from-ember to-flame px-4 py-1.5 text-xs transition-transform hover:scale-105"
            >
              {lang === 'pt' ? 'PT' : 'EN'}
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? t.nav.close : t.nav.menu}
              className="grid size-9 place-items-center rounded-full border border-white/20 md:hidden"
            >
              {open ? <FaXmark /> : <FaBars />}
            </button>
          </div>
        </nav>

        {/* Menu do celular */}
        <div id="menu-mobile" hidden={!open} className="glass mx-auto mt-3 max-w-6xl p-3 md:hidden">
          <ul className="grid gap-1">
            {sections.map((s) => (
              <li key={s.id}>
                <SectionLink
                  id={s.id}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm hover:bg-white/5 hover:text-brand-400"
                >
                  {t.nav[s.key]}
                  <span aria-hidden="true" className="text-brand-500">
                    →
                  </span>
                </SectionLink>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </>
  )
}
