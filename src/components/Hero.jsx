import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-scroll'

// Phrases cycled by the typewriter
const PHRASES = [
  'Your Own Website Starts Here.',
  'Built for Performance.',
  'Engineered for Growth.',
  'Powered by Innovation.',
]

function useTypewriter(phrases, speed = 60, pause = 1800) {
  const [displayed, setDisplayed] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIdx]

    const timeout = setTimeout(() => {
      if (!deleting) {
        // Typing forward
        setDisplayed(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          // Hold at end before deleting
          setTimeout(() => setDeleting(true), pause)
        } else {
          setCharIdx((c) => c + 1)
        }
      } else {
        // Deleting
        setDisplayed(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setCharIdx(0)
          setPhraseIdx((p) => (p + 1) % phrases.length)
        } else {
          setCharIdx((c) => c - 1)
        }
      }
    }, deleting ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause])

  return displayed
}

// Floating stat badge component
function StatBadge({ value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="glass corner-accent px-5 py-3 text-center"
    >
      <div className="font-rajdhani font-bold text-2xl neon-text">{value}</div>
      <div className="font-mono text-[10px] text-slate-400 tracking-widest uppercase mt-0.5">{label}</div>
    </motion.div>
  )
}

export default function Hero() {
  const typed = useTypewriter(PHRASES)

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg"
    >
      {/* Radial glow from top */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />

      {/* Animated scan line */}
      <div className="scanline" />

      {/* Corner frame decorations */}
      <span className="absolute top-24 left-8 w-16 h-16 border-l-2 border-t-2 border-neon-cyan/20 hidden md:block" />
      <span className="absolute bottom-12 right-8 w-16 h-16 border-r-2 border-b-2 border-neon-cyan/20 hidden md:block" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* System tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-slow" />
          <span className="section-label">System Online — VinSite v1.0</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-rajdhani font-bold text-5xl md:text-7xl lg:text-8xl text-white leading-tight tracking-tight mb-4"
        >
          YOUR OWN WEBSITE
          <br />
          <span className="neon-text">STARTED HERE</span>
        </motion.h1>

        {/* Typewriter line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-mono text-lg md:text-2xl text-slate-300 mb-6 min-h-[2rem] typewriter-cursor"
        >
          {typed}
        </motion.div>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="font-space text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Kami membangun website kelas dunia yang dirancang untuk mengakselerasi bisnis Anda —
          dari performa server hingga pengalaman pengguna yang tak terlupakan.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="contact" smooth duration={700} offset={-80}>
            <button className="cta-pulse px-8 py-3.5 bg-neon-cyan text-dark-bg font-rajdhani font-bold text-lg tracking-widest hover:bg-neon-cyan-dim transition-colors duration-200 rounded-sm">
              START YOUR PROJECT
            </button>
          </Link>
          <Link to="portfolio" smooth duration={700} offset={-80}>
            <button className="px-8 py-3.5 border border-neon-cyan/40 text-neon-cyan font-space text-sm tracking-wider hover:border-neon-cyan/80 hover:bg-neon-cyan/5 transition-all duration-200 rounded-sm">
              View Our Work
            </button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 flex flex-wrap justify-center gap-6"
        >
          <StatBadge value="50+" label="Projects Delivered" delay={1.3} />
          <StatBadge value="99.9%" label="Uptime Guaranteed" delay={1.4} />
          <StatBadge value="<1s" label="Load Time Target" delay={1.5} />
          <StatBadge value="24/7" label="Support Ready" delay={1.6} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="section-label">scroll</span>
        {/* Animated chevron */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-neon-cyan to-transparent"
        />
      </motion.div>
    </section>
  )
}
