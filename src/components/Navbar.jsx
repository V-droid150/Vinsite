import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-scroll'

const navLinks = [
  { label: 'Services', to: 'services' },
  { label: 'Portfolio', to: 'portfolio' },
  { label: 'Tech Stack', to: 'techstack' },
  { label: 'Contact', to: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Increase glass opacity after user scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-neon-cyan/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="hero" smooth duration={600} className="cursor-pointer">
          <span className="font-rajdhani font-bold text-2xl tracking-widest neon-text select-none">
            VIN<span className="text-white/80">SITE</span>
          </span>
          <span className="font-mono text-[9px] text-neon-cyan/50 block -mt-1 tracking-[0.35em]">
            PROFESSIONAL WEB MAKER
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              smooth
              duration={600}
              offset={-80}
              className="relative font-space text-sm text-slate-400 hover:text-neon-cyan transition-colors duration-200 cursor-pointer group"
            >
              {link.label}
              {/* underline grow on hover */}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-neon-cyan group-hover:w-full transition-all duration-300" />
            </Link>
          ))}

          <Link to="contact" smooth duration={600} offset={-80}>
            <button className="cta-pulse ml-4 px-5 py-2 text-sm font-space font-semibold border border-neon-cyan text-neon-cyan rounded hover:bg-neon-cyan/10 transition-colors duration-200">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-px w-6 bg-neon-cyan"
              animate={
                menuOpen
                  ? i === 0
                    ? { rotate: 45, y: 8 }
                    : i === 1
                    ? { opacity: 0 }
                    : { rotate: -45, y: -8 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.25 }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-neon-cyan/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  smooth
                  duration={600}
                  offset={-80}
                  onClick={() => setMenuOpen(false)}
                  className="font-space text-slate-300 hover:text-neon-cyan transition-colors cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
