import { Link } from 'react-router-dom'
import { contacts, profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import ContactIcon from './ContactIcon.jsx'
import Shape from './Shape.jsx'
import { wrap } from '../utils/ui.js'

const year = new Date().getFullYear()

// Rodapé em campo ultramar: o convite para conversar fecha todas as páginas
export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative overflow-hidden bg-blue text-white">
      <div className="pointer-events-none absolute -right-16 -top-16 hidden w-[26rem] grid-cols-2 md:grid">
        <Shape kind="quarter" bg="blue" fg="sun" turn={1} className="aspect-square" />
        <Shape kind="circle" bg="blue" fg="red" className="aspect-square" />
        <Shape kind="half" bg="blue" fg="paper" turn={3} className="aspect-square" />
        <Shape kind="ring" bg="blue" fg="sun" className="aspect-square" />
      </div>

      <div className={`${wrap} relative py-20`}>
        <h2 className="type-display max-w-[14ch] text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.9] tracking-[-0.015em]">
          {t.footer.title}
        </h2>
        <p className="mt-5 max-w-[46ch] text-lg text-sky">{t.footer.text}</p>
        <Link
          to="/contato"
          viewTransition
          className="group mt-8 inline-flex items-center gap-3 bg-sun px-6 py-3.5 font-bold text-ink transition-[background-color,transform] duration-300 hover:bg-white active:scale-[0.97]"
        >
          {t.footer.cta}
          <span aria-hidden="true" className="size-2.5 rounded-full bg-red transition-transform duration-300 ease-spring group-hover:translate-x-1 group-hover:scale-150" />
        </Link>

        <div className="mt-20 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/25 pt-6 text-sm text-sky sm:flex-row sm:items-center">
          <p>
            © {year} {profile.name}. {t.footer.built}
          </p>
          <ul className="-ml-2 flex items-center gap-1">
            {contacts.map((c) => (
              <li key={c.type}>
                <a
                  href={c.href}
                  target={c.type === 'email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={c.label}
                  className="grid size-11 place-items-center text-xl text-white transition-[color,transform] duration-300 ease-spring hover:-translate-y-1 hover:text-sun"
                >
                  <ContactIcon type={c.type} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
