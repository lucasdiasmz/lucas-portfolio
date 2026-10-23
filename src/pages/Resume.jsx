import { Link } from 'react-router-dom'
import { FaArrowUpRightFromSquare, FaDownload } from 'react-icons/fa6'
import PageHeader from '../components/PageHeader.jsx'
import Sheet from '../components/Sheet.jsx'
import { resume } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatYearMonth } from '../utils/date.js'

const primaryButton =
  'inline-flex items-center gap-2 bg-ink px-5 py-3 font-semibold text-paper transition-colors hover:bg-cobalt'
const secondaryButton =
  'inline-flex items-center gap-2 border border-ink px-5 py-3 font-semibold transition-colors hover:bg-ink hover:text-paper'

export default function Resume() {
  const { lang, t } = useLanguage()

  return (
    <>
      <PageHeader title={t.resume.title} subtitle={t.resume.subtitle} />

      {!resume.file ? (
        <Sheet grid className="p-6 sm:p-10">
          <p className="max-w-[60ch] text-lg">{t.resume.empty}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/projetos" className={primaryButton}>
              {t.resume.emptyProjects}
            </Link>
            <Link to="/contato" className={secondaryButton}>
              {t.resume.emptyContact}
            </Link>
          </div>
        </Sheet>
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
          <Sheet className="hidden p-3 md:block">
            <object data={resume.file} type="application/pdf" aria-label={t.resume.preview} className="h-[85vh] w-full">
              <p className="p-6 text-graphite">{t.resume.previewFallback}</p>
            </object>
          </Sheet>
        </>
      )}
    </>
  )
}
