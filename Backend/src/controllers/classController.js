import { query, queryOne, transaction } from '../database/connection.js';
import { generateRandomCode } from '../utils/stringUtils.js';

// Create class (teacher only)
export async function createClass(req, res) {
  try {
    const teacherId = req.user.id_user;
    const { nama_kelas, deskripsi, id_kategori } = req.body;

    // Generate unique class code
    let kode_kelas;
    let isUnique = false;
    while (!isUnique) {
      kode_kelas = generateRandomCode(6);
      const existing = await queryOne(
        'SELECT id_kelas FROM classes WHERE kode_kelas = ?',
        [kode_kelas]
      );
      if (!existing) {
        isUnique = true;
      }
    }

    // Create class
    const result = await query(
      'INSERT INTO classes (id_pengajar, nama_kelas, kode_kelas, deskripsi, id_kategori) VALUES (?, ?, ?, ?, ?)',
      [teacherId, nama_kelas, kode_kelas, deskripsi || null, id_kategori || null]
    );

    res.status(201).json({
      success: true,
      message: 'Kelas berhasil dibuat',
      data: {
        id_kelas: result.insertId,
        id_pengajar: teacherId,
        nama_kelas,
        kode_kelas,
        deskripsi: deskripsi || null,
        id_kategori: id_kategori || null
      }
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat kelas',
      data: null
    });
  }
}

// Get user's classes
export async function getUserClasses(req, res) {
  try {
    const userId = req.user.id_user;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit) || 10);
    const offset = (pageNum - 1) * limitNum;

    let sql, params;

    if (req.user.role === 'teacher') {
      // Teacher sees their own classes
      sql = 'SELECT c.id_kelas, c.nama_kelas, c.kode_kelas, c.deskripsi, c.id_kategori, c.created_at FROM classes c WHERE c.id_pengajar = ? ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
      params = [userId, limitNum, offset];
    } else {
      // Student sees classes they're a member of
      sql = `SELECT c.id_kelas, c.nama_kelas, c.kode_kelas, c.deskripsi, c.id_kategori, c.id_pengajar, c.created_at 
             FROM classes c 
             JOIN class_members cm ON c.id_kelas = cm.id_kelas 
             WHERE cm.id_user = ? 
             ORDER BY c.created_at DESC 
             LIMIT ? OFFSET ?`;
      params = [userId, limitNum, offset];
    }

    const classes = await query(sql, params);

    res.json({
      success: true,
      message: 'Daftar kelas berhasil diambil',
      data: {
        classes,
        pagination: {
          current_page: pageNum,
          per_page: limitNum
        }
      }
    });
  } catch (error) {
    console.error('Get user classes error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil daftar kelas',
      data: null
    });
  }
}

// Get class detail
export async function getClassDetail(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id_user;

    const classData = await queryOne(
      'SELECT id_kelas, id_pengajar, nama_kelas, kode_kelas, deskripsi, id_kategori, created_at FROM classes WHERE id_kelas = ?',
      [id]
    );

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Kelas tidak ditemukan',
        data: null
      });
    }

    // Check access: teacher or student member
    if (req.user.role === 'teacher' && classData.id_pengajar !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke kelas ini',
        data: null
      });
    }

    if (req.user.role === 'student') {
      const isMember = await queryOne(
        'SELECT id_anggota FROM class_members WHERE id_kelas = ? AND id_user = ?',
        [id, userId]
      );
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'Anda bukan anggota kelas ini',
          data: null
        });
      }
    }

    res.json({
      success: true,
      message: 'Detail kelas berhasil diambil',
      data: classData
    });
  } catch (error) {
    console.error('Get class detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil detail kelas',
      data: null
    });
  }
}

// Update class (teacher only)
export async function updateClass(req, res) {
  try {
    const { id } = req.params;
    const teacherId = req.user.id_user;
    const { nama_kelas, deskripsi, id_kategori } = req.body;

    // Check if class exists and belongs to teacher
    const classData = await queryOne(
      'SELECT id_pengajar FROM classes WHERE id_kelas = ?',
      [id]
    );

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Kelas tidak ditemukan',
        data: null
      });
    }

    if (classData.id_pengajar !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengubah kelas ini',
        data: null
      });
    }

    // Update class
    const updates = [];
    const values = [];

    if (nama_kelas) {
      updates.push('nama_kelas = ?');
      values.push(nama_kelas);
    }
    if (deskripsi !== undefined) {
      updates.push('deskripsi = ?');
      values.push(deskripsi || null);
    }
    if (id_kategori !== undefined) {
      updates.push('id_kategori = ?');
      values.push(id_kategori || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada data yang diupdate',
        data: null
      });
    }

    values.push(id);

    await query(
      `UPDATE classes SET ${updates.join(', ')} WHERE id_kelas = ?`,
      values
    );

    const updatedClass = await queryOne(
      'SELECT id_kelas, nama_kelas, kode_kelas, deskripsi, id_kategori FROM classes WHERE id_kelas = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Kelas berhasil diupdate',
      data: updatedClass
    });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate kelas',
      data: null
    });
  }
}

// Delete class (teacher only)
export async function deleteClass(req, res) {
  try {
    const { id } = req.params;
    const teacherId = req.user.id_user;

    // Check if class exists and belongs to teacher
    const classData = await queryOne(
      'SELECT id_pengajar FROM classes WHERE id_kelas = ?',
      [id]
    );

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Kelas tidak ditemukan',
        data: null
      });
    }

    if (classData.id_pengajar !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk menghapus kelas ini',
        data: null
      });
    }

    // Delete class
    await query(
      'DELETE FROM classes WHERE id_kelas = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Kelas berhasil dihapus',
      data: null
    });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus kelas',
      data: null
    });
  }
}

// Join class with code (student only)
export async function joinClass(req, res) {
  try {
    const studentId = req.user.id_user;
    const { kode_kelas } = req.body;

    // Find class by code
    const classData = await queryOne(
      'SELECT id_kelas FROM classes WHERE kode_kelas = ?',
      [kode_kelas]
    );

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Kode kelas tidak ditemukan',
        data: null
      });
    }

    // Check if already member
    const existingMember = await queryOne(
      'SELECT id_anggota FROM class_members WHERE id_kelas = ? AND id_user = ?',
      [classData.id_kelas, studentId]
    );

    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: 'Anda sudah menjadi anggota kelas ini',
        data: null
      });
    }

    // Add to class
    await query(
      'INSERT INTO class_members (id_kelas, id_user) VALUES (?, ?)',
      [classData.id_kelas, studentId]
    );

    res.status(201).json({
      success: true,
      message: 'Berhasil bergabung dengan kelas',
      data: {
        id_kelas: classData.id_kelas
      }
    });
  } catch (error) {
    console.error('Join class error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat bergabung dengan kelas',
      data: null
    });
  }
}

// Get class members (teacher only)
export async function getClassMembers(req, res) {
  try {
    const { id } = req.params;
    const teacherId = req.user.id_user;
    const { page = 1, limit = 10 } = req.query;

    // Check if class belongs to teacher
    const classData = await queryOne(
      'SELECT id_pengajar FROM classes WHERE id_kelas = ?',
      [id]
    );

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Kelas tidak ditemukan',
        data: null
      });
    }

    if (classData.id_pengajar !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke kelas ini',
        data: null
      });
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit) || 10);
    const offset = (pageNum - 1) * limitNum;

    // Get members
    const members = await query(
      `SELECT cm.id_anggota, u.id_user, u.nama, u.email, cm.tanggal_gabung 
       FROM class_members cm 
       JOIN users u ON cm.id_user = u.id_user 
       WHERE cm.id_kelas = ? 
       ORDER BY cm.tanggal_gabung DESC 
       LIMIT ? OFFSET ?`,
      [id, limitNum, offset]
    );

    // Get count
    const countResult = await queryOne(
      'SELECT COUNT(*) as total FROM class_members WHERE id_kelas = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Daftar anggota kelas berhasil diambil',
      data: {
        members,
        pagination: {
          current_page: pageNum,
          per_page: limitNum,
          total: countResult.total,
          total_pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get class members error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil daftar anggota',
      data: null
    });
  }
}

// Remove class member (teacher only)
export async function removeClassMember(req, res) {
  try {
    const { id, memberId } = req.params;
    const teacherId = req.user.id_user;

    // Check if class belongs to teacher
    const classData = await queryOne(
      'SELECT id_pengajar FROM classes WHERE id_kelas = ?',
      [id]
    );

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Kelas tidak ditemukan',
        data: null
      });
    }

    if (classData.id_pengajar !== teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke kelas ini',
        data: null
      });
    }

    // Check if member exists
    const member = await queryOne(
      'SELECT id_anggota FROM class_members WHERE id_anggota = ? AND id_kelas = ?',
      [memberId, id]
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Anggota tidak ditemukan',
        data: null
      });
    }

    // Remove member
    await query(
      'DELETE FROM class_members WHERE id_anggota = ?',
      [memberId]
    );

    res.json({
      success: true,
      message: 'Anggota berhasil dihapus dari kelas',
      data: null
    });
  } catch (error) {
    console.error('Remove class member error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus anggota',
      data: null
    });
  }
}
