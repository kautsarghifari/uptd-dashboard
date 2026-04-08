import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts'

const COLORS = {
  lengkap: '#16a34a',
  tidak: '#dc2626',
  bar: '#0284c7',
}

function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl p-3 text-sm font-body" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
      <p className="font-semibold mb-1" style={{ color: '#1e293b' }}>{label}</p>
      <p style={{ color: COLORS.bar }}>{payload[0]?.value?.toFixed(2)}% lengkap</p>
    </div>
  )
}

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl p-3 text-sm font-body" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
      <p className="font-semibold" style={{ color: '#1e293b' }}>{payload[0]?.name}</p>
      <p style={{ color: payload[0]?.payload?.fill }}>{payload[0]?.value?.toLocaleString('id')} pegawai</p>
    </div>
  )
}

export function Charts({ data }) {
  const [sortBy, setSortBy] = useState('persen')

  const totalLengkap = data.reduce((s, r) => s + r.lengkap, 0)
  const totalTidak = data.reduce((s, r) => s + r.tidakLengkap, 0)

  const pieData = [
    { name: 'Lengkap', value: totalLengkap, fill: COLORS.lengkap },
    { name: 'Tidak Lengkap', value: totalTidak, fill: COLORS.tidak },
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

  const RADIAN = Math.PI / 180
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontFamily="Sora" fontWeight={700}>
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Bar Chart - 2/3 width */}
      <div
        className="lg:col-span-2 rounded-2xl p-5 card-glow animate-slide-up bg-white"
        style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-base font-display font-semibold tracking-wide" style={{ color: '#1e293b' }}>Progress per Binaan (%)</h3>
          <div className="flex gap-1">
            {[['persen', 'Tertinggi'], ['pegawai', 'Terbanyak'], ['satker', 'A–Z']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setSortBy(val)}
                className="text-xs px-3 py-1.5 rounded-lg font-body transition-all"
                style={
                  sortBy === val
                    ? { background: '#0284c7', color: '#ffffff' }
                    : { background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'DM Sans' }}
                angle={-40}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'DM Sans' }}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(2,132,199,0.04)' }} />
              <Bar dataKey="persen" radius={[4, 4, 0, 0]} maxBarSize={28}>
                {barData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.persen >= 50 ? COLORS.lengkap :
                      entry.persen >= 25 ? COLORS.bar :
                      entry.persen >= 10 ? '#7c3aed' : COLORS.tidak
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex gap-4 mt-2 justify-center flex-wrap">
          {[
            { color: COLORS.lengkap, label: '≥ 50%' },
            { color: COLORS.bar, label: '25–49%' },
            { color: '#7c3aed', label: '10–24%' },
            { color: COLORS.tidak, label: '< 10%' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
              <span className="text-xs font-body" style={{ color: '#64748b' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pie Chart - 1/3 width */}
      <div
        className="rounded-2xl p-5 card-glow animate-slide-up flex flex-col bg-white"
        style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
      >
        <h3 className="text-base font-display font-semibold tracking-wide mb-4" style={{ color: '#1e293b' }}>Proporsi Validasi</h3>
        <div className="flex-1 flex items-center justify-center" style={{ minHeight: 220 }}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={50}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="mt-2 space-y-3">
          {[
            { label: 'Lengkap', value: totalLengkap, color: COLORS.lengkap },
            { label: 'Tidak Lengkap', value: totalTidak, color: COLORS.tidak },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-sm font-body" style={{ color: '#64748b' }}>{label}</span>
              </div>
              <span className="text-sm font-display font-semibold" style={{ color: '#1e293b' }}>{value.toLocaleString('id')}</span>
            </div>
          ))}
          <div className="h-px" style={{ background: '#e2e8f0' }} />
          <div className="flex items-center justify-between">
            <span className="text-sm font-body" style={{ color: '#64748b' }}>Total</span>
            <span className="text-sm font-display font-semibold" style={{ color: '#1e293b' }}>{(totalLengkap + totalTidak).toLocaleString('id')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
