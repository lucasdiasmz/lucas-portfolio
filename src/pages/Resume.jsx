import { FaArrowUpRightFromSquare, FaDownload } from 'react-icons/fa6'
import SectionLink from '../components/SectionLink.jsx'
import SplitTitle from '../components/SplitTitle.jsx'
import { resume } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatYearMonth } from '../utils/date.js'

export default function Resume() {
  const { lang, t } = useLanguage()

  return (
    <section className="mx-auto max-w-5xl px-6 pb-24 pt-40">
      <SplitTitle as="h1" text={t.resume.title} />
      <p className="mx-auto mt-6 max-w-xl text-center text-sm text-neutral-400">{t.resume.subtitle}</p>

      <div className="mt-14">
        {!resume.file ? (
          <div className="glass relative overflow-hidden p-8 text-center sm:p-12">
            <div aria-hidden="true" className="aura -top-72 left-1/2 size-[40rem] -translate-x-1/2" />
            <p className="relative mx-auto max-w-[44ch] text-base leading-relaxed text-neutral-200">{t.resume.empty}</p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <SectionLink id="projetos" className="btn-fire">
                {t.resume.emptyProjects}
              </SectionLink>
              <SectionLink id="contato" className="btn-ghost">
                {t.resume.emptyContact}
              </SectionLink>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <a href={resume.file} download className="btn-fire">
                <FaDownload aria-hidden="true" />
                {t.resume.download}
              </a>
              <a href={resume.file} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <FaArrowUpRightFromSquare aria-hidden="true" />
                {t.resume.open}
              </a>
              {resume.updated && (
                <p className="text-xs text-neutral-400 sm:ml-auto">
                  {t.resume.updated} {formatYearMonth(resume.updated, lang)}
                </p>
              )}
            </div>

            {/* Visualização embutida só em telas maiores; no celular os botões acima bastam */}
            <div className="glass hidden p-3 md:block">
              <object data={resume.file} type="application/pdf" aria-label={t.resume.preview} className="h-[85vh] w-full rounded-xl">
                <p className="p-6 text-neutral-400">{t.resume.previewFallback}</p>
              </object>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
