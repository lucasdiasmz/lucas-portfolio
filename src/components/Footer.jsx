import { contacts, profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import ContactIcon from './ContactIcon.jsx'

const year = new Date().getFullYear()

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-ink-800">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-ink-300 sm:flex-row sm:px-6">
        <div className="text-center sm:text-left">
          <p>
            © {year} {profile.name}. {t.footer.rights}
          </p>
          <p className="text-xs text-ink-300/70">{t.footer.built}</p>
        </div>
        <ul className="flex items-center gap-2">
          {contacts.map((c) => (
            <li key={c.type}>
              <a
                href={c.href}
                target={c.type === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={c.label}
                className="grid h-9 w-9 place-items-center rounded-md text-ink-300 transition-colors hover:bg-ink-800 hover:text-white"
              >
                <ContactIcon type={c.type} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
