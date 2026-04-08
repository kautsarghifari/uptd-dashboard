import { useState, useMemo } from 'react'
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'

function PersenBadge({ persen }) {
  const color =
    persen >= 50 ? { bg: 'rgba(22,163,74,0.10)', text: '#15803d', border: 'rgba(22,163,74,0.25)' } :
    persen >= 25 ? { bg: 'rgba(2,132,199,0.10)', text: '#0369a1', border: 'rgba(2,132,199,0.25)' } :
    persen >= 10 ? { bg: 'rgba(124,58,237,0.10)', text: '#6d28d9', border: 'rgba(124,58,237,0.25)' } :
                   { bg: 'rgba(220,38,38,0.10)', text: '#b91c1c', border: 'rgba(220,38,38,0.25)' }

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-semibold"
      style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}` }}
    >
      {persen.toFixed(2)}%
    </span>
  )
}

function ProgressBar({ persen }) {
  const color =
    persen >= 50 ? '#16a34a' :
    persen >= 25 ? '#0284c7' :
    persen >= 10 ? '#7c3aed' : '#dc2626'

  return (
    <div className="w-full h-2 rounded-full" style={{ background: '#e2e8f0' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(persen, 100)}%`, background: color }}
      />
    </div>
  )
}

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <ArrowUpDown size={12} style={{ color: '#cbd5e1' }} />
  return sortDir === 'asc'
    ? <ArrowUp size={12} style={{ color: '#0284c7' }} />
    : <ArrowDown size={12} style={{ color: '#0284c7' }} />
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
    { key: 'no', label: 'No', w: 'w-12' },
    { key: 'satker', label: 'Satker', w: 'min-w-[160px]' },
    { key: 'totalBinaan', label: 'Binaan', w: 'w-20' },
    { key: 'totalPegawai', label: 'Pegawai', w: 'w-20' },
    { key: 'lengkap', label: 'Lengkap', w: 'w-20' },
    { key: 'tidakLengkap', label: 'Tidak Lengkap', w: 'w-28' },
    { key: 'persen', label: '% Lengkap', w: 'w-40' },
    { key: 'keterangan', label: 'Status', w: 'w-28' },
  ]

  return (
    <div
      className="rounded-2xl card-glow animate-slide-up overflow-hidden bg-white"
      style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}
    >
      {/* Table Header Controls */}
      <div className="p-5 flex flex-wrap items-center gap-3 justify-between" style={{ borderBottom: '1px solid #f1f5f9' }}>
        <h3 className="text-base font-display font-semibold tracking-wide" style={{ color: '#1e293b' }}>
          Data Seluruh UPTD
          <span className="ml-2 text-sm font-mono font-normal" style={{ color: '#94a3b8' }}>{filtered.length} satker</span>
        </h3>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Filter buttons */}
          <div className="flex gap-1">
            {[
              ['all', 'Semua'],
              ['rendah', '< 10%'],
              ['sedang', '10–49%'],
              ['tinggi', '≥ 50%'],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => { setFilter(val); setPage(1) }}
                className="text-xs px-3 py-1.5 rounded-lg font-body transition-all"
                style={
                  filter === val
                    ? { background: '#0284c7', color: '#ffffff' }
                    : { background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }
                }
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Cari satker..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="pl-8 pr-3 py-1.5 text-sm font-body rounded-lg outline-none w-44 transition-all focus:w-52"
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#1e293b',
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead style={{ background: '#f8fafc' }}>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              {cols.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-3 text-left cursor-pointer select-none ${col.w}`}
                  style={{ color: sortCol === col.key ? '#0284c7' : '#64748b' }}
                >
                  <div className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
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
                  Tidak ada data ditemukan
                </td>
              </tr>
            ) : paginated.map((row) => (
              <tr
                key={row.no}
                className="table-row-hover"
                style={{ borderBottom: '1px solid #f1f5f9' }}
              >
                <td className="px-4 py-3 font-mono" style={{ color: '#94a3b8' }}>{row.no}</td>
                <td className="px-4 py-3 font-semibold" style={{ color: '#1e293b' }}>{row.satker}</td>
                <td className="px-4 py-3" style={{ color: '#475569' }}>{row.totalBinaan.toLocaleString('id')}</td>
                <td className="px-4 py-3" style={{ color: '#475569' }}>{row.totalPegawai.toLocaleString('id')}</td>
                <td className="px-4 py-3 font-medium" style={{ color: '#15803d' }}>{row.lengkap.toLocaleString('id')}</td>
                <td className="px-4 py-3 font-medium" style={{ color: '#b91c1c' }}>{row.tidakLengkap.toLocaleString('id')}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1.5 min-w-[120px]">
                    <PersenBadge persen={row.persen} />
                    <ProgressBar persen={row.persen} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs px-2.5 py-1 rounded-md font-medium"
                    style={{
                      background: 'rgba(2,132,199,0.08)',
                      color: '#0369a1',
                      border: '1px solid rgba(2,132,199,0.2)',
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
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: '1px solid #f1f5f9' }}
        >
          <span className="text-sm font-body" style={{ color: '#64748b' }}>
            Halaman {page} dari {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg disabled:opacity-30 transition-colors"
              style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}
            >
              <ChevronLeft size={14} />
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
                  <span key={`e${i}`} className="px-2 py-1 text-sm" style={{ color: '#94a3b8' }}>…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-lg text-sm font-mono transition-all"
                    style={
                      page === p
                        ? { background: '#0284c7', color: 'white' }
                        : { background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }
                    }
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg disabled:opacity-30 transition-colors"
              style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
