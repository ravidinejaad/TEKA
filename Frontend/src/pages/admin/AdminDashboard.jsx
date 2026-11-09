import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  FolderTree,
  Activity,
  ArrowUp,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { toast } from '../../components/ui/Toast';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    totalCategories: 0,
    todayActivity: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await adminAPI.getStats();
      if (statsRes.success) {
        setStats({
          totalUsers: statsRes.data.totalUsers || 0,
          totalQuizzes: statsRes.data.totalQuizzes || 0,
          totalCategories: statsRes.data.totalCategories || 0,
          todayActivity: statsRes.data.todayActivity || 0,
        });
      }

      // Fetch recent users (last 5)
      const usersRes = await adminAPI.getAllUsers({ 
        limit: 5, 
        sort: 'created_at', 
        order: 'DESC' 
      });
      if (usersRes.success) {
        setRecentUsers(usersRes.data || []);
      }

      // Fetch recent activity
      const activityRes = await adminAPI.getRecentActivity({ limit: 5 });
      if (activityRes.success) {
        setRecentActivity(activityRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return 'Kemarin';
    return `${diffDays} hari lalu`;
  };

  const statsCards = [
    {
      title: 'Total Pengguna',
      value: stats.totalUsers,
      icon: Users,
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
      link: '/admin/users',
    },
    {
      title: 'Total Kuis',
      value: stats.totalQuizzes,
      icon: BookOpen,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
      link: null,
    },
    {
      title: 'Kategori',
      value: stats.totalCategories,
      icon: FolderTree,
      bg: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
      link: '/admin/categories',
    },
    {
      title: 'Aktivitas Hari Ini',
      value: stats.todayActivity,
      icon: Activity,
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
      link: null,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard Admin</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Selamat datang kembali! Berikut ringkasan sistem Anda.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              onClick={() => stat.link && navigate(stat.link)}
              className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow ${
                stat.link ? 'cursor-pointer' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
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
            <button
              onClick={() => navigate('/admin/users')}
              className="text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div
                  key={user.id_user}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold flex-shrink-0">
                    {user.nama?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {user.nama}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'teacher'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : user.role === 'admin'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatTimeAgo(user.created_at)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Belum ada pengguna terbaru
              </p>
            )}
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
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={activity.id || index} className="flex items-start gap-4">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'complete'
                        ? 'bg-green-500'
                        : activity.type === 'register'
                        ? 'bg-blue-500'
                        : activity.type === 'create'
                        ? 'bg-purple-500'
                        : 'bg-gray-500'
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      <span className="font-semibold">{activity.user}</span>{' '}
                      <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatTimeAgo(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Belum ada aktivitas terbaru
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
          >
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-gray-100">Kelola Pengguna</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Lihat & edit semua user
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/categories')}
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          >
            <FolderTree className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-gray-100">Kelola Kategori</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Tambah & edit kategori
              </p>
            </div>
          </button>

          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <RefreshCw className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-gray-100">Refresh Data</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Perbarui semua statistik
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
