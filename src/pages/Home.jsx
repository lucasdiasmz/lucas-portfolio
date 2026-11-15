import Hero from '../sections/Hero.jsx'
import About from '../sections/About.jsx'
import Process from '../sections/Process.jsx'
import Skills from '../sections/Skills.jsx'
import Focus from '../sections/Focus.jsx'
import Projects from '../sections/Projects.jsx'
import Contact from '../sections/Contact.jsx'

// Página única, na ordem do modelo: topo, sobre, processo, habilidades, foco, projetos e contato
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Process />
      <Skills />
      <Focus />
      <Projects />
      <Contact />
    </>
  )
}
