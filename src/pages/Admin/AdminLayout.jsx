import { useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Overview from './Overview'
import Messages from './Messages'
import ProjectManager from './ProjectManager'

// ─── Sidebar navigation items ─────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: '/admin',          label: 'Overview',  icon: '◈', end: true  },
  { to: '/admin/messages', label: 'Messages',  icon: '◉', end: false },
  { to: '/admin/projects', label: 'Projects',  icon: '◇', end: false },
]

// ─── Sidebar component ────────────────────────────────────────────────────────
function Sidebar({ onNavigate }) {
  const navigate = useNavigate()

  return (
    <aside className="w-64 min-h-screen glass border-r border-neon-cyan/10 flex flex-col shrink-0">
      {/* Brand */}
      <div className="p-6 border-b border-neon-cyan/10">
        <span className="font-rajdhani font-bold text-xl tracking-widest neon-text">
          VIN<span className="text-white/70">SITE</span>
        </span>
        <p className="font-mono text-[9px] text-neon-cyan/40 tracking-[0.25em] mt-0.5">
          ADMIN COMMAND CENTER
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-sm font-space text-sm transition-all duration-200 border ${
                isActive
                  ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/25 shadow-neon-sm'
                  : 'text-slate-400 hover:text-neon-cyan hover:bg-neon-cyan/5 border-transparent'
              }`
            }
          >
            <span className="font-mono text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom panel */}
      <div className="p-4 border-t border-neon-cyan/10 space-y-2">
        {/* Back to main site */}
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2 px-4 py-2.5 font-mono text-xs text-slate-500 hover:text-neon-cyan transition-colors duration-200"
        >
          <span>←</span>
          <span>Back to Site</span>
        </button>

        {/* System pulse */}
        <div className="flex items-center gap-2 px-4 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow shrink-0" />
          <span className="font-mono text-[9px] text-slate-600 tracking-widest">ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>
    </aside>
  )
}

// ─── Top bar ──────────────────────────────────────────────────────────────────
function TopBar({ onMenuToggle }) {
  const now = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="glass border-b border-neon-cyan/10 px-6 py-4 flex items-center justify-between shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="md:hidden flex flex-col gap-1.5 p-1 mr-4"
        aria-label="Toggle sidebar"
      >
        <span className="block h-px w-5 bg-neon-cyan" />
        <span className="block h-px w-5 bg-neon-cyan" />
        <span className="block h-px w-3 bg-neon-cyan" />
      </button>

      <div>
        <h1 className="font-rajdhani font-bold text-lg text-white tracking-wider">Admin Dashboard</h1>
        <p className="font-mono text-[9px] text-slate-600 tracking-widest">vinsite@admin:~$</p>
      </div>

      <span className="font-mono text-[10px] text-neon-cyan/40 border border-neon-cyan/15 px-2 py-1 hidden sm:block">
        {now}
      </span>
    </div>
  )
}

// ─── Layout shell ─────────────────────────────────────────────────────────────
export default function AdminLayout() {
  // Mobile sidebar open/close state
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex grid-bg">

      {/* ── Desktop sidebar (always visible ≥ md) ── */}
      <div className="hidden md:flex">
        <motion.div
          initial={{ x: -260 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Sidebar />
        </motion.div>
      </div>

      {/* ── Mobile sidebar (overlay) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="md:hidden fixed top-0 left-0 bottom-0 z-40"
            >
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-auto">
        <TopBar onMenuToggle={() => setMobileOpen(o => !o)} />

        {/* Page content — nested routes */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Routes>
            <Route index          element={<Overview />}       />
            <Route path="messages" element={<Messages />}      />
            <Route path="projects" element={<ProjectManager />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
