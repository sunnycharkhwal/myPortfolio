import useActiveSection from '../hooks/useActiveSection.js'
import Nav            from '../components/Nav.jsx'
import Hero           from '../components/Hero.jsx'
import Skills         from '../components/Skills.jsx'
import Projects       from '../components/Projects.jsx'
import Experience     from '../components/Experience.jsx'
import Contact        from '../components/Contact.jsx'
import Footer         from '../components/Footer.jsx'
import BackToTop      from '../components/BackToTop.jsx'
import DevOpsBackground from '../components/DevOpsBackground.jsx'

// The public portfolio — moved verbatim out of App.jsx so App.jsx can become a pure
// route table. Zero behavior change: this is only ever mounted at "/", so Nav's
// document.getElementById calls and useActiveSection's IntersectionObserver never run
// on any other route.
export default function HomePage() {
  useActiveSection()

  return (
    <>
      <DevOpsBackground />
      <Nav />
      <Hero />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
      <BackToTop />
    </>
  )
}
