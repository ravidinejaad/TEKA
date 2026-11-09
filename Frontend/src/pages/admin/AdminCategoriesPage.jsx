import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Search,
  BookOpen,
  Tag,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { categoryAPI } from '../../utils/api';
import { toast } from '../../components/ui/Toast';

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    nama_kategori: '',
    deskripsi: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryAPI.getAll({ limit: 100 });
      if (response.success) {
        setCategories(response.data?.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Gagal memuat data kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setModalMode('add');
    setSelectedCategory(null);
    setFormData({
      nama_kategori: '',
      deskripsi: '',
    });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setFormData({
      nama_kategori: category.nama_kategori,
      deskripsi: category.deskripsi || '',
    });
    setShowModal(true);
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kategori "${categoryName}"?`)) {
      return;
    }

    try {
      const response = await categoryAPI.delete(categoryId);
      if (response.success) {
        toast.success('Kategori berhasil dihapus');
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Gagal menghapus kategori');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama_kategori.trim()) {
      toast.error('Nama kategori harus diisi');
      return;
    }

    try {
      let response;
      if (modalMode === 'add') {
        response = await categoryAPI.create(formData);
      } else {
        response = await categoryAPI.update(selectedCategory.id_kategori, formData);
      }

      if (response.success) {
        toast.success(
          modalMode === 'add' ? 'Kategori berhasil ditambahkan' : 'Kategori berhasil diupdate'
        );
        setShowModal(false);
        fetchCategories();
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Gagal menyimpan kategori');
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.nama_kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const colorClasses = [
    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  ];

  const getColorClass = (index) => colorClasses[index % colorClasses.length];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Memuat data kategori...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Kelola Kategori</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Atur kategori kuis untuk organisasi yang lebih baik
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <Button variant="primary" icon={Plus} onClick={handleAddCategory} className="w-full sm:w-auto">
            Tambah Kategori
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <FolderTree className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Kategori</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {categories.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Hasil Pencarian</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {filteredCategories.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
          </div>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">Aktif</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <div
            key={category.id_kategori}
            className={`rounded-xl border-2 p-6 hover:shadow-lg transition-all ${getColorClass(index)}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`p-3 rounded-lg ${getColorClass(index).split(' ')[0].replace('100', '200').replace('900/30', '800')}`}>
                  <FolderTree className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{category.nama_kategori}</h3>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    handleDeleteCategory(category.id_kategori, category.nama_kategori)
                  }
                  className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition-colors text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm opacity-90 line-clamp-3 min-h-[4rem]">
              {category.deskripsi || 'Tidak ada deskripsi'}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-current/20">
              <p className="text-xs opacity-75">
                {new Date(category.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <span className="text-xs font-semibold opacity-75">ID: {category.id_kategori}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <FolderTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {searchQuery ? 'Kategori tidak ditemukan' : 'Belum ada kategori'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery
              ? 'Tidak ada kategori yang cocok dengan pencarian Anda'
              : 'Mulai dengan menambahkan kategori pertama Anda'}
          </p>
          {!searchQuery && (
            <Button variant="primary" icon={Plus} onClick={handleAddCategory}>
              Tambah Kategori Baru
            </Button>
          )}
        </div>
      )}

      {/* Modal Add/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {modalMode === 'add' ? 'Tambah Kategori' : 'Edit Kategori'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Kategori"
                value={formData.nama_kategori}
                onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })}
                placeholder="Contoh: Matematika"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Deskripsi kategori (opsional)"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" variant="primary" icon={Save} className="flex-1">
                  {modalMode === 'add' ? 'Tambah' : 'Update'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
