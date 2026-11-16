import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center px-6 pt-32 text-center">
      <p className="glow-text text-[clamp(5rem,20vw,10rem)] leading-none text-brand-500">404</p>
      <h1 className="mt-6 text-2xl text-white">{t.notFound.title}</h1>
      <p className="mt-3 text-sm text-neutral-400">{t.notFound.text}</p>
      <Link to="/" className="btn-fire mt-10">
        {t.notFound.back}
      </Link>
    </section>
  )
}
