import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <section className="py-16 text-center">
      <p className="font-mono text-6xl font-bold text-brand-400">404</p>
      <h1 className="mt-4 text-2xl font-bold">{t.notFound.title}</h1>
      <p className="mt-2 text-ink-300">{t.notFound.text}</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-400"
      >
        {t.notFound.back}
      </Link>
    </section>
  )
}
