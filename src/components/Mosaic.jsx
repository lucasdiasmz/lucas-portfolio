import { useRef, useState } from 'react'
import { FaShuffle } from 'react-icons/fa6'
import Shape from './Shape.jsx'
import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

// Campo de formas 4x4 do topo da página inicial. A foto ocupa o bloco 2x2 do meio-direita.
// As formas giram conforme a proximidade do ponteiro, como um único campo contínuo.
const start = [
  { kind: 'quarter', bg: 'blue', fg: 'sun', turn: 1 },
  { kind: 'circle', bg: 'paper', fg: 'red', turn: 0 },
  { kind: 'arch', bg: 'red', fg: 'paper', turn: 0 },
  { kind: 'bars', bg: 'sun', fg: 'ink', turn: 1 },
  { kind: 'half', bg: 'ink', fg: 'sun', turn: 0 },
  { kind: 'leaf', bg: 'green', fg: 'paper', turn: 0 },
  { kind: 'ring', bg: 'paper', fg: 'blue', turn: 0 },
  { kind: 'quarter', bg: 'red', fg: 'ink', turn: 2 },
  { kind: 'dot', bg: 'blue', fg: 'paper', turn: 0 },
  { kind: 'arch', bg: 'sun', fg: 'red', turn: 2 },
  { kind: 'half', bg: 'paper', fg: 'green', turn: 2 },
  { kind: 'circle', bg: 'blue', fg: 'sun', turn: 0 },
]
const shapeKinds = ['circle', 'dot', 'ring', 'half', 'arch', 'quarter', 'leaf', 'square', 'bars']
const grounds = ['blue', 'red', 'sun', 'green', 'ink', 'paper']
const fgFor = { blue: 'sun', red: 'paper', sun: 'red', green: 'paper', ink: 'sun', paper: 'blue' }

function shuffled() {
  return start.map(() => {
    const bg = grounds[Math.floor(Math.random() * grounds.length)]
    return {
      kind: shapeKinds[Math.floor(Math.random() * shapeKinds.length)],
      bg,
      fg: fgFor[bg],
      turn: Math.floor(Math.random() * 4),
    }
  })
}

function Photo() {
  const [failed, setFailed] = useState(false)
  return (
    <div className="relative col-span-2 row-span-2 overflow-hidden bg-sun">
      {profile.photo && !failed ? (
        <img
          src={profile.photo}
          alt={profile.name}
          onError={() => setFailed(true)}
          className="size-full object-cover grayscale contrast-125 mix-blend-multiply"
        />
      ) : (
        <span className="type-display grid size-full place-items-center text-[10rem] font-extrabold leading-none">
          {profile.shortName.charAt(0)}
        </span>
      )}
    </div>
  )
}

export default function Mosaic() {
  const { t } = useLanguage()
  const [tiles, setTiles] = useState(start)
  const [count, setCount] = useState(1)
  const gridRef = useRef(null)
  const frame = useRef(0)

  // Atualiza só uma variável CSS por módulo (sem re-renderizar o React)
  function handleMove(e) {
    if (e.pointerType !== 'mouse') return
    const { clientX, clientY } = e
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      for (const el of gridRef.current.querySelectorAll('[data-tile]')) {
        const r = el.getBoundingClientRect()
        const d = Math.hypot(clientX - (r.left + r.width / 2), clientY - (r.top + r.height / 2))
        el.style.setProperty('--turn', d < r.width * 0.75 ? 1 : 0)
      }
    })
  }

  function handleLeave() {
    cancelAnimationFrame(frame.current)
    for (const el of gridRef.current.querySelectorAll('[data-tile]')) el.style.setProperty('--turn', 0)
  }

  // Posições na grade 4x4: a foto ocupa colunas 2-3, linhas 2-3
  const isPhoto = (cell) => [5, 6, 9, 10].includes(cell)
  const shapeCells = Array.from({ length: 16 }, (_, cell) => cell).filter((cell) => !isPhoto(cell))
  const cells = Array.from({ length: 16 }, (_, cell) => {
    if (isPhoto(cell)) return cell === 5 ? <Photo key="photo" /> : null
    const tile = tiles[shapeCells.indexOf(cell)]
    return <Shape key={cell} data-tile {...tile} className="animate-pop" style={{ animationDelay: `${120 + cell * 45}ms` }} />
  })

  return (
    <figure className="w-full">
      <div
        ref={gridRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="grid aspect-square w-full grid-cols-4 grid-rows-4"
      >
        {cells}
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4 font-type text-sm text-graphite">
        <span aria-live="polite">
          {t.about.composition} {String(count).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={() => {
            setTiles(shuffled())
            setCount((c) => c + 1)
          }}
          className="inline-flex items-center gap-2 font-sans font-semibold text-ink underline decoration-2 decoration-red underline-offset-4 transition-colors hover:text-red"
        >
          <FaShuffle aria-hidden="true" />
          {t.about.shuffle}
        </button>
      </figcaption>
    </figure>
  )
}
