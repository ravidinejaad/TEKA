import jwt from 'jsonwebtoken';
import { query, queryOne } from '../database/connection.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { generateToken, generateRefreshToken } from '../middleware/auth.js';

// Register
export async function register(req, res) {
  try {
    const { nama, email, password } = req.body;

    // Check if email already exists
    const existingUser = await queryOne(
      'SELECT id_user FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar',
        data: null
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user
    const result = await query(
      'INSERT INTO users (nama, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [nama, email, hashedPassword, 'student']
    );

    const userId = result.insertId;

    // Generate tokens
    const token = generateToken(userId, email, 'student');
    const refreshToken = generateRefreshToken(userId, email, 'student');

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        id_user: userId,
        nama,
        email,
        role: 'student',
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat registrasi',
      data: null
    });
  }
}

// Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await queryOne(
      'SELECT id_user, nama, email, password_hash, role, status_aktif FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
        data: null
      });
    }

    // Check if user is active
    if (!user.status_aktif) {
      return res.status(401).json({
        success: false,
        message: 'Akun Anda telah dinonaktifkan',
        data: null
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
        data: null
      });
    }

    // Generate tokens
    const token = generateToken(user.id_user, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id_user, user.email, user.role);

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        id_user: user.id_user,
        nama: user.nama,
        email: user.email,
        role: user.role,
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login',
      data: null
    });
  }
}

// Logout (client-side token removal, no server action needed)
export async function logout(req, res) {
  res.json({
    success: true,
    message: 'Logout berhasil',
    data: null
  });
}

// Refresh Token
export async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token diperlukan',
        data: null
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate new token
    const newToken = generateToken(decoded.id_user, decoded.email, decoded.role);

    res.json({
      success: true,
      message: 'Token berhasil diperbarui',
      data: {
        token: newToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Refresh token tidak valid',
      data: null
    });
  }
}
