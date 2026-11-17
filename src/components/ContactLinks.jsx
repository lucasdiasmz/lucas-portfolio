import ContactIcon from './ContactIcon.jsx'
import { contacts } from '../data/profile.js'

// E-mail abre no próprio aplicativo; o resto, em nova aba
// eslint-disable-next-line react-refresh/only-export-components
export const linkProps = (contact) => (contact.type === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })

// Ícones de contato (hero e rodapé). `bare`: só o ícone, sem o quadrado.
export default function ContactLinks({ bare = false, className = '' }) {
  return (
    <ul className={className}>
      {contacts.map((c) => (
        <li key={c.type}>
          <a href={c.href} {...linkProps(c)} aria-label={c.label} className={`icon-tile${bare ? ' icon-tile--bare' : ''}`}>
            <ContactIcon type={c.type} />
          </a>
        </li>
      ))}
    </ul>
  )
}
