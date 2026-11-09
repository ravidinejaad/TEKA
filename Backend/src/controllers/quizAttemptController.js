import { query, queryOne, transaction } from '../database/connection.js';
import { compareAnswers, normalizeString } from '../utils/stringUtils.js';

// Start quiz attempt
export async function startQuizAttempt(req, res) {
  try {
    const userId = req.user.id_user;
    const { id_kuis } = req.body;

    // Get quiz details
    const quiz = await queryOne(
      'SELECT id_kuis, id_kelas, durasi_menit, waktu_mulai, waktu_selesai, status, bisa_coba_ulang FROM quizzes WHERE id_kuis = ?',
      [id_kuis]
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Kuis tidak ditemukan',
        data: null
      });
    }

    // Check if quiz is published
    if (quiz.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Kuis belum dipublikasikan atau sudah ditutup',
        data: null
      });
    }

    // Check if student is member of class
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

    // Check if quiz is within time window
    const now = new Date();
    const startTime = new Date(quiz.waktu_mulai);
    const endTime = new Date(quiz.waktu_selesai);

    if (now < startTime) {
      return res.status(400).json({
        success: false,
        message: 'Kuis belum dimulai',
        data: null
      });
    }

    if (now > endTime) {
      return res.status(400).json({
        success: false,
        message: 'Kuis sudah berakhir',
        data: null
      });
    }

    // Check for existing ongoing attempt
    const existingAttempt = await queryOne(
      'SELECT id_percobaan FROM quiz_attempts WHERE id_kuis = ? AND id_user = ? AND status = ?',
      [id_kuis, userId, 'ongoing']
    );

    if (existingAttempt) {
      return res.status(200).json({
        success: true,
        message: 'Melanjutkan percobaan sebelumnya',
        data: {
          id_percobaan: existingAttempt.id_percobaan
        }
      });
    }

    // Check retry policy if not allowed to retry
    if (!quiz.bisa_coba_ulang) {
      const completedAttempt = await queryOne(
        'SELECT id_percobaan FROM quiz_attempts WHERE id_kuis = ? AND id_user = ? AND status IN (?, ?)',
        [id_kuis, userId, 'submitted', 'graded']
      );

      if (completedAttempt) {
        return res.status(400).json({
          success: false,
          message: 'Anda sudah menyelesaikan kuis ini dan tidak bisa mengulang',
          data: null
        });
      }
    }

    // Create new attempt
    const waktuBatas = new Date(now.getTime() + quiz.durasi_menit * 60000);

    const result = await query(
      'INSERT INTO quiz_attempts (id_kuis, id_user, waktu_mulai, waktu_batas, status) VALUES (?, ?, ?, ?, ?)',
      [id_kuis, userId, now, waktuBatas, 'ongoing']
    );

    const attemptId = result.insertId;

    // Get quiz questions
    const questions = await query(
      `SELECT qq.id_kuis_soal, qq.id_soal, qq.bobot, qq.urutan, q.pertanyaan, q.jenis_soal, q.kunci_jawaban
       FROM quiz_questions qq
       JOIN questions q ON qq.id_soal = q.id_soal
       WHERE qq.id_kuis = ?
       ORDER BY qq.urutan`,
      [id_kuis]
    );

    // Get options for multiple choice questions
    const questionsWithOptions = await Promise.all(
      questions.map(async (q) => {
        if (q.jenis_soal === 'pilihan_ganda') {
          const options = await query(
            'SELECT id_opsi, label_opsi, teks_opsi FROM question_options WHERE id_soal = ? ORDER BY urutan',
            [q.id_soal]
          );
          return { ...q, options };
        }
        return { ...q, options: [] };
      })
    );

    // Remove answer keys from response (student shouldn't see them yet)
    const questionsForStudent = questionsWithOptions.map(q => {
      const { kunci_jawaban, ...rest } = q;
      return rest;
    });

    res.status(201).json({
      success: true,
      message: 'Kuis dimulai',
      data: {
        id_percobaan: attemptId,
        waktu_mulai: now,
        waktu_batas: waktuBatas,
        durasi_menit: quiz.durasi_menit,
        jumlah_soal: questions.length,
        questions: questionsForStudent
      }
    });
  } catch (error) {
    console.error('Start quiz attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memulai kuis',
      data: null
    });
  }
}

// Get current attempt
export async function getCurrentAttempt(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id_user;

    // Get attempt
    const attempt = await queryOne(
      'SELECT id_percobaan, id_kuis, waktu_mulai, waktu_batas, waktu_kirim, status, skor FROM quiz_attempts WHERE id_percobaan = ? AND id_user = ?',
      [id, userId]
    );

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Percobaan tidak ditemukan',
        data: null
      });
    }

    if (attempt.status === 'submitted' || attempt.status === 'graded') {
      return res.status(400).json({
        success: false,
        message: 'Percobaan sudah selesai',
        data: null
      });
    }

    // Get quiz
    const quiz = await queryOne(
      'SELECT id_kuis, durasi_menit FROM quizzes WHERE id_kuis = ?',
      [attempt.id_kuis]
    );

    // Get questions
    const questions = await query(
      `SELECT qq.id_kuis_soal, qq.id_soal, qq.bobot, qq.urutan, q.pertanyaan, q.jenis_soal
       FROM quiz_questions qq
       JOIN questions q ON qq.id_soal = q.id_soal
       WHERE qq.id_kuis = ?
       ORDER BY qq.urutan`,
      [attempt.id_kuis]
    );

    // Get options and student answers
    const questionsWithData = await Promise.all(
      questions.map(async (q) => {
        let options = [];
        if (q.jenis_soal === 'pilihan_ganda') {
          options = await query(
            'SELECT id_opsi, label_opsi, teks_opsi FROM question_options WHERE id_soal = ? ORDER BY urutan',
            [q.id_soal]
          );
        }

        const studentAnswer = await queryOne(
          'SELECT jawaban FROM quiz_answers WHERE id_percobaan = ? AND id_soal = ?',
          [id, q.id_soal]
        );

        return {
          ...q,
          options,
          student_answer: studentAnswer ? studentAnswer.jawaban : null
        };
      })
    );

    res.json({
      success: true,
      message: 'Data percobaan berhasil diambil',
      data: {
        id_percobaan: attempt.id_percobaan,
        waktu_mulai: attempt.waktu_mulai,
        waktu_batas: attempt.waktu_batas,
        durasi_menit: quiz.durasi_menit,
        status: attempt.status,
        questions: questionsWithData
      }
    });
  } catch (error) {
    console.error('Get current attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data percobaan',
      data: null
    });
  }
}

// Auto-save answer
export async function saveAnswer(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id_user;
    const { id_soal, jawaban } = req.body;

    // Check attempt ownership and status
    const attempt = await queryOne(
      'SELECT id_percobaan, status FROM quiz_attempts WHERE id_percobaan = ? AND id_user = ?',
      [id, userId]
    );

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Percobaan tidak ditemukan',
        data: null
      });
    }

    if (attempt.status !== 'ongoing') {
      return res.status(400).json({
        success: false,
        message: 'Percobaan sudah selesai',
        data: null
      });
    }

    // Check if answer already exists
    const existingAnswer = await queryOne(
      'SELECT id_jawaban FROM quiz_answers WHERE id_percobaan = ? AND id_soal = ?',
      [id, id_soal]
    );

    if (existingAnswer) {
      // Update existing answer
      await query(
        'UPDATE quiz_answers SET jawaban = ? WHERE id_percobaan = ? AND id_soal = ?',
        [jawaban, id, id_soal]
      );
    } else {
      // Insert new answer
      await query(
        'INSERT INTO quiz_answers (id_percobaan, id_soal, jawaban) VALUES (?, ?, ?)',
        [id, id_soal, jawaban]
      );
    }

    res.json({
      success: true,
      message: 'Jawaban berhasil disimpan',
      data: null
    });
  } catch (error) {
    console.error('Save answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menyimpan jawaban',
      data: null
    });
  }
}

// Submit quiz
export async function submitQuiz(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id_user;

    // Get attempt
    const attempt = await queryOne(
      'SELECT id_percobaan, id_kuis, waktu_mulai, waktu_batas, status FROM quiz_attempts WHERE id_percobaan = ? AND id_user = ?',
      [id, userId]
    );

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Percobaan tidak ditemukan',
        data: null
      });
    }

    if (attempt.status !== 'ongoing') {
      return res.status(400).json({
        success: false,
        message: 'Percobaan sudah selesai',
        data: null
      });
    }

    // Check if time is up
    const now = new Date();
    if (now > new Date(attempt.waktu_batas)) {
      // Auto-submit due to timeout
      await query(
        'UPDATE quiz_attempts SET status = ?, waktu_kirim = ? WHERE id_percobaan = ?',
        ['submitted', now, id]
      );
    } else {
      // Manual submit
      await query(
        'UPDATE quiz_attempts SET status = ?, waktu_kirim = ? WHERE id_percobaan = ?',
        ['submitted', now, id]
      );
    }

    // Grade the quiz
    await gradeQuiz(id);

    // Get results
    const result = await getQuizResult(id);

    res.json({
      success: true,
      message: 'Kuis berhasil disubmit',
      data: result
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengirim kuis',
      data: null
    });
  }
}

// Grade quiz helper
async function gradeQuiz(attemptId) {
  try {
    // Get attempt with quiz details
    const attempt = await queryOne(
      `SELECT qa.id_percobaan, qa.id_kuis, qq.id_soal, qq.bobot, q.jenis_soal, q.kunci_jawaban
       FROM quiz_attempts qa
       JOIN quiz_questions qq ON qq.id_kuis = qa.id_kuis
       JOIN questions q ON q.id_soal = qq.id_soal
       WHERE qa.id_percobaan = ?`,
      [attemptId]
    );

    if (!attempt) return;

    // Get all questions in quiz
    const questions = await query(
      `SELECT qq.id_soal, qq.bobot, q.jenis_soal, q.kunci_jawaban
       FROM quiz_questions qq
       JOIN questions q ON q.id_soal = qq.id_soal
       WHERE qq.id_kuis = (SELECT id_kuis FROM quiz_attempts WHERE id_percobaan = ?)`,
      [attemptId]
    );

    let totalScore = 0;
    let totalWeight = 0;

    // Grade each answer
    for (const question of questions) {
      totalWeight += parseFloat(question.bobot);

      const studentAnswer = await queryOne(
        'SELECT id_jawaban, jawaban FROM quiz_answers WHERE id_percobaan = ? AND id_soal = ?',
        [attemptId, question.id_soal]
      );

      let isCorrect = false;
      let poin = 0;

      if (studentAnswer) {
        isCorrect = gradeAnswer(
          studentAnswer.jawaban,
          question.kunci_jawaban,
          question.jenis_soal
        );

        if (isCorrect) {
          poin = parseFloat(question.bobot);
          totalScore += poin;
        }

        // Update answer with grading result
        await query(
          'UPDATE quiz_answers SET is_benar = ?, poin = ? WHERE id_jawaban = ?',
          [isCorrect, poin, studentAnswer.id_jawaban]
        );
      }
    }

    // Calculate final score (0-100)
    const finalScore = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;

    // Update attempt with score and mark as graded
    await query(
      'UPDATE quiz_attempts SET skor = ?, status = ? WHERE id_percobaan = ?',
      [finalScore, 'graded', attemptId]
    );
  } catch (error) {
    console.error('Grade quiz error:', error);
  }
}

// Grade individual answer
function gradeAnswer(studentAnswer, correctAnswer, questionType) {
  switch (questionType) {
    case 'pilihan_ganda':
      return studentAnswer === correctAnswer;

    case 'benar_salah':
      return normalizeString(studentAnswer) === normalizeString(correctAnswer);

    case 'isian_singkat':
      return compareAnswers(studentAnswer, correctAnswer);

    default:
      return false;
  }
}

// Get quiz results helper
async function getQuizResult(attemptId) {
  const attempt = await queryOne(
    'SELECT id_percobaan, id_kuis, id_user, waktu_mulai, waktu_kirim, skor, status FROM quiz_attempts WHERE id_percobaan = ?',
    [attemptId]
  );

  if (!attempt) return null;

  // Get quiz info
  const quiz = await queryOne(
    'SELECT id_kuis, judul, durasi_menit, tampilkan_jawaban, tampilkan_pembahasan FROM quizzes WHERE id_kuis = ?',
    [attempt.id_kuis]
  );

  // Get all answers with questions
  const answers = await query(
    `SELECT qa.id_jawaban, qa.id_soal, qa.jawaban, qa.is_benar, qa.poin, q.pertanyaan, q.jenis_soal, q.kunci_jawaban, q.pembahasan
     FROM quiz_answers qa
     JOIN questions q ON qa.id_soal = q.id_soal
     WHERE qa.id_percobaan = ?`,
    [attemptId]
  );

  // Get options for multiple choice
  const answersWithOptions = await Promise.all(
    answers.map(async (a) => {
      if (a.jenis_soal === 'pilihan_ganda') {
        const options = await query(
          'SELECT id_opsi, label_opsi, teks_opsi FROM question_options WHERE id_soal = ? ORDER BY urutan',
          [a.id_soal]
        );
        return { ...a, options };
      }
      return { ...a, options: [] };
    })
  );

  // Filter pembahasan if not allowed to view
  let answersForStudent = answersWithOptions;
  if (!quiz.tampilkan_pembahasan) {
    answersForStudent = answersWithOptions.map(a => {
      const { pembahasan, ...rest } = a;
      return rest;
    });
  }

  const totalCorrect = answers.filter(a => a.is_benar).length;

  return {
    id_percobaan: attempt.id_percobaan,
    id_kuis: attempt.id_kuis,
    judul_kuis: quiz.judul,
    waktu_mulai: attempt.waktu_mulai,
    waktu_kirim: attempt.waktu_kirim,
    skor: attempt.skor,
    total_questions: answers.length,
    total_correct: totalCorrect,
    answers: answersForStudent
  };
}

// Get results
export async function getResults(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id_user;

    // Get attempt
    const attempt = await queryOne(
      'SELECT id_percobaan, status FROM quiz_attempts WHERE id_percobaan = ? AND id_user = ?',
      [id, userId]
    );

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Hasil tidak ditemukan',
        data: null
      });
    }

    if (attempt.status !== 'graded') {
      return res.status(400).json({
        success: false,
        message: 'Kuis belum selesai dinilai',
        data: null
      });
    }

    const result = await getQuizResult(id);

    res.json({
      success: true,
      message: 'Hasil kuis berhasil diambil',
      data: result
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil hasil',
      data: null
    });
  }
}

// Get user's quiz attempts (for history)
export async function getUserAttempts(req, res) {
  try {
    const { quizId } = req.params;
    const userId = req.user.id_user;

    const attempts = await query(
      `SELECT id_percobaan, id_kuis, waktu_mulai, waktu_kirim, skor, status
       FROM quiz_attempts
       WHERE id_kuis = ? AND id_user = ?
       ORDER BY waktu_mulai DESC`,
      [quizId, userId]
    );

    res.json({
      success: true,
      message: 'Riwayat percobaan berhasil diambil',
      data: attempts
    });
  } catch (error) {
    console.error('Get user attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil riwayat',
      data: null
    });
  }
}
