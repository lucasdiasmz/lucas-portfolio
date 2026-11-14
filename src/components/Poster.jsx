import Shape from './Shape.jsx'
import { useReveal } from '../utils/useReveal.js'

// Cada projeto ganha um "cartaz" geométrico próprio, gerado a partir do id.
// O mesmo id sempre gera o mesmo cartaz; trocar o id troca a composição.
const grounds = ['blue', 'red', 'sun', 'green', 'ink', 'paper']
const inks = { blue: ['sun', 'paper', 'red'], red: ['paper', 'sun', 'ink'], sun: ['red', 'blue', 'ink'], green: ['sun', 'paper', 'ink'], ink: ['sun', 'red', 'paper'], paper: ['blue', 'red', 'ink'] }
const kinds = ['circle', 'half', 'arch', 'quarter', 'leaf', 'ring', 'bars', 'dot']

function seeded(text) {
  let h = 2166136261
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

function posterFor(id) {
  const rand = seeded(id)
  const pick = (list) => list[Math.floor(rand() * list.length)]
  // Um módulo grande (2x2) e cinco pequenos, sem repetir o fundo do vizinho anterior
  let prev = ''
  return Array.from({ length: 6 }, () => {
    const bg = pick(grounds.filter((g) => g !== prev))
    prev = bg
    return { bg, fg: pick(inks[bg]), kind: pick(kinds), turn: Math.floor(rand() * 4) }
  })
}

export default function Poster({ id, className = '' }) {
  const ref = useReveal(0.25)
  const tiles = posterFor(id)

  return (
    <div
      ref={ref}
      className={`assemble grid aspect-square grid-cols-3 grid-rows-3 ${className}`}
    >
      {tiles.map((tile, i) => (
        <Shape
          key={i}
          {...tile}
          className={i === 0 ? 'col-span-2 row-span-2' : ''}
          style={{ '--i': i }}
        />
      ))}
    </div>
  )
}
