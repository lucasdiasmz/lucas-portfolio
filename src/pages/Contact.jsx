import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import ContactIcon from '../components/ContactIcon.jsx'
import { contacts } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

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
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-100">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-erro`} role="alert" className="mt-1.5 text-sm text-rose-400">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass = (hasError) =>
  [
    'w-full rounded-lg border bg-ink-900 px-3.5 py-2.5 text-sm text-white placeholder:text-ink-300/50',
    'focus:outline-none focus:ring-2 focus:ring-brand-500',
    hasError ? 'border-rose-500' : 'border-ink-700',
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
      <PageHeader title={t.contact.title} subtitle={t.contact.subtitle} />

      <div className="grid gap-8 lg:grid-cols-5">
        <section className="lg:col-span-2" aria-labelledby="canais">
          <h2 id="canais" className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent-400">
            {t.contact.channels}
          </h2>
          <ul className="grid gap-3">
            {contacts.map((c) => (
              <li key={c.type}>
                <a
                  href={c.href}
                  target={c.type === 'email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-ink-800 bg-ink-900/70 p-4 transition-colors hover:border-brand-500"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-ink-800 text-xl text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <ContactIcon type={c.type} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{c.label}</span>
                    <span className="block truncate text-sm text-ink-300">{c.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-3" aria-labelledby="formulario">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-ink-800 bg-ink-900/70 p-5 sm:p-6"
          >
            <h2 id="formulario" className="mb-5 text-lg font-bold">
              {t.contact.formTitle}
            </h2>

            <div className="grid gap-4">
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
              className="mt-6 w-full rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {sending ? t.contact.sending : t.contact.send}
            </button>

            <div aria-live="polite" className="mt-4 min-h-6 text-sm">
              {status === 'success' && <p className="text-emerald-400">{t.contact.success}</p>}
              {status === 'error' && <p className="text-rose-400">{t.contact.error}</p>}
              {status === 'notConfigured' && <p className="text-amber-400">{t.contact.notConfigured}</p>}
            </div>
          </form>
        </section>
      </div>
    </>
  )
}
