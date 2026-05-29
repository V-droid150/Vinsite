import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'

// ─── Server status (infrastruktur nyata Anda — data ini statis kecuali
//     Anda menghubungkan monitoring tool seperti UptimeRobot API) ─────────────
const SERVER_STATUS = [
  { name: 'VPS Primary (Jakarta)', uptime: 99.8, status: 'ONLINE'  },
  { name: 'DNS Manager',           uptime: 100,  status: 'ONLINE'  },
  { name: 'CDN Network',           uptime: 99.9, status: 'ONLINE'  },
  { name: 'SSL Certificate',       uptime: 100,  status: 'VALID',   detail: '180 days left' },
  { name: 'Backup Server',         uptime: 98.5, status: 'ONLINE'  },
]

const COLOR = {
  cyan:    { text: 'text-neon-cyan',   border: 'border-neon-cyan/20',   bg: 'bg-neon-cyan/5'   },
  violet:  { text: 'text-violet-400',  border: 'border-violet-500/20',  bg: 'bg-violet-500/5'  },
  emerald: { text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
  rose:    { text: 'text-rose-400',    border: 'border-rose-500/20',    bg: 'bg-rose-500/5'    },
}

// ─── Metric card ──────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, icon, color, loading, index }) {
  const c = COLOR[color]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={`glass corner-accent rounded-sm p-5 border ${c.border}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`font-mono text-2xl ${c.text}`}>{icon}</span>
      </div>
      <div className={`font-rajdhani font-bold text-3xl ${c.text} mb-1 ${loading ? 'animate-pulse-slow' : ''}`}>
        {loading ? '—' : value}
      </div>
      <div className="font-space text-xs text-slate-400">{label}</div>
      <div className="font-mono text-[9px] text-slate-700 mt-0.5">{sub}</div>
    </motion.div>
  )
}

// ─── Server status row ────────────────────────────────────────────────────────
function ServerRow({ svc, index }) {
  const barColor =
    svc.uptime >= 99.5 ? 'bg-emerald-400' :
    svc.uptime >= 98   ? 'bg-yellow-400'  : 'bg-red-400'
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1,  x: 0 }}
      transition={{ delay: 0.5 + index * 0.07 }}
      className="flex items-center gap-4"
    >
      <span className="w-44 font-mono text-xs text-slate-400 shrink-0 truncate">{svc.name}</span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${svc.uptime}%` }}
          transition={{ delay: 0.6 + index * 0.07, duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
      <span className="font-mono text-xs text-slate-500 w-12 text-right shrink-0">{svc.uptime}%</span>
      <span className={`font-mono text-[9px] px-2 py-0.5 border tracking-widest shrink-0 ${
        svc.status === 'ONLINE' || svc.status === 'VALID'
          ? 'text-emerald-400 border-emerald-500/30'
          : 'text-red-400 border-red-500/30'
      }`}>
        {svc.detail ?? svc.status}
      </span>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Overview() {
  // ── State untuk metrik real dari Supabase ─────────────────────────────────
  const [stats, setStats]         = useState(null)
  const [recentMsgs, setRecentMsgs] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)

      // Jalankan semua query secara paralel
      const [
        { count: totalMsgs  },
        { count: unreadMsgs },
        { count: totalProjs },
        { count: activeProjs},
        { data:  latest     },
      ] = await Promise.all([
        // Total pesan masuk
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        // Pesan belum dibaca
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('read', false),
        // Total proyek
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        // Proyek aktif (belum LIVE)
        supabase.from('projects').select('*', { count: 'exact', head: true }).neq('status', 'LIVE'),
        // 4 pesan terbaru untuk activity log
        supabase.from('messages').select('name, email, created_at').order('created_at', { ascending: false }).limit(4),
      ])

      setStats({ totalMsgs, unreadMsgs, totalProjs, activeProjs })
      setRecentMsgs(latest ?? [])
      setLoading(false)
    }

    fetchStats()

    // Real-time: update unread count saat pesan baru masuk
    const channel = supabase
      .channel('overview-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchStats()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const metrics = [
    { label: 'Total Pesan Masuk',  value: stats?.totalMsgs  ?? 0,  sub: 'dari form kontak',     icon: '◈', color: 'cyan'    },
    { label: 'Pesan Belum Dibaca', value: stats?.unreadMsgs ?? 0,  sub: 'perlu ditindaklanjuti', icon: '◉', color: 'rose'    },
    { label: 'Total Proyek',       value: stats?.totalProjs ?? 0,  sub: 'di semua status',       icon: '◇', color: 'violet'  },
    { label: 'Proyek Aktif',       value: stats?.activeProjs ?? 0, sub: 'belum selesai',         icon: '⬡', color: 'emerald' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label mb-1">// Dashboard</p>
        <h2 className="font-rajdhani font-bold text-2xl text-white">System Overview</h2>
      </div>

      {/* Metric cards — data dari Supabase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} {...m} loading={loading} index={i} />
        ))}
      </div>

      {/* Server status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="glass corner-accent rounded-sm p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="section-label mb-1">// Infrastructure Monitor</p>
            <h3 className="font-rajdhani font-semibold text-lg text-white">Server & Infrastructure Status</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
            <span className="font-mono text-[9px] text-emerald-400 tracking-widest hidden sm:block">LIVE MONITORING</span>
          </div>
        </div>
        <div className="space-y-3">
          {SERVER_STATUS.map((svc, i) => <ServerRow key={svc.name} svc={svc} index={i} />)}
        </div>
      </motion.div>

      {/* Activity log — pesan terbaru dari Supabase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="glass rounded-sm p-5"
      >
        <p className="section-label mb-4">// Recent Inquiries</p>
        {loading ? (
          <p className="font-mono text-xs text-slate-700 animate-pulse-slow">LOADING...</p>
        ) : recentMsgs.length === 0 ? (
          <p className="font-mono text-xs text-slate-700">// Belum ada pesan masuk</p>
        ) : (
          <div className="space-y-2.5">
            {recentMsgs.map((msg, i) => (
              <div key={i} className="flex items-start gap-3 font-mono text-xs">
                <span className="text-slate-600 shrink-0 w-20 truncate">
                  {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-0.5 shrink-0" />
                <span className="text-slate-500">
                  Pesan baru dari <span className="text-neon-cyan/70">{msg.name}</span> — {msg.email}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
