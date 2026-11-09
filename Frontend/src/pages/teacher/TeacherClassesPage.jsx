import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  BookOpen,
  UserPlus,
  Settings,
  Copy,
  Check,
  MoreVertical,
  Trash2,
  Edit2,
} from 'lucide-react';
import Button from '../../components/ui/Button';

export default function TeacherClassesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  // Mock data - akan diganti dengan API call
  const classes = [
    {
      id_kelas: 1,
      nama_kelas: 'Kelas 10A - Matematika',
      deskripsi: 'Matematika Dasar untuk Kelas 10',
      kode_kelas: 'MTK10A',
      student_count: 32,
      quiz_count: 8,
      created_at: '2024-01-15',
    },
    {
      id_kelas: 2,
      nama_kelas: 'Kelas 11B - Bahasa Inggris',
      deskripsi: 'English Grammar & Vocabulary',
      kode_kelas: 'ENG11B',
      student_count: 28,
      quiz_count: 6,
      created_at: '2024-01-20',
    },
    {
      id_kelas: 3,
      nama_kelas: 'Kelas 9A - IPA',
      deskripsi: 'Ilmu Pengetahuan Alam Kelas 9',
      kode_kelas: 'IPA9A',
      student_count: 30,
      quiz_count: 10,
      created_at: '2024-02-01',
    },
    {
      id_kelas: 4,
      nama_kelas: 'Kelas 12 - Persiapan UTBK',
      deskripsi: 'Persiapan UTBK Saintek',
      kode_kelas: 'UTBK12',
      student_count: 25,
      quiz_count: 15,
      created_at: '2024-01-10',
    },
  ];

  const filteredClasses = classes.filter((cls) =>
    cls.nama_kelas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Kelola Kelas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Buat dan kelola kelas untuk siswa Anda
          </p>
        </div>
        <Button variant="primary" icon={Plus} className="w-full sm:w-auto">
          Buat Kelas Baru
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Kelas</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{classes.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Siswa</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {classes.reduce((sum, cls) => sum + cls.student_count, 0)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Kuis</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {classes.reduce((sum, cls) => sum + cls.quiz_count, 0)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rata-rata Siswa</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(
              classes.reduce((sum, cls) => sum + cls.student_count, 0) / classes.length
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id_kelas}
            className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex-shrink-0">
                  <Users className="w-6 h-6 text-purple-700 dark:text-purple-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
                    {cls.nama_kelas}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {cls.deskripsi}
                  </p>
                </div>
              </div>

              {/* Action Menu */}
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors flex-shrink-0">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Class Code */}
            <div className="mb-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Kode Kelas</p>
                  <p className="font-mono font-bold text-lg text-purple-700 dark:text-purple-300">
                    {cls.kode_kelas}
                  </p>
                </div>
                <button
                  onClick={() => handleCopyCode(cls.kode_kelas)}
                  className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 transition-colors"
                >
                  {copiedCode === cls.kode_kelas ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {cls.student_count}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Siswa</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {cls.quiz_count}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Kuis</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button variant="outline" size="sm" icon={UserPlus} className="flex-1">
                Lihat Siswa
              </Button>
              <Button variant="outline" size="sm" icon={BookOpen} className="flex-1">
                Kuis
              </Button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Belum ada kelas
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Buat kelas pertama Anda dan undang siswa untuk bergabung
          </p>
          <Button variant="primary" icon={Plus}>
            Buat Kelas Baru
          </Button>
        </div>
      )}
    </div>
  );
}
