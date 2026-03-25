import Intro from '@/components/Intro'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import MarqueeStrip from '@/components/MarqueeStrip'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import ScrollProgress from '@/components/ScrollProgress'
import { Certificates, Contact, Footer } from '@/components/Sections'

export default function Home() {
  return (
    <>
      <Intro />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <MarqueeStrip />
        <About />
        <MarqueeStrip reverse />
        <Projects />
        <Skills />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
