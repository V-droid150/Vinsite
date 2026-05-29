import { motion } from 'framer-motion'

// ─── Mock data ───────────────────────────────────────────────────────────────
// TODO: Replace each const with a real API call, e.g.:
//   const [metrics, setMetrics] = useState([])
//   useEffect(() => { fetch('/api/metrics').then(r => r.json()).then(setMetrics) }, [])
// ─────────────────────────────────────────────────────────────────────────────

const METRICS = [
  { label: 'Total Visitors',  value: '12,847', change: '+18%',  period: 'vs last month',  icon: '◈', color: 'cyan'    },
  { label: 'Active Projects', value: '7',       change: '+2',    period: 'this month',     icon: '◉', color: 'violet'  },
  { label: 'New Clients',     value: '3',       change: '+1',    period: 'this month',     icon: '◇', color: 'emerald' },
  { label: 'Est. Revenue',    value: 'Rp 42M',  change: '+23%',  period: 'vs last month',  icon: '⬡', color: 'rose'    },
]

const SERVER_STATUS = [
  { name: 'VPS Primary (Jakarta)', uptime: 99.8, status: 'ONLINE'  },
  { name: 'DNS Manager',           uptime: 100,  status: 'ONLINE'  },
  { name: 'CDN Network',           uptime: 99.9, status: 'ONLINE'  },
  { name: 'SSL Certificate',       uptime: 100,  status: 'VALID',   detail: '180 days left' },
  { name: 'Backup Server',         uptime: 98.5, status: 'ONLINE'  },
]

const ACTIVITY_LOG = [
  { time: '09:42', event: 'New contact submission from ahmad@cvnusantara.co.id',     type: 'info'    },
  { time: '08:15', event: 'Deploy successful — NovaCorp v2.1.0 pushed to production', type: 'success' },
  { time: 'Kemarin', event: 'SSL auto-renewed for luxestay.co.id',                  type: 'success' },
  { time: 'Kemarin', event: 'VPS snapshot backup completed — 2.3 GB saved',          type: 'info'    },
]

// Tailwind class maps keyed by color name
const COLOR = {
  cyan:    { text: 'text-neon-cyan',   border: 'border-neon-cyan/20',    bg: 'bg-neon-cyan/5'    },
  violet:  { text: 'text-violet-400',  border: 'border-violet-500/20',   bg: 'bg-violet-500/5'   },
  emerald: { text: 'text-emerald-400', border: 'border-emerald-500/20',  bg: 'bg-emerald-500/5'  },
  rose:    { text: 'text-rose-400',    border: 'border-rose-500/20',     bg: 'bg-rose-500/5'     },
}

// ─── Metric card ─────────────────────────────────────────────────────────────
function MetricCard({ metric, index }) {
  const c = COLOR[metric.color]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={`glass corner-accent rounded-sm p-5 border ${c.border}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`font-mono text-2xl ${c.text}`}>{metric.icon}</span>
        <span className={`font-mono text-[9px] px-1.5 py-0.5 border ${c.border} ${c.bg} ${c.text} tracking-widest`}>
          {metric.change}
        </span>
      </div>
      <div className={`font-rajdhani font-bold text-3xl ${c.text} mb-1`}>{metric.value}</div>
      <div className="font-space text-xs text-slate-400">{metric.label}</div>
      <div className="font-mono text-[9px] text-slate-700 mt-0.5">{metric.period}</div>
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
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.55 + index * 0.07 }}
      className="flex items-center gap-4"
    >
      <span className="w-44 font-mono text-xs text-slate-400 shrink-0 truncate">{svc.name}</span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        {/* Animated fill — width driven by uptime % */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${svc.uptime}%` }}
          transition={{ delay: 0.65 + index * 0.07, duration: 0.8, ease: 'easeOut' }}
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
  return (
    <div className="space-y-6">
      <div>
        <p className="section-label mb-1">// Dashboard</p>
        <h2 className="font-rajdhani font-bold text-2xl text-white">System Overview</h2>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {METRICS.map((m, i) => <MetricCard key={m.label} metric={m} index={i} />)}
      </div>

      {/* Server & Infrastructure Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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

      {/* Activity log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="glass rounded-sm p-5"
      >
        <p className="section-label mb-4">// Activity Log</p>
        <div className="space-y-2.5">
          {ACTIVITY_LOG.map((log, i) => (
            <div key={i} className="flex items-start gap-3 font-mono text-xs">
              <span className="text-slate-600 shrink-0 w-16">{log.time}</span>
              <span className={`w-1.5 h-1.5 rounded-full mt-0.5 shrink-0 ${log.type === 'success' ? 'bg-emerald-400' : 'bg-neon-cyan'}`} />
              <span className="text-slate-500">{log.event}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
