import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FaBars, FaXmark } from 'react-icons/fa6'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { profile } from '../data/profile.js'
import { wrap } from '../utils/ui.js'

// Cada seção tem a sua cor; o ponto colorido marca a página atual
const links = [
  { to: '/', key: 'about', end: true, color: 'bg-red' },
  { to: '/projetos', key: 'projects', color: 'bg-blue' },
  { to: '/curriculo', key: 'resume', color: 'bg-sun' },
  { to: '/contato', key: 'contact', color: 'bg-green' },
]

// Marca: três formas do sistema visual
function Mark() {
  return (
    <span aria-hidden="true" className="grid size-8 grid-cols-2 grid-rows-2 transition-transform duration-500 ease-spring group-hover:rotate-90">
      <span className="rounded-tl-full bg-red" />
      <span className="rounded-full bg-sun" />
      <span className="bg-blue" />
      <span className="rounded-br-full bg-ink" />
    </span>
  )
}

function LanguageSwitch() {
  const { lang, setLang, t } = useLanguage()
  return (
    <div role="group" aria-label={t.nav.language} className="inline-flex text-sm font-semibold">
      {['pt', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={[
            'px-2.5 py-1 uppercase transition-colors',
            lang === code ? 'bg-ink text-white' : 'text-graphite hover:text-ink',
          ].join(' ')}
        >
          {code}
        </button>
      ))}
    </div>
  )
}

function NavItem({ link, onClick, large = false }) {
  const { t } = useLanguage()
  return (
    <NavLink
      to={link.to}
      end={link.end}
      viewTransition
      onClick={onClick}
      className={({ isActive }) =>
        [
          'group/link flex items-center gap-2.5 font-semibold transition-colors',
          large ? 'py-3 text-3xl' : 'py-1 text-[0.95rem]',
          isActive ? 'text-ink' : 'text-graphite hover:text-ink',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <span
            aria-hidden="true"
            className={[
              'size-2.5 rounded-full transition-transform duration-300 ease-spring',
              link.color,
              isActive ? 'scale-100' : 'scale-0 group-hover/link:scale-75',
            ].join(' ')}
          />
          {t.nav[link.key]}
        </>
      )}
    </NavLink>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <div className={`${wrap} flex h-16 items-center justify-between`}>
        <Link
          to="/"
          viewTransition
          className="group flex items-center gap-3 text-lg font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <Mark />
          {profile.name}
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
            {links.map((l) => (
              <NavItem key={l.to} link={l} />
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <button
              type="button"
              className="grid size-10 place-items-center text-xl text-ink md:hidden"
              aria-label={t.nav.menu}
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <FaXmark /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" className="border-t border-rule px-4 pb-6 pt-2 md:hidden" aria-label="Principal">
          <ul className="flex flex-col">
            {links.map((l, i) => (
              <li key={l.to} className="animate-rise" style={{ animationDelay: `${i * 50}ms` }}>
                <NavItem link={l} large onClick={() => setOpen(false)} />
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
