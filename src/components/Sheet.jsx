// "Folha" de desenho técnico: moldura fina com marcas de canto.
// Usada nos blocos principais (topo da página inicial, formulário, avisos).
const corners = [
  'left-0 top-0 border-l-2 border-t-2',
  'right-0 top-0 border-r-2 border-t-2',
  'bottom-0 left-0 border-b-2 border-l-2',
  'bottom-0 right-0 border-b-2 border-r-2',
]

export default function Sheet({ as: Tag = 'div', grid = false, className = '', children, ...props }) {
  return (
    <Tag
      className={['relative border border-rule bg-sheet', grid ? 'drafting-grid' : '', className].join(' ')}
      {...props}
    >
      {corners.map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`pointer-events-none absolute -m-px size-3.5 border-ink ${pos}`}
        />
      ))}
      {children}
    </Tag>
  )
}
