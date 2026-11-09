import { query, queryOne } from '../database/connection.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

// Get current user profile
export async function getCurrentUser(req, res) {
  try {
    const userId = req.user.id_user;

    const user = await queryOne(
      'SELECT id_user, nama, email, role, status_aktif, foto_profil, created_at FROM users WHERE id_user = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Data user berhasil diambil',
      data: user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data user',
      data: null
    });
  }
}

// Update user profile
export async function updateProfile(req, res) {
  try {
    const userId = req.user.id_user;
    const { nama, email } = req.body;

    // Check if new email already exists (if email is being changed)
    if (email) {
      const existingUser = await queryOne(
        'SELECT id_user FROM users WHERE email = ? AND id_user != ?',
        [email, userId]
      );

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email sudah digunakan oleh pengguna lain',
          data: null
        });
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (nama) {
      updates.push('nama = ?');
      values.push(nama);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada data yang diupdate',
        data: null
      });
    }

    values.push(userId);

    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id_user = ?`,
      values
    );

    // Get updated user
    const updatedUser = await queryOne(
      'SELECT id_user, nama, email, role, status_aktif, foto_profil, created_at FROM users WHERE id_user = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Profil berhasil diupdate',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate profil',
      data: null
    });
  }
}

// Change password
export async function changePassword(req, res) {
  try {
    const userId = req.user.id_user;
    const { oldPassword, newPassword } = req.body;

    // Get user password hash
    const user = await queryOne(
      'SELECT password_hash FROM users WHERE id_user = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    // Verify old password
    const isPasswordValid = await verifyPassword(oldPassword, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Password lama tidak sesuai',
        data: null
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await query(
      'UPDATE users SET password_hash = ? WHERE id_user = ?',
      [hashedPassword, userId]
    );

    res.json({
      success: true,
      message: 'Password berhasil diubah',
      data: null
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengubah password',
      data: null
    });
  }
}

// Get user statistics
export async function getUserStats(req, res) {
  try {
    const userId = req.user.id_user;

    // Get user info
    const user = await queryOne(
      'SELECT created_at FROM users WHERE id_user = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    // Get quiz statistics
    const stats = await queryOne(
      `SELECT 
        COUNT(DISTINCT qa.id_percobaan) as total_quizzes,
        ROUND(AVG(qa_answers.poin), 2) as average_score,
        MAX(qa.skor) as best_score,
        SUM(CASE WHEN qa_answers.is_benar = true THEN 1 ELSE 0 END) as total_correct
      FROM quiz_attempts qa
      LEFT JOIN quiz_answers qa_answers ON qa.id_percobaan = qa_answers.id_percobaan
      WHERE qa.id_user = ? AND qa.status = 'graded'`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Statistik user berhasil diambil',
      data: {
        member_since: user.created_at,
        total_quizzes: stats.total_quizzes || 0,
        average_score: stats.average_score || 0,
        best_score: stats.best_score || 0,
        total_correct: stats.total_correct || 0
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil statistik',
      data: null
    });
  }
}

// Get all users (admin only)
export async function getAllUsers(req, res) {
  try {
    const { page = 1, limit = 10, role, status } = req.query;

    let whereConditions = [];
    let params = [];

    if (role) {
      whereConditions.push('role = ?');
      params.push(role);
    }

    if (status !== undefined) {
      whereConditions.push('status_aktif = ?');
      params.push(status === 'true');
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get total count
    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit) || 10);
    const offset = (pageNum - 1) * limitNum;

    // Get users
    const users = await query(
      `SELECT id_user, nama, email, role, status_aktif, created_at FROM users ${whereClause} LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    res.json({
      success: true,
      message: 'Daftar user berhasil diambil',
      data: {
        users,
        pagination: {
          current_page: pageNum,
          per_page: limitNum,
          total: countResult.total,
          total_pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil daftar user',
      data: null
    });
  }
}

// Update user status (admin only)
export async function updateUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { status_aktif } = req.body;

    // Check if user exists
    const user = await queryOne(
      'SELECT id_user FROM users WHERE id_user = ?',
      [id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    // Update user status
    await query(
      'UPDATE users SET status_aktif = ? WHERE id_user = ?',
      [status_aktif, id]
    );

    res.json({
      success: true,
      message: 'Status user berhasil diupdate',
      data: null
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate status user',
      data: null
    });
  }
}
