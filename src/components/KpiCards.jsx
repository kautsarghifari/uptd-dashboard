import { Users, CheckCircle2, Activity, TrendingUp } from 'lucide-react'

function KpiCard({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <div
      className={`relative rounded-2xl p-5 card-glow animate-slide-up overflow-hidden group cursor-default bg-white`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
        borderTop: `3px solid ${color}`,
      }}
    >
      {/* Soft glow accent top-right */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ background: color }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-body tracking-widest uppercase mb-2" style={{ color: '#94a3b8' }}>{label}</p>
          <p className="text-3xl font-display font-bold leading-none" style={{ color: '#1e293b' }}>{value}</p>
          {sub && <p className="text-sm mt-1.5 font-body" style={{ color: '#64748b' }}>{sub}</p>}
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Icon size={20} style={{ color }} strokeWidth={2} />
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
        icon={Activity}
        label="Total Binaan UPTD"
        value={totalUptd.toLocaleString('id')}
        sub="unit pelaksana teknis"
        color="#0284c7"
        delay={50}
      />
      <KpiCard
        icon={Users}
        label="Total Pegawai"
        value={totalPegawai.toLocaleString('id')}
        sub="seluruh satker"
        color="#7c3aed"
        delay={100}
      />
      <KpiCard
        icon={CheckCircle2}
        label="Data Lengkap"
        value={totalLengkap.toLocaleString('id')}
        sub={`${persen}% dari total`}
        color="#16a34a"
        delay={150}
      />
      <KpiCard
        icon={TrendingUp}
        label="Progress Tertinggi"
        value={`${tertinggi?.persen?.toFixed(2) ?? '0.00'}%`}
        sub={tertinggi?.satker ?? '-'}
        color="#ea580c"
        delay={200}
      />
    </div>
  )
}
