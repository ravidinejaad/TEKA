import React from 'react';
import {
  Users,
  BookOpen,
  FolderTree,
  TrendingUp,
  Activity,
  UserCheck,
  UserPlus,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Pengguna',
      value: '2,543',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'purple',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
    },
    {
      title: 'Total Kuis',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: BookOpen,
      color: 'blue',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      title: 'Kategori',
      value: '45',
      change: '+2',
      trend: 'up',
      icon: FolderTree,
      color: 'green',
      bg: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
    },
    {
      title: 'Aktivitas Hari Ini',
      value: '890',
      change: '-3.1%',
      trend: 'down',
      icon: Activity,
      color: 'orange',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
    },
  ];

  const recentUsers = [
    { name: 'Ahmad Fauzi', email: 'ahmad@example.com', role: 'student', date: '2 menit lalu' },
    { name: 'Siti Nurhaliza', email: 'siti@example.com', role: 'teacher', date: '15 menit lalu' },
    { name: 'Budi Santoso', email: 'budi@example.com', role: 'student', date: '1 jam lalu' },
    { name: 'Dewi Lestari', email: 'dewi@example.com', role: 'student', date: '2 jam lalu' },
    { name: 'Eko Prasetyo', email: 'eko@example.com', role: 'teacher', date: '3 jam lalu' },
  ];

  const recentActivity = [
    { action: 'Kuis baru dibuat', user: 'Budi Santoso', time: '5 menit lalu', type: 'create' },
    { action: 'User mendaftar', user: 'Ahmad Fauzi', time: '10 menit lalu', type: 'register' },
    { action: 'Kategori diupdate', user: 'Admin', time: '30 menit lalu', type: 'update' },
    { action: 'Kuis diselesaikan', user: 'Siti Nurhaliza', time: '1 jam lalu', type: 'complete' },
    { action: 'User login', user: 'Dewi Lestari', time: '2 jam lalu', type: 'login' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard Admin</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Selamat datang kembali! Berikut ringkasan sistem Anda.
        </p>
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
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Pengguna Terbaru
            </h2>
            <button className="text-sm font-semibold text-purple-600 hover:text-purple-700">
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold flex-shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'teacher'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {user.role}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Aktivitas Terkini
            </h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'create'
                      ? 'bg-green-500'
                      : activity.type === 'register'
                      ? 'bg-blue-500'
                      : activity.type === 'update'
                      ? 'bg-purple-500'
                      : activity.type === 'complete'
                      ? 'bg-orange-500'
                      : 'bg-gray-500'
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    <span className="font-semibold">{activity.user}</span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Statistik Pengguna (30 Hari Terakhir)
          </h2>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>

        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Chart akan ditampilkan di sini</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Integrasi dengan library charting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
