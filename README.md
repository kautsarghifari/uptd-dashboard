# Dashboard Validasi UPTD

Dashboard monitoring real-time untuk validasi data 282 UPTD, berbasis data Google Sheets.

## 🛠 Tech Stack
- **React 18** + Vite
- **Tailwind CSS**
- **Recharts** (grafik)
- **PapaParse** (parsing CSV)
- **Lucide React** (ikon)
- Deploy: **Vercel** via GitHub

---

## 🚀 Setup Langkah demi Langkah

### 1. Persiapkan Google Sheets

Format kolom yang dibutuhkan (header baris pertama):

| No | Satker | Total Binaan | Total Pegawai | Lengkap | Tidak Lengkap | Keterangan |
|----|--------|--------------|---------------|---------|----------------|------------|
| 1  | BBPVP Medan | 22 | 184 | 28 | 156 | On Progress |

**Publish Google Sheets sebagai CSV:**
1. Buka Google Sheets Anda
2. Klik **File → Share → Publish to web**
3. Pilih: **Sheet yang berisi data** → format **CSV**
4. Klik **Publish** → Copy URL yang muncul
5. URL contoh: `https://docs.google.com/spreadsheets/d/ABCDEF.../pub?gid=0&single=true&output=csv`

### 2. Clone & Install

```bash
git clone https://github.com/username/uptd-dashboard.git
cd uptd-dashboard
npm install
```

### 3. Konfigurasi URL Google Sheets

Buat file `.env` di root project:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SHEETS_URL=https://docs.google.com/spreadsheets/d/YOUR_ID/pub?gid=0&single=true&output=csv
```

### 4. Jalankan Lokal

```bash
npm run dev
```

Buka `http://localhost:5173`

---

## 📦 Deploy ke Vercel

### Cara 1: Via GitHub (Rekomendasi)

1. Push project ke GitHub:
```bash
git init
git add .
git commit -m "init: dashboard validasi uptd"
git remote add origin https://github.com/username/uptd-dashboard.git
git push -u origin main
```

2. Buka [vercel.com](https://vercel.com) → **New Project** → Import dari GitHub
3. Di bagian **Environment Variables**, tambahkan:
   - Key: `VITE_SHEETS_URL`
   - Value: URL Google Sheets CSV Anda
4. Di bagian **Project Name**, ganti namanya jadi sesuatu yang tidak deskriptif, contoh: `validasi-uptd-k7x2m` atau `monitoring-internal-2026`
5. Klik **Deploy**
6. URL final: `https://validasi-uptd-k7x2m.vercel.app` → share ke menteri

> 🔒 **Keamanan URL:** Dashboard tidak diindeks Google (`robots.txt` + `X-Robots-Tag` header sudah dikonfigurasi). Siapapun yang tidak tahu URL-nya tidak akan bisa menemukan halaman ini.

### Cara 2: Via Vercel CLI

```bash
npm i -g vercel
vercel
# Ikuti promptnya, masukkan env variable saat diminta
```

---

## 🔧 Kustomisasi

### Ganti Nama Kolom Google Sheets

Edit fungsi `parseRow` di `src/hooks/useSheetData.js`:

```js
function parseRow(row) {
  // Sesuaikan dengan header kolom di Google Sheets Anda
  return {
    no: parseInt(row['No'] || 0),
    satker: row['Satker'] || '',
    totalBinaan: parseInt(row['Total Binaan'] || 0),
    totalPegawai: parseInt(row['Total Pegawai'] || 0),
    lengkap: parseInt(row['Lengkap'] || 0),
    tidakLengkap: parseInt(row['Tidak Lengkap'] || 0),
    // ... dst
  }
}
```

### Ganti Interval Auto-Refresh

Di `src/hooks/useSheetData.js`, ubah nilai `REFRESH_INTERVAL`:

```js
const REFRESH_INTERVAL = 5 * 60 * 1000  // 5 menit (default)
const REFRESH_INTERVAL = 1 * 60 * 1000  // 1 menit
const REFRESH_INTERVAL = 30 * 1000      // 30 detik
```

### Color Coding Progress

Warna otomatis berdasarkan persentase:
- 🔴 `< 10%` → Merah
- 🟣 `10–24%` → Ungu
- 🔵 `25–49%` → Biru
- 🟢 `≥ 50%` → Hijau

Ubah threshold di `src/components/DataTable.jsx` dan `src/components/Charts.jsx`.

---

## 📁 Struktur Project

```
uptd-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx      # Header, timestamp, refresh button
│   │   ├── KpiCards.jsx    # 4 KPI summary cards
│   │   ├── Charts.jsx      # Bar chart + Pie/Donut chart
│   │   └── DataTable.jsx   # Tabel lengkap + search + filter + sort
│   ├── hooks/
│   │   └── useSheetData.js # Data fetching dari Google Sheets CSV
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── vercel.json
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## ⚠️ Troubleshooting

**Data tidak muncul / error fetch:**
- Pastikan Google Sheets sudah di-publish (File → Share → Publish to web)
- Pastikan URL di `.env` sudah benar
- Cek browser console untuk pesan error

**CORS error:**
- Google Sheets CSV URL sudah support CORS secara default
- Jika masih error, coba buka URL-nya langsung di browser untuk memastikan bisa diakses

**Data dummy yang muncul:**
- Artinya `VITE_SHEETS_URL` belum dikonfigurasi atau environment variable belum terbaca
- Pastikan file `.env` ada di root project (bukan di dalam `src/`)
- Restart dev server setelah edit `.env`

---

## 📝 Lisensi

Internal use. Hak cipta © 2026.
