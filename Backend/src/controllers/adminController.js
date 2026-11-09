import { query, queryOne } from '../database/connection.js';

// Get system analytics (admin only)
export async function getSystemAnalytics(req, res) {
  try {
    // User statistics
    const userStats = await queryOne(
      `SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
        SUM(CASE WHEN role = 'teacher' THEN 1 ELSE 0 END) as teacher_count,
        SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as student_count,
        SUM(CASE WHEN status_aktif = true THEN 1 ELSE 0 END) as active_users
       FROM users`
    );

    // Class statistics
    const classStats = await queryOne(
      `SELECT 
        COUNT(*) as total_classes,
        COUNT(DISTINCT id_pengajar) as total_teachers,
        (SELECT COUNT(*) FROM class_members) as total_memberships
       FROM classes`
    );

    // Quiz statistics
    const quizStats = await queryOne(
      `SELECT 
        COUNT(*) as total_quizzes,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_count,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_count,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_count
       FROM quizzes`
    );

    // Attempt statistics
    const attemptStats = await queryOne(
      `SELECT 
        COUNT(*) as total_attempts,
        COUNT(DISTINCT id_user) as total_participants,
        AVG(skor) as average_score,
        MAX(skor) as highest_score,
        MIN(skor) as lowest_score
       FROM quiz_attempts
       WHERE status = 'graded'`
    );

    // Question statistics
    const questionStats = await queryOne(
      `SELECT 
        COUNT(*) as total_questions,
        SUM(CASE WHEN jenis_soal = 'pilihan_ganda' THEN 1 ELSE 0 END) as pilihan_ganda_count,
        SUM(CASE WHEN jenis_soal = 'benar_salah' THEN 1 ELSE 0 END) as benar_salah_count,
        SUM(CASE WHEN jenis_soal = 'isian_singkat' THEN 1 ELSE 0 END) as isian_singkat_count
       FROM questions`
    );

    res.json({
      success: true,
      message: 'Analytics sistem berhasil diambil',
      data: {
        users: {
          total: userStats.total_users || 0,
          admins: userStats.admin_count || 0,
          teachers: userStats.teacher_count || 0,
          students: userStats.student_count || 0,
          active: userStats.active_users || 0
        },
        classes: {
          total: classStats.total_classes || 0,
          total_teachers: classStats.total_teachers || 0,
          total_memberships: classStats.total_memberships || 0
        },
        quizzes: {
          total: quizStats.total_quizzes || 0,
          draft: quizStats.draft_count || 0,
          published: quizStats.published_count || 0,
          closed: quizStats.closed_count || 0
        },
        attempts: {
          total: attemptStats.total_attempts || 0,
          total_participants: attemptStats.total_participants || 0,
          average_score: Math.round(attemptStats.average_score || 0),
          highest_score: attemptStats.highest_score || 0,
          lowest_score: attemptStats.lowest_score || 0
        },
        questions: {
          total: questionStats.total_questions || 0,
          pilihan_ganda: questionStats.pilihan_ganda_count || 0,
          benar_salah: questionStats.benar_salah_count || 0,
          isian_singkat: questionStats.isian_singkat_count || 0
        }
      }
    });
  } catch (error) {
    console.error('Get system analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil analytics sistem',
      data: null
    });
  }
}

// Get dashboard summary
export async function getDashboardSummary(req, res) {
  try {
    // Today's activity
    const today = new Date().toISOString().split('T')[0];
    
    const todayActivity = await queryOne(
      `SELECT 
        SUM(CASE WHEN DATE(created_at) = ? AND role = 'student' THEN 1 ELSE 0 END) as new_students,
        SUM(CASE WHEN DATE(created_at) = ? THEN 1 ELSE 0 END) as new_users
       FROM users
       WHERE created_at >= ? AND created_at < ? + INTERVAL 1 DAY`,
      [today, today, `${today} 00:00:00`, today]
    );

    const todayAttempts = await queryOne(
      `SELECT 
        COUNT(*) as attempts_today,
        AVG(skor) as avg_score_today
       FROM quiz_attempts
       WHERE DATE(waktu_kirim) = ? AND status = 'graded'`,
      [today]
    );

    // Recent activities
    const recentUsers = await query(
      `SELECT id_user, nama, email, role, created_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT 5`
    );

    const recentQuizzes = await query(
      `SELECT id_kuis, judul, status, created_at, id_kelas
       FROM quizzes 
       ORDER BY created_at DESC 
       LIMIT 5`
    );

    res.json({
      success: true,
      message: 'Dashboard summary berhasil diambil',
      data: {
        today_activity: {
          new_students: todayActivity.new_students || 0,
          new_users: todayActivity.new_users || 0,
          quiz_attempts: todayAttempts.attempts_today || 0,
          average_score_today: Math.round(todayAttempts.avg_score_today || 0)
        },
        recent_users: recentUsers,
        recent_quizzes: recentQuizzes
      }
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil dashboard summary',
      data: null
    });
  }
}

// Get teacher rankings
export async function getTeacherRankings(req, res) {
  try {
    const { limit = 10 } = req.query;
    const limitNum = Math.min(100, parseInt(limit) || 10);

    const rankings = await query(
      `SELECT 
        u.id_user,
        u.nama,
        u.email,
        COUNT(DISTINCT c.id_kelas) as total_classes,
        COUNT(DISTINCT q.id_kuis) as total_quizzes,
        COUNT(DISTINCT qn.id_soal) as total_questions,
        COUNT(DISTINCT qa.id_percobaan) as student_attempts,
        ROUND(AVG(qa.skor), 2) as average_student_score
       FROM users u
       LEFT JOIN classes c ON u.id_user = c.id_pengajar
       LEFT JOIN quizzes q ON c.id_kelas = q.id_kelas
       LEFT JOIN questions qn ON u.id_user = qn.id_pengajar
       LEFT JOIN quiz_answers qa ON q.id_kuis IN (
         SELECT id_kuis FROM quiz_attempts WHERE status = 'graded'
       )
       WHERE u.role = 'teacher'
       GROUP BY u.id_user, u.nama, u.email
       ORDER BY total_classes DESC, total_quizzes DESC
       LIMIT ?`,
      [limitNum]
    );

    res.json({
      success: true,
      message: 'Ranking pengajar berhasil diambil',
      data: {
        rankings
      }
    });
  } catch (error) {
    console.error('Get teacher rankings error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil ranking pengajar',
      data: null
    });
  }
}

// Get student activity
export async function getStudentActivity(req, res) {
  try {
    const { days = 30, limit = 10 } = req.query;
    const daysNum = Math.min(365, parseInt(days) || 30);
    const limitNum = Math.min(100, parseInt(limit) || 10);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    const activity = await query(
      `SELECT 
        u.id_user,
        u.nama,
        u.email,
        COUNT(DISTINCT qa.id_percobaan) as quiz_attempts,
        COUNT(DISTINCT CASE WHEN qa.status = 'graded' THEN qa.id_percobaan END) as completed_quizzes,
        ROUND(AVG(qa.skor), 2) as average_score,
        MAX(qa.skor) as highest_score,
        u.created_at,
        MAX(qa.waktu_kirim) as last_activity
       FROM users u
       LEFT JOIN quiz_attempts qa ON u.id_user = qa.id_user AND qa.waktu_mulai >= ?
       WHERE u.role = 'student'
       GROUP BY u.id_user
       ORDER BY last_activity DESC
       LIMIT ?`,
      [startDate.toISOString(), limitNum]
    );

    res.json({
      success: true,
      message: 'Aktivitas siswa berhasil diambil',
      data: {
        period_days: daysNum,
        activity
      }
    });
  } catch (error) {
    console.error('Get student activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil aktivitas siswa',
      data: null
    });
  }
}

// Get system health
export async function getSystemHealth(req, res) {
  try {
    const health = {
      status: 'healthy',
      checks: {},
      timestamp: new Date().toISOString()
    };

    // Database connectivity
    try {
      const dbCheck = await queryOne('SELECT 1');
      health.checks.database = {
        status: dbCheck ? 'ok' : 'error',
        message: 'Database connection successful'
      };
    } catch (error) {
      health.status = 'unhealthy';
      health.checks.database = {
        status: 'error',
        message: 'Database connection failed'
      };
    }

    // Data integrity
    const integrityCheck = await queryOne(
      `SELECT 
        COUNT(DISTINCT u.id_user) as total_users,
        COUNT(DISTINCT c.id_kelas) as total_classes,
        COUNT(DISTINCT q.id_kuis) as total_quizzes
       FROM users u
       CROSS JOIN classes c
       CROSS JOIN quizzes q`
    );

    health.checks.data_integrity = {
      status: integrityCheck ? 'ok' : 'error',
      message: 'Data integrity check passed'
    };

    res.json({
      success: true,
      message: 'System health berhasil diambil',
      data: health
    });
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengecek kesehatan sistem',
      data: null
    });
  }
}

// Get admin stats for dashboard
export async function getAdminStats(req, res) {
  try {
    // Total users
    const userCount = await queryOne('SELECT COUNT(*) as total FROM users');
    
    // Total quizzes
    const quizCount = await queryOne('SELECT COUNT(*) as total FROM quizzes');
    
    // Total categories
    const categoryCount = await queryOne('SELECT COUNT(*) as total FROM categories');
    
    // Today's activity
    const today = new Date().toISOString().split('T')[0];
    const todayActivity = await queryOne(
      `SELECT COUNT(*) as total FROM quiz_attempts WHERE DATE(waktu_mulai) = ?`,
      [today]
    );

    res.json({
      success: true,
      message: 'Admin stats berhasil diambil',
      data: {
        totalUsers: userCount.total || 0,
        totalQuizzes: quizCount.total || 0,
        totalCategories: categoryCount.total || 0,
        todayActivity: todayActivity.total || 0,
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil stats admin',
      data: null
    });
  }
}

// Get recent activity
export async function getRecentActivity(req, res) {
  try {
    const { limit = 5 } = req.query;
    const limitNum = Math.min(50, parseInt(limit) || 5);

    // Get recent quiz attempts
    const recentAttempts = await query(
      `SELECT 
        qa.id_percobaan,
        qa.waktu_mulai as created_at,
        u.nama as user,
        'Menyelesaikan kuis' as action,
        'complete' as type
       FROM quiz_attempts qa
       JOIN users u ON qa.id_user = u.id_user
       WHERE qa.status = 'graded'
       ORDER BY qa.waktu_kirim DESC
       LIMIT ?`,
      [limitNum]
    );

    // Get recent user registrations
    const recentUsers = await query(
      `SELECT 
        id_user,
        created_at,
        nama as user,
        'Mendaftar sebagai user baru' as action,
        'register' as type
       FROM users
       ORDER BY created_at DESC
       LIMIT ?`,
      [limitNum]
    );

    // Combine and sort
    const activities = [...recentAttempts, ...recentUsers]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limitNum);

    res.json({
      success: true,
      message: 'Recent activity berhasil diambil',
      data: activities
    });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil recent activity',
      data: null
    });
  }
}

// Get all users (admin only - for user management)
export async function getAllUsers(req, res) {
  try {
    const { 
      role, 
      status_aktif, 
      search,
      sort = 'created_at',
      order = 'DESC',
      limit = 10,
      offset = 0 
    } = req.query;

    let whereClauses = [];
    let params = [];

    if (role) {
      whereClauses.push('role = ?');
      params.push(role);
    }

    if (status_aktif !== undefined) {
      whereClauses.push('status_aktif = ?');
      params.push(status_aktif === 'true' || status_aktif === '1');
    }

    if (search) {
      whereClauses.push('(nama LIKE ? OR email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const validSorts = ['nama', 'email', 'role', 'created_at', 'status_aktif'];
    const sortField = validSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const limitNum = Math.min(100, parseInt(limit) || 10);
    const offsetNum = Math.max(0, parseInt(offset) || 0);

    const users = await query(
      `SELECT id_user, nama, email, role, status_aktif, created_at, updated_at
       FROM users
       ${whereSQL}
       ORDER BY ${sortField} ${sortOrder}
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offsetNum]
    );

    const totalResult = await queryOne(
      `SELECT COUNT(*) as total FROM users ${whereSQL}`,
      params
    );

    res.json({
      success: true,
      message: 'Users berhasil diambil',
      data: users,
      meta: {
        total: totalResult.total,
        limit: limitNum,
        offset: offsetNum
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data users',
      data: null
    });
  }
}

// Update user (admin only)
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { nama, email, role, status_aktif } = req.body;

    const updates = [];
    const params = [];

    if (nama) {
      updates.push('nama = ?');
      params.push(nama);
    }

    if (email) {
      updates.push('email = ?');
      params.push(email);
    }

    if (role) {
      updates.push('role = ?');
      params.push(role);
    }

    if (status_aktif !== undefined) {
      updates.push('status_aktif = ?');
      params.push(status_aktif);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada data yang diupdate',
        data: null
      });
    }

    updates.push('updated_at = NOW()');
    params.push(id);

    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id_user = ?`,
      params
    );

    const updatedUser = await queryOne(
      'SELECT id_user, nama, email, role, status_aktif, created_at, updated_at FROM users WHERE id_user = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'User berhasil diupdate',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate user',
      data: null
    });
  }
}

// Delete user (admin only)
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await queryOne('SELECT id_user FROM users WHERE id_user = ?', [id]);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    // Don't allow deleting yourself
    if (parseInt(id) === req.user.id_user) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus akun sendiri',
        data: null
      });
    }

    await query('DELETE FROM users WHERE id_user = ?', [id]);

    res.json({
      success: true,
      message: 'User berhasil dihapus',
      data: null
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus user',
      data: null
    });
  }
}

// Create new user (admin only)
export async function createUser(req, res) {
  try {
    const { nama, email, password, role = 'student', status_aktif = true } = req.body;

    console.log('Create user request:', { nama, email, role, status_aktif, passwordLength: password?.length });

    // Validation
    if (!nama || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan password harus diisi',
        data: null
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 8 karakter',
        data: null
      });
    }

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

    // Hash password using hashPassword from password utility
    const { hashPassword } = await import('../utils/password.js');
    const password_hash = await hashPassword(password);

    console.log('Password hashed successfully');

    // Insert user
    const result = await query(
      'INSERT INTO users (nama, email, password_hash, role, status_aktif) VALUES (?, ?, ?, ?, ?)',
      [nama, email, password_hash, role, status_aktif === true || status_aktif === 1 || status_aktif === '1' ? 1 : 0]
    );

    console.log('User inserted, ID:', result.insertId);

    // Get created user
    const newUser = await queryOne(
      'SELECT id_user, nama, email, role, status_aktif, created_at FROM users WHERE id_user = ?',
      [result.insertId]
    );

    console.log('User created successfully:', newUser.id_user);

    res.status(201).json({
      success: true,
      message: 'User berhasil dibuat',
      data: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat user: ' + error.message,
      data: null
    });
  }
}


// Test create user (untuk debugging)
export async function testCreateUser(req, res) {
  try {
    // Test insert sederhana
    const testData = {
      nama: 'Test User Debug',
      email: 'testdebug' + Date.now() + '@example.com',
      password_hash: '$2a$10$NO9zZZ0HB0XYtwtXqo8rBO9Q.DTuVF0WkNfhh8Il5AmVkXFBHihP2',
      role: 'student',
      status_aktif: 1
    };

    console.log('Testing insert with:', testData);

    const result = await query(
      'INSERT INTO users (nama, email, password_hash, role, status_aktif) VALUES (?, ?, ?, ?, ?)',
      [testData.nama, testData.email, testData.password_hash, testData.role, testData.status_aktif]
    );

    console.log('Insert result:', result);

    res.json({
      success: true,
      message: 'Test insert berhasil',
      data: { insertId: result.insertId }
    });
  } catch (error) {
    console.error('Test insert error:', error);
    res.status(500).json({
      success: false,
      message: 'Test insert gagal: ' + error.message,
      error: error.stack
    });
  }
}


// Get all quizzes (admin only)
export async function getAllQuizzes(req, res) {
  try {
    const { limit = 100 } = req.query;
    const limitNum = Math.min(500, parseInt(limit) || 100);

    const quizzes = await query(
      `SELECT q.*, c.nama_kelas 
       FROM quizzes q
       LEFT JOIN classes c ON q.id_kelas = c.id_kelas
       ORDER BY q.created_at DESC
       LIMIT ?`,
      [limitNum]
    );

    res.json({
      success: true,
      message: 'Daftar kuis berhasil diambil',
      data: quizzes
    });
  } catch (error) {
    console.error('Get all quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil daftar kuis',
      data: null
    });
  }
}

// Delete quiz (admin only)
export async function deleteQuiz(req, res) {
  try {
    const { id } = req.params;

    // Check if quiz exists
    const quiz = await queryOne('SELECT id_kuis FROM quizzes WHERE id_kuis = ?', [id]);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Kuis tidak ditemukan',
        data: null
      });
    }

    // Delete quiz (cascade will delete related data)
    await query('DELETE FROM quizzes WHERE id_kuis = ?', [id]);

    res.json({
      success: true,
      message: 'Kuis berhasil dihapus',
      data: null
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus kuis',
      data: null
    });
  }
}
