import { query, queryOne } from '../database/connection.js';

// Get user notifications
export async function getUserNotifications(req, res) {
  try {
    const userId = req.user.id_user;
    const { page = 1, limit = 10, terbaca } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit) || 10);
    const offset = (pageNum - 1) * limitNum;

    let whereConditions = ['n.id_user = ?'];
    let params = [userId];

    if (terbaca !== undefined) {
      whereConditions.push('n.terbaca = ?');
      params.push(terbaca === 'true');
    }

    const whereClause = whereConditions.join(' AND ');

    // Get count
    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM notifications n WHERE ${whereClause}`,
      params
    );

    // Get notifications
    const notifications = await query(
      `SELECT id_notifikasi, judul, pesan, tipe, terbaca, created_at 
       FROM notifications n 
       WHERE ${whereClause}
       ORDER BY n.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    res.json({
      success: true,
      message: 'Notifikasi berhasil diambil',
      data: {
        notifications,
        pagination: {
          current_page: pageNum,
          per_page: limitNum,
          total: countResult.total,
          total_pages: Math.ceil(countResult.total / limitNum),
          unread_count: await getUnreadCount(userId)
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil notifikasi',
      data: null
    });
  }
}

// Helper: Get unread count
async function getUnreadCount(userId) {
  const result = await queryOne(
    'SELECT COUNT(*) as total FROM notifications WHERE id_user = ? AND terbaca = ?',
    [userId, false]
  );
  return result.total || 0;
}

// Get unread count
export async function getUnreadCount_(req, res) {
  try {
    const userId = req.user.id_user;
    const unreadCount = await getUnreadCount(userId);

    res.json({
      success: true,
      message: 'Jumlah notifikasi belum dibaca',
      data: {
        unread_count: unreadCount
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan',
      data: null
    });
  }
}

// Mark notification as read
export async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id_user;

    // Check ownership
    const notification = await queryOne(
      'SELECT id_notifikasi FROM notifications WHERE id_notifikasi = ? AND id_user = ?',
      [id, userId]
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notifikasi tidak ditemukan',
        data: null
      });
    }

    // Update
    await query(
      'UPDATE notifications SET terbaca = ? WHERE id_notifikasi = ?',
      [true, id]
    );

    res.json({
      success: true,
      message: 'Notifikasi berhasil ditandai sebagai dibaca',
      data: null
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menandai notifikasi',
      data: null
    });
  }
}

// Mark all as read
export async function markAllAsRead(req, res) {
  try {
    const userId = req.user.id_user;

    await query(
      'UPDATE notifications SET terbaca = ? WHERE id_user = ? AND terbaca = ?',
      [true, userId, false]
    );

    res.json({
      success: true,
      message: 'Semua notifikasi berhasil ditandai sebagai dibaca',
      data: null
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menandai notifikasi',
      data: null
    });
  }
}

// Delete notification
export async function deleteNotification(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id_user;

    // Check ownership
    const notification = await queryOne(
      'SELECT id_notifikasi FROM notifications WHERE id_notifikasi = ? AND id_user = ?',
      [id, userId]
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notifikasi tidak ditemukan',
        data: null
      });
    }

    // Delete
    await query(
      'DELETE FROM notifications WHERE id_notifikasi = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Notifikasi berhasil dihapus',
      data: null
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus notifikasi',
      data: null
    });
  }
}

// Helper: Create notification
export async function createNotification(userId, judul, pesan, tipe = 'pengumuman') {
  try {
    await query(
      'INSERT INTO notifications (id_user, judul, pesan, tipe) VALUES (?, ?, ?, ?)',
      [userId, judul, pesan, tipe]
    );
  } catch (error) {
    console.error('Create notification error:', error);
  }
}

// Helper: Create notification for class
export async function createClassNotification(classId, judul, pesan, tipe = 'pengumuman') {
  try {
    // Get all members of class
    const members = await query(
      'SELECT id_user FROM class_members WHERE id_kelas = ?',
      [classId]
    );

    // Create notification for each member
    for (const member of members) {
      await createNotification(member.id_user, judul, pesan, tipe);
    }
  } catch (error) {
    console.error('Create class notification error:', error);
  }
}

// Helper: Create notification for quiz participants
export async function createQuizNotification(quizId, judul, pesan, tipe = 'quiz_baru') {
  try {
    // Get all members of the quiz's class
    const quiz = await queryOne(
      'SELECT id_kelas FROM quizzes WHERE id_kuis = ?',
      [quizId]
    );

    if (!quiz) return;

    const members = await query(
      'SELECT id_user FROM class_members WHERE id_kelas = ?',
      [quiz.id_kelas]
    );

    // Create notification for each member
    for (const member of members) {
      await createNotification(member.id_user, judul, pesan, tipe);
    }
  } catch (error) {
    console.error('Create quiz notification error:', error);
  }
}
