import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'
import Resume from './pages/Resume.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

// Roteador de dados: necessário para as transições de página (prop viewTransition nos links)
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route index element={<About />} />
      <Route path="projetos" element={<Projects />} />
      <Route path="curriculo" element={<Resume />} />
      {/* Endereço antigo da página de Experiências: leva para o Currículo */}
      <Route path="experiencias" element={<Navigate to="/curriculo" replace />} />
      <Route path="contato" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
)

export default function App() {
  return <RouterProvider router={router} />
}
