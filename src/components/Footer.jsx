import { contacts } from '../data/profile.js'
import { sections } from '../data/sections.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import ContactIcon from './ContactIcon.jsx'
import Reveal from './Reveal.jsx'
import SectionLink from './SectionLink.jsx'

const year = new Date().getFullYear()

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-transparent to-black/60 px-6 pb-10 pt-16 md:px-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] max-w-[200vw] -translate-x-1/2 rounded-full bg-brand-600/15 blur-[140px]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.6fr_1fr_1fr]">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.35em] text-brand-400 uppercase">{t.footer.kicker}</p>
          <h2 className="mt-5 text-[clamp(1.6rem,3.6vw,2.8rem)] leading-[1.1] uppercase">
            <span className="block text-white">{t.footer.titleTop}</span>
            <span className="glow-text block text-brand-500">{t.footer.titleBottom}</span>
          </h2>
          <p className="mt-6 max-w-[48ch] text-sm text-neutral-300">{t.footer.text}</p>
        </Reveal>

        <Reveal delay={120}>
          <p className="text-[0.7rem] tracking-[0.35em] text-neutral-500 uppercase">{t.footer.navigation}</p>
          <ul className="mt-5 grid gap-3 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <SectionLink
                  id={s.id}
                  className="group inline-flex items-center gap-3 text-neutral-200 transition-colors hover:text-brand-400"
                >
                  {t.nav[s.key]}
                  <span aria-hidden="true" className="text-brand-500 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </SectionLink>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={240}>
          <p className="text-[0.7rem] tracking-[0.35em] text-neutral-500 uppercase">{t.footer.building}</p>
          <ul className="mt-5 grid gap-3 text-sm text-neutral-200">
            {t.footer.buildList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-12 max-w-6xl border-t border-brand-500/30 pt-6">
        <div className="flex flex-col justify-between gap-3 text-[0.65rem] tracking-[0.2em] text-neutral-500 uppercase sm:flex-row">
          <p>{t.footer.stack}</p>
          <p>
            {t.footer.signature} © {year}
          </p>
        </div>

        <p className="mt-8 text-[0.7rem] tracking-[0.35em] text-neutral-500 uppercase">{t.footer.socials}</p>
        <ul className="mt-6 grid grid-cols-4 place-items-center">
          {contacts.map((c) => (
            <li key={c.type}>
              <a
                href={c.href}
                target={c.type === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={c.label}
                className="grid size-12 place-items-center text-2xl text-brand-500 transition-[transform,color,filter] duration-300 hover:-translate-y-1 hover:text-brand-300 hover:drop-shadow-[0_0_12px_#548cff]"
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
