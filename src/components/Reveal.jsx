import { useReveal } from '../motion/hooks.js'

// Sobe e aparece quando entra na tela. `delay` em ms. Terminada a entrada, o
// elemento volta a usar as transições dele (ver .reveal no CSS).
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useReveal(0.15, 900 + delay)
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--d': `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  )
}
