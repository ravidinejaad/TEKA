import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Target,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { toast } from '../../components/ui/Toast';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Gagal memuat data analitik');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Memuat data analitik...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Data analitik tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analitik Sistem</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Statistik dan insight lengkap sistem pembelajaran
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* User Analytics */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Statistik Pengguna
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.users?.total || 0}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              {analytics.users?.active || 0} aktif
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Teachers</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.users?.teachers || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Students</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.users?.students || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admins</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.users?.admins || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Quiz Analytics */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Statistik Kuis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Kuis</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.quizzes?.total || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.quizzes?.published || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <BookOpen className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Draft</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.quizzes?.draft || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <BookOpen className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Closed</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.quizzes?.closed || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Attempt Analytics */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Statistik Percobaan Kuis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Attempts
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.attempts?.total || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Score</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.attempts?.average_score || 0}%
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Highest Score
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.attempts?.highest_score || 0}%
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Participants
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.attempts?.total_participants || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Question Analytics */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Statistik Soal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Soal</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.questions?.total || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pilihan Ganda
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.questions?.pilihan_ganda || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Benar/Salah</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.questions?.benar_salah || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Isian Singkat
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.questions?.isian_singkat || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Classes Analytics */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Statistik Kelas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Kelas</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.classes?.total || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Teachers
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.classes?.total_teachers || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Members
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.classes?.total_memberships || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
