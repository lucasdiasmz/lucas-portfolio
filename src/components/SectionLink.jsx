import { Link, useLocation } from 'react-router-dom'

// Link para uma seção da página inicial: âncora simples na própria página,
// ou volta para "/" com o hash quando o visitante está em outra página.
export default function SectionLink({ id, children, ...rest }) {
  const { pathname } = useLocation()
  if (pathname === '/') {
    return (
      <a href={`#${id}`} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link to={{ pathname: '/', hash: `#${id}` }} {...rest}>
      {children}
    </Link>
  )
}
