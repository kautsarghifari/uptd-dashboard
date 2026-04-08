import { RefreshCw, Clock, WifiOff } from 'lucide-react'

function formatDate(date) {
  if (!date) return '—'
  return date.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatTime(date) {
  if (!date) return ''
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function Header({ lastUpdated, onRefresh, loading, error }) {
  return (
    <header className="relative">
      {/* Top accent line */}
      <div className="h-1 w-full mb-6 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #0284c7 40%, #7c3aed 70%, transparent)' }} />

      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Title group */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="relative flex items-center justify-center w-2 h-2">
              <span className="live-dot absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: error ? '#dc2626' : '#16a34a' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: error ? '#dc2626' : '#16a34a' }} />
            </div>
            <span className="text-xs font-mono tracking-widest uppercase" style={{ color: error ? '#dc2626' : '#16a34a' }}>
              {error ? 'Koneksi Gagal' : 'Live Update'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold leading-tight tracking-tight" style={{ color: '#1e293b' }}>
            Dashboard Validasi<br />
            <span style={{ color: '#0284c7' }}>Data UPTD</span>
          </h1>
          <p className="text-sm font-body mt-2" style={{ color: '#64748b' }}>
            Monitoring progres validasi data seluruh unit pelaksana teknis daerah
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-end gap-2">
          {/* Last updated */}
          <div className="flex items-center gap-1.5 text-sm font-body" style={{ color: '#64748b' }}>
            <Clock size={13} />
            <span>Update terakhir: {lastUpdated ? formatTime(lastUpdated) : '—'}</span>
          </div>
          <div className="text-sm font-body" style={{ color: '#64748b' }}>
            {formatDate(lastUpdated || new Date())}
          </div>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium transition-all disabled:opacity-50"
            style={{
              background: '#ffffff',
              border: '1px solid #bfdbfe',
              color: '#0284c7',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Memuat...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error notice */}
      {error && (
        <div
          className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body"
          style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', color: '#b91c1c' }}
        >
          <WifiOff size={14} />
          <span>Gagal mengambil data: {error}. Menampilkan data terakhir yang tersedia.</span>
        </div>
      )}
    </header>
  )
}
