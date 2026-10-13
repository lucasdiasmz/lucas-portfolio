import { FaEnvelope, FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa6'

const icons = {
  email: FaEnvelope,
  whatsapp: FaWhatsapp,
  linkedin: FaLinkedin,
  github: FaGithub,
}

export default function ContactIcon({ type, className = '' }) {
  const Icon = icons[type] ?? FaEnvelope
  return <Icon className={className} aria-hidden="true" />
}
