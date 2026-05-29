import { motion } from 'framer-motion'
import { Link } from 'react-scroll'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="relative border-t border-neon-cyan/10 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div>
          <span className="font-rajdhani font-bold text-xl tracking-widest neon-text">
            VIN<span className="text-white/70">SITE</span>
          </span>
          <p className="font-mono text-[9px] text-slate-600 tracking-widest mt-0.5">
            PROFESSIONAL WEBSITE MAKER
          </p>
        </div>

        {/* Nav */}
        <div className="flex items-center gap-6">
          {['services', 'portfolio', 'techstack', 'contact'].map((id) => (
            <Link
              key={id}
              to={id}
              smooth
              duration={600}
              offset={-80}
              className="font-mono text-[10px] text-slate-600 hover:text-neon-cyan transition-colors duration-200 cursor-pointer tracking-widest uppercase"
            >
              {id}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="font-mono text-[9px] text-slate-700 tracking-widest">
          © {year} VINSITE. ALL SYSTEMS OPERATIONAL.
        </p>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
    </footer>
  )
}
