import Shape from './Shape.jsx'
import { wrap } from '../utils/ui.js'

// Cabeçalho das páginas internas: título em escala de cartaz e uma faixa de formas na cor da seção
export default function PageHeader({ title, subtitle, color = 'blue', shapes = ['circle', 'arch', 'quarter'] }) {
  const ink = color === 'sun' ? 'ink' : 'paper'
  return (
    <header className={`${wrap} grid items-end gap-8 pb-14 pt-12 sm:pt-20 md:grid-cols-[1fr_auto]`}>
      <div>
        <h1 className="type-display animate-rise text-[clamp(3.5rem,11vw,6rem)] font-extrabold leading-[0.88] tracking-[-0.015em]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-[52ch] animate-rise text-lg text-graphite [animation-delay:120ms]">{subtitle}</p>
        )}
      </div>
      <div className="flex">
        {shapes.map((kind, i) => (
          <Shape
            key={kind}
            kind={kind}
            bg={i === 1 ? 'ink' : color}
            fg={i === 1 ? (color === 'sun' ? 'red' : 'sun') : ink}
            turn={i}
            className="size-20 animate-pop sm:size-28 lg:size-36"
            style={{ animationDelay: `${150 + i * 90}ms` }}
          />
        ))}
      </div>
    </header>
  )
}
