import { Link } from 'react-router-dom'
import Shape from '../components/Shape.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { buttonDot, primaryButton, wrap } from '../utils/ui.js'

// 404 com uma peça faltando no mosaico: a peça que falta é a página
export default function NotFound() {
  const { t } = useLanguage()
  return (
    <section className={`${wrap} grid items-center gap-12 py-16 md:grid-cols-2`}>
      <div className="grid w-full max-w-sm grid-cols-3">
        <Shape kind="quarter" bg="red" fg="sun" turn={1} className="aspect-square animate-pop" />
        <Shape kind="circle" bg="paper" fg="blue" className="aspect-square animate-pop [animation-delay:80ms]" />
        <Shape kind="arch" bg="sun" fg="ink" className="aspect-square animate-pop [animation-delay:160ms]" />
        <Shape kind="half" bg="ink" fg="paper" turn={2} className="aspect-square animate-pop [animation-delay:240ms]" />
        <div aria-hidden="true" className="aspect-square border-[3px] border-dashed border-ink/40" />
        <Shape kind="leaf" bg="green" fg="paper" className="aspect-square animate-pop [animation-delay:320ms]" />
      </div>
      <div>
        <p className="type-display text-[clamp(5rem,14vw,6rem)] font-extrabold leading-none tracking-[-0.015em] text-red">404</p>
        <h1 className="type-tight mt-2 text-4xl font-extrabold tracking-[-0.02em]">{t.notFound.title}</h1>
        <p className="mt-3 text-lg text-graphite">{t.notFound.text}</p>
        <Link to="/" viewTransition className={`${primaryButton} mt-8`}>
          {t.notFound.back}
          <span aria-hidden="true" className={buttonDot} />
        </Link>
      </div>
    </section>
  )
}
