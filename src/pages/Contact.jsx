import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import ContactIcon from '../components/ContactIcon.jsx'
import Shape from '../components/Shape.jsx'
import { contacts } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { buttonDot, primaryButton, wrap } from '../utils/ui.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}
const emailjsReady = Object.values(emailjsConfig).every(
  (v) => typeof v === 'string' && v.length > 0 && !v.endsWith('_aqui'),
)

// Retorna a chave de erro (dentro de t.contact.validation) ou '' se o campo estiver válido
function validateField(field, value) {
  const v = value.trim()
  if (field === 'name') {
    if (!v) return 'nameRequired'
    if (v.length < 2) return 'nameShort'
  }
  if (field === 'email') {
    if (!v) return 'emailRequired'
    if (!EMAIL_RE.test(v)) return 'emailInvalid'
  }
  if (field === 'message') {
    if (!v) return 'messageRequired'
    if (v.length < 10) return 'messageShort'
  }
  return ''
}

const initialValues = { name: '', email: '', message: '' }
const fields = ['name', 'email', 'message']

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-bold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-erro`} role="alert" className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass = (hasError) =>
  [
    'w-full border-0 border-b-[3px] bg-paper px-4 py-3 text-ink placeholder:text-graphite transition-colors',
    'focus:border-blue focus:bg-sky/40 focus:outline-none',
    hasError ? 'border-danger' : 'border-ink',
  ].join(' ')

export default function Contact() {
  const { t } = useLanguage()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error | notConfigured

  const errorText = (field) => (errors[field] ? t.contact.validation[errors[field]] : '')

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // Limpa o erro assim que o usuário corrige o campo
    if (errors[name] && !validateField(name, value)) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (status === 'success' || status === 'error') setStatus('idle')
  }

  function handleBlur(e) {
    const { name, value } = e.target
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'sending') return

    const nextErrors = Object.fromEntries(fields.map((f) => [f, validateField(f, values[f])]))
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      document.getElementById(fields.find((f) => nextErrors[f]))?.focus()
      return
    }

    // Campo invisível: se um robô preencheu, finge que deu certo e não envia nada
    if (honeypot) {
      setStatus('success')
      setValues(initialValues)
      return
    }

    if (!emailjsReady) {
      setStatus('notConfigured')
      return
    }

    setStatus('sending')
    try {
      const { default: emailjs } = await import('@emailjs/browser')
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          from_name: values.name.trim(),
          from_email: values.email.trim(),
          reply_to: values.email.trim(),
          message: values.message.trim(),
        },
        { publicKey: emailjsConfig.publicKey },
      )
      setStatus('success')
      setValues(initialValues)
      setErrors({})
    } catch {
      setStatus('error')
    }
  }

  const sending = status === 'sending'

  return (
    <>
      <PageHeader title={t.contact.title} subtitle={t.contact.subtitle} color="green" shapes={['half', 'circle', 'arch']} />

      <div className={`${wrap} grid gap-12 lg:grid-cols-5 lg:gap-16`}>
        <section className="lg:col-span-2" aria-labelledby="canais">
          <h2 id="canais" className="type-tight mb-6 text-[2rem] font-extrabold leading-tight tracking-[-0.02em]">
            {t.contact.channels}
          </h2>
          <ul className="border-t border-rule">
            {contacts.map((c, i) => (
              <li key={c.type} className="border-b border-rule">
                <a
                  href={c.href}
                  target={c.type === 'email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-4"
                >
                  <span
                    className={[
                      'grid size-12 shrink-0 place-items-center text-xl text-white transition-transform duration-500 ease-spring group-hover:-rotate-12 group-hover:scale-110',
                      ['bg-red', 'bg-green', 'bg-blue', 'bg-ink'][i % 4],
                      i % 2 ? 'rounded-full' : 'rounded-tl-full',
                    ].join(' ')}
                  >
                    <ContactIcon type={c.type} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{c.label}</span>
                    <span className="block truncate text-graphite group-hover:text-ink group-hover:underline group-hover:underline-offset-4">
                      {c.value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-3" aria-labelledby="formulario">
          <form onSubmit={handleSubmit} noValidate className="relative bg-white p-6 sm:p-10">
            <Shape kind="quarter" bg="green" fg="sun" turn={1} className="absolute right-0 top-0 size-14 sm:size-20" />
            <h2 id="formulario" className="type-tight mb-8 pr-16 text-[2rem] font-extrabold leading-tight tracking-[-0.02em]">
              {t.contact.formTitle}
            </h2>

            <div className="grid gap-5">
              <Field id="name" label={t.contact.name} error={errorText('name')}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t.contact.namePlaceholder}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-erro' : undefined}
                  className={inputClass(errors.name)}
                />
              </Field>

              <Field id="email" label={t.contact.email} error={errorText('email')}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t.contact.emailPlaceholder}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-erro' : undefined}
                  className={inputClass(errors.email)}
                />
              </Field>

              <Field id="message" label={t.contact.message} error={errorText('message')}>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t.contact.messagePlaceholder}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-erro' : undefined}
                  className={`${inputClass(errors.message)} resize-y`}
                />
              </Field>

              {/* Armadilha para robôs: humanos não veem nem preenchem */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className={`${primaryButton} mt-8 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto`}
            >
              {sending ? t.contact.sending : t.contact.send}
              <span aria-hidden="true" className={`${buttonDot} ${sending ? 'animate-ping' : ''}`} />
            </button>

            <div aria-live="polite" className="mt-4 min-h-6 font-medium">
              {status === 'success' && (
                <p className="flex animate-rise items-center gap-3 text-success">
                  <Shape kind="circle" fg="green" className="size-5 animate-pop" />
                  {t.contact.success}
                </p>
              )}
              {status === 'error' && <p className="text-danger">{t.contact.error}</p>}
              {status === 'notConfigured' && <p className="text-warning">{t.contact.notConfigured}</p>}
            </div>
          </form>
        </section>
      </div>
    </>
  )
}
