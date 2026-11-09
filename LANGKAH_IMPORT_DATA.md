# 🚀 LANGKAH IMPORT DATA & TEST QUIZ

## ⚠️ PENTING - Kerjakan Step by Step!

### ✅ Status Sekarang
- ✅ Backend: Jalan (port 5000)
- ✅ Frontend: Jalan (port 5173)  
- ✅ MySQL: Jalan
- ❌ Data dummy: **BELUM DI-IMPORT**

---

## 📋 LANGKAH 1: IMPORT DATA KE DATABASE

### Cara 1: Via phpMyAdmin (PALING MUDAH) ⭐

1. **Buka phpMyAdmin di browser:**
   ```
   http://localhost/phpmyadmin
   ```

2. **Login dengan:**
   - Username: `root`
   - Password: (kosong atau sesuai setup Anda)

3. **Pilih database `teka_db` di sidebar kiri**

4. **Klik tab "SQL" di atas**

5. **Copy SEMUA isi file ini:**
   ```
   Backend/src/database/IMPORT_SEKARANG.sql
   ```
   
6. **Paste ke kotak SQL di phpMyAdmin**

7. **Klik tombol "Go" atau "Kirim"**

8. **Tunggu sampai muncul "✅ DATA BERHASIL DI-IMPORT!"**

### Cara 2: Via HeidiSQL / MySQL Workbench

1. Buka HeidiSQL atau MySQL Workbench
2. Connect ke database `teka_db`
3. Buka file `Backend/src/database/IMPORT_SEKARANG.sql`
4. Execute (Run/F9)

---

## 📋 LANGKAH 2: VERIFIKASI DATA BERHASIL DI-IMPORT

Buka phpMyAdmin → pilih database `teka_db` → cek tabel-tabel ini:

✅ Harus ada data:
- **classes** → 3 rows (MTK10A, BIND11B, IPA12)
- **questions** → 3 rows (3 soal matematika)
- **quizzes** → 1 row (Quiz Matematika - Operasi Dasar)
- **class_members** → 3 rows (user id=3 join 3 kelas)
- **question_options** → 10 rows (pilihan jawaban)
- **quiz_questions** → 3 rows (soal di quiz)

**Jika masih 0 rows → Import belum berhasil, ulangi Langkah 1!**

---

## 📋 LANGKAH 3: TEST QUIZ SEKARANG! 🎯

### 1. Login ke Aplikasi

Buka browser: http://localhost:5173/login

**Login dengan:**
- Email: `user@teka.test`
- Password: `password123`
- Klik "Masuk"

### 2. Cek Halaman Kelas

Setelah login, Anda akan redirect ke dashboard.

Klik menu **"Kelas"** atau buka: http://localhost:5173/dashboard/classes

**✅ Harus muncul 3 kelas:**
- Kelas 10A - Matematika (MTK10A)
- Kelas 11B - Bahasa Indonesia (BIND11B)
- Kelas 12 - IPA Terpadu (IPA12)

**❌ Jika KOSONG / ERROR:**
- Cek console browser (F12) → lihat error
- Pastikan data sudah di-import (ulangi Langkah 1-2)
- Pastikan backend jalan di port 5000

### 3. Cek Halaman Kuis Terdaftar

Klik menu **"Kuis Terdaftar"** atau buka: http://localhost:5173/dashboard/quizzes

**✅ Harus muncul 1 quiz:**
- **Quiz Matematika - Operasi Dasar**
- Durasi: 30 menit
- Status: **Tersedia** (badge hijau)
- Tombol: **"Mulai Kuis"** (biru, aktif)

**❌ Jika KOSONG / ERROR:**
- Lihat console browser (F12)
- Pastikan kelas sudah muncul dulu (step 2)
- Refresh halaman (Ctrl+R)

### 4. Mulai Quiz! 🎉

1. **Klik tombol "Mulai Kuis"**
2. Anda akan dibawa ke halaman quiz dengan:
   - Timer countdown (30:00)
   - 3 soal matematika
   - Progress bar
   - Navigasi soal

3. **Jawab soal-soal:**
   - Soal 1: "Berapakah hasil dari 15 + 27?" → Pilih **42** (B)
   - Soal 2: "Berapakah nilai dari 12 x 8?" → Pilih **96** (C)
   - Soal 3: "Apakah 25 adalah bilangan prima?" → Pilih **Salah** (B)

4. **Klik "Submit Quiz"**

5. **Lihat hasil:**
   - Score: **100** (3/3 benar)
   - Badge: **"Luar Biasa! 🎉"**
   - Statistik lengkap
   - Pembahasan soal (expand)

---

## 🐛 TROUBLESHOOTING

### Masalah: Halaman Kelas/Quiz Kosong

**Solusi:**
1. Buka Console Browser (F12) → tab "Console"
2. Lihat error merah
3. Kemungkinan:
   - **"Network Error"** → Backend mati, restart: `cd Backend && npm run dev`
   - **"401 Unauthorized"** → Token expired, logout & login lagi
   - **"404 Not Found"** → Endpoint salah, cek Backend controller
   - **Data masih kosong** → Import data belum berhasil (ulangi Langkah 1)

### Masalah: Backend Error ECONNREFUSED

**Solusi:**
1. Pastikan MySQL running (cek XAMPP/Laragon Control Panel)
2. Start MySQL service
3. Restart backend: `cd Backend && npm run dev`

### Masalah: Frontend tidak bisa akses Backend

**Solusi:**
1. Cek file `Frontend/.env`:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
2. Pastikan backend jalan di port 5000
3. Restart frontend: `cd Frontend && npm run dev`

### Masalah: Login berhasil tapi redirect error

**Solusi:**
1. Cek role user di database (harus `student`)
2. Clear localStorage browser (F12 → Application → Local Storage → Clear)
3. Login ulang

---

## 📊 DATA DUMMY YANG DI-IMPORT

### Users (sudah ada dari setup sebelumnya):
- `admin@teka.test` / `password123` (role: admin)
- `teacher@teka.test` / `password123` (role: teacher)
- `user@teka.test` / `password123` (role: student) ← **GUNAKAN INI**

### Kelas (3):
1. Kelas 10A - Matematika (kode: MTK10A)
2. Kelas 11B - Bahasa Indonesia (kode: BIND11B)
3. Kelas 12 - IPA Terpadu (kode: IPA12)

### Quiz (1):
- **Quiz Matematika - Operasi Dasar**
- Durasi: 30 menit
- Status: published
- Waktu: Sekarang s/d +7 hari (selalu tersedia)

### Soal (3):
1. 15 + 27 = ? (Jawaban: 42)
2. 12 x 8 = ? (Jawaban: 96)
3. 25 adalah bilangan prima? (Jawaban: Salah)

---

## ✅ CHECKLIST SEBELUM TEST

- [ ] MySQL running
- [ ] Backend running (`npm run dev` di folder Backend)
- [ ] Frontend running (`npm run dev` di folder Frontend)
- [ ] Data sudah di-import (cek tabel di phpMyAdmin)
- [ ] Browser dibuka di `http://localhost:5173`
- [ ] Login dengan `user@teka.test` / `password123`
- [ ] Halaman kelas menampilkan 3 kelas
- [ ] Halaman quiz menampilkan 1 quiz
- [ ] Bisa klik "Mulai Kuis" dan ngerjain soal
- [ ] Bisa submit dan lihat hasil

---

## 🎯 NEXT STEPS SETELAH BERHASIL

Setelah berhasil test quiz, Anda bisa:
1. Tambah kelas baru (via teacher account)
2. Tambah quiz baru (via teacher account)
3. Test dashboard admin (login dengan `admin@teka.test`)
4. Coba fitur-fitur lain (history, profile, analytics)

---

**💡 TIP:** Jika masih error, kirim screenshot console browser (F12) dan pesan error yang muncul!
