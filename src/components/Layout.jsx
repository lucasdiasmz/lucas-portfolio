import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Layout() {
  const { pathname } = useLocation()
  const { t } = useLanguage()

  // Volta ao topo a cada troca de página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        {t.nav.skip}
      </a>
      <Navbar />
      <main id="conteudo" className="flex-1 pb-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
