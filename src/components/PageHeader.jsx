export default function PageHeader({ title, subtitle }) {
  return (
    <header className="mb-10 animate-fade-up">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="bg-gradient-to-r from-white to-brand-400 bg-clip-text text-transparent">{title}</span>
      </h1>
      {subtitle && <p className="mt-3 max-w-2xl text-ink-300">{subtitle}</p>}
    </header>
  )
}
