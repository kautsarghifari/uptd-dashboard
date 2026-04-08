import { Users, CheckCircle2, Building2, TrendingUp } from 'lucide-react'

function KpiCard({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <div
      className="relative bg-white rounded-md p-5 animate-slide-up"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
        border: '1px solid #e2e8f0',
        borderLeft: `4px solid ${color}`,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="text-xs font-semibold tracking-wider uppercase mb-2"
            style={{ color: '#64748b', letterSpacing: '0.06em' }}
          >
            {label}
          </p>
          <p
            className="text-3xl font-bold leading-none tabular-nums"
            style={{ color: '#0f172a' }}
          >
            {value}
          </p>
          {sub && (
            <p className="text-xs mt-2 truncate" style={{ color: '#64748b' }}>
              {sub}
            </p>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}12`, border: `1px solid ${color}25` }}
          aria-hidden="true"
        >
          <Icon size={20} style={{ color }} strokeWidth={2.25} />
        </div>
      </div>
    </div>
  )
}

export function KpiCards({ data }) {
  const totalUptd = data.length
  const totalPegawai = data.reduce((s, r) => s + r.totalPegawai, 0)
  const totalLengkap = data.reduce((s, r) => s + r.lengkap, 0)
  const persen = totalPegawai > 0 ? ((totalLengkap / totalPegawai) * 100).toFixed(2) : '0.00'
  const tertinggi = data.length > 0 ? [...data].sort((a, b) => b.persen - a.persen)[0] : null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        icon={Building2}
        label="Total Binaan UPTD"
        value={totalUptd.toLocaleString('id')}
        sub="Unit Pelaksana Teknis Daerah"
        color="#1e3a8a"
        delay={50}
      />
      <KpiCard
        icon={Users}
        label="Total Pegawai"
        value={totalPegawai.toLocaleString('id')}
        sub="Seluruh satuan kerja"
        color="#0369a1"
        delay={100}
      />
      <KpiCard
        icon={CheckCircle2}
        label="Data Sudah Lengkap"
        value={totalLengkap.toLocaleString('id')}
        sub={`${persen}% dari total pegawai`}
        color="#15803d"
        delay={150}
      />
      <KpiCard
        icon={TrendingUp}
        label="Capaian Tertinggi"
        value={`${tertinggi?.persen?.toFixed(2) ?? '0.00'}%`}
        sub={tertinggi?.satker ?? '—'}
        color="#b91c1c"
        delay={200}
      />
    </div>
  )
}
