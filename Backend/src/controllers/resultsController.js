import { query, queryOne } from '../database/connection.js';

// Get quiz results for teacher (all students)
export async function getQuizResults(req, res) {
  try {
    const { quizId } = req.params;
    const teacherId = req.user.id_user;
    const { page = 1, limit = 10 } = req.query;

    // Verify teacher owns this quiz
    const quiz = await queryOne(
      'SELECT q.id_kuis, c.id_pengajar FROM quizzes q JOIN classes c ON q.id_kelas = c.id_kelas WHERE q.id_kuis = ?',
      [quizId]
    );

    if (!quiz || quiz.id_pengajar !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke hasil kuis ini',
        data: null
      });
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit) || 10);
    const offset = (pageNum - 1) * limitNum;

    // Get count
    const countResult = await queryOne(
      'SELECT COUNT(*) as total FROM quiz_attempts WHERE id_kuis = ? AND status = ?',
      [quizId, 'graded']
    );

    // Get results
    const results = await query(
      `SELECT qa.id_percobaan, u.id_user, u.nama, u.email, qa.waktu_mulai, qa.waktu_kirim, qa.skor,
              COUNT(qan.id_jawaban) as total_questions,
              SUM(CASE WHEN qan.is_benar = true THEN 1 ELSE 0 END) as correct_answers
       FROM quiz_attempts qa
       JOIN users u ON qa.id_user = u.id_user
       LEFT JOIN quiz_answers qan ON qa.id_percobaan = qan.id_percobaan
       WHERE qa.id_kuis = ? AND qa.status = ?
       GROUP BY qa.id_percobaan
       ORDER BY qa.skor DESC, qa.waktu_kirim ASC
       LIMIT ? OFFSET ?`,
      [quizId, 'graded', limitNum, offset]
    );

    res.json({
      success: true,
      message: 'Hasil kuis berhasil diambil',
      data: {
        results,
        pagination: {
          current_page: pageNum,
          per_page: limitNum,
          total: countResult.total,
          total_pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil hasil kuis',
      data: null
    });
  }
}

// Get quiz analytics
export async function getQuizAnalytics(req, res) {
  try {
    const { quizId } = req.params;
    const teacherId = req.user.id_user;

    // Verify teacher owns this quiz
    const quiz = await queryOne(
      'SELECT q.id_kuis, c.id_pengajar FROM quizzes q JOIN classes c ON q.id_kelas = c.id_kelas WHERE q.id_kuis = ?',
      [quizId]
    );

    if (!quiz || quiz.id_pengajar !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke analytics kuis ini',
        data: null
      });
    }

    // Get statistics
    const stats = await queryOne(
      `SELECT 
        COUNT(*) as total_attempts,
        COUNT(DISTINCT id_user) as unique_students,
        AVG(skor) as average_score,
        MAX(skor) as highest_score,
        MIN(skor) as lowest_score,
        SUM(CASE WHEN skor >= 80 THEN 1 ELSE 0 END) as excellent_count,
        SUM(CASE WHEN skor >= 60 AND skor < 80 THEN 1 ELSE 0 END) as good_count,
        SUM(CASE WHEN skor >= 40 AND skor < 60 THEN 1 ELSE 0 END) as average_count,
        SUM(CASE WHEN skor < 40 THEN 1 ELSE 0 END) as poor_count
       FROM quiz_attempts
       WHERE id_kuis = ? AND status = ?`,
      [quizId, 'graded']
    );

    // Get question difficulty (how many got each question right)
    const questionStats = await query(
      `SELECT q.id_soal, q.pertanyaan, q.jenis_soal, 
              COUNT(qa.id_jawaban) as total_answered,
              SUM(CASE WHEN qa.is_benar = true THEN 1 ELSE 0 END) as correct_count,
              ROUND(SUM(CASE WHEN qa.is_benar = true THEN 1 ELSE 0 END) / COUNT(qa.id_jawaban) * 100, 2) as correct_percentage
       FROM questions q
       JOIN quiz_questions qq ON q.id_soal = qq.id_soal
       LEFT JOIN quiz_answers qa ON q.id_soal = qa.id_soal AND qa.id_percobaan IN 
         (SELECT id_percobaan FROM quiz_attempts WHERE id_kuis = ? AND status = ?)
       WHERE qq.id_kuis = ?
       GROUP BY q.id_soal
       ORDER BY q.id_soal`,
      [quizId, 'graded', quizId]
    );

    res.json({
      success: true,
      message: 'Analytics kuis berhasil diambil',
      data: {
        overall: {
          total_attempts: stats.total_attempts || 0,
          unique_students: stats.unique_students || 0,
          average_score: Math.round(stats.average_score || 0),
          highest_score: stats.highest_score || 0,
          lowest_score: stats.lowest_score || 0,
          score_distribution: {
            excellent: stats.excellent_count || 0,
            good: stats.good_count || 0,
            average: stats.average_count || 0,
            poor: stats.poor_count || 0
          }
        },
        question_stats: questionStats
      }
    });
  } catch (error) {
    console.error('Get quiz analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil analytics kuis',
      data: null
    });
  }
}

// Get class leaderboard
export async function getClassLeaderboard(req, res) {
  try {
    const { classId } = req.params;
    const userId = req.user.id_user;
    const { limit = 10 } = req.query;

    // Check if user is member or teacher of class
    const classData = await queryOne(
      'SELECT id_pengajar FROM classes WHERE id_kelas = ?',
      [classId]
    );

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Kelas tidak ditemukan',
        data: null
      });
    }

    if (req.user.role === 'student') {
      const isMember = await queryOne(
        'SELECT id_anggota FROM class_members WHERE id_kelas = ? AND id_user = ?',
        [classId, userId]
      );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'Anda bukan anggota kelas ini',
          data: null
        });
      }
    } else if (req.user.role === 'teacher' && classData.id_pengajar !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke kelas ini',
        data: null
      });
    }

    const limitNum = Math.min(100, parseInt(limit) || 10);

    // Get leaderboard
    const leaderboard = await query(
      `SELECT 
        ROW_NUMBER() OVER (ORDER BY AVG(qa.skor) DESC, COUNT(qa.id_percobaan) DESC) as ranking,
        u.id_user,
        u.nama,
        COUNT(DISTINCT qa.id_percobaan) as total_quizzes,
        ROUND(AVG(qa.skor), 2) as average_score,
        MAX(qa.skor) as highest_score,
        SUM(CASE WHEN qa.skor >= 80 THEN 1 ELSE 0 END) as excellent_count
       FROM users u
       JOIN class_members cm ON u.id_user = cm.id_user
       LEFT JOIN quiz_attempts qa ON u.id_user = qa.id_user AND qa.status = 'graded'
         AND qa.id_kuis IN (
           SELECT id_kuis FROM quizzes WHERE id_kelas = ?
         )
       WHERE cm.id_kelas = ?
       GROUP BY u.id_user, u.nama
       ORDER BY average_score DESC, total_quizzes DESC
       LIMIT ?`,
      [classId, classId, limitNum]
    );

    res.json({
      success: true,
      message: 'Leaderboard kelas berhasil diambil',
      data: {
        leaderboard,
        total_members: leaderboard.length
      }
    });
  } catch (error) {
    console.error('Get class leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil leaderboard',
      data: null
    });
  }
}

// Get user's quiz history
export async function getUserQuizHistory(req, res) {
  try {
    const userId = req.user.id_user;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit) || 10);
    const offset = (pageNum - 1) * limitNum;

    // Get count
    const countResult = await queryOne(
      'SELECT COUNT(*) as total FROM quiz_attempts WHERE id_user = ? AND status = ?',
      [userId, 'graded']
    );

    // Get history
    const history = await query(
      `SELECT qa.id_percobaan, qa.id_kuis, q.judul as quiz_title, qa.waktu_mulai, qa.waktu_kirim, qa.skor,
              COUNT(qan.id_jawaban) as total_questions,
              SUM(CASE WHEN qan.is_benar = true THEN 1 ELSE 0 END) as correct_answers
       FROM quiz_attempts qa
       JOIN quizzes q ON qa.id_kuis = q.id_kuis
       LEFT JOIN quiz_answers qan ON qa.id_percobaan = qan.id_percobaan
       WHERE qa.id_user = ? AND qa.status = ?
       GROUP BY qa.id_percobaan
       ORDER BY qa.waktu_kirim DESC
       LIMIT ? OFFSET ?`,
      [userId, 'graded', limitNum, offset]
    );

    res.json({
      success: true,
      message: 'Riwayat kuis berhasil diambil',
      data: {
        history,
        pagination: {
          current_page: pageNum,
          per_page: limitNum,
          total: countResult.total,
          total_pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get user quiz history error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil riwayat kuis',
      data: null
    });
  }
}

// Get user statistics
export async function getUserStatistics(req, res) {
  try {
    const userId = req.user.id_user;

    const stats = await queryOne(
      `SELECT 
        COUNT(DISTINCT id_percobaan) as total_quizzes,
        ROUND(AVG(skor), 2) as average_score,
        MAX(skor) as highest_score,
        MIN(skor) as lowest_score,
        SUM(CASE WHEN skor >= 80 THEN 1 ELSE 0 END) as excellent_count,
        SUM(CASE WHEN skor >= 60 AND skor < 80 THEN 1 ELSE 0 END) as good_count,
        SUM(CASE WHEN skor >= 40 AND skor < 60 THEN 1 ELSE 0 END) as average_count,
        SUM(CASE WHEN skor < 40 THEN 1 ELSE 0 END) as poor_count
       FROM quiz_attempts
       WHERE id_user = ? AND status = ?`,
      [userId, 'graded']
    );

    res.json({
      success: true,
      message: 'Statistik user berhasil diambil',
      data: {
        total_quizzes: stats.total_quizzes || 0,
        average_score: stats.average_score || 0,
        highest_score: stats.highest_score || 0,
        lowest_score: stats.lowest_score || 0,
        score_distribution: {
          excellent: stats.excellent_count || 0,
          good: stats.good_count || 0,
          average: stats.average_count || 0,
          poor: stats.poor_count || 0
        }
      }
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil statistik user',
      data: null
    });
  }
}
