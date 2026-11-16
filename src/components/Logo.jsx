import { useId } from 'react'

// Marca "L" em gradiente laranja → vermelho
export default function Logo({ className = '' }) {
  const id = useId()
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#93b3ff" />
          <stop offset="0.55" stopColor="#548cff" />
          <stop offset="1" stopColor="#3d73e6" />
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} d="M17 8h11v33h19v11H22a5 5 0 0 1-5-5Z" />
      <path fill={`url(#${id})`} opacity=".55" d="M34 8h13v8H34z" />
    </svg>
  )
}
