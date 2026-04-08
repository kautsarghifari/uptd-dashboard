import { useState, useMemo } from 'react'
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'

// Status colors aligned with government palette
const STATUS_COLORS = {
  high:   { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', bar: '#15803d' },
  mid:    { bg: '#eff6ff', text: '#1e3a8a', border: '#bfdbfe', bar: '#1e3a8a' },
  low:    { bg: '#fffbeb', text: '#b45309', border: '#fde68a', bar: '#b45309' },
  critical: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', bar: '#b91c1c' },
}

const getStatus = (p) =>
  p >= 50 ? STATUS_COLORS.high :
  p >= 25 ? STATUS_COLORS.mid :
  p >= 10 ? STATUS_COLORS.low : STATUS_COLORS.critical

function PersenBadge({ persen }) {
  const c = getStatus(persen)
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tabular-nums"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {persen.toFixed(2)}%
    </span>
  )
}

function ProgressBar({ persen }) {
  const c = getStatus(persen)
  return (
    <div
      className="w-full h-1.5 rounded-sm overflow-hidden"
      style={{ background: '#e2e8f0' }}
      role="progressbar"
      aria-valuenow={persen}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full transition-all duration-500"
        style={{ width: `${Math.min(persen, 100)}%`, background: c.bar }}
      />
    </div>
  )
}

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <ArrowUpDown size={12} style={{ color: '#cbd5e1' }} aria-hidden="true" />
  return sortDir === 'asc'
    ? <ArrowUp size={12} style={{ color: '#1e3a8a' }} aria-hidden="true" />
    : <ArrowDown size={12} style={{ color: '#1e3a8a' }} aria-hidden="true" />
}

const PAGE_SIZE = 10

export function DataTable({ data }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortCol, setSortCol] = useState('no')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
    setPage(1)
  }

  const filtered = useMemo(() => {
    let rows = [...data]
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(r => r.satker.toLowerCase().includes(q))
    }
    if (filter === 'rendah') rows = rows.filter(r => r.persen < 10)
    else if (filter === 'sedang') rows = rows.filter(r => r.persen >= 10 && r.persen < 50)
    else if (filter === 'tinggi') rows = rows.filter(r => r.persen >= 50)

    rows.sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol]
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
    })
    return rows
  }, [data, search, filter, sortCol, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const cols = [
    { key: 'no', label: 'No', w: 'w-12', align: 'left' },
    { key: 'satker', label: 'Satuan Kerja', w: 'min-w-[200px]', align: 'left' },
    { key: 'totalBinaan', label: 'Binaan', w: 'w-20', align: 'right' },
    { key: 'totalPegawai', label: 'Pegawai', w: 'w-20', align: 'right' },
    { key: 'lengkap', label: 'Sudah Lengkap', w: 'w-24', align: 'right' },
    { key: 'tidakLengkap', label: 'Belum Lengkap', w: 'w-24', align: 'right' },
    { key: 'persen', label: 'Capaian', w: 'w-44', align: 'left' },
    { key: 'keterangan', label: 'Status', w: 'w-32', align: 'left' },
  ]

  return (
    <div
      className="rounded-md bg-white animate-slide-up overflow-hidden"
      style={{
        animationDelay: '350ms',
        animationFillMode: 'forwards',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
      }}
    >
      {/* Table Header */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}
      >
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: '#0f172a', letterSpacing: '0.04em' }}>
              Rincian Data Seluruh UPTD
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
              Menampilkan <span className="font-semibold tabular-nums" style={{ color: '#0f172a' }}>{filtered.length}</span> satuan kerja
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Filter buttons */}
            <div
              className="flex rounded-md overflow-hidden"
              style={{ border: '1px solid #cbd5e1' }}
              role="group"
              aria-label="Filter capaian"
            >
              {[
                ['all', 'Semua'],
                ['rendah', '< 10%'],
                ['sedang', '10–49%'],
                ['tinggi', '≥ 50%'],
              ].map(([val, label], i, arr) => (
                <button
                  key={val}
                  onClick={() => { setFilter(val); setPage(1) }}
                  aria-pressed={filter === val}
                  className="text-xs px-3 py-1.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset"
                  style={{
                    background: filter === val ? '#1e3a8a' : '#ffffff',
                    color: filter === val ? '#ffffff' : '#64748b',
                    borderRight: i < arr.length - 1 ? '1px solid #cbd5e1' : 'none',
                    outlineColor: '#1e3a8a',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2"
                style={{ color: '#64748b' }}
                aria-hidden="true"
              />
              <label className="sr-only" htmlFor="search-satker">Cari satuan kerja</label>
              <input
                id="search-satker"
                type="text"
                placeholder="Cari satuan kerja..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="pl-8 pr-3 py-1.5 text-sm rounded-md outline-none w-52 transition-all focus:ring-2"
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#1e3a8a'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,58,138,0.12)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#cbd5e1'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead style={{ background: '#f1f5f9' }}>
            <tr style={{ borderBottom: '2px solid #cbd5e1' }}>
              {cols.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  scope="col"
                  className={`px-4 py-3 cursor-pointer select-none ${col.w} ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                  style={{
                    color: sortCol === col.key ? '#1e3a8a' : '#475569',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                  aria-sort={sortCol === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <div className={`flex items-center gap-1.5 hover:opacity-70 transition-opacity ${col.align === 'right' ? 'justify-end' : ''}`}>
                    {col.label}
                    <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={cols.length} className="text-center py-12" style={{ color: '#94a3b8' }}>
                  Tidak ada data yang sesuai dengan pencarian
                </td>
              </tr>
            ) : paginated.map((row, idx) => (
              <tr
                key={row.no}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  background: idx % 2 === 0 ? '#ffffff' : '#fafbfc',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#fafbfc'}
              >
                <td className="px-4 py-3 tabular-nums" style={{ color: '#94a3b8' }}>{row.no}</td>
                <td className="px-4 py-3 font-semibold" style={{ color: '#0f172a' }}>{row.satker}</td>
                <td className="px-4 py-3 text-right tabular-nums" style={{ color: '#475569' }}>{row.totalBinaan.toLocaleString('id')}</td>
                <td className="px-4 py-3 text-right tabular-nums" style={{ color: '#475569' }}>{row.totalPegawai.toLocaleString('id')}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums" style={{ color: '#15803d' }}>{row.lengkap.toLocaleString('id')}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums" style={{ color: '#b91c1c' }}>{row.tidakLengkap.toLocaleString('id')}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1.5 min-w-[140px]">
                    <PersenBadge persen={row.persen} />
                    <ProgressBar persen={row.persen} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded font-semibold inline-block"
                    style={{
                      background: '#eff6ff',
                      color: '#1e3a8a',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    {row.keterangan}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="px-5 py-3 flex items-center justify-between flex-wrap gap-2"
          style={{ borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}
        >
          <span className="text-xs" style={{ color: '#475569' }}>
            Halaman <span className="font-bold tabular-nums" style={{ color: '#0f172a' }}>{page}</span> dari <span className="font-bold tabular-nums" style={{ color: '#0f172a' }}>{totalPages}</span>
          </span>
          <nav className="flex gap-1" aria-label="Navigasi halaman">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Halaman sebelumnya"
              className="p-1.5 rounded-md disabled:opacity-30 transition-colors focus:outline-none focus:ring-2"
              style={{ background: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', outlineColor: '#1e3a8a' }}
            >
              <ChevronLeft size={14} aria-hidden="true" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`e${i}`} className="px-2 py-1 text-xs flex items-center" style={{ color: '#94a3b8' }}>…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    aria-label={`Halaman ${p}`}
                    aria-current={page === p ? 'page' : undefined}
                    className="w-8 h-8 rounded-md text-xs font-bold tabular-nums transition-all focus:outline-none focus:ring-2"
                    style={
                      page === p
                        ? { background: '#1e3a8a', color: '#ffffff', border: '1px solid #1e3a8a', outlineColor: '#1e3a8a' }
                        : { background: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', outlineColor: '#1e3a8a' }
                    }
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Halaman berikutnya"
              className="p-1.5 rounded-md disabled:opacity-30 transition-colors focus:outline-none focus:ring-2"
              style={{ background: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', outlineColor: '#1e3a8a' }}
            >
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}
