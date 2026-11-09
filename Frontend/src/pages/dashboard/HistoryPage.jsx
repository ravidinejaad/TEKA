import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resultAPI } from '../../utils/api';
import { toast } from '../../components/ui/Toast';
import {
  History,
  BookOpen,
  Clock,
  Award,
  RefreshCw,
  Trophy,
  Eye,
} from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Correct endpoint: GET /api/results/user/history
      // Backend returns: { success, data: { history: [], pagination: {} } }
      const response = await resultAPI.getUserHistory({ limit: 50 });

      if (response?.success) {
        const historyData = response.data?.history || response.data || [];
        setHistory(Array.isArray(historyData) ? historyData : []);
      } else {
        toast.error(response?.message || 'Gagal memuat riwayat');
        setHistory([]);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      // Suppress validation error message — show friendly message instead
      if (error?.status !== 400) {
        toast.error(error?.message || 'Gagal memuat riwayat kuis');
      }
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { bg: 'bg-green-100', text: 'text-green-700', label: 'Sangat Baik' };
    if (score >= 60) return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Baik' };
    if (score >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Cukup' };
    return { bg: 'bg-red-100', text: 'text-red-700', label: 'Perlu Latihan' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Memuat riwayat...</p>
        </div>
      </div>
    );
  }

  // Compute stats from history
  const avgScore = history.length > 0
    ? Math.round(history.reduce((sum, h) => sum + (h.skor || 0), 0) / history.length)
    : 0;
  const bestScore = history.length > 0
    ? Math.max(...history.map((h) => h.skor || 0))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Riwayat Kuis</h1>
          <p className="text-sm text-slate-500 mt-1">
            Hasil dari semua kuis yang sudah Anda kerjakan
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-semibold"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Stats */}
      {history.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-50">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm text-slate-600">Total Kuis</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">{history.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-50">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-slate-600">Rata-rata Skor</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">{avgScore}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-yellow-50">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-sm text-slate-600">Skor Terbaik</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">{bestScore}</p>
          </div>
        </div>
      )}

      {/* History List */}
      {history.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {history.map((attempt) => {
              const score = attempt.skor || 0;
              const scoreBadge = getScoreBadge(score);

              return (
                <div
                  key={attempt.id_percobaan}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-purple-100 flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-900">
                            {attempt.quiz_title || attempt.judul || `Kuis #${attempt.id_kuis}`}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {attempt.waktu_mulai
                                  ? new Date(attempt.waktu_mulai).toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : '—'}
                              </span>
                            </div>
                            {attempt.total_questions > 0 && (
                              <span className="text-xs">
                                {attempt.correct_answers || 0}/{attempt.total_questions} Benar
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Score & Action */}
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${scoreBadge.bg} ${scoreBadge.text}`}
                        >
                          <Award className="w-5 h-5" />
                          <span className="text-2xl">{score}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{scoreBadge.label}</p>
                      </div>

                      <button
                        onClick={() => navigate(`/quiz/result/${attempt.id_percobaan}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Detail</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Riwayat</h3>
          <p className="text-slate-500 mb-6">
            Anda belum pernah menyelesaikan kuis. Mulai sekarang!
          </p>
          <button
            onClick={() => navigate('/dashboard/quizzes')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Jelajahi Kuis
          </button>
        </div>
      )}
    </div>
  );
}
