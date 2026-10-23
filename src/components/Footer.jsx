import { contacts, profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import ContactIcon from './ContactIcon.jsx'

const year = new Date().getFullYear()

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 text-sm text-graphite sm:flex-row sm:items-center sm:px-8">
        <div>
          <p>
            © {year} {profile.name}. {t.footer.rights}
          </p>
          <p>{t.footer.built}</p>
        </div>
        <ul className="-ml-2 flex items-center gap-1 sm:ml-0">
          {contacts.map((c) => (
            <li key={c.type}>
              <a
                href={c.href}
                target={c.type === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={c.label}
                className="grid size-10 place-items-center text-lg text-graphite transition-colors hover:text-cobalt"
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
