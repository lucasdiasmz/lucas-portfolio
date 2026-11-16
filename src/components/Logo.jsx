import { useId } from 'react'
import { cssVar } from '../theme.js'

// Marca "L" em gradiente neon (tokens glow → ember → flame)
export default function Logo({ className = '' }) {
  const id = useId()
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: cssVar('glow') }} />
          <stop offset="0.55" style={{ stopColor: cssVar('ember') }} />
          <stop offset="1" style={{ stopColor: cssVar('flame') }} />
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} d="M17 8h11v33h19v11H22a5 5 0 0 1-5-5Z" />
      <path fill={`url(#${id})`} opacity=".55" d="M34 8h13v8H34z" />
    </svg>
  )
}
