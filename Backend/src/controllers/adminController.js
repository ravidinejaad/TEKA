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
