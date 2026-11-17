import { useReveal } from '../motion/hooks.js'

// Título grande (branco com brilho neon, ver h1/h2 em index.css) em que cada letra sobe ao entrar na tela
export default function SplitTitle({ text, as: Tag = 'h2', id, className = '' }) {
  const words = text.split(' ')
  const ref = useReveal(0.3, 950 + text.length * 35)
  let i = 0
  return (
    <Tag
      ref={ref}
      id={id}
      aria-label={text}
      className={`split text-center text-[clamp(2rem,6vw,4.5rem)] leading-[1.15] tracking-tight select-none ${className}`}
    >
      {words.map((word, w) => (
        <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
          {[...word].map((ch) => (
            <span key={i} className="ch">
              <span style={{ '--i': i++ }}>{ch}</span>
            </span>
          ))}
          {w < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  )
}
