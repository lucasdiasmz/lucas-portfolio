import { useEffect, useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import SectionRail from './SectionRail.jsx'
import Footer from './Footer.jsx'
import Cursor from './Cursor.jsx'
import Intro from './Intro.jsx'
import BackgroundVideo from './BackgroundVideo.jsx'
import useDust from './useDust.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { startPointerEffects } from '../motion/pointer.js'
import { trackSections } from '../motion/sections.js'

export default function Layout() {
  const { pathname, hash } = useLocation()
  const { t } = useLanguage()

  // Ao trocar de página: vai para a seção pedida no hash, ou para o topo
  useEffect(() => {
    if (hash) {
      // Espera a página nova estar montada antes de rolar até a seção
      const timer = setTimeout(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' }),
      )
      return () => clearTimeout(timer)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, hash])

  // Luz e ímã do cursor: um listener para o site todo
  useEffect(() => startPointerEffects(), [])

  // Seções da página atual: pausa o que está fora da tela e diz qual está ativa.
  // Antes da pintura, para a navbar já nascer no estado certo ao trocar de página.
  useLayoutEffect(() => trackSections(document.getElementById('conteudo')), [pathname])

  // Conteúdo que passa do topo da tela pulveriza; volta ao rolar de volta
  useDust([pathname])

  return (
    <div className="isolate flex min-h-screen flex-col">
      <BackgroundVideo />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-on-neon"
      >
        {t.nav.skip}
      </a>
      <Intro />
      <Cursor />
      <Navbar />
      <SectionRail />
      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
