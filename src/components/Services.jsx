import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const services = [
  {
    id: '01',
    icon: '⬡',
    title: 'Professional Web Development',
    subtitle: 'Custom Sites & WordPress Ecosystem',
    description:
      'Pengembangan website kustom berperforma tinggi, manajemen ekosistem WordPress & NEO WordPress, dirancang sepenuhnya untuk kebutuhan bisnis Anda.',
    features: ['Custom Web Development', 'WordPress & NEO WordPress', 'UI/UX Design', 'Performance Optimization'],
    accent: 'from-cyan-500/10 to-blue-500/5',
  },
  {
    id: '02',
    icon: '◈',
    title: 'Infrastructure & Server',
    subtitle: 'VPS · DNS · Architecture',
    description:
      'Pengelolaan VPS secara profesional, konfigurasi DNS Manager yang presisi, dan optimasi arsitektur server untuk kecepatan dan keandalan maksimum.',
    features: ['VPS Management', 'DNS Configuration', 'Server Architecture', 'Security Hardening'],
    accent: 'from-violet-500/10 to-cyan-500/5',
  },
  {
    id: '03',
    icon: '◉',
    title: 'AI & Automation',
    subtitle: 'API Tools · Agentic AI',
    description:
      'Implementasi alat berbasis API mutakhir dan integrasi Agentic AI yang cerdas untuk mengotomasi proses bisnis Anda dan meningkatkan efisiensi operasional.',
    features: ['API Integration', 'Agentic AI Workflows', 'Business Automation', 'Custom AI Tools'],
    accent: 'from-emerald-500/10 to-cyan-500/5',
  },
  {
    id: '04',
    icon: '◇',
    title: 'Digital Brand Assets',
    subtitle: 'Visual · Video · Photography',
    description:
      'Dukungan identitas merek menyeluruh: desain visual kelas premium, videografi sinematik memukau, dan fotografi produk profesional untuk memperkuat website Anda.',
    features: ['Brand Identity Design', 'Cinematic Videography', 'Product Photography', 'Visual Content Strategy'],
    accent: 'from-rose-500/10 to-cyan-500/5',
  },
]

// Per-card entrance animation
function ServiceCard({ service, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
      // 3D tilt handled via CSS vars on mouse move
      whileHover={{ scale: 1.015 }}
      className="group relative glass corner-accent rounded-sm p-6 flex flex-col gap-4 cursor-default overflow-hidden"
      style={{ '--delay': `${index * 0.1}s` }}
    >
      {/* Gradient glow bg */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Neon scan effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between mb-2">
          <span className="font-mono text-3xl text-neon-cyan/30 group-hover:text-neon-cyan/60 transition-colors duration-300">
            {service.icon}
          </span>
          <span className="font-mono text-xs text-neon-cyan/40 tracking-widest">
            [{service.id}]
          </span>
        </div>

        {/* Title */}
        <h3 className="font-rajdhani font-bold text-xl text-white group-hover:text-neon-cyan transition-colors duration-300 leading-tight mb-1">
          {service.title}
        </h3>
        <p className="font-mono text-[10px] text-neon-cyan/50 tracking-widest uppercase mb-3">
          {service.subtitle}
        </p>

        {/* Description */}
        <p className="font-space text-sm text-slate-400 leading-relaxed mb-5">
          {service.description}
        </p>

        {/* Feature list */}
        <ul className="flex flex-col gap-1.5">
          {service.features.map((f) => (
            <li key={f} className="flex items-center gap-2 font-mono text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
              <span className="w-1 h-1 rounded-full bg-neon-cyan/50 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom border glow on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/0 to-transparent group-hover:via-neon-cyan/50 transition-all duration-500" />
    </motion.div>
  )
}

export default function Services() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true, margin: '-60px' })

  return (
    <section id="services" className="relative py-28 px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-neon-cyan/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="section-label mb-3">// What We Build</p>
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl text-white">
            OUR <span className="neon-text">SERVICES</span>
          </h2>
          <p className="font-space text-slate-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Solusi terintegrasi dari desain hingga infrastruktur — semua yang dibutuhkan bisnis Anda untuk eksis secara digital.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
