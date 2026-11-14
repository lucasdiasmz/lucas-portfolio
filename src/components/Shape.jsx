// Formas geométricas do sistema visual, desenhadas num quadrado 100x100.
const paths = {
  circle: <circle cx="50" cy="50" r="50" />,
  dot: <circle cx="50" cy="50" r="22" />,
  ring: <path fillRule="evenodd" d="M50 0a50 50 0 1 1 0 100A50 50 0 0 1 50 0Zm0 26a24 24 0 1 0 0 48 24 24 0 0 0 0-48Z" />,
  half: <path d="M50 0A50 50 0 0 0 50 100Z" />,
  arch: <path d="M0 100V50a50 50 0 0 1 100 0v50Z" />,
  quarter: <path d="M0 0h100A100 100 0 0 1 0 100Z" />,
  leaf: <path d="M0 100A100 100 0 0 1 100 0 100 100 0 0 1 0 100Z" />,
  square: <rect x="18" y="18" width="64" height="64" />,
  bars: <path d="M0 0h100v20H0Zm0 40h100v20H0Zm0 40h100v20H0Z" />,
}

const colors = {
  paper: 'var(--color-paper)',
  white: 'var(--color-white)',
  ink: 'var(--color-ink)',
  red: 'var(--color-red)',
  blue: 'var(--color-blue)',
  sun: 'var(--color-sun)',
  green: 'var(--color-green)',
  sky: 'var(--color-sky)',
}

// Um módulo: fundo chapado + uma forma girada em passos de 90°
export default function Shape({ kind, bg, fg, turn = 0, className = '', style, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: colors[bg], ...style }}
      {...props}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full transition-transform duration-700 ease-spring"
        style={{ fill: colors[fg], transform: `rotate(calc(${turn * 90}deg + var(--turn, 0) * 90deg))` }}
      >
        {paths[kind]}
      </svg>
    </div>
  )
}
