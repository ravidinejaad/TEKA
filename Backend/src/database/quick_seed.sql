-- QUICK SEED DATA - Copy paste ini ke phpMyAdmin atau MySQL Workbench
USE teka_db;

-- Password untuk semua user: password123
-- Hash: $2a$10$NO9zZZ0HB0XYtwtXqo8rBO9Q.DTuVF0WkNfhh8Il5AmVkXFBHihP2

-- Bersihkan data lama (HATI-HATI!)
-- DELETE FROM quiz_answers;
-- DELETE FROM quiz_attempts;
-- DELETE FROM quiz_questions;
-- DELETE FROM quizzes;
-- DELETE FROM question_options;
-- DELETE FROM questions;
-- DELETE FROM class_members;
-- DELETE FROM classes;
-- DELETE FROM categories WHERE id_kategori > 0;
-- DELETE FROM users WHERE id_user > 3;

-- Pastikan ada categories
INSERT IGNORE INTO categories (nama_kategori, deskripsi) VALUES
('Matematika', 'Kategori kuis matematika'),
('Bahasa Indonesia', 'Kategori kuis bahasa Indonesia'),
('IPA', 'Kategori kuis ilmu pengetahuan alam');

-- Buat kelas (pastikan teacher dengan id=2 ada)
INSERT INTO classes (id_pengajar, nama_kelas, kode_kelas, deskripsi, id_kategori) VALUES
(2, 'Kelas 10A - Matematika', 'MTK10A', 'Kelas matematika untuk siswa kelas 10A', 1),
(2, 'Kelas 11B - Bahasa Indonesia', 'BIND11B', 'Kelas bahasa Indonesia untuk siswa kelas 11B', 2),
(2, 'Kelas 12 - IPA Terpadu', 'IPA12', 'Kelas IPA terpadu untuk persiapan ujian', 3);

-- Join student (id=3) ke kelas
INSERT INTO class_members (id_kelas, id_user) 
SELECT id_kelas, 3 FROM classes WHERE kode_kelas IN ('MTK10A', 'BIND11B', 'IPA12');

-- Buat soal
INSERT INTO questions (id_pengajar, pertanyaan, jenis_soal, kunci_jawaban, pembahasan) VALUES
(2, 'Berapakah hasil dari 15 + 27?', 'pilihan_ganda', '42', 'Penjumlahan: 15 + 27 = 42'),
(2, 'Berapakah nilai dari 12 x 8?', 'pilihan_ganda', '96', 'Perkalian: 12 x 8 = 96'),
(2, 'Apakah 25 adalah bilangan prima?', 'benar_salah', 'Salah', '25 bukan bilangan prima');

-- Options untuk soal 1
INSERT INTO question_options (id_soal, label_opsi, teks_opsi, urutan) VALUES
(LAST_INSERT_ID()-2, 'A', '40', 1),
(LAST_INSERT_ID()-2, 'B', '42', 2),
(LAST_INSERT_ID()-2, 'C', '44', 3),
(LAST_INSERT_ID()-2, 'D', '45', 4);

-- Options untuk soal 2
INSERT INTO question_options (id_soal, label_opsi, teks_opsi, urutan) VALUES
(LAST_INSERT_ID()-1, 'A', '84', 1),
(LAST_INSERT_ID()-1, 'B', '92', 2),
(LAST_INSERT_ID()-1, 'C', '96', 3),
(LAST_INSERT_ID()-1, 'D', '100', 4);

-- Options untuk soal 3
INSERT INTO question_options (id_soal, label_opsi, teks_opsi, urutan) VALUES
(LAST_INSERT_ID(), 'A', 'Benar', 1),
(LAST_INSERT_ID(), 'B', 'Salah', 2);

-- Buat quiz
INSERT INTO quizzes (id_kelas, judul, deskripsi, durasi_menit, waktu_mulai, waktu_selesai, status) 
SELECT id_kelas, 'Quiz Matematika - Operasi Dasar', 'Quiz tentang penjumlahan dan perkalian', 30, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'published'
FROM classes WHERE kode_kelas = 'MTK10A';

-- Hubungkan soal dengan quiz (ambil 3 soal terakhir)
INSERT INTO quiz_questions (id_kuis, id_soal, bobot, urutan)
SELECT 
  (SELECT id_kuis FROM quizzes WHERE judul = 'Quiz Matematika - Operasi Dasar' LIMIT 1),
  id_soal,
  10.00,
  @rownum := @rownum + 1
FROM questions, (SELECT @rownum := 0) r
ORDER BY id_soal DESC
LIMIT 3;

SELECT 'DATA BERHASIL DI-INSERT!' as Status;
SELECT COUNT(*) as 'Total Classes' FROM classes;
SELECT COUNT(*) as 'Total Questions' FROM questions;
SELECT COUNT(*) as 'Total Quizzes' FROM quizzes;
