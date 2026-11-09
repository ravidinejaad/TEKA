import { query, queryOne, transaction } from '../database/connection.js';

// Create quiz (teacher only)
export async function createQuiz(req, res) {
  try {
    const teacherId = req.user.id_user;
    const {
      id_kelas,
      judul,
      deskripsi,
      durasi_menit,
      waktu_mulai,
      waktu_selesai,
      bisa_coba_ulang,
      tampilkan_jawaban,
      tampilkan_pembahasan,
      questions
    } = req.body;

    // Verify class ownership
    const classData = await queryOne(
      'SELECT id_pengajar FROM classes WHERE id_kelas = ?',
      [id_kelas]
    );

    if (!classData || classData.id_pengajar !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke kelas ini',
        data: null
      });
    }

    // Validate times
    const start = new Date(waktu_mulai);
    const end = new Date(waktu_selesai);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'Waktu selesai harus lebih besar dari waktu mulai',
        data: null
      });
    }

    // Create quiz with questions using transaction
    const quizId = await transaction(async (connection) => {
      const [insertResult] = await connection.execute(
        `INSERT INTO quizzes 
         (id_kelas, judul, deskripsi, durasi_menit, waktu_mulai, waktu_selesai, bisa_coba_ulang, tampilkan_jawaban, tampilkan_pembahasan) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id_kelas,
          judul,
          deskripsi || null,
          durasi_menit,
          waktu_mulai,
          waktu_selesai,
          bisa_coba_ulang || false,
          tampilkan_jawaban || false,
          tampilkan_pembahasan || false
        ]
      );

      const newQuizId = insertResult.insertId;

      // Add questions to quiz
      if (questions && questions.length > 0) {
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          await connection.execute(
            'INSERT INTO quiz_questions (id_kuis, id_soal, bobot, urutan) VALUES (?, ?, ?, ?)',
            [newQuizId, q.id_soal, q.bobot || 1.0, i + 1]
          );
        }
      }

      return newQuizId;
    });

    // Get created quiz
    const quiz = await getQuizWithQuestions(quizId);

    res.status(201).json({
      success: true,
      message: 'Kuis berhasil dibuat',
      data: quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat kuis',
      data: null
    });
  }
}

// Get quiz with questions helper
async function getQuizWithQuestions(quizId) {
  const quiz = await queryOne(
    `SELECT id_kuis, id_kelas, judul, deskripsi, durasi_menit, waktu_mulai, 
            waktu_selesai, status, bisa_coba_ulang, tampilkan_jawaban, tampilkan_pembahasan, 
            created_at FROM quizzes WHERE id_kuis = ?`,
    [quizId]
  );

  if (!quiz) return null;

  const questions = await query(
    `SELECT qq.id_kuis_soal, qq.id_soal, qq.bobot, qq.urutan, q.pertanyaan, q.jenis_soal
     FROM quiz_questions qq
     JOIN questions q ON qq.id_soal = q.id_soal
     WHERE qq.id_kuis = ?
     ORDER BY qq.urutan`,
    [quizId]
  );

  return {
    ...quiz,
    questions: questions || []
  };
}

// Get class quizzes
export async function getClassQuizzes(req, res) {
  try {
    const { classId } = req.params;
    const userId = req.user.id_user;
    const { page = 1, limit = 10, status } = req.query;

    // Verify access to class
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

    // Teacher can see all quizzes in their class, student can see published only
    let whereConditions = ['q.id_kelas = ?'];
    let params = [classId];

    if (req.user.role === 'student') {
      // Verify student is member
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

      whereConditions.push('q.status = ?');
      params.push('published');
    } else if (req.user.role === 'teacher') {
      if (classData.id_pengajar !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Anda tidak memiliki akses ke kelas ini',
          data: null
        });
      }
    }

    if (status) {
      whereConditions.push('q.status = ?');
      params.push(status);
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit) || 10);
    const offset = (pageNum - 1) * limitNum;

    const whereClause = whereConditions.join(' AND ');

    // Get count
    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM quizzes q WHERE ${whereClause}`,
      params
    );

    // Get quizzes
    const quizzes = await query(
      `SELECT id_kuis, judul, deskripsi, durasi_menit, waktu_mulai, waktu_selesai, 
              status, bisa_coba_ulang, created_at
       FROM quizzes q 
       WHERE ${whereClause}
       ORDER BY q.waktu_mulai DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    res.json({
      success: true,
      message: 'Daftar kuis berhasil diambil',
      data: {
        quizzes,
        pagination: {
          current_page: pageNum,
          per_page: limitNum,
          total: countResult.total,
          total_pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get class quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil daftar kuis',
      data: null
    });
  }
}

// Get quiz detail
export async function getQuizDetail(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id_user;

    const quiz = await queryOne(
      'SELECT id_kuis, id_kelas, judul, deskripsi, durasi_menit, waktu_mulai, waktu_selesai, status, bisa_coba_ulang, tampilkan_jawaban, tampilkan_pembahasan FROM quizzes WHERE id_kuis = ?',
      [id]
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Kuis tidak ditemukan',
        data: null
      });
    }

    // Get class
    const classData = await queryOne(
      'SELECT id_pengajar FROM classes WHERE id_kelas = ?',
      [quiz.id_kelas]
    );

    // Check access
    if (req.user.role === 'teacher') {
      if (classData.id_pengajar !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Anda tidak memiliki akses ke kuis ini',
          data: null
        });
      }
    } else if (req.user.role === 'student') {
      if (quiz.status !== 'published') {
        return res.status(403).json({
          success: false,
          message: 'Kuis belum dipublikasikan',
          data: null
        });
      }

      const isMember = await queryOne(
        'SELECT id_anggota FROM class_members WHERE id_kelas = ? AND id_user = ?',
        [quiz.id_kelas, userId]
      );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'Anda bukan anggota kelas ini',
          data: null
        });
      }
    }

    // Get questions (don't include answers for students)
    let questionQuery = `
      SELECT qq.id_kuis_soal, qq.id_soal, qq.bobot, qq.urutan, q.pertanyaan, q.jenis_soal`;

    if (req.user.role === 'teacher') {
      questionQuery += ', q.kunci_jawaban, q.pembahasan';
    }

    questionQuery += `
      FROM quiz_questions qq
      JOIN questions q ON qq.id_soal = q.id_soal
      WHERE qq.id_kuis = ?
      ORDER BY qq.urutan`;

    const questions = await query(questionQuery, [id]);

    // Get options for multiple choice
    let questionsWithOptions = questions;
    if (req.user.role === 'teacher' || quiz.status === 'published') {
      questionsWithOptions = await Promise.all(
        questions.map(async (q) => {
          if (q.jenis_soal === 'pilihan_ganda') {
            const options = await query(
              'SELECT id_opsi, label_opsi, teks_opsi FROM question_options WHERE id_soal = ? ORDER BY urutan',
              [q.id_soal]
            );
            return { ...q, options };
          }
          return q;
        })
      );
    }

    res.json({
      success: true,
      message: 'Detail kuis berhasil diambil',
      data: {
        ...quiz,
        questions: questionsWithOptions
      }
    });
  } catch (error) {
    console.error('Get quiz detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil detail kuis',
      data: null
    });
  }
}

// Update quiz (teacher only)
export async function updateQuiz(req, res) {
  try {
    const { id } = req.params;
    const teacherId = req.user.id_user;
    const { judul, deskripsi, durasi_menit, waktu_mulai, waktu_selesai, bisa_coba_ulang, tampilkan_jawaban, tampilkan_pembahasan, questions } = req.body;

    // Check ownership
    const quiz = await queryOne(
      'SELECT id_kelas FROM quizzes WHERE id_kuis = ?',
      [id]
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Kuis tidak ditemukan',
        data: null
      });
    }

    const classData = await queryOne(
      'SELECT id_pengajar FROM classes WHERE id_kelas = ?',
      [quiz.id_kelas]
    );

    if (classData.id_pengajar !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengubah kuis ini',
        data: null
      });
    }

    // Update quiz using transaction
    await transaction(async (connection) => {
      const updates = [];
      const values = [];

      if (judul) {
        updates.push('judul = ?');
        values.push(judul);
      }
      if (deskripsi !== undefined) {
        updates.push('deskripsi = ?');
        values.push(deskripsi || null);
      }
      if (durasi_menit) {
        updates.push('durasi_menit = ?');
        values.push(durasi_menit);
      }
      if (waktu_mulai) {
        updates.push('waktu_mulai = ?');
        values.push(waktu_mulai);
      }
      if (waktu_selesai) {
        updates.push('waktu_selesai = ?');
        values.push(waktu_selesai);
      }
      if (bisa_coba_ulang !== undefined) {
        updates.push('bisa_coba_ulang = ?');
        values.push(bisa_coba_ulang);
      }
      if (tampilkan_jawaban !== undefined) {
        updates.push('tampilkan_jawaban = ?');
        values.push(tampilkan_jawaban);
      }
      if (tampilkan_pembahasan !== undefined) {
        updates.push('tampilkan_pembahasan = ?');
        values.push(tampilkan_pembahasan);
      }

      if (updates.length > 0) {
        values.push(id);
        await connection.execute(
          `UPDATE quizzes SET ${updates.join(', ')} WHERE id_kuis = ?`,
          values
        );
      }

      // Update questions if provided
      if (questions && questions.length > 0) {
        await connection.execute('DELETE FROM quiz_questions WHERE id_kuis = ?', [id]);

        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          await connection.execute(
            'INSERT INTO quiz_questions (id_kuis, id_soal, bobot, urutan) VALUES (?, ?, ?, ?)',
            [id, q.id_soal, q.bobot || 1.0, i + 1]
          );
        }
      }
    });

    const updatedQuiz = await getQuizWithQuestions(id);

    res.json({
      success: true,
      message: 'Kuis berhasil diupdate',
      data: updatedQuiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate kuis',
      data: null
    });
  }
}

// Delete quiz (teacher only)
export async function deleteQuiz(req, res) {
  try {
    const { id } = req.params;
    const teacherId = req.user.id_user;

    // Check ownership
    const quiz = await queryOne(
      'SELECT id_kelas FROM quizzes WHERE id_kuis = ?',
      [id]
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Kuis tidak ditemukan',
        data: null
      });
    }

    const classData = await queryOne(
      'SELECT id_pengajar FROM classes WHERE id_kelas = ?',
      [quiz.id_kelas]
    );

    if (classData.id_pengajar !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk menghapus kuis ini',
        data: null
      });
    }

    // Delete quiz (cascade will delete quiz_questions, quiz_attempts, quiz_answers)
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

// Publish quiz (teacher only)
export async function publishQuiz(req, res) {
  try {
    const { id } = req.params;
    const teacherId = req.user.id_user;

    // Check ownership
    const quiz = await queryOne(
      'SELECT id_kelas, status FROM quizzes WHERE id_kuis = ?',
      [id]
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Kuis tidak ditemukan',
        data: null
      });
    }

    const classData = await queryOne(
      'SELECT id_pengajar FROM classes WHERE id_kelas = ?',
      [quiz.id_kelas]
    );

    if (classData.id_pengajar !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke kuis ini',
        data: null
      });
    }

    if (quiz.status === 'published') {
      return res.status(400).json({
        success: false,
        message: 'Kuis sudah dipublikasikan',
        data: null
      });
    }

    // Update status
    await query('UPDATE quizzes SET status = ? WHERE id_kuis = ?', ['published', id]);

    res.json({
      success: true,
      message: 'Kuis berhasil dipublikasikan',
      data: null
    });
  } catch (error) {
    console.error('Publish quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mempublikasikan kuis',
      data: null
    });
  }
}

// Close quiz (teacher only)
export async function closeQuiz(req, res) {
  try {
    const { id } = req.params;
    const teacherId = req.user.id_user;

    // Check ownership
    const quiz = await queryOne(
      'SELECT id_kelas, status FROM quizzes WHERE id_kuis = ?',
      [id]
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Kuis tidak ditemukan',
        data: null
      });
    }

    const classData = await queryOne(
      'SELECT id_pengajar FROM classes WHERE id_kelas = ?',
      [quiz.id_kelas]
    );

    if (classData.id_pengajar !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke kuis ini',
        data: null
      });
    }

    // Update status
    await query('UPDATE quizzes SET status = ? WHERE id_kuis = ?', ['closed', id]);

    res.json({
      success: true,
      message: 'Kuis berhasil ditutup',
      data: null
    });
  } catch (error) {
    console.error('Close quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menutup kuis',
      data: null
    });
  }
}
