import { useState, useEffect, useCallback } from 'react'
import Papa from 'papaparse'

// ============================================================
// KONFIGURASI UTAMA - GANTI URL INI DENGAN URL GOOGLE SHEETS ANDA
// Cara mendapatkan URL:
// 1. Buka Google Sheets "Dashboard 282 UPTD"
// 2. Klik File → Share → Publish to web
// 3. Pilih sheet yang berisi data, format: CSV
// 4. Klik Publish, copy URL yang muncul
// 5. Paste URL tersebut di file .env sebagai VITE_SHEETS_URL
// ============================================================
const SHEETS_CSV_URL = import.meta.env.VITE_SHEETS_URL || ''

// Interval auto-refresh dalam milidetik (default: 5 menit)
const REFRESH_INTERVAL = 5 * 60 * 1000

/**
 * Struktur kolom Google Sheets "Dashboard 282 UPTD":
 * A: No | B: Satker | C: Total Binaan | D: Total Pegawai |
 * E: Lengkap | F: Tidak Lengkap | G: Progress Kelengkapan | H: Keterangan
 */
function parseRow(row) {
  const totalPegawai = parseInt(row['Total Pegawai'] || 0)
  const lengkap = parseInt(row['Lengkap'] || 0)
  const tidakLengkap = parseInt(row['Tidak Lengkap'] || 0)

  // Kolom G bisa berformat "15.22%" atau desimal "0.1522" — tangani keduanya
  const persenRaw = (row['Progress Kelengkapan'] || row['%'] || '').toString().trim()
  let persen
  if (persenRaw.includes('%')) {
    persen = parseFloat(persenRaw.replace('%', '').replace(',', '.'))
  } else if (persenRaw !== '') {
    const val = parseFloat(persenRaw.replace(',', '.'))
    persen = val <= 1 ? val * 100 : val
  } else {
    persen = totalPegawai > 0 ? (lengkap / totalPegawai) * 100 : 0
  }

  return {
    no: parseInt(row['No'] || 0),
    satker: (row['Satker'] || '').trim(),
    totalBinaan: parseInt(row['Total Binaan'] || 0),
    totalPegawai,
    lengkap,
    tidakLengkap,
    persen: isNaN(persen) ? 0 : parseFloat(persen.toFixed(2)),
    keterangan: (row['Keterangan'] || 'On Progress').trim(),
  }
}

export function useSheetData() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      if (!SHEETS_CSV_URL) {
        console.warn('⚠️ VITE_SHEETS_URL belum diisi. Menggunakan data dummy.')
        setData(getDummyData())
        setLastUpdated(new Date())
        setLoading(false)
        return
      }

      const url = `${SHEETS_CSV_URL}&t=${Date.now()}`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}: Gagal mengambil data`)

      const text = await response.text()

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = results.data
            .map(parseRow)
            .filter(row => row.satker && row.satker !== '' && row.no > 0)
            .sort((a, b) => a.no - b.no)

          setData(parsed)
          setLastUpdated(new Date())
          setError(null)
          setLoading(false)
        },
        error: (err) => {
          throw new Error(`Gagal parse CSV: ${err.message}`)
        }
      })
    } catch (err) {
      console.error('Error fetching sheet data:', err)
      setError(err.message)
      if (data.length === 0) setData(getDummyData())
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchData])

  return { data, loading, error, lastUpdated, refresh: fetchData }
}

// Data dummy untuk development / saat URL belum dikonfigurasi
function getDummyData() {
  return [
    { no: 1,  satker: 'BBPVP Medan',                  totalBinaan: 22, totalPegawai: 184, lengkap: 28,  tidakLengkap: 156, persen: 15.22, keterangan: 'On Progress' },
    { no: 2,  satker: 'BBPVP Bekasi',                 totalBinaan: 27, totalPegawai: 227, lengkap: 38,  tidakLengkap: 189, persen: 16.74, keterangan: 'On Progress' },
    { no: 3,  satker: 'BBPVP Bandung',                totalBinaan: 11, totalPegawai: 172, lengkap: 12,  tidakLengkap: 160, persen: 6.98,  keterangan: 'On Progress' },
    { no: 4,  satker: 'BBPVP Semarang',               totalBinaan: 26, totalPegawai: 300, lengkap: 81,  tidakLengkap: 219, persen: 27.00, keterangan: 'On Progress' },
    { no: 5,  satker: 'BBPVP Makassar',               totalBinaan: 20, totalPegawai: 198, lengkap: 19,  tidakLengkap: 179, persen: 9.60,  keterangan: 'On Progress' },
    { no: 6,  satker: 'BBPVP Serang',                 totalBinaan: 28, totalPegawai: 349, lengkap: 49,  tidakLengkap: 300, persen: 14.04, keterangan: 'On Progress' },
    { no: 7,  satker: 'BPVP Ambon',                   totalBinaan: 3,  totalPegawai: 19,  lengkap: 2,   tidakLengkap: 17,  persen: 10.53, keterangan: 'On Progress' },
    { no: 8,  satker: 'BPVP Banda Aceh',              totalBinaan: 13, totalPegawai: 118, lengkap: 0,   tidakLengkap: 118, persen: 0.00,  keterangan: 'On Progress' },
    { no: 9,  satker: 'BPVP Bandung Barat (Lembang)', totalBinaan: 6,  totalPegawai: 137, lengkap: 10,  tidakLengkap: 127, persen: 7.30,  keterangan: 'On Progress' },
    { no: 10, satker: 'BPVP Bantaeng',                totalBinaan: 6,  totalPegawai: 77,  lengkap: 15,  tidakLengkap: 62,  persen: 19.48, keterangan: 'On Progress' },
    { no: 11, satker: 'BPVP Banyuwangi',              totalBinaan: 11, totalPegawai: 185, lengkap: 20,  tidakLengkap: 165, persen: 10.81, keterangan: 'On Progress' },
    { no: 12, satker: 'BPVP Belitung',                totalBinaan: 1,  totalPegawai: 3,   lengkap: 2,   tidakLengkap: 1,   persen: 66.67, keterangan: 'On Progress' },
    { no: 13, satker: 'BPVP Kendari',                 totalBinaan: 5,  totalPegawai: 75,  lengkap: 7,   tidakLengkap: 68,  persen: 9.33,  keterangan: 'On Progress' },
    { no: 14, satker: 'BPVP Lombok Timur',            totalBinaan: 16, totalPegawai: 216, lengkap: 1,   tidakLengkap: 215, persen: 0.46,  keterangan: 'On Progress' },
    { no: 15, satker: 'BPVP Padang',                  totalBinaan: 20, totalPegawai: 207, lengkap: 35,  tidakLengkap: 172, persen: 16.91, keterangan: 'On Progress' },
    { no: 16, satker: 'BPVP Pangkajene & Kepulauan',  totalBinaan: 5,  totalPegawai: 92,  lengkap: 24,  tidakLengkap: 68,  persen: 26.09, keterangan: 'On Progress' },
    { no: 17, satker: 'BPVP Samarinda',               totalBinaan: 16, totalPegawai: 261, lengkap: 56,  tidakLengkap: 205, persen: 21.46, keterangan: 'On Progress' },
    { no: 18, satker: 'BPVP Sidoarjo',                totalBinaan: 20, totalPegawai: 379, lengkap: 116, tidakLengkap: 263, persen: 30.61, keterangan: 'On Progress' },
    { no: 19, satker: 'BPVP Sorong',                  totalBinaan: 6,  totalPegawai: 53,  lengkap: 2,   tidakLengkap: 51,  persen: 3.77,  keterangan: 'On Progress' },
    { no: 20, satker: 'BPVP Surakarta',               totalBinaan: 16, totalPegawai: 320, lengkap: 94,  tidakLengkap: 226, persen: 29.38, keterangan: 'On Progress' },
    { no: 21, satker: 'BPVP Ternate',                 totalBinaan: 4,  totalPegawai: 17,  lengkap: 3,   tidakLengkap: 14,  persen: 17.65, keterangan: 'On Progress' },
  ]
}
