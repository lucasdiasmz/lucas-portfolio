import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <section className="py-12">
      <p className="type-condensed text-[clamp(7rem,25vw,14rem)] font-black leading-none text-cobalt">404</p>
      <h1 className="type-condensed mt-2 text-5xl font-extrabold tracking-tight">{t.notFound.title}</h1>
      <p className="mt-3 text-lg text-graphite">{t.notFound.text}</p>
      <Link
        to="/"
        className="mt-8 inline-block bg-ink px-5 py-3 font-semibold text-paper transition-colors hover:bg-cobalt"
      >
        {t.notFound.back}
      </Link>
    </section>
  )
}
