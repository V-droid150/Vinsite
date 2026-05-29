import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const techGroups = [
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'Vite'],
  },
  {
    category: 'CMS & E-Commerce',
    items: ['WordPress', 'NEO WordPress', 'WooCommerce', 'Elementor Pro', 'ACF', 'Headless CMS'],
  },
  {
    category: 'Infrastructure',
    items: ['VPS (Ubuntu)', 'Nginx', 'DNS Manager', 'Cloudflare', 'SSL/TLS', 'Docker'],
  },
  {
    category: 'AI & Automation',
    items: ['OpenAI API', 'Claude API', 'Agentic AI', 'Zapier', 'Make.com', 'Custom GPT'],
  },
  {
    category: 'Backend & DB',
    items: ['Node.js', 'REST API', 'MySQL', 'MongoDB', 'Redis', 'Firebase'],
  },
  {
    category: 'Tools & DevOps',
    items: ['Git', 'GitHub Actions', 'Postman', 'Figma', 'Google Analytics', 'SEO Tools'],
  },
]

function Badge({ tech, delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{
        scale: 1.06,
        boxShadow: '0 0 12px rgba(0,229,255,0.3)',
        borderColor: 'rgba(0,229,255,0.6)',
      }}
      className="inline-block px-3 py-1.5 font-mono text-xs border border-neon-cyan/20 text-neon-cyan/70 hover:text-neon-cyan rounded-sm cursor-default transition-colors duration-200"
    >
      {tech}
    </motion.span>
  )
}

export default function TechStack() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true, margin: '-60px' })

  return (
    <section id="techstack" className="relative py-28 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-neon-cyan/20 to-transparent" />

      {/* Background grid accent */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="section-label mb-3">// Tech Arsenal</p>
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl text-white">
            TOOLS & <span className="neon-text">TECHNOLOGIES</span>
          </h2>
          <p className="font-space text-slate-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Stack teknologi pilihan untuk membangun solusi web terbaik — dari frontend hingga infrastruktur.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techGroups.map((group, gi) => {
            const ref = useRef(null)
            const inView = useInView(ref, { once: true, margin: '-60px' })
            return (
              <motion.div
                key={group.category}
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: gi * 0.1 }}
                className="glass corner-accent rounded-sm p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse-slow" />
                  <h3 className="font-mono text-[11px] text-neon-cyan tracking-widest uppercase">
                    {group.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((tech, ti) => (
                    <Badge key={tech} tech={tech} delay={gi * 0.08 + ti * 0.04} />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
