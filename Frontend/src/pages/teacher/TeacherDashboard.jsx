import React from 'react';
import {
  BookOpen,
  Users,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Plus,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Kuis Saya',
      value: '12',
      change: '+3 bulan ini',
      icon: BookOpen,
      color: 'purple',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
    },
    {
      title: 'Kelas Aktif',
      value: '5',
      change: '48 siswa total',
      icon: Users,
      color: 'blue',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      title: 'Quiz Attempts',
      value: '234',
      change: '+18% minggu ini',
      icon: BarChart3,
      color: 'green',
      bg: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
    },
    {
      title: 'Rata-rata Nilai',
      value: '78%',
      change: '+5% dari bulan lalu',
      icon: TrendingUp,
      color: 'orange',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
    },
  ];

  const recentQuizzes = [
    {
      id: 1,
      title: 'Matematika Kelas 10 - Trigonometri',
      class: 'Kelas 10A',
      attempts: 24,
      avg_score: 82,
      status: 'active',
      created: '2 hari lalu',
    },
    {
      id: 2,
      title: 'Bahasa Inggris - Grammar Quiz',
      class: 'Kelas 11B',
      attempts: 18,
      avg_score: 75,
      status: 'active',
      created: '5 hari lalu',
    },
    {
      id: 3,
      title: 'IPA - Sistem Pencernaan',
      class: 'Kelas 9A',
      attempts: 31,
      avg_score: 88,
      status: 'completed',
      created: '1 minggu lalu',
    },
  ];

  const recentClasses = [
    { id: 1, name: 'Kelas 10A - Matematika', students: 32, quizzes: 8, code: 'MTK10A' },
    { id: 2, name: 'Kelas 11B - Bahasa Inggris', students: 28, quizzes: 6, code: 'ENG11B' },
    { id: 3, name: 'Kelas 9A - IPA', students: 30, quizzes: 10, code: 'IPA9A' },
  ];

  const upcomingDeadlines = [
    {
      title: 'Quiz Matematika Chapter 5',
      class: 'Kelas 10A',
      deadline: '2024-03-20',
      remaining: '2 hari',
    },
    {
      title: 'English Grammar Test',
      class: 'Kelas 11B',
      deadline: '2024-03-22',
      remaining: '4 hari',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard Teacher
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Selamat datang kembali! Kelola kuis dan kelas Anda.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/teacher/quizzes?action=create')}
        >
          Buat Kuis Baru
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quizzes - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Kuis Terbaru</h2>
            <button
              onClick={() => navigate('/teacher/quizzes')}
              className="text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {recentQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    quiz.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.class}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {quiz.attempts}
                      </p>
                      <p className="text-xs text-gray-500">attempts</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {quiz.avg_score}%
                      </p>
                      <p className="text-xs text-gray-500">avg score</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{quiz.created}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Deadline Mendatang
            </h2>
          </div>

          <div className="space-y-4">
            {upcomingDeadlines.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.class}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                      <span className="text-orange-600 dark:text-orange-400 font-medium">
                        {item.remaining}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Classes Overview */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Kelas Saya</h2>
          <button
            onClick={() => navigate('/teacher/classes')}
            className="text-sm font-semibold text-purple-600 hover:text-purple-700"
          >
            Kelola Kelas
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentClasses.map((cls) => (
            <div
              key={cls.id}
              className="p-5 rounded-lg border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{cls.name}</h3>
                <span className="px-2 py-1 rounded-md bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 text-xs font-mono font-semibold">
                  {cls.code}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{cls.students}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{cls.quizzes} kuis</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
