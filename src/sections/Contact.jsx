import { useEffect, useState } from 'react'
import { FaCheck, FaEnvelope, FaPaperPlane, FaRegCopy } from 'react-icons/fa6'
import ContactIcon from '../components/ContactIcon.jsx'
import { linkProps } from '../components/ContactLinks.jsx'
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

const mailTo = contacts.find((c) => c.type === 'email')?.value

// Cartão de um canal de contato: o cartão inteiro é o link; o botão copia o endereço
function ContactCard({ contact }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(timer)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(contact.value)
      setCopied(true)
    } catch {
      // sem permissão de área de transferência: o endereço continua visível para copiar à mão
    }
  }

  return (
    <div className="glass glass-hover group relative flex h-full flex-col p-6">
      <ContactIcon type={contact.type} className="text-2xl text-brand-500 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-125" />
      {/* o ::after do link cobre o cartão: clicar em qualquer ponto abre o canal */}
      <a href={contact.href} {...linkProps(contact)} className="mt-4 text-base text-white after:absolute after:inset-0 after:rounded-3xl">
        {contact.label}
      </a>
      <span className="mt-1 text-xs text-neutral-400">{t.contact.hints[contact.type]}</span>
      <span className="mt-3 flex items-center justify-between gap-3">
        <span className="truncate text-xs text-brand-300/80 group-hover:text-brand-300">{contact.value}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={`${t.contact.copy}: ${contact.value}`}
          className="relative z-10 flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[0.65rem] text-neutral-300 transition-[color,border-color,scale] duration-200 hover:border-brand-500/60 hover:text-white active:scale-90"
        >
          {copied ? <FaCheck aria-hidden="true" className="text-success" /> : <FaRegCopy aria-hidden="true" />}
          <span key={copied} className="swap-in" aria-live="polite">
            {copied ? t.contact.copied : t.contact.copy}
          </span>
        </button>
      </span>
    </div>
  )
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs text-neutral-300">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-erro`} role="alert" className="mt-1.5 animate-rise text-xs text-danger">
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

  // Saída quando o envio pelo site não está disponível: a mesma mensagem, no e-mail da pessoa
  const mailHref = `mailto:${mailTo}?subject=${encodeURIComponent(t.contact.mailSubject)}&body=${encodeURIComponent(
    `${values.message.trim()}

${values.name.trim()}`,
  )}`

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
      <div aria-hidden="true" className="aura -right-64 -top-64 size-[40rem] [--aura-a:0.1]" />
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
            className="field"
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
            className="field"
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
              className="field min-h-32 resize-y"
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
        <span key={sending} className="swap-in">
          {sending ? t.contact.sending : t.contact.send}
        </span>
        {sending ? (
          <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border-2 border-black/25 border-t-black" />
        ) : (
          <FaPaperPlane aria-hidden="true" />
        )}
      </button>

      <div aria-live="polite" className="relative mt-4 min-h-6 text-xs">
        {status === 'success' && (
          <p className="flex animate-rise items-center gap-2 text-success">
            <FaCheck aria-hidden="true" /> {t.contact.success}
          </p>
        )}
        {(status === 'error' || status === 'notConfigured') && (
          <div className="flex animate-rise flex-wrap items-center gap-x-4 gap-y-3">
            <p className={status === 'error' ? 'text-danger' : 'text-warning'}>{t.contact[status]}</p>
            <a href={mailHref} className="btn-ghost px-4 py-2 text-[0.7rem]">
              <FaEnvelope aria-hidden="true" /> {t.contact.openMail}
            </a>
          </div>
        )}
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
              <ContactCard contact={c} />
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
