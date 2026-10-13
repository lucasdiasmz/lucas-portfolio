// Linha do tempo vertical. Em telas largas alterna os cards entre esquerda e direita;
// no celular fica numa coluna só, com a linha à esquerda.
// items: [{ id, content }]
export default function Timeline({ items }) {
  return (
    <ol className="relative">
      <span aria-hidden="true" className="absolute left-4 top-0 h-full w-px bg-ink-700 md:left-1/2" />
      {items.map((item, index) => {
        const right = index % 2 === 1
        return (
          <li
            key={item.id}
            className={[
              'relative pb-10 pl-12 last:pb-0 md:w-1/2 md:pl-0',
              right ? 'md:ml-auto md:pl-10' : 'md:pr-10',
            ].join(' ')}
          >
            <span
              aria-hidden="true"
              className={[
                'absolute top-7 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-ink-950 bg-gradient-to-br from-brand-400 to-accent-400 ring-4 ring-brand-500/20',
                'left-4',
                right ? 'md:left-0' : 'md:left-auto md:right-0 md:translate-x-1/2',
              ].join(' ')}
            />
            {item.content}
          </li>
        )
      })}
    </ol>
  )
}
