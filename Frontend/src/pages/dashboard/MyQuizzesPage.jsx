import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  Calendar,
  Play,
  CheckCircle,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { quizAPI, classAPI } from '../../utils/api';
import { toast } from '../../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function MyQuizzesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [myClasses, setMyClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch classes user is in
      // Backend: GET /api/classes → { success, data: { classes: [], pagination: {} } }
      const classesRes = await classAPI.getAll();

      let userClasses = [];
      if (classesRes?.success) {
        userClasses = classesRes.data?.classes || classesRes.data || [];
        if (!Array.isArray(userClasses)) userClasses = [];
      }
      setMyClasses(userClasses);

      if (userClasses.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch quizzes from each class
      // Backend: GET /api/quizzes/classes/:classId → { success, data: { quizzes: [], pagination: {} } }
      const allQuizzes = [];
      for (const cls of userClasses) {
        try {
          const quizRes = await quizAPI.getByClass(cls.id_kelas);
          if (quizRes?.success) {
            const clsQuizzes = quizRes.data?.quizzes || quizRes.data || [];
            const withClass = (Array.isArray(clsQuizzes) ? clsQuizzes : []).map((q) => ({
              ...q,
              nama_kelas: cls.nama_kelas,
              kode_kelas: cls.kode_kelas,
              id_kelas: cls.id_kelas,
            }));
            allQuizzes.push(...withClass);
          }
        } catch (err) {
          console.warn(`Failed to load quizzes for class ${cls.id_kelas}:`, err);
        }
      }

      setQuizzes(allQuizzes);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error?.message || 'Gagal memuat data kuis');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (quizId) => {
    navigate(`/dashboard/quizzes/${quizId}`);
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchSearch = quiz.judul?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = filterClass === 'all' || String(quiz.id_kelas) === String(filterClass);
    return matchSearch && matchClass;
  });

  const getQuizStatus = (quiz) => {
    if (quiz.status !== 'published') {
      return { label: 'Belum Tersedia', color: 'gray', available: false };
    }
    const now = new Date();
    const start = quiz.waktu_mulai ? new Date(quiz.waktu_mulai) : null;
    const end = quiz.waktu_selesai ? new Date(quiz.waktu_selesai) : null;

    if (start && now < start) return { label: 'Akan Datang', color: 'blue', available: false };
    if (end && now > end) return { label: 'Sudah Berakhir', color: 'red', available: false };
    return { label: 'Tersedia', color: 'green', available: true };
  };

  const statusColorMap = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-slate-100 text-slate-600',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Memuat kuis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Kuis Terdaftar</h1>
          <p className="text-sm text-slate-500 mt-1">Kuis dari kelas yang Anda ikuti</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-semibold"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-50">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-slate-600">Total Kuis</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{quizzes.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-50">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-slate-600">Tersedia</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {quizzes.filter((q) => getQuizStatus(q).available).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-50">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-slate-600">Kelas Diikuti</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{myClasses.length}</p>
        </div>
      </div>

      {/* Filters */}
      {quizzes.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kuis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="all">Semua Kelas</option>
                {myClasses.map((cls) => (
                  <option key={cls.id_kelas} value={cls.id_kelas}>
                    {cls.nama_kelas}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Quizzes Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuizzes.map((quiz) => {
            const statusInfo = getQuizStatus(quiz);
            const end = quiz.waktu_selesai ? new Date(quiz.waktu_selesai) : null;

            return (
              <div
                key={quiz.id_kuis}
                className="bg-white rounded-xl border-2 border-slate-200 hover:border-purple-300 p-6 hover:shadow-lg transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${statusColorMap[statusInfo.color]}`}
                    >
                      {statusInfo.label}
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 mb-1 leading-tight">
                      {quiz.judul}
                    </h3>
                    <p className="text-sm text-purple-600 font-semibold mb-2">{quiz.nama_kelas}</p>
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {quiz.deskripsi || 'Tidak ada deskripsi'}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>{quiz.durasi_menit} menit</span>
                  </div>
                  {end && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span>s/d {end.toLocaleDateString('id-ID')}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  variant={statusInfo.available ? 'primary' : 'outline'}
                  icon={statusInfo.available ? Play : AlertCircle}
                  className="w-full"
                  disabled={!statusInfo.available}
                  onClick={() => statusInfo.available && handleStartQuiz(quiz.id_kuis)}
                >
                  {statusInfo.available ? 'Lihat & Mulai Kuis' : statusInfo.label}
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {myClasses.length === 0 ? 'Belum bergabung kelas' : 'Belum ada kuis'}
          </h3>
          <p className="text-slate-500 mb-6">
            {myClasses.length === 0
              ? 'Bergabung ke kelas untuk melihat kuis yang tersedia'
              : 'Belum ada kuis yang dipublikasikan di kelas Anda'}
          </p>
          <Button
            variant="primary"
            onClick={() => navigate(myClasses.length === 0 ? '/dashboard/classes' : '/dashboard/classes')}
          >
            {myClasses.length === 0 ? 'Cari Kelas' : 'Lihat Kelas'}
          </Button>
        </div>
      )}
    </div>
  );
}
