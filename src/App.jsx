import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'
import Experiences from './pages/Experiences.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<About />} />
        <Route path="projetos" element={<Projects />} />
        <Route path="experiencias" element={<Experiences />} />
        <Route path="contato" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
