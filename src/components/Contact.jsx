import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { supabase } from '../lib/supabase'

const contactInfo = [
  {
    label: 'WHATSAPP',
    value: '+62 821 1351 5619',
    href: 'https://wa.me/6282113515619',
    icon: '◈ WA',
  },
  {
    label: 'EMAIL',
    value: 'kiekevin27@gmail.com',
    href: 'mailto:kiekevin27@gmail.com',
    icon: '◉ EM',
  },
]

const FIELDS = [
  { name: 'name',    label: 'name',    placeholder: 'your_name',              type: 'text',  prefix: '~$', required: true  },
  { name: 'company', label: 'company', placeholder: 'company_name (optional)', type: 'text',  prefix: '~$', required: false },
  { name: 'email',   label: 'email',   placeholder: 'email@domain.com',        type: 'email', prefix: '~$', required: true  },
  { name: 'budget',  label: 'budget',  placeholder: 'project_budget',          type: 'text',  prefix: '~$', required: false },
]

const EMPTY = { name: '', company: '', email: '', budget: '', message: '' }

// Status states untuk feedback visual
const STATUS = { idle: 'idle', loading: 'loading', success: 'success', error: 'error' }

export default function Contact() {
  const headRef = useRef(null)
  const headInView = useInView(headRef, { once: true, margin: '-60px' })

  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState(STATUS.idle)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(STATUS.loading)
    setErrorMsg('')

    // ── Kirim ke Supabase ────────────────────────────────────────────────────
    // Data tersimpan di tabel `messages` dan langsung muncul di admin dashboard
    const { error } = await supabase.from('messages').insert({
      name:    form.name,
      company: form.company || null,
      email:   form.email,
      budget:  form.budget  || null,
      message: form.message,
      read:    false,
    })
    // ────────────────────────────────────────────────────────────────────────

    if (error) {
      console.error('[Contact] Supabase error:', error.message)
      setErrorMsg('Gagal mengirim pesan. Silakan hubungi via WhatsApp.')
      setStatus(STATUS.error)
      return
    }

    setStatus(STATUS.success)
    setForm(EMPTY)
    // Reset status setelah 5 detik
    setTimeout(() => setStatus(STATUS.idle), 5000)
  }

  const isLoading = status === STATUS.loading

  return (
    <section id="contact" className="relative py-28 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-neon-cyan/20 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="section-label mb-3">// Initialize Contact</p>
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl text-white">
            START A <span className="neon-text">PROJECT</span>
          </h2>
          <p className="font-space text-slate-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Siap membawa bisnis Anda ke level berikutnya? Kirim brief singkat dan tim kami akan merespons dalam 24 jam.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact info panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* System status card */}
            <div className="glass corner-accent rounded-sm p-5">
              <p className="section-label mb-4">// System Status</p>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'AVAILABILITY', val: 'OPEN FOR PROJECTS', dot: true, valClass: 'text-emerald-400' },
                  { label: 'RESPONSE TIME', val: '< 24 HOURS',        dot: false, valClass: 'text-neon-cyan'   },
                  { label: 'TIMEZONE',      val: 'WIB (UTC+7)',        dot: false, valClass: 'text-slate-400'   },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-500">{row.label}</span>
                    <span className={`flex items-center gap-1.5 font-mono text-xs ${row.valClass}`}>
                      {row.dot && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />}
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct contact cards */}
            {contactInfo.map(c => (
              <motion.a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 4, boxShadow: '0 0 12px rgba(0,229,255,0.2)' }}
                className="glass corner-accent rounded-sm p-5 flex flex-col gap-1.5 group border border-neon-cyan/10 hover:border-neon-cyan/40 transition-all duration-300"
              >
                <span className="font-mono text-[9px] text-neon-cyan/50 tracking-widest">{c.label}</span>
                <span className="font-rajdhani font-semibold text-white group-hover:text-neon-cyan transition-colors duration-200">
                  {c.value}
                </span>
                <span className="font-mono text-[9px] text-slate-600 group-hover:text-neon-cyan/50 transition-colors duration-200">
                  {c.icon} → CONNECT
                </span>
              </motion.a>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3"
          >
            <div className="glass corner-accent rounded-sm p-6">
              {/* Terminal header */}
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-white/5">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <span className="font-mono text-[10px] text-slate-600 tracking-widest">
                  vinsite@contact:~$ new_project_inquiry
                </span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FIELDS.map(f => (
                    <div key={f.name} className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] text-slate-600 tracking-widest uppercase">
                        {f.prefix} {f.label}
                      </label>
                      <input
                        type={f.type}
                        name={f.name}
                        value={form[f.name]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        required={f.required}
                        disabled={isLoading}
                        className="cli-input w-full px-3 py-2.5 text-sm rounded-sm disabled:opacity-50"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] text-slate-600 tracking-widest uppercase">
                    ~$ message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="describe_your_project..."
                    rows={4}
                    required
                    disabled={isLoading}
                    className="cli-input w-full px-3 py-2.5 text-sm rounded-sm resize-none disabled:opacity-50"
                  />
                </div>

                {/* Error message */}
                {status === STATUS.error && (
                  <p className="font-mono text-xs text-red-400 border border-red-500/20 px-3 py-2">
                    ✗ {errorMsg}
                  </p>
                )}

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.01 } : {}}
                  whileTap={!isLoading ? { scale: 0.99 } : {}}
                  className={`mt-2 w-full py-3.5 font-rajdhani font-bold text-lg tracking-widest transition-all duration-300 rounded-sm disabled:cursor-not-allowed ${
                    status === STATUS.success
                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                      : status === STATUS.error
                      ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                      : isLoading
                      ? 'bg-neon-cyan/50 text-dark-bg'
                      : 'cta-pulse bg-neon-cyan text-dark-bg hover:bg-neon-cyan-dim'
                  }`}
                >
                  {status === STATUS.success
                    ? '✓ PESAN TERKIRIM — KAMI AKAN SEGERA MERESPONS'
                    : isLoading
                    ? '> SENDING...'
                    : '> SUBMIT_INQUIRY.exe'}
                </motion.button>

                <p className="font-mono text-[9px] text-slate-700 text-center tracking-wider">
                  // Pesan tersimpan langsung ke sistem VinSite
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
