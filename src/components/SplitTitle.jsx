import { useReveal } from '../utils/useReveal.js'

// Título grande laranja em que cada letra sobe e ganha foco ao entrar na tela
export default function SplitTitle({ text, as: Tag = 'h2', id, className = '' }) {
  const ref = useReveal(0.3)
  let i = 0
  return (
    <Tag
      ref={ref}
      id={id}
      aria-label={text}
      className={`split glow-text text-center text-[clamp(2rem,6vw,4.5rem)] leading-[1.15] tracking-tight text-brand-400 select-none ${className}`}
    >
      {text.split(' ').map((word, w) => (
        <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
          {[...word].map((ch) => (
            <span key={i} className="ch">
              <span style={{ '--i': i++ }}>{ch}</span>
            </span>
          ))}
          {w < text.split(' ').length - 1 && '\u00a0'}
        </span>
      ))}
    </Tag>
  )
}
