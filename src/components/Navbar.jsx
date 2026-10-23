import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FaBars, FaXmark } from 'react-icons/fa6'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { profile } from '../data/profile.js'

const links = [
  { to: '/', key: 'about', end: true },
  { to: '/projetos', key: 'projects' },
  { to: '/experiencias', key: 'experiences' },
  { to: '/contato', key: 'contact' },
]

function linkClass({ isActive }) {
  return [
    'border-b-2 py-1 text-[0.95rem] font-medium transition-colors',
    isActive ? 'border-cobalt text-ink' : 'border-transparent text-graphite hover:text-ink',
  ].join(' ')
}

function LanguageSwitch() {
  const { lang, setLang, t } = useLanguage()
  return (
    <div role="group" aria-label={t.nav.language} className="inline-flex border border-ink text-xs font-semibold">
      {['pt', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={[
            'type-wide px-2.5 py-1 uppercase transition-colors',
            lang === code ? 'bg-ink text-paper' : 'text-graphite hover:text-ink',
          ].join(' ')}
        >
          {code}
        </button>
      ))}
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link
          to="/"
          className="type-condensed text-[1.4rem] font-extrabold leading-none tracking-tight"
          onClick={() => setOpen(false)}
        >
          {profile.name}
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {t.nav[l.key]}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <button
              type="button"
              className="grid size-9 place-items-center text-ink md:hidden"
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
        <nav id="menu-mobile" className="border-t border-rule px-4 pb-4 md:hidden" aria-label="Principal">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.to} className="border-b border-rule">
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    [
                      'type-semicondensed block py-3 text-xl font-bold',
                      isActive ? 'text-cobalt' : 'text-ink',
                    ].join(' ')
                  }
                  onClick={() => setOpen(false)}
                >
                  {t.nav[l.key]}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
