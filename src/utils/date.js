// Converte 'AAAA-MM' em uma data local (dia 1) sem problemas de fuso horário.
export function parseYearMonth(value) {
  const [year, month] = value.split('-').map(Number)
  return new Date(year, (month || 1) - 1, 1)
}

export function formatYearMonth(value, lang) {
  const locale = lang === 'pt' ? 'pt-BR' : 'en-US'
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' })
    .format(parseYearMonth(value))
    .replace('.', '')
}
