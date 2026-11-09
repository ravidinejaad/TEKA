-- ============================================
-- SEED DATA FOR TESTING - TEKA QUIZ SYSTEM
-- ============================================
USE teka_db;

-- Pastikan sudah ada users (admin, teacher, student)
-- Password untuk semua: password123
-- Hash: $2a$10$NO9zZZ0HB0XYtwtXqo8rBO9Q.DTuVF0WkNfhh8Il5AmVkXFBHihP2

-- Insert more students untuk testing
INSERT INTO users (nama, email, password_hash, role, status_aktif) VALUES
('Student Test 1', 'student1@test.com', '$2a$10$NO9zZZ0HB0XYtwtXqo8rBO9Q.DTuVF0WkNfhh8Il5AmVkXFBHihP2', 'student', TRUE),
('Student Test 2', 'student2@test.com', '$2a$10$NO9zZZ0HB0XYtwtXqo8rBO9Q.DTuVF0WkNfhh8Il5AmVkXFBHihP2', 'student', TRUE),
('Teacher Test 1', 'teacher1@test.com', '$2a$10$NO9zZZ0HB0XYtwtXqo8rBO9Q.DTuVF0WkNfhh8Il5AmVkXFBHihP2', 'teacher', TRUE);

-- Insert Categories (jika belum ada)
INSERT INTO categories (nama_kategori, deskripsi) VALUES
('Matematika', 'Kategori kuis matematika'),
('Bahasa Indonesia', 'Kategori kuis bahasa Indonesia'),
('IPA', 'Kategori kuis ilmu pengetahuan alam'),
('IPS', 'Kategori kuis ilmu pengetahuan sosial'),
('Bahasa Inggris', 'Kategori kuis bahasa Inggris')
ON DUPLICATE KEY UPDATE nama_kategori=nama_kategori;

-- Insert Classes (menggunakan teacher id = 2, sesuaikan dengan id teacher di database Anda)
INSERT INTO classes (id_pengajar, nama_kelas, kode_kelas, deskripsi, id_kategori) VALUES
(2, 'Kelas 10A - Matematika', 'MTK10A', 'Kelas matematika untuk siswa kelas 10A', 1),
(2, 'Kelas 11B - Bahasa Indonesia', 'BIND11B', 'Kelas bahasa Indonesia untuk siswa kelas 11B', 2),
(2, 'Kelas 12 - IPA Terpadu', 'IPA12', 'Kelas IPA terpadu untuk persiapan ujian', 3);

-- Ambil id_kelas yang baru dibuat (sesuaikan dengan id yang actual)
SET @kelas1 = (SELECT id_kelas FROM classes WHERE kode_kelas = 'MTK10A' LIMIT 1);
SET @kelas2 = (SELECT id_kelas FROM classes WHERE kode_kelas = 'BIND11B' LIMIT 1);
SET @kelas3 = (SELECT id_kelas FROM classes WHERE kode_kelas = 'IPA12' LIMIT 1);

-- Insert Class Members (student dengan id 3 dan 4 join ke kelas)
INSERT INTO class_members (id_kelas, id_user) VALUES
(@kelas1, 3), -- User asli join kelas MTK10A
(@kelas1, 4), -- Student Test 1 join kelas MTK10A
(@kelas2, 3), -- User asli join kelas BIND11B
(@kelas2, 5), -- Student Test 2 join kelas BIND11B
(@kelas3, 3), -- User asli join kelas IPA12
(@kelas3, 4), -- Student Test 1 join kelas IPA12
(@kelas3, 5); -- Student Test 2 join kelas IPA12

-- Insert Questions (soal dari teacher)
INSERT INTO questions (id_pengajar, pertanyaan, jenis_soal, kunci_jawaban, pembahasan) VALUES
-- Soal Matematika
(2, 'Berapakah hasil dari 15 + 27?', 'pilihan_ganda', '42', 'Penjumlahan sederhana: 15 + 27 = 42'),
(2, 'Berapakah nilai dari 12 x 8?', 'pilihan_ganda', '96', 'Perkalian: 12 x 8 = 96'),
(2, 'Apakah 25 adalah bilangan prima?', 'benar_salah', 'Salah', '25 bukan bilangan prima karena dapat dibagi 5'),
(2, 'Berapakah akar dari 144?', 'pilihan_ganda', '12', 'Akar kuadrat dari 144 adalah 12'),
(2, 'Berapa hasil dari 100 - 37?', 'pilihan_ganda', '63', 'Pengurangan: 100 - 37 = 63'),

-- Soal Bahasa Indonesia
(2, 'Apa kepanjangan dari PUEBI?', 'isian_singkat', 'Pedoman Umum Ejaan Bahasa Indonesia', 'PUEBI adalah pedoman penulisan bahasa Indonesia'),
(2, 'Apakah kata "makan" termasuk kata kerja?', 'benar_salah', 'Benar', 'Makan adalah kata kerja yang menunjukkan aktivitas'),
(2, 'Siapakah penulis novel "Laskar Pelangi"?', 'pilihan_ganda', 'Andrea Hirata', 'Andrea Hirata adalah penulis Laskar Pelangi'),

-- Soal IPA
(2, 'Apakah air terdiri dari H2O?', 'benar_salah', 'Benar', 'Rumus kimia air adalah H2O (2 hidrogen, 1 oksigen)'),
(2, 'Berapa jumlah planet dalam tata surya?', 'pilihan_ganda', '8', 'Ada 8 planet di tata surya (Pluto sudah bukan planet)');

-- Insert Question Options (untuk pilihan ganda)
INSERT INTO question_options (id_soal, label_opsi, teks_opsi, urutan) VALUES
-- Soal 1: 15 + 27
(1, 'A', '40', 1),
(1, 'B', '42', 2),
(1, 'C', '44', 3),
(1, 'D', '45', 4),

-- Soal 2: 12 x 8
(2, 'A', '84', 1),
(2, 'B', '92', 2),
(2, 'C', '96', 3),
(2, 'D', '100', 4),

-- Soal 3: Prima (benar_salah)
(3, 'A', 'Benar', 1),
(3, 'B', 'Salah', 2),

-- Soal 4: Akar 144
(4, 'A', '10', 1),
(4, 'B', '11', 2),
(4, 'C', '12', 3),
(4, 'D', '13', 4),

-- Soal 5: 100 - 37
(5, 'A', '61', 1),
(5, 'B', '62', 2),
(5, 'C', '63', 3),
(5, 'D', '64', 4),

-- Soal 7: Kata kerja (benar_salah)
(7, 'A', 'Benar', 1),
(7, 'B', 'Salah', 2),

-- Soal 8: Penulis Laskar Pelangi
(8, 'A', 'Andrea Hirata', 1),
(8, 'B', 'Pramoedya Ananta Toer', 2),
(8, 'C', 'Dee Lestari', 3),
(8, 'D', 'Tere Liye', 4),

-- Soal 9: H2O (benar_salah)
(9, 'A', 'Benar', 1),
(9, 'B', 'Salah', 2),

-- Soal 10: Jumlah planet
(10, 'A', '7', 1),
(10, 'B', '8', 2),
(10, 'C', '9', 3),
(10, 'D', '10', 4);

-- Insert Quizzes (untuk setiap kelas)
INSERT INTO quizzes (id_kelas, judul, deskripsi, durasi_menit, waktu_mulai, waktu_selesai, status, bisa_coba_ulang, tampilkan_jawaban) VALUES
(@kelas1, 'Quiz Matematika - Operasi Dasar', 'Quiz tentang penjumlahan, pengurangan, perkalian dan pembagian', 30, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'published', TRUE, TRUE),
(@kelas1, 'Quiz Matematika - Bilangan', 'Quiz tentang bilangan prima dan akar kuadrat', 20, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), 'published', TRUE, FALSE),
(@kelas2, 'Quiz Bahasa Indonesia - PUEBI', 'Quiz tentang ejaan dan tata bahasa Indonesia', 25, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'published', TRUE, TRUE),
(@kelas3, 'Quiz IPA - Sains Dasar', 'Quiz tentang kimia dan astronomi', 30, NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY), 'published', FALSE, TRUE);

-- Ambil id quiz
SET @quiz1 = (SELECT id_kuis FROM quizzes WHERE judul = 'Quiz Matematika - Operasi Dasar' LIMIT 1);
SET @quiz2 = (SELECT id_kuis FROM quizzes WHERE judul = 'Quiz Matematika - Bilangan' LIMIT 1);
SET @quiz3 = (SELECT id_kuis FROM quizzes WHERE judul = 'Quiz Bahasa Indonesia - PUEBI' LIMIT 1);
SET @quiz4 = (SELECT id_kuis FROM quizzes WHERE judul = 'Quiz IPA - Sains Dasar' LIMIT 1);

-- Insert Quiz Questions (hubungkan soal dengan quiz)
INSERT INTO quiz_questions (id_kuis, id_soal, bobot, urutan) VALUES
-- Quiz 1: Matematika Operasi Dasar (soal 1, 2, 5)
(@quiz1, 1, 10.00, 1),
(@quiz1, 2, 10.00, 2),
(@quiz1, 5, 10.00, 3),

-- Quiz 2: Matematika Bilangan (soal 3, 4)
(@quiz2, 3, 15.00, 1),
(@quiz2, 4, 15.00, 2),

-- Quiz 3: Bahasa Indonesia (soal 6, 7, 8)
(@quiz3, 6, 10.00, 1),
(@quiz3, 7, 10.00, 2),
(@quiz3, 8, 10.00, 3),

-- Quiz 4: IPA (soal 9, 10)
(@quiz4, 9, 15.00, 1),
(@quiz4, 10, 15.00, 2);

-- Insert beberapa quiz attempts untuk testing (optional)
INSERT INTO quiz_attempts (id_kuis, id_user, waktu_mulai, waktu_batas, waktu_kirim, skor, status) VALUES
(@quiz1, 4, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 30 MINUTE, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 25 MINUTE, 80.00, 'graded'),
(@quiz3, 5, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 25 MINUTE, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 20 MINUTE, 90.00, 'graded');

-- Summary
SELECT 'DATA SEED COMPLETED!' as Message;
SELECT COUNT(*) as 'Total Users' FROM users;
SELECT COUNT(*) as 'Total Classes' FROM classes;
SELECT COUNT(*) as 'Total Questions' FROM questions;
SELECT COUNT(*) as 'Total Quizzes' FROM quizzes;
SELECT COUNT(*) as 'Total Class Members' FROM class_members;

-- Tampilkan info login
SELECT '=== LOGIN INFO ===' as Info;
SELECT 'Email: admin@teka.test | Password: password123' as 'Admin Login';
SELECT 'Email: teacher@teka.test | Password: password123' as 'Teacher Login';
SELECT 'Email: user@teka.test | Password: password123' as 'Student Login';
