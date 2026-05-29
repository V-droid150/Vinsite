import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  'LIVE':        'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  'IN PROGRESS': 'text-neon-cyan   border-neon-cyan/30   bg-neon-cyan/10',
  'REVIEW':      'text-yellow-400  border-yellow-500/30  bg-yellow-500/10',
  'PLANNING':    'text-slate-400   border-slate-500/30   bg-slate-500/10',
}
const STATUS_OPTIONS = ['PLANNING', 'IN PROGRESS', 'REVIEW', 'LIVE']

const PROGRESS_COLOR = (p) =>
  p === 100 ? 'bg-emerald-400' : p >= 60 ? 'bg-neon-cyan' : 'bg-violet-400'

const EMPTY_FORM = { name: '', client: '', stack: '', startDate: '', deadline: '', description: '' }

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ proj, index, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      className="glass corner-accent rounded-sm p-5 flex flex-col gap-3 group relative"
    >
      {/* Delete button — visible on hover */}
      <button
        onClick={() => onDelete(proj.id)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-slate-600 hover:text-red-400 duration-200"
        title="Hapus proyek"
      >
        ✕
      </button>

      <div className="flex items-center justify-between">
        <span className={`font-mono text-[9px] px-2 py-0.5 border tracking-widest ${STATUS_STYLE[proj.status] ?? STATUS_STYLE['PLANNING']}`}>
          {proj.status}
        </span>
      </div>

      <div>
        <h3 className="font-rajdhani font-bold text-base text-white group-hover:text-neon-cyan transition-colors duration-200 leading-tight pr-6">
          {proj.name}
        </h3>
        <p className="font-mono text-[10px] text-slate-600">{proj.client}</p>
      </div>

      <p className="font-space text-xs text-slate-500 leading-relaxed flex-1">{proj.description}</p>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between font-mono text-[9px] text-slate-600 mb-1">
          <span>PROGRESS</span>
          <span>{proj.progress}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${proj.progress}%` }}
            transition={{ delay: index * 0.07 + 0.3, duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${PROGRESS_COLOR(proj.progress)}`}
          />
        </div>
      </div>

      {/* Stack badges */}
      <div className="flex flex-wrap gap-1.5">
        {(proj.stack ?? []).map(s => (
          <span key={s} className="font-mono text-[9px] px-1.5 py-0.5 border border-white/10 text-slate-600">{s}</span>
        ))}
      </div>

      <div className="flex gap-4 font-mono text-[9px] text-slate-700 border-t border-white/5 pt-2">
        <span>START: {proj.start_date ?? '—'}</span>
        <span>DL: {proj.deadline ?? '—'}</span>
      </div>
    </motion.div>
  )
}

// ─── Add Project Modal ────────────────────────────────────────────────────────
function AddProjectModal({ onClose, onAdd }) {
  const [form, setForm]     = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // ── INSERT ke Supabase ──────────────────────────────────────────────────
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name:        form.name,
        client:      form.client,
        status:      'PLANNING',
        progress:    0,
        stack:       form.stack.split(',').map(s => s.trim()).filter(Boolean),
        start_date:  form.startDate   || null,
        deadline:    form.deadline    || null,
        description: form.description || null,
      })
      .select()   // kembalikan row yang baru dibuat
      .single()
    // ────────────────────────────────────────────────────────────────────────

    setLoading(false)
    if (!error && data) { onAdd(data); onClose() }
    else console.error('[ProjectManager] insert error:', error?.message)
  }

  const fields = [
    { name: 'name',        label: 'project_name', placeholder: 'e.g. AgroMarket Platform',               col: 'sm:col-span-2', required: true  },
    { name: 'client',      label: 'client_name',  placeholder: 'e.g. PT Agro Indonesia',                 col: '',              required: true  },
    { name: 'stack',       label: 'tech_stack',   placeholder: 'React, Node.js, VPS (pisahkan koma)',    col: '',              required: false },
    { name: 'startDate',   label: 'start_date',   placeholder: 'e.g. Jun 2026',                          col: '',              required: false },
    { name: 'deadline',    label: 'deadline',     placeholder: 'e.g. Sep 2026',                          col: '',              required: false },
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0   }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="glass corner-accent rounded-sm w-full max-w-lg p-6 border border-neon-cyan/20">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/5">
            <div>
              <p className="section-label mb-0.5">// New Entry</p>
              <h3 className="font-rajdhani font-bold text-lg text-white">Add New Project</h3>
            </div>
            <button onClick={onClose} className="font-mono text-slate-500 hover:text-neon-cyan transition-colors text-lg leading-none">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map(f => (
                <div key={f.name} className={f.col}>
                  <label className="font-mono text-[9px] text-slate-600 tracking-widest block mb-1">~$ {f.label}</label>
                  <input
                    type="text" name={f.name} value={form[f.name]}
                    onChange={handleChange} placeholder={f.placeholder}
                    required={f.required} disabled={loading}
                    className="cli-input w-full px-3 py-2 text-sm rounded-sm disabled:opacity-50"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="font-mono text-[9px] text-slate-600 tracking-widest block mb-1">~$ description</label>
              <textarea
                name="description" value={form.description} onChange={handleChange}
                placeholder="brief_project_description..." rows={2} disabled={loading}
                className="cli-input w-full px-3 py-2 text-sm rounded-sm resize-none disabled:opacity-50"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit" disabled={loading}
                className="flex-1 py-2.5 font-mono text-xs text-dark-bg bg-neon-cyan hover:bg-neon-cyan-dim transition-colors duration-200 font-bold tracking-wider disabled:opacity-60"
              >
                {loading ? '> SAVING...' : '> COMMIT_PROJECT.exe'}
              </button>
              <button
                type="button" onClick={onClose}
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
  const [projects, setProjects]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)

  // ── Fetch semua proyek dari Supabase ─────────────────────────────────────
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setProjects(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  // ── Tambah proyek baru (dipanggil dari modal setelah INSERT sukses) ───────
  const handleAdd = (newProject) => setProjects(prev => [newProject, ...prev])

  // ── Hapus proyek ─────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    await supabase.from('projects').delete().eq('id', id)
    // Hapus dari local state tanpa perlu re-fetch
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="section-label mb-1">// Portfolio Manager</p>
          <h2 className="font-rajdhani font-bold text-2xl text-white">Active Projects</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="cta-pulse px-5 py-2.5 font-mono text-xs text-dark-bg bg-neon-cyan hover:bg-neon-cyan-dim transition-colors duration-200 font-bold tracking-wider"
        >
          + ADD NEW PROJECT
        </motion.button>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(STATUS_STYLE).map(([s, cls]) => (
          <span key={s} className={`font-mono text-[9px] px-2 py-0.5 border tracking-widest ${cls}`}>{s}</span>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass rounded-sm p-8 text-center">
          <p className="font-mono text-xs text-slate-600 tracking-widest animate-pulse-slow">LOADING PROJECTS...</p>
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {projects.map((proj, i) => (
              <ProjectCard key={proj.id} proj={proj} index={i} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
          {projects.length === 0 && (
            <p className="col-span-full font-mono text-xs text-slate-700 text-center py-8">
              // NO PROJECTS YET — ADD YOUR FIRST PROJECT
            </p>
          )}
        </div>
      )}

      <AnimatePresence>
        {showModal && <AddProjectModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
      </AnimatePresence>
    </div>
  )
}
