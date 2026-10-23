export default function PageHeader({ title, subtitle }) {
  return (
    <header className="mb-12 border-b border-ink pb-8">
      <h1 className="type-condensed text-[clamp(3.25rem,9vw,6rem)] font-extrabold leading-[0.9] tracking-tight">
        {title}
      </h1>
      {subtitle && <p className="mt-4 max-w-[56ch] text-lg text-graphite">{subtitle}</p>}
    </header>
  )
}
