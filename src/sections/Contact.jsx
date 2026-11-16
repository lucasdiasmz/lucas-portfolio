import { useState } from 'react'
import { FaPaperPlane } from 'react-icons/fa6'
import ContactIcon from '../components/ContactIcon.jsx'
import Reveal from '../components/Reveal.jsx'
import SplitTitle from '../components/SplitTitle.jsx'
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

const inputClass = (hasError) =>
  [
    'w-full rounded-xl border bg-black/40 px-4 py-3 text-sm text-white placeholder:text-neutral-600 transition-colors',
    'focus:border-orange-500 focus:bg-black/60 focus:outline-none',
    hasError ? 'border-danger' : 'border-white/10',
  ].join(' ')

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs text-neutral-300">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-erro`} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

function ContactForm() {
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
    <form onSubmit={handleSubmit} noValidate className="glass relative overflow-hidden p-6 sm:p-10">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-orange-500/15 blur-[100px]" />
      <h3 id="formulario" className="relative text-xl text-white">
        {t.contact.formTitle}
      </h3>

      <div className="relative mt-8 grid gap-5 sm:grid-cols-2">
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

        <div className="sm:col-span-2">
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
        </div>

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
        className="btn-fire relative mt-8 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {sending ? t.contact.sending : t.contact.send}
        <FaPaperPlane aria-hidden="true" className={sending ? 'animate-pulse' : ''} />
      </button>

      <div aria-live="polite" className="relative mt-4 min-h-6 text-xs">
        {status === 'success' && <p className="animate-rise text-success">{t.contact.success}</p>}
        {status === 'error' && <p className="text-danger">{t.contact.error}</p>}
        {status === 'notConfigured' && <p className="text-warning">{t.contact.notConfigured}</p>}
      </div>
    </form>
  )
}

export default function Contact() {
  const { t } = useLanguage()

  return (
    <section id="contato" aria-labelledby="contato-titulo" className="relative px-6 py-14 md:px-16 md:py-16">
      <SplitTitle id="contato-titulo" text={t.contact.title} />
      <Reveal as="p" className="mx-auto mt-8 max-w-2xl text-center text-sm text-neutral-400">
        {t.contact.subtitle}
      </Reveal>

      <div className="mx-auto mt-10 max-w-5xl sm:mt-12">
        <ul className="grid gap-5 sm:grid-cols-2">
          {contacts.map((c, i) => (
            <Reveal as="li" key={c.type} delay={(i % 2) * 110}>
              <a
                href={c.href}
                target={c.type === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="glass glass-hover group flex h-full flex-col p-6"
              >
                <ContactIcon type={c.type} className="text-2xl text-orange-500 transition-transform duration-500 group-hover:scale-110" />
                <span className="mt-4 text-base text-white">{c.label}</span>
                <span className="mt-1 text-xs text-neutral-400">{t.contact.hints[c.type]}</span>
                <span className="mt-3 truncate text-xs text-orange-300/80 group-hover:text-orange-300">{c.value}</span>
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={150} className="mt-8">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
