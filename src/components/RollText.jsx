// Texto cujas letras rolam no hover do elemento pai (que precisa da classe .roll-host)
export default function RollText({ children }) {
  const text = String(children)
  return (
    <span className="roll" aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden="true" style={{ '--i': i }}>
          <span>{ch === ' ' ? '\u00a0' : ch}</span>
          <span>{ch === ' ' ? '\u00a0' : ch}</span>
        </span>
      ))}
    </span>
  )
}
