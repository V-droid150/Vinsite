import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime()
  const min  = Math.floor(diff / 60000)
  const hr   = Math.floor(diff / 3600000)
  const day  = Math.floor(diff / 86400000)
  if (min  < 1)  return 'Baru saja'
  if (min  < 60) return `${min} menit lalu`
  if (hr   < 24) return `${hr} jam lalu`
  return `${day} hari lalu`
}

// ─── Detail panel ─────────────────────────────────────────────────────────────
function MessageDetail({ msg }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="px-6 py-5 bg-neon-cyan/[0.03] border-b border-neon-cyan/10">
        {/* Meta */}
        <div className="flex flex-wrap gap-6 mb-4 pb-4 border-b border-white/5">
          {[
            { label: 'FROM',    val: `${msg.name} <${msg.email}>` },
            { label: 'COMPANY', val: msg.company || '—'           },
            { label: 'BUDGET',  val: msg.budget  || '—'           },
          ].map(({ label, val }) => (
            <div key={label}>
              <div className="font-mono text-[9px] text-slate-600 tracking-widest mb-0.5">{label}</div>
              <div className="font-mono text-xs text-neon-cyan">{val}</div>
            </div>
          ))}
        </div>
        {/* Body */}
        <p className="font-mono text-[11px] text-slate-400 leading-relaxed whitespace-pre-line">
          {msg.message}
        </p>
        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-4">
          <a
            href={`mailto:${msg.email}?subject=Re: Inquiry dari VinSite`}
            className="px-4 py-2 font-mono text-xs text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/10 transition-colors duration-200"
          >
            → REPLY VIA EMAIL
          </a>
          <a
            href={`https://wa.me/6282113515619?text=Halo%20${encodeURIComponent(msg.name)}%2C%20terima%20kasih%20telah%20menghubungi%20VinSite.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 font-mono text-xs text-slate-500 border border-white/10 hover:bg-white/5 transition-colors duration-200"
          >
            → WHATSAPP
          </a>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Messages() {
  const [messages, setMessages]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [selectedId, setSelectedId] = useState(null)

  // ── Fetch awal dari Supabase ──────────────────────────────────────────────
  const fetchMessages = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setMessages(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMessages()

    // ── Real-time subscription: pesan baru langsung muncul tanpa refresh ──
    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          // Sisipkan pesan baru di paling atas list
          setMessages(prev => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchMessages])

  // ── Klik baris → expand + tandai sudah dibaca ─────────────────────────────
  const handleSelect = async (id) => {
    setSelectedId(prev => (prev === id ? null : id))

    // Update kolom `read` di Supabase
    await supabase.from('messages').update({ read: true }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="section-label mb-1">// CLI Inbox</p>
          <h2 className="font-rajdhani font-bold text-2xl text-white">Messages</h2>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              className="font-mono text-xs text-neon-cyan border border-neon-cyan/30 px-2 py-1"
            >
              {unreadCount} UNREAD
            </motion.span>
          )}
          <button
            onClick={fetchMessages}
            className="font-mono text-[10px] text-slate-600 hover:text-neon-cyan transition-colors px-2 py-1 border border-white/5"
          >
            ↺ REFRESH
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="glass rounded-sm p-8 text-center">
          <p className="font-mono text-xs text-slate-600 tracking-widest animate-pulse-slow">
            LOADING MESSAGES...
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && messages.length === 0 && (
        <div className="glass rounded-sm p-8 text-center">
          <p className="font-mono text-xs text-slate-600 tracking-widest">
            // NO MESSAGES YET — INBOX EMPTY
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && messages.length > 0 && (
        <div className="glass rounded-sm overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-white/5 font-mono text-[9px] text-slate-600 tracking-widest uppercase">
            <div className="col-span-1">●</div>
            <div className="col-span-3">From</div>
            <div className="col-span-4 hidden md:block">Subject / Preview</div>
            <div className="col-span-2 hidden sm:block">Budget</div>
            <div className="col-span-2">Time</div>
          </div>

          {messages.map((msg, i) => (
            <div key={msg.id}>
              {/* Row */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleSelect(msg.id)}
                className={`grid grid-cols-12 gap-2 px-4 py-3.5 border-b border-white/5 cursor-pointer transition-all duration-200 select-none ${
                  selectedId === msg.id
                    ? 'bg-neon-cyan/5 border-l-2 border-l-neon-cyan'
                    : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'
                }`}
              >
                {/* Unread dot */}
                <div className="col-span-1 flex items-center">
                  <span className={`w-2 h-2 rounded-full ${msg.read ? 'bg-slate-700' : 'bg-neon-cyan animate-pulse-slow'}`} />
                </div>
                {/* Sender */}
                <div className="col-span-3 min-w-0">
                  <div className={`font-space text-sm truncate ${msg.read ? 'text-slate-400' : 'text-white font-medium'}`}>
                    {msg.name}
                  </div>
                  <div className="font-mono text-[9px] text-slate-600 truncate">{msg.company || msg.email}</div>
                </div>
                {/* Preview */}
                <div className="col-span-4 hidden md:flex items-center">
                  <span className="font-space text-sm text-slate-500 truncate">
                    {msg.message.slice(0, 60)}{msg.message.length > 60 ? '…' : ''}
                  </span>
                </div>
                {/* Budget */}
                <div className="col-span-2 hidden sm:flex items-center">
                  <span className="font-mono text-xs text-neon-cyan">{msg.budget || '—'}</span>
                </div>
                {/* Time */}
                <div className="col-span-2 flex items-center">
                  <span className="font-mono text-[10px] text-slate-600">{timeAgo(msg.created_at)}</span>
                </div>
              </motion.div>

              {/* Expanded detail */}
              <AnimatePresence>
                {selectedId === msg.id && <MessageDetail msg={msg} />}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
