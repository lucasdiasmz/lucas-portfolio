import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import Cursor from './Cursor.jsx'
import Intro from './Intro.jsx'
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

  return (
    <div className="flex min-h-screen flex-col">
      <div aria-hidden="true" className="site-bg" />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-orange-600 focus:px-4 focus:py-2 focus:text-white"
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
