import { validationResult, body, param, query } from 'express-validator';

// Handle validation errors
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      data: null,
      errors: errors.array()
    });
  }
  next();
}

// Auth validation rules
export const registerValidation = [
  body('nama')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nama minimal 3 karakter'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Format email tidak valid'),
  body('password')
    .isLength({ min: parseInt(process.env.PASSWORD_MIN_LENGTH || 8) })
    .withMessage(`Password minimal ${process.env.PASSWORD_MIN_LENGTH || 8} karakter`),
  handleValidationErrors
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Format email tidak valid'),
  body('password')
    .notEmpty()
    .withMessage('Password tidak boleh kosong'),
  handleValidationErrors
];

// User validation rules
export const updateProfileValidation = [
  body('nama')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nama minimal 3 karakter'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Format email tidak valid'),
  handleValidationErrors
];

export const changePasswordValidation = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Password lama tidak boleh kosong'),
  body('newPassword')
    .isLength({ min: parseInt(process.env.PASSWORD_MIN_LENGTH || 8) })
    .withMessage(`Password baru minimal ${process.env.PASSWORD_MIN_LENGTH || 8} karakter`),
  handleValidationErrors
];

// Category validation
export const categoryValidation = [
  body('nama_kategori')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nama kategori minimal 3 karakter'),
  body('deskripsi')
    .optional()
    .trim(),
  handleValidationErrors
];

// Class validation
export const classValidation = [
  body('nama_kelas')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nama kelas minimal 3 karakter'),
  body('deskripsi')
    .optional()
    .trim(),
  body('id_kategori')
    .optional()
    .isInt()
    .withMessage('ID kategori harus berupa angka'),
  handleValidationErrors
];

export const joinClassValidation = [
  body('kode_kelas')
    .trim()
    .notEmpty()
    .withMessage('Kode kelas tidak boleh kosong'),
  handleValidationErrors
];

// Question validation
export const questionValidation = [
  body('pertanyaan')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Pertanyaan minimal 10 karakter'),
  body('jenis_soal')
    .isIn(['pilihan_ganda', 'benar_salah', 'isian_singkat'])
    .withMessage('Jenis soal tidak valid'),
  body('kunci_jawaban')
    .trim()
    .notEmpty()
    .withMessage('Kunci jawaban tidak boleh kosong'),
  body('pembahasan')
    .optional()
    .trim(),
  body('options')
    .optional()
    .isArray({ min: 2 })
    .withMessage('Minimal 2 opsi jawaban untuk pilihan ganda'),
  handleValidationErrors
];

// Quiz validation
export const quizValidation = [
  body('judul')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Judul minimal 5 karakter'),
  body('deskripsi')
    .optional()
    .trim(),
  body('durasi_menit')
    .isInt({ min: 1 })
    .withMessage('Durasi harus angka positif'),
  body('waktu_mulai')
    .isISO8601()
    .withMessage('Format waktu mulai tidak valid'),
  body('waktu_selesai')
    .isISO8601()
    .withMessage('Format waktu selesai tidak valid'),
  body('questions')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Minimal 1 pertanyaan dalam kuis'),
  handleValidationErrors
];

// Pagination validation
export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Halaman harus angka positif'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit harus antara 1-100'),
  handleValidationErrors
];

// ID validation
export const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID harus berupa angka positif'),
  handleValidationErrors
];
