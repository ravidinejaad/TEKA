# 🎯 PETUNJUK LENGKAP - TEST QUIZ SEKARANG!

## ✅ Yang Sudah Saya Perbaiki

### Frontend Dashboard User (100% Terintegrasi):
1. ✅ **ClassesPage** - Lihat kelas yang diikuti
2. ✅ **MyQuizzesPage** - Lihat quiz dari kelas
3. ✅ **QuizPlayPage** - Ngerjain quiz dengan timer
4. ✅ **QuizResultPage** - Lihat hasil (score, benar/salah, pembahasan)

### Backend API (Lengkap):
1. ✅ Route `/api/quiz-attempts` dengan alias `/complete` dan `/result`
2. ✅ Controller `getQuizQuestions` untuk ambil soal
3. ✅ Endpoint lengkap untuk start, submit, complete, get result

### Logging (Debug):
- ✅ Console.log di semua fungsi fetch data
- ✅ Error handling yang jelas
- ✅ Toast notification untuk setiap aksi

---

## 🚀 LANGKAH TEST SEKARANG

### STEP 1: IMPORT DATA (WAJIB!)

**1.1 Buka phpMyAdmin:**
```
http://localhost/phpmyadmin
```

**1.2 Login:**
- Username: `root`
- Password: (kosong atau sesuai setup)

**1.3 Pilih database `teka_db` di sidebar kiri**

**1.4 Klik tab "SQL"**

**1.5 Copy SEMUA isi file:**
```
Backend/src/database/IMPORT_SEKARANG.sql
```

**1.6 Paste ke kotak SQL & klik "Go"**

**1.7 Verifikasi - Cek tabel ini punya data:**
- `classes` → 3 rows ✅
- `questions` → 3 rows ✅
- `quizzes` → 1 row ✅
- `class_members` → 3 rows ✅
- `question_options` → 10 rows ✅
- `quiz_questions` → 3 rows ✅

---

### STEP 2: RESTART BACKEND (Ada Perubahan Code!)

```bash
# Terminal 1: Stop backend yang lama (Ctrl+C)
cd Backend
npm run dev
```

**Tunggu sampai muncul:**
```
✅ Database connection successful
🚀 Server running on port 5000
```

---

### STEP 3: PASTIKAN FRONTEND JALAN

```bash
# Terminal 2: Frontend
cd Frontend
npm run dev
```

**Buka browser:**
```
http://localhost:5173
```

---

### STEP 4: TEST FLOW LENGKAP 🎯

#### 4.1 Login
1. Buka: http://localhost:5173/login
2. Email: `user@teka.test`
3. Password: `password123`
4. Klik **"Masuk"**

✅ **Expected:** Redirect ke `/dashboard`

#### 4.2 Cek Halaman Kelas
1. Klik menu **"Kelas"** di sidebar
2. URL: http://localhost:5173/dashboard/classes

✅ **Expected:** Muncul 3 kelas:
- Kelas 10A - Matematika (MTK10A)
- Kelas 11B - Bahasa Indonesia (BIND11B)
- Kelas 12 - IPA Terpadu (IPA12)

❌ **Jika KOSONG:**
- Buka Console (F12 → Console)
- Lihat log: `🔍 Fetching classes...` dan `✅ Classes response:`
- Screenshot error merah & kirim ke saya

#### 4.3 Cek Halaman Kuis Terdaftar
1. Klik menu **"Kuis Terdaftar"**
2. URL: http://localhost:5173/dashboard/quizzes

✅ **Expected:** Muncul 1 quiz:
- **Quiz Matematika - Operasi Dasar**
- Status: **Tersedia** (badge hijau)
- Durasi: 30 menit
- Tombol: **"Mulai Kuis"** (biru, enabled)

❌ **Jika KOSONG:**
- Cek console browser
- Lihat log: `🔍 Fetching classes for quizzes...`
- Pastikan kelas sudah muncul di step 4.2

#### 4.4 MULAI QUIZ! 🎉
1. **Klik tombol "Mulai Kuis"**
2. URL berubah ke: `/dashboard/quiz/1`

✅ **Expected:**
- Timer countdown muncul (30:00)
- Progress bar muncul
- Soal 1 tampil: "Berapakah hasil dari 15 + 27?"
- 4 pilihan jawaban: A. 40, B. 42, C. 44, D. 45
- Tombol navigasi: "Sebelumnya" (disabled) & "Selanjutnya"

**Console akan menampilkan:**
```
🔍 Fetching quiz data for ID: 1
✅ Quiz detail response: {...}
📝 Quiz data: {...}
🔍 Fetching questions for quiz ID: 1
✅ Questions response: {...}
📋 Questions data: [3 soal]
🚀 Starting quiz attempt...
✅ Attempt started: {id_percobaan: ...}
```

#### 4.5 Jawab Soal
1. **Soal 1:** Klik **B. 42** ✅ (Benar)
2. Klik tombol **"Selanjutnya"**
3. **Soal 2:** "Berapakah nilai dari 12 x 8?"
4. Klik **C. 96** ✅ (Benar)
5. Klik tombol **"Selanjutnya"**
6. **Soal 3:** "Apakah 25 adalah bilangan prima?"
7. Klik **B. Salah** ✅ (Benar)

✅ **Expected:**
- Setiap pilihan yang diklik highlight ungu
- Counter "3 dari 3 soal terjawab"
- Tombol "Submit Quiz" muncul (hijau)

#### 4.6 Submit Quiz
1. Klik tombol **"Submit Quiz"**
2. Confirm dialog muncul (jika belum semua terjawab)
3. Klik **OK**

**Console akan menampilkan:**
```
📤 Submitting quiz...
Attempt ID: ...
Answers: {1: "42", 2: "96", 3: "Salah"}
📋 Answer data to submit: [...]
✅ Submit response: {...}
🏁 Completing attempt...
✅ Complete response: {...}
🎯 Redirecting to result page...
```

✅ **Expected:**
- Toast: "Quiz berhasil disubmit!"
- Redirect ke `/dashboard/quiz-result/{attemptId}`

#### 4.7 Lihat Hasil 🎉
✅ **Expected Result Page:**

**Score Card:**
- Badge ungu besar: **100** / 100
- Text: **"Luar Biasa! 🎉"**
- Judul: "Quiz Matematika - Operasi Dasar"
- Kelas: "Kelas 10A - Matematika"

**Statistik:**
- Benar: **3** (hijau)
- Salah: **0** (merah)
- Total Soal: **3**
- Waktu: **~1m 30s**

**Performance Message:**
- "Prestasi Cemerlang!"
- "Anda menguasai materi dengan sangat baik. Pertahankan!"

**Pembahasan Soal (Expand/Collapse):**
- Soal 1: ✅ Benar - Jawaban Anda: 42, Kunci: 42
- Soal 2: ✅ Benar - Jawaban Anda: 96, Kunci: 96
- Soal 3: ✅ Benar - Jawaban Anda: Salah, Kunci: Salah

**Console akan menampilkan:**
```
🔍 Fetching result for attempt ID: ...
✅ Result response: {...}
🎯 Result data: {skor: 100, total_questions: 3, ...}
```

---

## 🐛 TROUBLESHOOTING

### Error: "Network Error"
**Solusi:**
- Backend mati → Restart: `cd Backend && npm run dev`
- Cek URL di `.env`: `VITE_API_BASE_URL=http://localhost:5000/api`

### Error: "401 Unauthorized"
**Solusi:**
- Token expired → Logout & login lagi
- Clear localStorage (F12 → Application → Local Storage → Clear)

### Halaman Kelas/Quiz Kosong
**Solusi:**
1. Buka Console (F12)
2. Cek log:
   - Ada error merah? Screenshot & kirim
   - `✅ Classes response:` → apa isinya?
   - `data: []` → **Data belum di-import!** Ulangi STEP 1

### Error: "Quiz tidak ditemukan"
**Solusi:**
- Pastikan data di-import dengan benar
- Cek tabel `quizzes` di phpMyAdmin → harus ada 1 row
- Cek `quiz_questions` → harus ada 3 rows

### Error: "Anda bukan anggota kelas"
**Solusi:**
- Cek tabel `class_members` → harus ada row:
  ```
  id_kelas: 1, id_user: 3
  ```
- Jika tidak ada, jalankan SQL:
  ```sql
  INSERT INTO class_members (id_kelas, id_user) VALUES (1, 3);
  ```

### Quiz tidak bisa submit
**Solusi:**
1. Cek console untuk error
2. Pastikan semua soal dijawab
3. Cek backend logs (terminal backend)
4. Test manual endpoint:
   ```bash
   curl http://localhost:5000/api/quiz-attempts
   ```

---

## 📊 DATA YANG DI-IMPORT

### Users (sudah ada):
- `user@teka.test` / `password123` (student) ← **PAKAI INI**
- `teacher@teka.test` / `password123` (teacher)
- `admin@teka.test` / `password123` (admin)

### Kelas (3):
1. **Kelas 10A - Matematika** (MTK10A)
2. **Kelas 11B - Bahasa Indonesia** (BIND11B)
3. **Kelas 12 - IPA Terpadu** (IPA12)

### Quiz (1):
- **Quiz Matematika - Operasi Dasar**
- Kelas: Kelas 10A - Matematika
- Durasi: 30 menit
- Status: published
- 3 soal matematika

### Soal (3):
1. **15 + 27 = ?**
   - A. 40
   - B. 42 ✅
   - C. 44
   - D. 45

2. **12 x 8 = ?**
   - A. 84
   - B. 92
   - C. 96 ✅
   - D. 100

3. **25 adalah bilangan prima?**
   - A. Benar
   - B. Salah ✅

---

## ✅ CHECKLIST FINAL

Sebelum bilang "tidak berfungsi", pastikan:

- [ ] MySQL running (cek XAMPP/Laragon)
- [ ] Data sudah di-import (cek phpMyAdmin)
- [ ] Backend running di port 5000
- [ ] Frontend running di port 5173
- [ ] Sudah login dengan `user@teka.test`
- [ ] Sudah buka halaman `/dashboard/classes`
- [ ] Sudah buka halaman `/dashboard/quizzes`
- [ ] Sudah cek Console browser (F12)
- [ ] Screenshot error jika ada

---

## 📝 CARA CEK ERROR DI CONSOLE

1. **Buka Browser Developer Tools:**
   - Chrome/Edge: `F12` atau `Ctrl+Shift+I`
   - Firefox: `F12`

2. **Klik tab "Console"**

3. **Lihat log yang saya tambahkan:**
   - 🔍 = Sedang fetch data
   - ✅ = Sukses dapat response
   - ❌ = Error terjadi
   - 📚 = Data yang diterima

4. **Screenshot & kirim jika ada error merah**

---

## 🎯 HASIL YANG HARUS DIDAPAT

Jika semua berhasil, Anda akan bisa:

✅ Login sebagai student
✅ Lihat 3 kelas di halaman Kelas
✅ Lihat 1 quiz di halaman Kuis Terdaftar
✅ Klik "Mulai Kuis" dan masuk ke halaman quiz
✅ Lihat timer countdown 30:00
✅ Jawab 3 soal matematika
✅ Submit quiz
✅ Lihat hasil score 100 (jika semua benar)
✅ Lihat pembahasan soal dengan jawaban benar/salah
✅ Badge "Luar Biasa! 🎉"

---

**Silakan jalankan STEP 1-4 dan kirim screenshot jika ada masalah!** 🚀
