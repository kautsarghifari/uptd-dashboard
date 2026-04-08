import { RefreshCw, Clock, WifiOff } from 'lucide-react'
import logoIntala from '../assets/logo-intala.png'

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
      {/* Top institutional bar - Indonesian flag inspired */}
      <div className="flex w-full mb-0 overflow-hidden rounded-t-sm" style={{ height: '4px' }}>
        <div className="flex-1" style={{ background: '#b91c1c' }} />
        <div className="flex-1" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }} />
      </div>

      {/* Main header bar */}
      <div
        className="bg-white px-6 py-5"
        style={{ borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          {/* Title group with seal */}
          <div className="flex items-start gap-4">
            {/* Institutional emblem */}
            <div className="flex-shrink-0 w-28 h-28 flex items-center justify-center">
              <img
                src={logoIntala}
                alt="Logo Direktorat Bina Intala"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wider uppercase mb-0.5" style={{ color: '#64748b', letterSpacing: '0.08em' }}>
                Direktorat Bina Intala
              </p>
              <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight" style={{ color: '#0f172a' }}>
                Dashboard Kelengkapan Data UPTD
              </h1>
              <p className="text-sm mt-1" style={{ color: '#475569' }}>
                Sistem Monitoring Progres Kelengkapan Data Unit Pelaksana Teknis Daerah
              </p>

              {/* Status indicator */}
              <div className="flex items-center gap-2 mt-3">
                <div className="relative flex items-center justify-center w-2 h-2">
                  <span
                    className="live-dot absolute inline-flex h-full w-full rounded-full opacity-60"
                    style={{ background: error ? '#b91c1c' : '#15803d' }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ background: error ? '#b91c1c' : '#15803d' }}
                  />
                </div>
                <span
                  className="text-xs font-semibold tracking-wider uppercase"
                  style={{ color: error ? '#b91c1c' : '#15803d', letterSpacing: '0.06em' }}
                >
                  {error ? 'Koneksi Terputus' : 'Sistem Aktif'}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-end gap-2">
            <div
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: '#64748b', letterSpacing: '0.06em' }}
            >
              {formatDate(lastUpdated || new Date())}
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: '#475569' }}>
              <Clock size={13} aria-hidden="true" />
              <span>Pembaruan terakhir: <span className="font-semibold tabular-nums" style={{ color: '#0f172a' }}>{lastUpdated ? formatTime(lastUpdated) : '—'}</span></span>
            </div>

            {/* Refresh button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              aria-label="Perbarui data"
              className="mt-1 flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: '#1e3a8a',
                color: '#ffffff',
                border: '1px solid #1e3a8a',
                outlineColor: '#1e3a8a',
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = '#1e40af')}
              onMouseLeave={e => !loading && (e.currentTarget.style.background = '#1e3a8a')}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
              {loading ? 'Memuat data...' : 'Perbarui Data'}
            </button>
          </div>
        </div>

        {/* Error notice */}
        {error && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-3 px-4 py-3 rounded-md text-sm"
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderLeft: '4px solid #b91c1c',
              color: '#991b1b',
            }}
          >
            <WifiOff size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold">Gagal mengambil data terbaru</p>
              <p className="mt-0.5" style={{ color: '#7f1d1d' }}>{error}. Sistem menampilkan data terakhir yang tersedia.</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}