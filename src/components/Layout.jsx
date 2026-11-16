import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import Cursor from './Cursor.jsx'
import Intro from './Intro.jsx'
import BackgroundVideo from './BackgroundVideo.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

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

  // Seção que já passou da linha de 30% do topo some (CSS em [data-gone]);
  // ao rolar de volta ela volta. A última fica sempre visível.
  useEffect(() => {
    const sections = [...document.querySelectorAll('#conteudo > section')].slice(0, -1)
    const io = new IntersectionObserver(
      // reavalia todas: num salto (âncora, Home) uma seção pode ir de "acima"
      // para "abaixo" sem o observer avisar
      () => {
        const line = window.innerHeight * 0.3
        for (const s of sections) s.toggleAttribute('data-gone', s.getBoundingClientRect().bottom < line)
      },
      { rootMargin: '-30% 0px 0px 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => {
      io.disconnect()
      sections.forEach((s) => s.removeAttribute('data-gone'))
    }
  }, [pathname])

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
      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
