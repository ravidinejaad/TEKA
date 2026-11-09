import { query, queryOne, transaction } from '../database/connection.js';

// Create question (teacher only)
export async function createQuestion(req, res) {
  try {
    const teacherId = req.user.id_user;
    const { pertanyaan, jenis_soal, kunci_jawaban, pembahasan, options } = req.body;

    // Insert question using transaction
    const result = await transaction(async (connection) => {
      const [insertResult] = await connection.execute(
        'INSERT INTO questions (id_pengajar, pertanyaan, jenis_soal, kunci_jawaban, pembahasan) VALUES (?, ?, ?, ?, ?)',
        [teacherId, pertanyaan, jenis_soal, kunci_jawaban, pembahasan || null]
      );

      const questionId = insertResult.insertId;

      // Insert options if provided and it's multiple choice
      if (options && options.length > 0 && jenis_soal === 'pilihan_ganda') {
        for (let i = 0; i < options.length; i++) {
          const option = options[i];
          await connection.execute(
            'INSERT INTO question_options (id_soal, label_opsi, teks_opsi, urutan) VALUES (?, ?, ?, ?)',
            [questionId, String.fromCharCode(65 + i), option, i + 1]
          );
        }
      }

      return questionId;
    });

    // Get created question with options
    const question = await getQuestionWithOptions(result);

    res.status(201).json({
      success: true,
      message: 'Soal berhasil dibuat',
      data: question
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat soal',
      data: null
    });
  }
}

// Get question with options helper
async function getQuestionWithOptions(questionId) {
  const question = await queryOne(
    'SELECT id_soal, id_pengajar, pertanyaan, jenis_soal, kunci_jawaban, pembahasan, created_at FROM questions WHERE id_soal = ?',
    [questionId]
  );

  if (!question) return null;

  const options = await query(
    'SELECT id_opsi, label_opsi, teks_opsi FROM question_options WHERE id_soal = ? ORDER BY urutan',
    [questionId]
  );

  return {
    ...question,
    options: options || []
  };
}

// Get all teacher's questions
export async function getTeacherQuestions(req, res) {
  try {
    const teacherId = req.user.id_user;
    const { page = 1, limit = 10, jenis_soal, search } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit) || 10);
    const offset = (pageNum - 1) * limitNum;

    // Build query
    let whereConditions = ['q.id_pengajar = ?'];
    let params = [teacherId];

    if (jenis_soal) {
      whereConditions.push('q.jenis_soal = ?');
      params.push(jenis_soal);
    }

    if (search) {
      whereConditions.push('q.pertanyaan LIKE ?');
      params.push(`%${search}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM questions q WHERE ${whereClause}`,
      params
    );

    // Get questions
    const questions = await query(
      `SELECT id_soal, pertanyaan, jenis_soal, kunci_jawaban, pembahasan, created_at 
       FROM questions q 
       WHERE ${whereClause} 
       ORDER BY q.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    // Get options for each question
    const questionsWithOptions = await Promise.all(
      questions.map(async (q) => {
        const options = await query(
          'SELECT id_opsi, label_opsi, teks_opsi FROM question_options WHERE id_soal = ? ORDER BY urutan',
          [q.id_soal]
        );
        return {
          ...q,
          options: options || []
        };
      })
    );

    res.json({
      success: true,
      message: 'Daftar soal berhasil diambil',
      data: {
        questions: questionsWithOptions,
        pagination: {
          current_page: pageNum,
          per_page: limitNum,
          total: countResult.total,
          total_pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil daftar soal',
      data: null
    });
  }
}

// Get question detail
export async function getQuestionDetail(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id_user;

    const question = await queryOne(
      'SELECT id_soal, id_pengajar, pertanyaan, jenis_soal, kunci_jawaban, pembahasan FROM questions WHERE id_soal = ?',
      [id]
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Soal tidak ditemukan',
        data: null
      });
    }

    // Check ownership if teacher
    if (req.user.role === 'teacher' && question.id_pengajar !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke soal ini',
        data: null
      });
    }

    // Get options
    const options = await query(
      'SELECT id_opsi, label_opsi, teks_opsi FROM question_options WHERE id_soal = ? ORDER BY urutan',
      [id]
    );

    res.json({
      success: true,
      message: 'Detail soal berhasil diambil',
      data: {
        ...question,
        options: options || []
      }
    });
  } catch (error) {
    console.error('Get question detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil detail soal',
      data: null
    });
  }
}

// Update question (teacher only)
export async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const teacherId = req.user.id_user;
    const { pertanyaan, jenis_soal, kunci_jawaban, pembahasan, options } = req.body;

    // Check ownership
    const question = await queryOne(
      'SELECT id_pengajar FROM questions WHERE id_soal = ?',
      [id]
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Soal tidak ditemukan',
        data: null
      });
    }

    if (question.id_pengajar !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengubah soal ini',
        data: null
      });
    }

    // Update using transaction
    await transaction(async (connection) => {
      const updates = [];
      const values = [];

      if (pertanyaan) {
        updates.push('pertanyaan = ?');
        values.push(pertanyaan);
      }
      if (jenis_soal) {
        updates.push('jenis_soal = ?');
        values.push(jenis_soal);
      }
      if (kunci_jawaban) {
        updates.push('kunci_jawaban = ?');
        values.push(kunci_jawaban);
      }
      if (pembahasan !== undefined) {
        updates.push('pembahasan = ?');
        values.push(pembahasan || null);
      }

      if (updates.length > 0) {
        values.push(id);
        await connection.execute(
          `UPDATE questions SET ${updates.join(', ')} WHERE id_soal = ?`,
          values
        );
      }

      // Update options if provided
      if (options && options.length > 0 && jenis_soal === 'pilihan_ganda') {
        // Delete existing options
        await connection.execute('DELETE FROM question_options WHERE id_soal = ?', [id]);

        // Insert new options
        for (let i = 0; i < options.length; i++) {
          const option = options[i];
          await connection.execute(
            'INSERT INTO question_options (id_soal, label_opsi, teks_opsi, urutan) VALUES (?, ?, ?, ?)',
            [id, String.fromCharCode(65 + i), option, i + 1]
          );
        }
      }
    });

    const updatedQuestion = await getQuestionWithOptions(id);

    res.json({
      success: true,
      message: 'Soal berhasil diupdate',
      data: updatedQuestion
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate soal',
      data: null
    });
  }
}

// Delete question (teacher only)
export async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    const teacherId = req.user.id_user;

    // Check ownership
    const question = await queryOne(
      'SELECT id_pengajar FROM questions WHERE id_soal = ?',
      [id]
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Soal tidak ditemukan',
        data: null
      });
    }

    if (question.id_pengajar !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk menghapus soal ini',
        data: null
      });
    }

    // Delete question (cascade will delete options)
    await query('DELETE FROM questions WHERE id_soal = ?', [id]);

    res.json({
      success: true,
      message: 'Soal berhasil dihapus',
      data: null
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus soal',
      data: null
    });
  }
}

// Search questions (for quiz creation)
export async function searchQuestions(req, res) {
  try {
    const teacherId = req.user.id_user;
    const { search, jenis_soal, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit) || 10);
    const offset = (pageNum - 1) * limitNum;

    let whereConditions = ['q.id_pengajar = ?'];
    let params = [teacherId];

    if (search) {
      whereConditions.push('q.pertanyaan LIKE ?');
      params.push(`%${search}%`);
    }

    if (jenis_soal) {
      whereConditions.push('q.jenis_soal = ?');
      params.push(jenis_soal);
    }

    const whereClause = whereConditions.join(' AND ');

    // Get count
    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM questions q WHERE ${whereClause}`,
      params
    );

    // Get questions
    const questions = await query(
      `SELECT id_soal, pertanyaan, jenis_soal FROM questions q 
       WHERE ${whereClause} 
       ORDER BY q.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    res.json({
      success: true,
      message: 'Hasil pencarian soal berhasil diambil',
      data: {
        questions,
        pagination: {
          current_page: pageNum,
          per_page: limitNum,
          total: countResult.total,
          total_pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Search questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mencari soal',
      data: null
    });
  }
}
