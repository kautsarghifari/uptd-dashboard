import { useSheetData } from './hooks/useSheetData'
import { Header } from './components/Header'
import { KpiCards } from './components/KpiCards'
import { Charts } from './components/Charts'
import { DataTable } from './components/DataTable'

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white" style={{ border: '1px solid #e2e8f0' }} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-80 rounded-2xl bg-white" style={{ border: '1px solid #e2e8f0' }} />
        <div className="h-80 rounded-2xl bg-white" style={{ border: '1px solid #e2e8f0' }} />
      </div>
      <div className="h-96 rounded-2xl bg-white" style={{ border: '1px solid #e2e8f0' }} />
    </div>
  )
}

export default function App() {
  const { data, loading, error, lastUpdated, refresh } = useSheetData()

  return (
    <div className="min-h-screen relative" style={{ background: '#f0f5fb' }}>
      {/* Subtle decorative blobs */}
      <div
        className="fixed top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0284c7, transparent)' }}
      />
      <div
        className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-[0.05] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
      />

      <main className="relative z-10 max-w-screen-xl mx-auto px-4 py-8 space-y-6">
        <Header
          lastUpdated={lastUpdated}
          onRefresh={refresh}
          loading={loading}
          error={error}
        />

        {loading && data.length === 0 ? (
          <LoadingSkeleton />
        ) : (
          <>
            <KpiCards data={data} />
            <Charts data={data} />
            <DataTable data={data} />
          </>
        )}

        {/* Footer */}
        <footer className="text-center pt-4 pb-2">
          <p className="text-xs text-slate-400 font-body">
            Data diambil dari Google Sheets · Auto-refresh setiap 5 menit ·{' '}
            <span style={{ color: '#0284c7' }}>Dashboard Validasi UPTD</span>
          </p>
        </footer>
      </main>
    </div>
  )
}
