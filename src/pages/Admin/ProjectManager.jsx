import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Mock data ────────────────────────────────────────────────────────────────
// TODO: Replace with real fetch:
//   useEffect(() => { fetch('/api/projects').then(r => r.json()).then(setProjects) }, [])
// For add: POST /api/projects  →  append returned project to state
// For update: PATCH /api/projects/:id
// For delete: DELETE /api/projects/:id
// ─────────────────────────────────────────────────────────────────────────────
const SEED_PROJECTS = [
  {
    id: 1,
    name: 'NovaCorp Digital Hub',
    client: 'PT Nova Corporation',
    status: 'LIVE',
    progress: 100,
    stack: ['React', 'Node.js', 'VPS'],
    startDate: 'Jan 2026',
    deadline: 'Feb 2026',
    desc: 'Corporate portal dengan CMS kustom, SEO enterprise, dan load time < 1s.',
  },
  {
    id: 2,
    name: 'ClinicFlow SaaS',
    client: 'Klinik Sehat Bersama',
    status: 'IN PROGRESS',
    progress: 65,
    stack: ['React', 'Claude API', 'MongoDB'],
    startDate: 'Mar 2026',
    deadline: 'Jun 2026',
    desc: 'Aplikasi manajemen klinik dengan AI scheduling dan rekam medis digital.',
  },
  {
    id: 3,
    name: 'FashionBatik Store',
    client: 'Fashion Batik ID',
    status: 'IN PROGRESS',
    progress: 30,
    stack: ['WooCommerce', 'WordPress', 'CDN'],
    startDate: 'Apr 2026',
    deadline: 'Jul 2026',
    desc: 'Platform e-commerce 500+ SKU dengan integrasi marketplace dan payment gateway.',
  },
  {
    id: 4,
    name: 'StartupTech Dashboard',
    client: 'StartupTech Indonesia',
    status: 'REVIEW',
    progress: 90,
    stack: ['React', 'Node.js', 'REST API'],
    startDate: 'Feb 2026',
    deadline: 'May 2026',
    desc: 'SaaS dashboard dengan real-time analytics dan role-based access control.',
  },
  {
    id: 5,
    name: 'Grand Hotel Website',
    client: 'Grand Hotel Nusantara',
    status: 'PLANNING',
    progress: 10,
    stack: ['NEO WP', 'Booking API', 'CDN'],
    startDate: 'May 2026',
    deadline: 'Aug 2026',
    desc: 'Website hotel premium dengan booking system real-time dan galeri sinematik.',
  },
]

const STATUS_STYLE = {
  'LIVE':        'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  'IN PROGRESS': 'text-neon-cyan   border-neon-cyan/30   bg-neon-cyan/10',
  'REVIEW':      'text-yellow-400  border-yellow-500/30  bg-yellow-500/10',
  'PLANNING':    'text-slate-400   border-slate-500/30   bg-slate-500/10',
}

const PROGRESS_COLOR = (p) =>
  p === 100 ? 'bg-emerald-400' : p >= 60 ? 'bg-neon-cyan' : 'bg-violet-400'

// ─── Empty form template ──────────────────────────────────────────────────────
const EMPTY_FORM = { name: '', client: '', stack: '', startDate: '', deadline: '', desc: '' }

// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({ proj, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="glass corner-accent rounded-sm p-5 flex flex-col gap-3 group"
    >
      {/* Status badge + ID */}
      <div className="flex items-center justify-between">
        <span className={`font-mono text-[9px] px-2 py-0.5 border tracking-widest ${STATUS_STYLE[proj.status]}`}>
          {proj.status}
        </span>
        <span className="font-mono text-[9px] text-slate-700">
          #{String(proj.id).padStart(3, '0')}
        </span>
      </div>

      {/* Name & client */}
      <div>
        <h3 className="font-rajdhani font-bold text-base text-white group-hover:text-neon-cyan transition-colors duration-200 leading-tight">
          {proj.name}
        </h3>
        <p className="font-mono text-[10px] text-slate-600">{proj.client}</p>
      </div>

      {/* Description */}
      <p className="font-space text-xs text-slate-500 leading-relaxed flex-1">{proj.desc}</p>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between font-mono text-[9px] text-slate-600 mb-1">
          <span>PROGRESS</span>
          <span>{proj.progress}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          {/* Width animated from 0 → real value on mount */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${proj.progress}%` }}
            transition={{ delay: index * 0.08 + 0.3, duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${PROGRESS_COLOR(proj.progress)}`}
          />
        </div>
      </div>

      {/* Stack badges */}
      <div className="flex flex-wrap gap-1.5">
        {proj.stack.map(s => (
          <span key={s} className="font-mono text-[9px] px-1.5 py-0.5 border border-white/10 text-slate-600">
            {s}
          </span>
        ))}
      </div>

      {/* Dates */}
      <div className="flex gap-4 font-mono text-[9px] text-slate-700 border-t border-white/5 pt-2">
        <span>START: {proj.startDate}</span>
        <span>DL: {proj.deadline}</span>
      </div>
    </motion.div>
  )
}

// ─── Add Project Modal ────────────────────────────────────────────────────────
function AddProjectModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Replace body with POST /api/projects call; use returned id from server
    onAdd({
      id: Date.now(),
      name: form.name,
      client: form.client,
      status: 'PLANNING',
      progress: 0,
      stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
      startDate: form.startDate || '—',
      deadline: form.deadline || '—',
      desc: form.desc,
    })
    onClose()
  }

  const fields = [
    { name: 'name',      label: 'project_name', placeholder: 'e.g. AgroMarket Platform',              required: true  },
    { name: 'client',    label: 'client_name',   placeholder: 'e.g. PT Agro Indonesia',                required: true  },
    { name: 'stack',     label: 'tech_stack',    placeholder: 'React, Node.js, VPS  (comma separated)', required: false },
    { name: 'startDate', label: 'start_date',    placeholder: 'e.g. Jun 2026',                         required: false },
    { name: 'deadline',  label: 'deadline',      placeholder: 'e.g. Sep 2026',                         required: false },
  ]

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
      />

      {/* Modal panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="glass corner-accent rounded-sm w-full max-w-lg p-6 border border-neon-cyan/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/5">
            <div>
              <p className="section-label mb-0.5">// New Entry</p>
              <h3 className="font-rajdhani font-bold text-lg text-white">Add New Project</h3>
            </div>
            <button
              onClick={onClose}
              className="font-mono text-slate-500 hover:text-neon-cyan transition-colors text-lg leading-none"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Single-line fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map(f => (
                <div key={f.name} className={f.name === 'stack' ? 'sm:col-span-2' : ''}>
                  <label className="font-mono text-[9px] text-slate-600 tracking-widest block mb-1">
                    ~$ {f.label}
                  </label>
                  <input
                    type="text"
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    required={f.required}
                    className="cli-input w-full px-3 py-2 text-sm rounded-sm"
                  />
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <label className="font-mono text-[9px] text-slate-600 tracking-widest block mb-1">
                ~$ description
              </label>
              <textarea
                name="desc"
                value={form.desc}
                onChange={handleChange}
                placeholder="brief_project_description..."
                rows={2}
                className="cli-input w-full px-3 py-2 text-sm rounded-sm resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 font-mono text-xs text-dark-bg bg-neon-cyan hover:bg-neon-cyan-dim transition-colors duration-200 font-bold tracking-wider"
              >
                {'>'} COMMIT_PROJECT.exe
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 font-mono text-xs text-slate-500 border border-white/10 hover:bg-white/5 transition-colors duration-200"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectManager() {
  // projects — in production, initialise from API and persist mutations back to server
  const [projects, setProjects] = useState(SEED_PROJECTS)
  const [showModal, setShowModal] = useState(false)

  const handleAdd = (newProject) => setProjects(prev => [newProject, ...prev])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="section-label mb-1">// Portfolio Manager</p>
          <h2 className="font-rajdhani font-bold text-2xl text-white">Active Projects</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="cta-pulse px-5 py-2.5 font-mono text-xs text-dark-bg bg-neon-cyan hover:bg-neon-cyan-dim transition-colors duration-200 font-bold tracking-wider"
        >
          + ADD NEW PROJECT
        </motion.button>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(STATUS_STYLE).map(([status, cls]) => (
          <span key={status} className={`font-mono text-[9px] px-2 py-0.5 border tracking-widest ${cls}`}>
            {status}
          </span>
        ))}
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((proj, i) => (
          <ProjectCard key={proj.id} proj={proj} index={i} />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <AddProjectModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
        )}
      </AnimatePresence>
    </div>
  )
}
