import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const projects = [
  {
    id: 'PRJ-001',
    title: 'NovaCorp Digital Hub',
    category: 'Corporate Website',
    stack: ['React', 'Node.js', 'VPS'],
    desc: 'Full-stack corporate portal dengan sistem CMS kustom, SEO teroptimasi, dan load time di bawah 800ms.',
    metrics: { perf: '98', seo: '100', load: '0.8s' },
    status: 'LIVE',
    color: 'cyan',
  },
  {
    id: 'PRJ-002',
    title: 'AgroMarket Platform',
    category: 'E-Commerce',
    stack: ['WordPress', 'WooCommerce', 'DNS'],
    desc: 'Platform e-commerce dengan 5.000+ SKU, payment gateway terintegrasi, dan infrastruktur server terdistribusi.',
    metrics: { perf: '95', seo: '97', load: '1.1s' },
    status: 'LIVE',
    color: 'violet',
  },
  {
    id: 'PRJ-003',
    title: 'ClinicFlow SaaS',
    category: 'Web Application',
    stack: ['React', 'API', 'AI Tools'],
    desc: 'Aplikasi manajemen klinik berbasis SaaS dengan integrasi AI untuk penjadwalan otomatis dan rekam medis digital.',
    metrics: { perf: '96', seo: '94', load: '0.9s' },
    status: 'LIVE',
    color: 'emerald',
  },
  {
    id: 'PRJ-004',
    title: 'LuxeStay Hospitality',
    category: 'Hotel Booking',
    stack: ['NEO WP', 'API', 'CDN'],
    desc: 'Website hotel premium dengan sistem booking real-time, galeri sinematik, dan integrasi multi-channel OTA.',
    metrics: { perf: '99', seo: '98', load: '0.7s' },
    status: 'LIVE',
    color: 'rose',
  },
  {
    id: 'PRJ-005',
    title: 'TechVault Dashboard',
    category: 'Admin Dashboard',
    stack: ['React', 'Automation', 'VPS'],
    desc: 'Dashboard analitik untuk perusahaan fintech dengan visualisasi data real-time dan sistem notifikasi otomatis.',
    metrics: { perf: '97', seo: '91', load: '1.0s' },
    status: 'LIVE',
    color: 'cyan',
  },
  {
    id: 'PRJ-006',
    title: 'EduPath LMS',
    category: 'Learning Management',
    stack: ['WordPress', 'LMS Plugin', 'API'],
    desc: 'Platform e-learning dengan 10.000+ pengguna aktif, video streaming, dan sistem ujian berbasis AI.',
    metrics: { perf: '94', seo: '96', load: '1.2s' },
    status: 'LIVE',
    color: 'violet',
  },
]

const colorMap = {
  cyan: 'border-neon-cyan/30 group-hover:border-neon-cyan/70',
  violet: 'border-violet-500/30 group-hover:border-violet-400/70',
  emerald: 'border-emerald-500/30 group-hover:border-emerald-400/70',
  rose: 'border-rose-500/30 group-hover:border-rose-400/70',
}

const textColorMap = {
  cyan: 'text-neon-cyan',
  violet: 'text-violet-400',
  emerald: 'text-emerald-400',
  rose: 'text-rose-400',
}

function ProjectCard({ project, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.09 }}
      className={`group relative bg-dark-card border ${colorMap[project.color]} rounded-sm p-5 flex flex-col gap-4 transition-all duration-300 hover:shadow-neon-sm overflow-hidden`}
    >
      {/* Terminal header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="font-mono text-[10px] text-slate-600 tracking-widest">{project.id}</span>
        <span className={`font-mono text-[9px] tracking-widest ${textColorMap[project.color]} border border-current/30 px-1.5 py-0.5`}>
          ● {project.status}
        </span>
      </div>

      {/* Category */}
      <p className={`font-mono text-[10px] tracking-[0.2em] uppercase ${textColorMap[project.color]}`}>
        {project.category}
      </p>

      {/* Title */}
      <h3 className="font-rajdhani font-bold text-lg text-white group-hover:text-neon-cyan transition-colors duration-300 leading-tight">
        {project.title}
      </h3>

      {/* Description */}
      <p className="font-space text-xs text-slate-500 leading-relaxed flex-1">
        {project.desc}
      </p>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-white/5">
        {[
          { label: 'PERF', val: project.metrics.perf + '/100' },
          { label: 'SEO', val: project.metrics.seo + '/100' },
          { label: 'LOAD', val: project.metrics.load },
        ].map(({ label, val }) => (
          <div key={label} className="text-center">
            <div className={`font-rajdhani font-bold text-sm ${textColorMap[project.color]}`}>{val}</div>
            <div className="font-mono text-[8px] text-slate-600 tracking-widest">{label}</div>
          </div>
        ))}
      </div>

      {/* Stack badges */}
      <div className="flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="font-mono text-[9px] px-2 py-0.5 border border-white/10 text-slate-500 tracking-wider"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Hover shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b from-white/[0.02] to-transparent" />
    </motion.div>
  )
}

export default function Portfolio() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true, margin: '-60px' })

  return (
    <section id="portfolio" className="relative py-28 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-neon-cyan/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="section-label mb-3">// Case Studies</p>
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl text-white">
            SELECTED <span className="neon-text">WORK</span>
          </h2>
          <p className="font-space text-slate-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Proyek-proyek nyata yang telah menghasilkan dampak bisnis yang terukur untuk klien kami.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
