import { query, queryOne } from '../database/connection.js';

// Get all categories
export async function getAllCategories(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Get total count
    const countResult = await queryOne(
      'SELECT COUNT(*) as total FROM categories'
    );

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit) || 10);
    const offset = (pageNum - 1) * limitNum;

    // Get categories
    const categories = await query(
      'SELECT id_kategori, nama_kategori, deskripsi, created_at FROM categories LIMIT ? OFFSET ?',
      [limitNum, offset]
    );

    res.json({
      success: true,
      message: 'Daftar kategori berhasil diambil',
      data: {
        categories,
        pagination: {
          current_page: pageNum,
          per_page: limitNum,
          total: countResult.total,
          total_pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil daftar kategori',
      data: null
    });
  }
}

// Get category by ID
export async function getCategoryById(req, res) {
  try {
    const { id } = req.params;

    const category = await queryOne(
      'SELECT id_kategori, nama_kategori, deskripsi, created_at FROM categories WHERE id_kategori = ?',
      [id]
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Kategori berhasil diambil',
      data: category
    });
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil kategori',
      data: null
    });
  }
}

// Create category (admin only)
export async function createCategory(req, res) {
  try {
    const { nama_kategori, deskripsi } = req.body;

    // Check if category already exists
    const existingCategory = await queryOne(
      'SELECT id_kategori FROM categories WHERE nama_kategori = ?',
      [nama_kategori]
    );

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Kategori sudah ada',
        data: null
      });
    }

    // Insert category
    const result = await query(
      'INSERT INTO categories (nama_kategori, deskripsi) VALUES (?, ?)',
      [nama_kategori, deskripsi || null]
    );

    res.status(201).json({
      success: true,
      message: 'Kategori berhasil dibuat',
      data: {
        id_kategori: result.insertId,
        nama_kategori,
        deskripsi: deskripsi || null
      }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat kategori',
      data: null
    });
  }
}

// Update category (admin only)
export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { nama_kategori, deskripsi } = req.body;

    // Check if category exists
    const category = await queryOne(
      'SELECT id_kategori FROM categories WHERE id_kategori = ?',
      [id]
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
        data: null
      });
    }

    // Check if new name already exists
    if (nama_kategori) {
      const existingCategory = await queryOne(
        'SELECT id_kategori FROM categories WHERE nama_kategori = ? AND id_kategori != ?',
        [nama_kategori, id]
      );

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: 'Nama kategori sudah digunakan',
          data: null
        });
      }
    }

    // Update category
    const updates = [];
    const values = [];

    if (nama_kategori) {
      updates.push('nama_kategori = ?');
      values.push(nama_kategori);
    }
    if (deskripsi !== undefined) {
      updates.push('deskripsi = ?');
      values.push(deskripsi || null);
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
      `UPDATE categories SET ${updates.join(', ')} WHERE id_kategori = ?`,
      values
    );

    // Get updated category
    const updatedCategory = await queryOne(
      'SELECT id_kategori, nama_kategori, deskripsi FROM categories WHERE id_kategori = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Kategori berhasil diupdate',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate kategori',
      data: null
    });
  }
}

// Delete category (admin only)
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    // Check if category exists
    const category = await queryOne(
      'SELECT id_kategori FROM categories WHERE id_kategori = ?',
      [id]
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
        data: null
      });
    }

    // Delete category
    await query(
      'DELETE FROM categories WHERE id_kategori = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Kategori berhasil dihapus',
      data: null
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus kategori',
      data: null
    });
  }
}
