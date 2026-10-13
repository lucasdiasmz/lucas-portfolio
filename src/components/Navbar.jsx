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
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-ink-800 text-white'
      : 'text-ink-300 hover:bg-ink-800/60 hover:text-white',
  ].join(' ')
}

function LanguageSwitch() {
  const { lang, setLang, t } = useLanguage()
  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className="inline-flex rounded-md border border-ink-700 p-0.5 text-xs font-semibold"
    >
      {['pt', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={[
            'rounded px-2.5 py-1 uppercase transition-colors',
            lang === code ? 'bg-brand-500 text-white' : 'text-ink-300 hover:text-white',
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
    <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight" onClick={() => setOpen(false)}>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 font-mono text-sm text-ink-950">
            {profile.shortName.charAt(0)}
          </span>
          <span>{profile.shortName}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
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
            className="grid h-9 w-9 place-items-center rounded-md text-ink-300 hover:bg-ink-800 hover:text-white md:hidden"
            aria-label={t.nav.menu}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <FaXmark /> : <FaBars />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" className="border-t border-ink-800 px-4 py-3 md:hidden" aria-label="Principal">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={(state) => `block ${linkClass(state)}`}
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
