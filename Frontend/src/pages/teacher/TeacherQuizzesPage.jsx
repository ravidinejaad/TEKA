import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  Eye,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import Button from '../../components/ui/Button';

export default function TeacherQuizzesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock data - akan diganti dengan API call
  const quizzes = [
    {
      id_kuis: 1,
      judul_kuis: 'Matematika Kelas 10 - Trigonometri',
      deskripsi: 'Quiz tentang dasar-dasar trigonometri',
      id_kategori: 1,
      kategori: 'Matematika',
      durasi: 45,
      jumlah_soal: 20,
      attempts: 24,
      avg_score: 82,
      status: 'active',
      created_at: '2024-02-15',
    },
    {
      id_kuis: 2,
      judul_kuis: 'Bahasa Inggris - Grammar Quiz',
      deskripsi: 'Test your grammar knowledge',
      id_kategori: 2,
      kategori: 'Bahasa Inggris',
      durasi: 30,
      jumlah_soal: 15,
      attempts: 18,
      avg_score: 75,
      status: 'active',
      created_at: '2024-02-10',
    },
    {
      id_kuis: 3,
      judul_kuis: 'IPA - Sistem Pencernaan',
      deskripsi: 'Quiz tentang sistem pencernaan manusia',
      id_kategori: 3,
      kategori: 'IPA',
      durasi: 40,
      jumlah_soal: 25,
      attempts: 31,
      avg_score: 88,
      status: 'completed',
      created_at: '2024-02-05',
    },
    {
      id_kuis: 4,
      judul_kuis: 'Sejarah Indonesia - Kemerdekaan',
      deskripsi: 'Perjuangan kemerdekaan Indonesia',
      id_kategori: 4,
      kategori: 'Sejarah',
      durasi: 35,
      jumlah_soal: 18,
      attempts: 0,
      avg_score: 0,
      status: 'draft',
      created_at: '2024-03-01',
    },
  ];

  const categories = [
    { id: 1, name: 'Matematika' },
    { id: 2, name: 'Bahasa Inggris' },
    { id: 3, name: 'IPA' },
    { id: 4, name: 'Sejarah' },
  ];

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchSearch = quiz.judul_kuis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || quiz.status === filterStatus;
    const matchCategory =
      filterCategory === 'all' || quiz.id_kategori === parseInt(filterCategory);
    return matchSearch && matchStatus && matchCategory;
  });

  const getStatusBadge = (status) => {
    const styles = {
      active: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        label: 'Aktif',
      },
      draft: {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-300',
        label: 'Draft',
      },
      completed: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        label: 'Selesai',
      },
    };
    return styles[status] || styles.draft;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Kelola Kuis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Buat, edit, dan kelola kuis untuk siswa Anda
          </p>
        </div>
        <Button variant="primary" icon={Plus} className="w-full sm:w-auto">
          Buat Kuis Baru
        </Button>
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
            <p className="text-sm text-gray-600 dark:text-gray-400">Kuis Aktif</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {quizzes.filter((q) => q.status === 'active').length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Attempts</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {quizzes.reduce((sum, q) => sum + q.attempts, 0)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Draft</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {quizzes.filter((q) => q.status === 'draft').length}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
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

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="draft">Draft</option>
              <option value="completed">Selesai</option>
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredQuizzes.map((quiz) => {
          const statusBadge = getStatusBadge(quiz.status);
          return (
            <div
              key={quiz.id_kuis}
              className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}
                    >
                      {statusBadge.label}
                    </span>
                    <span className="inline-block px-2 py-1 rounded-md text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {quiz.kategori}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">
                    {quiz.judul_kuis}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {quiz.deskripsi}
                  </p>
                </div>
              </div>

              {/* Quiz Info */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{quiz.durasi} menit</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{quiz.jumlah_soal} soal</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {new Date(quiz.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>

              {/* Stats */}
              {quiz.attempts > 0 ? (
                <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Attempts</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {quiz.attempts}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Score</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {quiz.avg_score}%
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-orange-700 dark:text-orange-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Belum ada siswa yang mengerjakan
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button variant="outline" size="sm" icon={Eye} className="flex-1">
                  Preview
                </Button>
                <Button variant="outline" size="sm" icon={BarChart3} className="flex-1">
                  Hasil
                </Button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Belum ada kuis
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Mulai buat kuis pertama Anda untuk siswa
          </p>
          <Button variant="primary" icon={Plus}>
            Buat Kuis Baru
          </Button>
        </div>
      )}
    </div>
  );
}
