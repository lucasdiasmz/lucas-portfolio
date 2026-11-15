import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Resume from './pages/Resume.jsx'
import NotFound from './pages/NotFound.jsx'

// O portfólio virou uma página única; os endereços antigos levam à seção correspondente
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="curriculo" element={<Resume />} />
      <Route path="projetos" element={<Navigate to={{ pathname: '/', hash: '#projetos' }} replace />} />
      <Route path="contato" element={<Navigate to={{ pathname: '/', hash: '#contato' }} replace />} />
      <Route path="experiencias" element={<Navigate to="/curriculo" replace />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
)

export default function App() {
  return <RouterProvider router={router} />
}
