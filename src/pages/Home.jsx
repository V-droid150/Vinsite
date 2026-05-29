import ParticleBackground from '../components/ParticleBackground'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Portfolio from '../components/Portfolio'
import TechStack from '../components/TechStack'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-dark-bg text-slate-100">
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Portfolio />
          <TechStack />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}
