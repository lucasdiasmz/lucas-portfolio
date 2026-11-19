import { useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

/*
 * Carrossel escalonado (adaptado do "Stagger Testimonials").
 *
 * Os cartões ficam lado a lado, alternando para cima e para baixo com uma leve
 * rotação; o do meio sobe e acende em neon. Clicar num cartão, usar as setas
 * (botões ou teclado) ou arrastar para o lado traz outro para o centro.
 *
 * Diferente do original, os cartões não são recriados a cada passo: cada um
 * guarda a mesma chave e só muda a posição (--pos). Quem dá a volta de uma
 * ponta para a outra pula sem transição, enquanto está invisível. Tamanho e
 * deslocamento vêm do CSS (.stagger), sem listener de resize.
 *
 * items: [{ id, Icon, iconClass, title, text }]
 */
export default function StaggerCards({ items, labels }) {
  const n = items.length
  const half = Math.floor(n / 2)
  const [state, setState] = useState({ active: 0, prev: 0 })
  const drag = useRef(null)

  const wrap = (i, active) => ((((i - active + half) % n) + n) % n) - half
  const move = (steps) => steps && setState(({ active }) => ({ prev: active, active: (((active + steps) % n) + n) % n }))

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') move(-1)
    else if (e.key === 'ArrowRight') move(1)
    else return
    e.preventDefault()
  }

  // Arrastar (toque ou mouse) para o lado também troca
  const onPointerDown = (e) => (drag.current = { x: e.clientX, y: e.clientY })
  const onPointerUp = (e) => {
    const d = drag.current
    drag.current = null
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - d.y)) {
      drag.current = 'moved'
      move(dx < 0 ? 1 : -1)
    }
  }

  const current = items[state.active]

  return (
    <div
      className="stagger"
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.region}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (drag.current = null)}
    >
      {items.map((item, i) => {
        const pos = wrap(i, state.active)
        const before = wrap(i, state.prev)
        const steps = wrap(state.active, state.prev)
        // deu a volta: muda de ponta sem atravessar a tela
        const jumped = Math.abs(pos - before) !== Math.abs(steps)
        const center = pos === 0
        const { Icon } = item
        return (
          <div
            key={item.id}
            className="stagger__card"
            data-center={center || undefined}
            data-far={Math.abs(pos) > 2 || undefined}
            data-jump={jumped || undefined}
            aria-hidden={!center}
            onClick={() => {
              if (drag.current === 'moved') return
              move(pos)
            }}
            style={{ '--pos': pos, '--tilt': center ? 0 : pos % 2 ? 1 : -1 }}
          >
            <span aria-hidden="true" className="stagger__corner" />
            <span className="stagger__icon">
              <Icon aria-hidden="true" className={center ? '' : item.iconClass} />
            </span>
            <h3 className="stagger__title">{item.title}</h3>
            <p className="stagger__text">{item.text}</p>
            <span aria-hidden="true" className="stagger__num">
              {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </span>
          </div>
        )
      })}

      <p className="sr-only" aria-live="polite">
        {labels.position(state.active + 1, n)}: {current.title}. {current.text}
      </p>

      <div className="stagger__controls">
        <button type="button" onClick={() => move(-1)} aria-label={labels.prev} className="stagger__btn" data-magnet>
          <FaChevronLeft aria-hidden="true" />
        </button>
        <button type="button" onClick={() => move(1)} aria-label={labels.next} className="stagger__btn" data-magnet>
          <FaChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
