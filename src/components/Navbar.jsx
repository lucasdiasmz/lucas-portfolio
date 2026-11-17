import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FaArrowUp, FaBars, FaXmark } from 'react-icons/fa6'
import Logo from './Logo.jsx'
import RollText from './RollText.jsx'
import SectionLink from './SectionLink.jsx'
import { sections } from '../data/sections.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { reducedMotion } from '../motion/env.js'
import { onScroll } from '../motion/scroll.js'
import { heroInView } from '../motion/sections.js'
import { useStore } from '../motion/store.js'

/*
 * Pílula de vidro flutuante com brilho que atravessa, links com letras que
 * rolam e botão de idioma em gradiente. Na home só aparece enquanto a hero
 * está na tela (daí em diante quem navega é o trilho lateral, e no celular o
 * botão de voltar ao topo); nas outras páginas some ao rolar para baixo e
 * volta ao subir. Nenhum estado muda a cada quadro de rolagem.
 */
export default function Navbar() {
  const { lang, setLang, t } = useLanguage()
  const { pathname } = useLocation()
  const home = pathname === '/'
  const header = useRef(null)
  const [open, setOpen] = useState(false)
  const heroVisible = useStore(heroInView)
  const [scrolledAway, setScrolledAway] = useState(false)

  // Fora da home: esconde ao descer, mostra ao subir (o estado só muda na virada)
  useEffect(() => {
    if (home) return
    return onScroll(({ y, dir }) => setScrolledAway(y > 160 && dir > 0))
  }, [home])

  const hidden = home ? !heroVisible : scrolledAway

  // Menu do celular: Esc ou toque fora fecham
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onDown = (e) => !header.current?.contains(e.target) && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const links = sections.filter((s) => s.id !== 'inicio')
  const toTop = () => window.scrollTo({ top: 0, behavior: reducedMotion.get() ? 'auto' : 'smooth' })

  return (
    <>
      <header
        ref={header}
        className={[
          'fixed inset-x-0 top-0 z-40 px-4 pt-4 transition-transform duration-500 ease-[var(--ease-out-expo)] sm:pt-5',
          hidden && !open ? '-translate-y-[130%]' : 'translate-y-0',
        ].join(' ')}
      >
        <nav
          aria-label={t.nav.main}
          className="navbar relative mx-auto flex max-w-6xl items-center justify-between rounded-full py-2.5 pl-3 pr-3 text-white sm:pl-4"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <div className="navbar-shine" />
          </div>

          <SectionLink id="inicio" className="relative flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <Logo className="size-9 drop-shadow-[0_0_10px_color-mix(in_srgb,var(--color-ember)_60%,transparent)]" />
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
              className="overflow-hidden rounded-full bg-gradient-to-r from-ember to-flame px-4 py-1.5 text-xs text-on-neon transition-[scale] duration-200 hover:scale-105 active:scale-95"
            >
              {/* key: a sigla nova sobe no lugar da antiga */}
              <span key={lang} className="swap-in">
                {lang === 'pt' ? 'PT' : 'EN'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? t.nav.close : t.nav.menu}
              className="grid size-9 place-items-center rounded-full border border-white/20 transition-[scale,border-color] duration-200 active:scale-90 aria-expanded:border-brand-500/70 md:hidden"
            >
              {open ? <FaXmark /> : <FaBars />}
            </button>
          </div>
        </nav>

        {/* Menu do celular */}
        <div id="menu-mobile" inert={!open} data-open={open || undefined} className="menu-sheet glass mx-auto mt-3 max-w-6xl p-3 md:hidden">
          <ul className="grid gap-1">
            {sections.map((s, i) => (
              <li key={s.id} style={{ '--i': i }}>
                <SectionLink
                  id={s.id}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors hover:bg-white/5 hover:text-brand-400 active:bg-white/10"
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

      {/* Celular: sem navbar depois da hero, este botão leva de volta a ela */}
      <button
        type="button"
        onClick={toTop}
        aria-label={t.nav.top}
        tabIndex={hidden ? 0 : -1}
        data-show={hidden || undefined}
        className="to-top fixed bottom-5 right-4 z-40 grid size-11 place-items-center rounded-full border border-white/15 bg-black/75 text-brand-400 shadow-[0_0_22px_-6px_var(--color-ember)] md:hidden"
      >
        <FaArrowUp aria-hidden="true" />
      </button>
    </>
  )
}
