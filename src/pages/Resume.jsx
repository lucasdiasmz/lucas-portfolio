import { Link } from 'react-router-dom'
import { FaArrowUpRightFromSquare, FaDownload } from 'react-icons/fa6'
import PageHeader from '../components/PageHeader.jsx'
import { resume } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatYearMonth } from '../utils/date.js'
import { buttonDot, primaryButton, secondaryButton, wrap } from '../utils/ui.js'

export default function Resume() {
  const { lang, t } = useLanguage()

  return (
    <>
      <PageHeader title={t.resume.title} subtitle={t.resume.subtitle} color="sun" shapes={['arch', 'dot', 'leaf']} />

      <div className={wrap}>
      {!resume.file ? (
        <div className="bg-sun p-8 sm:p-12">
          <p className="max-w-[48ch] text-xl font-semibold leading-snug sm:text-2xl">{t.resume.empty}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link to="/projetos" viewTransition className={primaryButton}>
              {t.resume.emptyProjects}
              <span aria-hidden="true" className={buttonDot} />
            </Link>
            <Link to="/contato" viewTransition className={secondaryButton}>
              {t.resume.emptyContact}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <a href={resume.file} download className={primaryButton}>
              <FaDownload aria-hidden="true" />
              {t.resume.download}
            </a>
            <a href={resume.file} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
              <FaArrowUpRightFromSquare aria-hidden="true" className="text-sm" />
              {t.resume.open}
            </a>
            {resume.updated && (
              <p className="text-graphite sm:ml-auto">
                {t.resume.updated} {formatYearMonth(resume.updated, lang)}
              </p>
            )}
          </div>

          {/* Visualização embutida só em telas maiores; no celular os botões acima bastam */}
          <div className="hidden bg-white p-3 md:block">
            <object data={resume.file} type="application/pdf" aria-label={t.resume.preview} className="h-[85vh] w-full">
              <p className="p-6 text-graphite">{t.resume.previewFallback}</p>
            </object>
          </div>
        </>
      )}
      </div>
    </>
  )
}
