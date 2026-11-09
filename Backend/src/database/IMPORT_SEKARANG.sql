-- =============================================
-- SEED DATA TEKA DB (AMAN DI-IMPORT ULANG)
-- =============================================

USE teka_db;

-- Bersihkan data kuis & soal lama agar tidak terjadi duplikasi opsi
DELETE FROM quiz_answers;
DELETE FROM quiz_attempts;
DELETE FROM quiz_questions;
DELETE FROM question_options;
DELETE FROM quizzes;
DELETE FROM questions;

-- 1. INSERT KELAS (3 kelas)
INSERT IGNORE INTO classes (id_kelas, id_pengajar, nama_kelas, kode_kelas, deskripsi, id_kategori) VALUES
(1, 2, 'Kelas 10A - Matematika', 'MTK10A', 'Kelas matematika untuk siswa kelas 10A', 1),
(2, 2, 'Kelas 11B - Bahasa Indonesia', 'BIND11B', 'Kelas bahasa Indonesia untuk siswa kelas 11B', 2),
(3, 2, 'Kelas 12 - IPA Terpadu', 'IPA12', 'Kelas IPA terpadu untuk persiapan ujian', 3);

-- 2. JOIN USER KE KELAS (user id=3 join semua kelas)
INSERT IGNORE INTO class_members (id_kelas, id_user) VALUES
(1, 3),
(2, 3),
(3, 3);

-- 3. INSERT SOAL MATEMATIKA (ID 1, 2, 3)
INSERT INTO questions (id_soal, id_pengajar, pertanyaan, jenis_soal, kunci_jawaban, pembahasan) VALUES
(1, 2, 'Berapakah hasil dari 15 + 27?', 'pilihan_ganda', '42', 'Penjumlahan sederhana: 15 + 27 = 42'),
(2, 2, 'Berapakah nilai dari 12 x 8?', 'pilihan_ganda', '96', 'Perkalian: 12 x 8 = 96'),
(3, 2, 'Apakah 25 adalah bilangan prima?', 'benar_salah', 'Salah', '25 bukan bilangan prima karena dapat dibagi 5');

-- 4. INSERT OPTIONS SOAL 1 (15 + 27 = 42)
INSERT INTO question_options (id_soal, label_opsi, teks_opsi, urutan) VALUES
(1, 'A', '40', 1),
(1, 'B', '42', 2),
(1, 'C', '44', 3),
(1, 'D', '45', 4);

-- 5. INSERT OPTIONS SOAL 2 (12 x 8 = 96)
INSERT INTO question_options (id_soal, label_opsi, teks_opsi, urutan) VALUES
(2, 'A', '84', 1),
(2, 'B', '92', 2),
(2, 'C', '96', 3),
(2, 'D', '100', 4);

-- 6. INSERT OPTIONS SOAL 3 (Benar/Salah)
INSERT INTO question_options (id_soal, label_opsi, teks_opsi, urutan) VALUES
(3, 'A', 'Benar', 1),
(3, 'B', 'Salah', 2);

-- 7. INSERT SOAL PENGETAHUAN UMUM (ID 4, 5, 6)
INSERT INTO questions (id_soal, id_pengajar, pertanyaan, jenis_soal, kunci_jawaban, pembahasan) VALUES
(4, 2, 'Apa nama ibukota Indonesia?', 'pilihan_ganda', 'Jakarta', 'Jakarta adalah ibukota negara Indonesia sejak tahun 1945.'),
(5, 2, 'Berapa jumlah pulau di Indonesia?', 'pilihan_ganda', 'Lebih dari 17.000', 'Indonesia memiliki lebih dari 17.000 pulau yang tersebar di seluruh nusantara.'),
(6, 2, 'Apakah Jakarta adalah kota terbesar di Indonesia?', 'benar_salah', 'Benar', 'Jakarta adalah kota terbesar di Indonesia dari segi populasi.');

-- 8. OPTIONS SOAL UMUM
INSERT INTO question_options (id_soal, label_opsi, teks_opsi, urutan) VALUES
(4, 'A', 'Jakarta', 1),
(4, 'B', 'Bandung', 2),
(4, 'C', 'Surabaya', 3),
(4, 'D', 'Medan', 4),
(5, 'A', 'Lebih dari 10.000', 1),
(5, 'B', 'Lebih dari 17.000', 2),
(5, 'C', 'Lebih dari 20.000', 3),
(5, 'D', 'Lebih dari 25.000', 4),
(6, 'A', 'Benar', 1),
(6, 'B', 'Salah', 2);

-- 9. INSERT QUIZ MATEMATIKA (di kelas MTK10A)
INSERT INTO quizzes (id_kuis, id_kelas, judul, deskripsi, durasi_menit, waktu_mulai, waktu_selesai, status, bisa_coba_ulang, tampilkan_jawaban) VALUES
(1, 1, 'Quiz Matematika - Operasi Dasar', 'Quiz tentang penjumlahan, pengurangan, dan perkalian dasar', 30, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'published', 1, 1);

-- 10. HUBUNGKAN SOAL DENGAN QUIZ MATEMATIKA
INSERT INTO quiz_questions (id_kuis, id_soal, bobot, urutan) VALUES
(1, 1, 10.00, 1),
(1, 2, 10.00, 2),
(1, 3, 10.00, 3);

-- 11. INSERT QUIZ UMUM (di kelas BIND11B)
INSERT INTO quizzes (id_kuis, id_kelas, judul, deskripsi, durasi_menit, waktu_mulai, waktu_selesai, status, bisa_coba_ulang, tampilkan_jawaban) VALUES
(2, 2, 'Quiz Pengetahuan Umum Indonesia', 'Quiz pengetahuan umum seputar negara Indonesia', 20, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'published', 1, 1);

-- 12. HUBUNGKAN SOAL DENGAN QUIZ UMUM
INSERT INTO quiz_questions (id_kuis, id_soal, bobot, urutan) VALUES
(2, 4, 10.00, 1),
(2, 5, 10.00, 2),
(2, 6, 10.00, 3);

SELECT '✅ DATA BERHASIL DI-IMPORT TANPA DUPLIKASI!' as Status;
