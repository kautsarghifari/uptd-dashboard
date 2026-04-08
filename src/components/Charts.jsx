import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts'
import { BarChart3, PieChart as PieIcon, ArrowUpRight } from 'lucide-react'

const COLORS = {
  navy: '#1e3a8a',
  navyDeep: '#172554',
  navyLight: '#3b82f6',
  blue: '#0369a1',
  green: '#15803d',
  greenLight: '#22c55e',
  amber: '#b45309',
  amberLight: '#f59e0b',
  red: '#b91c1c',
  redLight: '#ef4444',
  border: '#e2e8f0',
  text: '#0f172a',
  muted: '#64748b',
}

function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const value = payload[0]?.value
  return (
    <div
      className="rounded-lg overflow-hidden text-sm"
      style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        boxShadow: '0 10px 25px rgba(15,23,42,0.15), 0 4px 10px rgba(15,23,42,0.08)',
        minWidth: 180,
      }}
    >
      <div
        className="px-3 py-2"
        style={{ background: COLORS.navyDeep, borderBottom: `1px solid ${COLORS.navy}` }}
      >
        <p className="font-bold text-white text-xs uppercase tracking-wider">{label}</p>
      </div>
      <div className="px-3 py-2.5">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tabular-nums" style={{ color: COLORS.navy }}>
            {value?.toFixed(2)}
          </span>
          <span className="text-sm font-semibold" style={{ color: COLORS.muted }}>%</span>
        </div>
        <p className="text-xs mt-0.5" style={{ color: COLORS.muted }}>data tervalidasi</p>
      </div>
    </div>
  )
}

export function Charts({ data }) {
  const [sortBy, setSortBy] = useState('persen')
  const [hoveredBar, setHoveredBar] = useState(null)

  const totalLengkap = data.reduce((s, r) => s + r.lengkap, 0)
  const totalTidak = data.reduce((s, r) => s + r.tidakLengkap, 0)
  const total = totalLengkap + totalTidak
  const persenLengkap = total > 0 ? (totalLengkap / total) * 100 : 0

  const pieData = [
    { name: 'Sudah Lengkap', value: totalLengkap, fill: COLORS.green },
    { name: 'Belum Lengkap', value: totalTidak, fill: COLORS.red },
  ]

  const barData = [...data]
    .sort((a, b) => {
      if (sortBy === 'persen') return b.persen - a.persen
      if (sortBy === 'pegawai') return b.totalPegawai - a.totalPegawai
      return a.satker.localeCompare(b.satker)
    })
    .map(r => ({
      name: r.satker.replace('BBPVP ', '').replace('BPVP ', ''),
      fullName: r.satker,
      persen: r.persen,
    }))

  const avgPersen = data.length > 0 ? data.reduce((s, r) => s + r.persen, 0) / data.length : 0
  const maxPersen = Math.max(...data.map(r => r.persen), 0)
  const aboveAvg = data.filter(r => r.persen >= avgPersen).length

  const barGradient = (p) =>
    p >= 50 ? 'url(#gradGreen)' :
    p >= 25 ? 'url(#gradNavy)' :
    p >= 10 ? 'url(#gradAmber)' : 'url(#gradRed)'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Bar Chart - 2/3 width */}
      <div
        className="lg:col-span-2 rounded-xl bg-white animate-slide-up overflow-hidden relative"
        style={{
          animationDelay: '250ms',
          animationFillMode: 'forwards',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15,23,42,0.05), 0 4px 12px rgba(15,23,42,0.04)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, ${COLORS.navyDeep} 0%, ${COLORS.navy} 50%, ${COLORS.navyLight} 100%)` }}
        />

        <div className="px-5 pt-5 pb-3 flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDeep} 100%)`,
                boxShadow: '0 4px 12px rgba(30,58,138,0.25)',
              }}
            >
              <BarChart3 size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight" style={{ color: COLORS.text }}>
                Capaian Kelengkapan Data per Balai
              </h3>
              <p className="text-xs mt-0.5" style={{ color: COLORS.muted }}>
                Persentase data pegawai yang sudah lengkap
              </p>
            </div>
          </div>

          <div
            className="flex rounded-lg overflow-hidden p-0.5"
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
            role="group"
          >
            {[['persen', 'Capaian'], ['pegawai', 'Volume'], ['satker', 'A–Z']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setSortBy(val)}
                className="text-xs px-3 py-1.5 font-semibold rounded-md transition-all focus:outline-none"
                style={{
                  background: sortBy === val ? '#ffffff' : 'transparent',
                  color: sortBy === val ? COLORS.navy : COLORS.muted,
                  boxShadow: sortBy === val ? '0 1px 3px rgba(15,23,42,0.1)' : 'none',
                }}
                aria-pressed={sortBy === val}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Mini stats row */}
        <div className="pb-8"></div>

        <div className="px-3 pb-3">
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 8, right: 12, left: -16, bottom: 60 }}
                onMouseMove={(state) => setHoveredBar(state?.activeTooltipIndex ?? null)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <defs>
                  <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.greenLight} stopOpacity={1} />
                    <stop offset="100%" stopColor={COLORS.green} stopOpacity={0.85} />
                  </linearGradient>
                  <linearGradient id="gradNavy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.navyLight} stopOpacity={1} />
                    <stop offset="100%" stopColor={COLORS.navy} stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient id="gradAmber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.amberLight} stopOpacity={1} />
                    <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.redLight} stopOpacity={1} />
                    <stop offset="100%" stopColor={COLORS.red} stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: COLORS.muted, fontSize: 10, fontWeight: 500 }}
                  angle={-40}
                  textAnchor="end"
                  interval={0}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: COLORS.muted, fontSize: 10, fontWeight: 500 }}
                  tickFormatter={v => `${v}%`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: 'rgba(30,58,138,0.06)', radius: 4 }}
                />
                <Bar dataKey="persen" radius={[6, 6, 0, 0]} maxBarSize={32}>
                  {barData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={barGradient(entry.persen)}
                      opacity={hoveredBar === null || hoveredBar === i ? 1 : 0.35}
                      style={{ transition: 'opacity 0.2s ease' }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div
            className="flex gap-4 mt-2 pt-3 justify-center flex-wrap mx-2"
            style={{ borderTop: '1px solid #f1f5f9' }}
          >
            {[
              { from: COLORS.greenLight, to: COLORS.green, label: 'Sangat Baik', range: '≥ 50%' },
              { from: COLORS.navyLight, to: COLORS.navy, label: 'Cukup', range: '25–49%' },
              { from: COLORS.amberLight, to: COLORS.amber, label: 'Rendah', range: '10–24%' },
              { from: COLORS.redLight, to: COLORS.red, label: 'Sangat Rendah', range: '< 10%' },
            ].map(({ from, to, label, range }) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ background: `linear-gradient(180deg, ${from}, ${to})` }}
                />
                <span className="text-xs" style={{ color: COLORS.text }}>
                  <span className="font-semibold">{label}</span>
                  <span style={{ color: COLORS.muted }}> · {range}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pie Chart - 1/3 width */}
      <div
        className="rounded-xl bg-white animate-slide-up overflow-hidden flex flex-col relative"
        style={{
          animationDelay: '300ms',
          animationFillMode: 'forwards',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15,23,42,0.05), 0 4px 12px rgba(15,23,42,0.04)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, ${COLORS.green} 0%, ${COLORS.navy} 50%, ${COLORS.red} 100%)` }}
        />

        <div className="px-5 pt-5 pb-3 flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDeep} 100%)`,
              boxShadow: '0 4px 12px rgba(30,58,138,0.25)',
            }}
          >
            <PieIcon size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight" style={{ color: COLORS.text }}>
              Proporsi Kelengkapan Data
            </h3>
            <p className="text-xs mt-0.5" style={{ color: COLORS.muted }}>
              Distribusi total pegawai
            </p>
          </div>
        </div>

        {/* Donut with center label */}
        <div className="px-5 relative">
          <div className="flex items-center justify-center" style={{ minHeight: 200 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={55}
                  dataKey="value"
                  labelLine={false}
                  stroke="#ffffff"
                  strokeWidth={3}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center label overlay */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ paddingTop: 8 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: COLORS.muted, letterSpacing: '0.06em' }}>
              Sudah Lengkap
            </p>
            <p className="text-2xl font-bold tabular-nums leading-none mt-1" style={{ color: COLORS.navy }}>
              {persenLengkap.toFixed(1)}<span className="text-sm">%</span>
            </p>
          </div>
        </div>

        {/* Stats list */}
        <div className="px-5 pb-5 mt-2 space-y-2">
          {[
            { label: 'Sudah Lengkap', value: totalLengkap, color: COLORS.green, percent: persenLengkap },
            { label: 'Belum Lengkap', value: totalTidak, color: COLORS.red, percent: 100 - persenLengkap },
          ].map(({ label, value, color, percent }) => (
            <div
              key={label}
              className="rounded-lg p-3"
              style={{
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ background: color }}
                  />
                  <span className="text-xs font-semibold" style={{ color: COLORS.text }}>{label}</span>
                </div>
                <span className="text-sm font-bold tabular-nums" style={{ color: COLORS.text }}>
                  {value.toLocaleString('id')}
                </span>
              </div>
              <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${percent}%`, background: color }}
                />
              </div>
            </div>
          ))}

          {/* Total band */}
          <div
            className="rounded-lg p-3 flex items-center justify-between"
            style={{
              background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDeep} 100%)`,
              boxShadow: '0 4px 12px rgba(30,58,138,0.2)',
            }}
          >
            <div className="flex items-center gap-2">
              <ArrowUpRight size={14} className="text-white" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white" style={{ letterSpacing: '0.06em' }}>
                Total Pegawai
              </span>
            </div>
            <span className="text-base font-bold tabular-nums text-white">
              {total.toLocaleString('id')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}