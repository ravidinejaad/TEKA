# 🚀 CARA IMPORT DATA DUMMY UNTUK TESTING

## ⚠️ PENTING: Jalankan ini di MySQL/phpMyAdmin

### Metode 1: Menggunakan phpMyAdmin (RECOMMENDED)

1. **Buka phpMyAdmin** di browser: `http://localhost/phpmyadmin`

2. **Pilih database `teka_db`** di sidebar kiri

3. **Klik tab "SQL"** di bagian atas

4. **Copy-paste** seluruh isi file `Backend/src/database/quick_seed.sql`

5. **Klik tombol "Go"** di kanan bawah

6. **✅ Selesai!** Data sudah ter-import

---

### Metode 2: Menggunakan MySQL Command Line

```bash
# 1. Buka Command Prompt
# 2. Masuk ke MySQL
mysql -u root -p

# 3. Jalankan perintah
USE teka_db;
SOURCE C:/Codingan/Teka/Backend/src/database/quick_seed.sql
```

---

### Metode 3: Menggunakan MySQL Workbench

1. Buka **MySQL Workbench**
2. Connect ke server MySQL
3. Pilih database `teka_db`
4. Klik **File > Open SQL Script**
5. Pilih file `Backend/src/database/quick_seed.sql`
6. Klik **Execute** (⚡ icon) atau tekan `Ctrl+Shift+Enter`

---

## 📊 Data yang Akan Di-Import

### Classes (3 kelas):
- **MTK10A** - Kelas 10A Matematika
- **BIND11B** - Kelas 11B Bahasa Indonesia  
- **IPA12** - Kelas 12 IPA Terpadu

### Questions (3 soal):
1. Berapakah hasil dari 15 + 27? (Pilihan Ganda)
2. Berapakah nilai dari 12 x 8? (Pilihan Ganda)
3. Apakah 25 adalah bilangan prima? (Benar/Salah)

### Quiz (1 quiz):
- **Quiz Matematika - Operasi Dasar**
  - Durasi: 30 menit
  - Status: Published
  - 3 soal

### Class Members:
- User `user@teka.test` (student) sudah join ke ketiga kelas

---

## 🔐 Login Credentials untuk Testing

### Student (untuk test quiz):
```
Email: user@teka.test
Password: password123
```

### Teacher (untuk manage quiz):
```
Email: teacher@teka.test
Password: password123
```

### Admin (untuk admin dashboard):
```
Email: admin@teka.test
Password: password123
```

---

## ✅ Verifikasi Data Berhasil Di-Import

Jalankan query ini di MySQL:

```sql
USE teka_db;

-- Cek jumlah data
SELECT 'Classes' as Type, COUNT(*) as Total FROM classes
UNION ALL
SELECT 'Questions', COUNT(*) FROM questions
UNION ALL
SELECT 'Quizzes', COUNT(*) FROM quizzes
UNION ALL
SELECT 'Class Members', COUNT(*) FROM class_members;

-- Cek detail kelas
SELECT * FROM classes;

-- Cek detail quiz
SELECT * FROM quizzes;
```

Expected output:
```
Classes: 3+
Questions: 3+
Quizzes: 1+
Class Members: 3+
```

---

## 🧪 Testing Flow

### 1. Login sebagai Student
```
1. Buka: http://localhost:5173/login
2. Email: user@teka.test
3. Password: password123
4. Klik "Login"
```

### 2. Test Menu "Kelas"
```
1. Klik menu "Kelas" di sidebar
2. Lihat 3 kelas (MTK10A, BIND11B, IPA12)
3. Coba "Gabung Kelas" dengan kode: MTK10A
```

### 3. Test Menu "Kuis Terdaftar"
```
1. Klik menu "Kuis Terdaftar"
2. Lihat "Quiz Matematika - Operasi Dasar"
3. Filter by class "Kelas 10A - Matematika"
4. Klik "Mulai Kuis" untuk quiz yang tersedia
```

### 4. Test Mengerjakan Quiz
```
1. Klik "Mulai Kuis"
2. Jawab 3 soal yang tersedia
3. Klik "Submit" setelah selesai
4. Lihat hasil di halaman Result
```

---

## 🔧 Troubleshooting

### Error: "Table doesn't exist"
```sql
-- Pastikan schema sudah dijalankan
SOURCE C:/Codingan/Teka/Backend/src/database/schema.sql
```

### Error: "Foreign key constraint fails"
```sql
-- Pastikan ada user teacher dengan id=2
SELECT * FROM users WHERE id_user = 2;

-- Jika tidak ada, ubah script atau buat user teacher dulu
```

### Error: "Duplicate entry"
```sql
-- Hapus data lama dulu sebelum import
DELETE FROM quiz_questions;
DELETE FROM quizzes;
DELETE FROM questions;
DELETE FROM class_members;
DELETE FROM classes;
```

---

## 📝 Notes

- Password hash yang digunakan: `$2a$10$NO9zZZ0HB0XYtwtXqo8rBO9Q.DTuVF0WkNfhh8Il5AmVkXFBHihP2`
- Password plaintext: `password123`
- Semua quiz di-set status `published` dan waktu selesai 7 hari dari sekarang
- Class members otomatis di-assign untuk user dengan id=3 (user@teka.test)

---

## 🎉 Setelah Import Selesai

**Backend (Terminal 1):**
```bash
cd Backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd Frontend
npm run dev
```

**Buka Browser:**
```
http://localhost:5173
```

**Login dan Test!** 🚀
