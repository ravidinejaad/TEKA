import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  Clock,
  Users,
  BarChart3,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { toast } from '../../components/ui/Toast';

export default function AdminQuizzesPage() {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllQuizzes({ limit: 100 });
      if (response.success) {
        setQuizzes(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Gagal memuat data kuis');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId, quizTitle) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kuis "${quizTitle}"?`)) {
      return;
    }

    try {
      const response = await adminAPI.deleteQuiz(quizId);
      if (response.success) {
        toast.success('Kuis berhasil dihapus');
        fetchQuizzes();
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error(error.message || 'Gagal menghapus kuis');
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchSearch = quiz.judul?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || quiz.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      published: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        label: 'Published',
      },
      draft: {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-300',
        label: 'Draft',
      },
      closed: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        label: 'Closed',
      },
    };
    return styles[status] || styles.draft;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Memuat data kuis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Semua Kuis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola dan monitor semua kuis di sistem
          </p>
        </div>
        <button
          onClick={fetchQuizzes}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Kuis</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{quizzes.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {quizzes.filter((q) => q.status === 'published').length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Draft</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {quizzes.filter((q) => q.status === 'draft').length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Closed</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {quizzes.filter((q) => q.status === 'closed').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul kuis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Judul Kuis
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Durasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Dibuat
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredQuizzes.map((quiz) => {
                const statusBadge = getStatusBadge(quiz.status);
                return (
                  <tr
                    key={quiz.id_kuis}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {quiz.judul}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {quiz.deskripsi || 'Tidak ada deskripsi'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}
                      >
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {quiz.durasi_menit} menit
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(quiz.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id_kuis, quiz.judul)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Tidak ada kuis
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || filterStatus !== 'all'
                ? 'Tidak ada kuis yang cocok dengan filter'
                : 'Belum ada kuis di sistem'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
