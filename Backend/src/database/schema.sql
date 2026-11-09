-- Database Setup for Quiz Learning System

-- Drop existing database (optional - uncomment if needed)
-- DROP DATABASE IF EXISTS quizspace_db;

-- Create database
CREATE DATABASE IF NOT EXISTS teka_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE teka_db;

-- ============================================
-- 1. Users Table
-- ============================================
CREATE TABLE users (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'teacher', 'student') DEFAULT 'student',
  status_aktif BOOLEAN DEFAULT TRUE,
  foto_profil VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. Categories Table
-- ============================================
CREATE TABLE categories (
  id_kategori INT AUTO_INCREMENT PRIMARY KEY,
  nama_kategori VARCHAR(255) UNIQUE NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_nama (nama_kategori)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. Classes (Kelas) Table
-- ============================================
CREATE TABLE classes (
  id_kelas INT AUTO_INCREMENT PRIMARY KEY,
  id_pengajar INT NOT NULL,
  nama_kelas VARCHAR(255) NOT NULL,
  kode_kelas VARCHAR(20) UNIQUE NOT NULL,
  deskripsi TEXT,
  id_kategori INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_pengajar) REFERENCES users(id_user) ON DELETE RESTRICT,
  FOREIGN KEY (id_kategori) REFERENCES categories(id_kategori) ON DELETE SET NULL,
  INDEX idx_pengajar (id_pengajar),
  INDEX idx_kode_kelas (kode_kelas),
  INDEX idx_kategori (id_kategori)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. Class Members Table
-- ============================================
CREATE TABLE class_members (
  id_anggota INT AUTO_INCREMENT PRIMARY KEY,
  id_kelas INT NOT NULL,
  id_user INT NOT NULL,
  tanggal_gabung TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_member (id_kelas, id_user),
  FOREIGN KEY (id_kelas) REFERENCES classes(id_kelas) ON DELETE CASCADE,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
  INDEX idx_kelas (id_kelas),
  INDEX idx_user (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. Questions (Soal) Table
-- ============================================
CREATE TABLE questions (
  id_soal INT AUTO_INCREMENT PRIMARY KEY,
  id_pengajar INT NOT NULL,
  pertanyaan TEXT NOT NULL,
  jenis_soal ENUM('pilihan_ganda', 'benar_salah', 'isian_singkat') NOT NULL,
  kunci_jawaban TEXT NOT NULL,
  pembahasan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_pengajar) REFERENCES users(id_user) ON DELETE CASCADE,
  INDEX idx_pengajar (id_pengajar),
  INDEX idx_jenis (jenis_soal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. Question Options (Opsi Jawaban) Table
-- ============================================
CREATE TABLE question_options (
  id_opsi INT AUTO_INCREMENT PRIMARY KEY,
  id_soal INT NOT NULL,
  label_opsi CHAR(1),
  teks_opsi TEXT NOT NULL,
  urutan INT,
  FOREIGN KEY (id_soal) REFERENCES questions(id_soal) ON DELETE CASCADE,
  INDEX idx_soal (id_soal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. Quizzes (Kuis) Table
-- ============================================
CREATE TABLE quizzes (
  id_kuis INT AUTO_INCREMENT PRIMARY KEY,
  id_kelas INT NOT NULL,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  durasi_menit INT NOT NULL,
  waktu_mulai DATETIME NOT NULL,
  waktu_selesai DATETIME NOT NULL,
  status ENUM('draft', 'published', 'closed') DEFAULT 'draft',
  bisa_coba_ulang BOOLEAN DEFAULT FALSE,
  tampilkan_jawaban BOOLEAN DEFAULT FALSE,
  tampilkan_pembahasan BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_kelas) REFERENCES classes(id_kelas) ON DELETE CASCADE,
  INDEX idx_kelas (id_kelas),
  INDEX idx_status (status),
  INDEX idx_waktu_mulai (waktu_mulai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. Quiz Questions (Kuis Soal) Table
-- ============================================
CREATE TABLE quiz_questions (
  id_kuis_soal INT AUTO_INCREMENT PRIMARY KEY,
  id_kuis INT NOT NULL,
  id_soal INT NOT NULL,
  bobot DECIMAL(5,2) DEFAULT 1.00,
  urutan INT,
  UNIQUE KEY unique_quiz_question (id_kuis, id_soal),
  FOREIGN KEY (id_kuis) REFERENCES quizzes(id_kuis) ON DELETE CASCADE,
  FOREIGN KEY (id_soal) REFERENCES questions(id_soal) ON DELETE CASCADE,
  INDEX idx_kuis (id_kuis)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. Quiz Attempts (Percobaan Kuis) Table
-- ============================================
CREATE TABLE quiz_attempts (
  id_percobaan INT AUTO_INCREMENT PRIMARY KEY,
  id_kuis INT NOT NULL,
  id_user INT NOT NULL,
  waktu_mulai DATETIME NOT NULL,
  waktu_batas DATETIME NOT NULL,
  waktu_kirim DATETIME,
  skor DECIMAL(5,2),
  status ENUM('ongoing', 'submitted', 'graded') DEFAULT 'ongoing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_kuis) REFERENCES quizzes(id_kuis) ON DELETE CASCADE,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
  INDEX idx_kuis (id_kuis),
  INDEX idx_user (id_user),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. Quiz Answers (Jawaban Peserta) Table
-- ============================================
CREATE TABLE quiz_answers (
  id_jawaban INT AUTO_INCREMENT PRIMARY KEY,
  id_percobaan INT NOT NULL,
  id_soal INT NOT NULL,
  jawaban TEXT NOT NULL,
  is_benar BOOLEAN,
  poin DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_percobaan) REFERENCES quiz_attempts(id_percobaan) ON DELETE CASCADE,
  FOREIGN KEY (id_soal) REFERENCES questions(id_soal) ON DELETE CASCADE,
  INDEX idx_percobaan (id_percobaan),
  INDEX idx_soal (id_soal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 11. Notifications Table
-- ============================================
CREATE TABLE notifications (
  id_notifikasi INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  judul VARCHAR(255) NOT NULL,
  pesan TEXT,
  tipe ENUM('quiz_baru', 'pengumuman', 'aktivitas') DEFAULT 'pengumuman',
  terbaca BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
  INDEX idx_user (id_user),
  INDEX idx_terbaca (terbaca)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SEED DATA FOR TESTING
-- ============================================

-- Insert Admin User
INSERT INTO users (nama, email, password_hash, role) VALUES
('Admin Teka', 'admin@teka.test', '$2a$10$NO9zZZ0HB0XYtwtXqo8rBO9Q.DTuVF0WkNfhh8Il5AmVkXFBHihP2', 'admin');

-- Insert Teacher Users
INSERT INTO users (nama, email, password_hash, role) VALUES
('Budi Santoso', 'teacher@teka.test', '$2a$10$NO9zZZ0HB0XYtwtXqo8rBO9Q.DTuVF0WkNfhh8Il5AmVkXFBHihP2', 'teacher');

-- Insert Student Users
INSERT INTO users (nama, email, password_hash, role) VALUES
('Andi Wijaya', 'user@teka.test', '$2a$10$NO9zZZ0HB0XYtwtXqo8rBO9Q.DTuVF0WkNfhh8Il5AmVkXFBHihP2', 'student'),
('Siti Nurhaliza', 'student2@teka.test', '$2a$10$NO9zZZ0HB0XYtwtXqo8rBO9Q.DTuVF0WkNfhh8Il5AmVkXFBHihP2', 'student');

-- Insert Categories
INSERT INTO categories (nama_kategori, deskripsi) VALUES
('Pengetahuan Umum', 'Kuis tentang pengetahuan umum'),
('Sains & Teknologi', 'Kuis tentang sains dan teknologi'),
('Sejarah', 'Kuis tentang sejarah'),
('Matematika', 'Kuis tentang matematika'),
('Bahasa Inggris', 'Kuis tentang bahasa Inggris');

-- Insert Sample Questions (from teacher id 2)
INSERT INTO questions (id_pengajar, pertanyaan, jenis_soal, kunci_jawaban, pembahasan) VALUES
(2, 'Apa nama ibukota Indonesia?', 'pilihan_ganda', 'Jakarta', 'Jakarta adalah ibukota negara Indonesia sejak tahun 1945.'),
(2, 'Berapa jumlah pulau di Indonesia?', 'pilihan_ganda', 'lebih dari 17.000', 'Indonesia memiliki lebih dari 17.000 pulau yang tersebar di seluruh nusantara.'),
(2, 'Apakah Jakarta adalah kota terbesar di Indonesia?', 'benar_salah', 'Benar', 'Jakarta adalah kota terbesar di Indonesia dari segi populasi dan pembangunan.');

-- Insert Question Options
INSERT INTO question_options (id_soal, label_opsi, teks_opsi, urutan) VALUES
(1, 'A', 'Jakarta', 1),
(1, 'B', 'Bandung', 2),
(1, 'C', 'Surabaya', 3),
(1, 'D', 'Medan', 4),
(2, 'A', 'Lebih dari 10.000', 1),
(2, 'B', 'Lebih dari 17.000', 2),
(2, 'C', 'Lebih dari 20.000', 3),
(2, 'D', 'Lebih dari 25.000', 4),
(3, 'A', 'Benar', 1),
(3, 'B', 'Salah', 2);
