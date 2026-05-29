import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Mock data ────────────────────────────────────────────────────────────────
// TODO: Replace with real fetch:
//   useEffect(() => { fetch('/api/messages').then(r => r.json()).then(setMessages) }, [])
// When marking read, call: PATCH /api/messages/:id  { read: true }
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_MESSAGES = [
  {
    id: 1,
    from: 'Ahmad Fauzi',
    email: 'ahmad@cvnusantara.co.id',
    company: 'CV Nusantara',
    subject: 'Project Inquiry — Company Profile Website',
    message:
      'Selamat siang tim VinSite,\n\nSaya tertarik untuk membuat website company profile untuk perusahaan kami yang bergerak di bidang distribusi bahan bangunan. Kami membutuhkan tampilan yang modern, profesional, dan mobile-friendly.\n\nMohon dapat dikirimkan proposal dan estimasi biaya pengerjaan. Terima kasih.',
    budget: 'Rp 15.000.000',
    time: '2 jam lalu',
    read: false,
  },
  {
    id: 2,
    from: 'Siti Rahayu',
    email: 'siti@fashionbatik.com',
    company: 'Fashion Batik ID',
    subject: 'E-Commerce Platform Development',
    message:
      'Halo VinSite,\n\nKami membutuhkan platform e-commerce untuk toko batik online kami. Produk mencapai 500+ SKU dengan varian warna dan ukuran. Perlu integrasi payment gateway lokal (Midtrans) dan sinkronisasi stok dengan Tokopedia & Shopee.\n\nBisa kita jadwalkan meeting untuk diskusi lebih lanjut?',
    budget: 'Rp 28.000.000',
    time: '5 jam lalu',
    read: false,
  },
  {
    id: 3,
    from: 'Budi Santoso',
    email: 'budi@kliniksehat.id',
    company: 'Klinik Sehat Bersama',
    subject: 'Web App Manajemen Klinik + AI Scheduling',
    message:
      'Tim VinSite yang terhormat,\n\nKami mencari mitra pengembang untuk sistem manajemen klinik berbasis web. Fitur yang dibutuhkan: jadwal dokter otomatis, rekam medis digital, antrian online, dan notifikasi WhatsApp untuk pasien.\n\nKami juga tertarik dengan integrasi AI untuk optimasi jadwal.',
    budget: 'Rp 55.000.000',
    time: '1 hari lalu',
    read: true,
  },
  {
    id: 4,
    from: 'Dewi Permata',
    email: 'dewi@hotelgrand.com',
    company: 'Grand Hotel Nusantara',
    subject: 'Website Hotel + Booking System Real-time',
    message:
      'Selamat pagi,\n\nHotel kami ingin memperbarui website dan sistem booking. Kebutuhan utama: tampilan premium berkelas, galeri foto & video sinematik, sistem booking real-time, dan integrasi channel manager dengan OTA (Traveloka, Booking.com).\n\nKapan bisa presentasi?',
    budget: 'Rp 35.000.000',
    time: '2 hari lalu',
    read: true,
  },
  {
    id: 5,
    from: 'Rizky Andika',
    email: 'rizky@startuptech.io',
    company: 'StartupTech Indonesia',
    subject: 'SaaS Dashboard + REST API Integration',
    message:
      'Hi VinSite,\n\nStartup kami butuh dashboard SaaS yang clean dan powerful. Fitur: user management dengan role-based access, analytics charts real-time, integrasi 3rd party APIs, dan export laporan ke PDF/Excel. Tech stack yang kami prefer: React + Node.js + PostgreSQL.\n\nAda portfolio SaaS yang bisa kami lihat?',
    budget: 'Rp 75.000.000',
    time: '3 hari lalu',
    read: true,
  },
]

// ─── Detail panel (expanded message) ─────────────────────────────────────────
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
        {/* Meta row */}
        <div className="flex flex-wrap gap-6 mb-4 pb-4 border-b border-white/5">
          {[
            { label: 'FROM',    val: `${msg.from} <${msg.email}>` },
            { label: 'COMPANY', val: msg.company },
            { label: 'BUDGET',  val: msg.budget  },
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
            href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
            className="px-4 py-2 font-mono text-xs text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/10 transition-colors duration-200"
          >
            → REPLY VIA EMAIL
          </a>
          <a
            href={`https://wa.me/6282113515619?text=Halo%20${encodeURIComponent(msg.from)}%2C%20terima%20kasih%20telah%20menghubungi%20VinSite.`}
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
  // selectedId — which message row is expanded
  const [selectedId, setSelectedId] = useState(null)

  // messages state — in production sync read status via PATCH /api/messages/:id
  const [messages, setMessages] = useState(INITIAL_MESSAGES)

  const handleSelect = (id) => {
    setSelectedId(prev => (prev === id ? null : id))
    // Mark as read locally; in production call API here
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
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-mono text-xs text-neon-cyan border border-neon-cyan/30 px-2 py-1"
          >
            {unreadCount} UNREAD
          </motion.span>
        )}
      </div>

      {/* Table */}
      <div className="glass rounded-sm overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-white/5 font-mono text-[9px] text-slate-600 tracking-widest uppercase">
          <div className="col-span-1">●</div>
          <div className="col-span-3">From</div>
          <div className="col-span-4 hidden md:block">Subject</div>
          <div className="col-span-2 hidden sm:block">Budget</div>
          <div className="col-span-2">Time</div>
        </div>

        {messages.map((msg, i) => (
          <div key={msg.id}>
            {/* Row */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => handleSelect(msg.id)}
              className={`grid grid-cols-12 gap-2 px-4 py-3.5 border-b border-white/5 cursor-pointer transition-all duration-200 select-none ${
                selectedId === msg.id
                  ? 'bg-neon-cyan/5 border-l-2 border-l-neon-cyan'
                  : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'
              }`}
            >
              {/* Read indicator */}
              <div className="col-span-1 flex items-center">
                <span className={`w-2 h-2 rounded-full ${msg.read ? 'bg-slate-700' : 'bg-neon-cyan animate-pulse-slow'}`} />
              </div>

              {/* Sender */}
              <div className="col-span-3 min-w-0">
                <div className={`font-space text-sm truncate ${msg.read ? 'text-slate-400' : 'text-white font-medium'}`}>
                  {msg.from}
                </div>
                <div className="font-mono text-[9px] text-slate-600 truncate">{msg.company}</div>
              </div>

              {/* Subject */}
              <div className="col-span-4 hidden md:flex items-center">
                <span className="font-space text-sm text-slate-500 truncate">{msg.subject}</span>
              </div>

              {/* Budget */}
              <div className="col-span-2 hidden sm:flex items-center">
                <span className="font-mono text-xs text-neon-cyan">{msg.budget}</span>
              </div>

              {/* Time */}
              <div className="col-span-2 flex items-center">
                <span className="font-mono text-[10px] text-slate-600">{msg.time}</span>
              </div>
            </motion.div>

            {/* Expanded detail panel */}
            <AnimatePresence>
              {selectedId === msg.id && <MessageDetail msg={msg} />}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
