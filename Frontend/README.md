# TEKA Frontend

Platform pembelajaran dan kuis interaktif anti-slop bertema Quiziz modern menggunakan **React JS + Vite + Tailwind CSS**.

## ✨ Fitur Utama

- **Tema Ungu Modern (Quiziz-inspired)**: Palette warna `#7c3aed`, gradient halus, kartu rounded modern, dan micro-interactions 60fps.
- **Parallax Landing Page**: Efek parallax multi-layer di Hero Section dengan optimasi otomatis disable di perangkat mobile (`max-width: 768px`) dan `prefers-reduced-motion`.
- **Katalog Kuis Interaktif**: Pencarian real-time, filter kategori dinamis, dan kartu kuis dengan indikator durasi serta status kuis.
- **Ruang Ujian Berwaktu (Quiz Play)**:
  - Countdown timer dengan indikator warna saat tersisa < 60 detik.
  - Palet nomor soal interaktif untuk melompat antar soal.
  - Penanda soal ragu-ragu (*flagging*).
  - Progress bar animasi pengerjaan soal.
  - Auto-save jawaban ke server saat opsi dipilih.
  - Konfirmasi review status pengerjaan sebelum submit akhir.
  - Proteksi *beforeunload* mencegah keluar/refresh tanpa sengaja.
- **Halaman Evaluasi & Hasil**:
  - Score card dengan animasi count-up dari 0 hingga skor akhir.
  - Statistik ringkasan (benar, salah, poin, status).
  - Pembahasan dan review mendalam setiap butir soal.
- **Dashboard Terintegrasi**:
  - Kartu statistik skor dan aktivitas terbaru.
  - Manajemen kelas belajar (gabung kelas dengan kode kelas).
  - Riwayat lengkap pengerjaan kuis.
  - Pengaturan profil pengguna dan ganti kata sandi.
- **Autentikasi & Interseptor API**:
  - Dukungan JWT Access Token & Refresh Token otomatis.
  - Error handling terpadu (401 otomatis redirect ke login).

## 🚀 Menjalankan Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Environment
Salin file `.env.example` ke `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=15000
VITE_ENABLE_PARALLAX=true
```

### 3. Jalankan Development Server
```bash
npm run dev
```
Aplikasi akan aktif di `http://localhost:5173`.

### 4. Build Production
```bash
npm run build
```
Hasil build akan tersimpan di direktori `dist/`.

