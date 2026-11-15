import { useReveal } from '../utils/useReveal.js'

// Aparece com subida + desfoque quando entra na tela. `delay` em ms.
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useReveal(0.15)
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--d': `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  )
}
