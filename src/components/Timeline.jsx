// Linha do tempo em linhas: a data fica numa coluna à esquerda e o conteúdo à direita,
// separados por réguas finas. No celular a data aparece acima do conteúdo.
// items: [{ id, marker, content }]
export default function Timeline({ items }) {
  return (
    <ol className="border-t border-ink">
      {items.map((item) => (
        <li
          key={item.id}
          className="grid gap-x-10 gap-y-3 border-b border-rule py-10 md:grid-cols-[10rem_1fr]"
        >
          <div className="type-condensed text-[2.25rem] font-bold leading-none text-graphite">{item.marker}</div>
          <div className="min-w-0">{item.content}</div>
        </li>
      ))}
    </ol>
  )
}
