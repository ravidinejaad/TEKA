import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI, classAPI, resultAPI } from '../../utils/api';
import { toast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { formatDate } from '../../utils/helpers';
import {
  BookOpen,
  GraduationCap,
  Trophy,
  History,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Plus,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [stats, setStats] = useState(null);
  const [classes, setClasses] = useState([]);
  const [history, setHistory] = useState([]);

  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchClasses();
    fetchHistory();
  }, []);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      // GET /api/users/me/stats → { success, data: { total_quizzes, average_score, best_score, total_correct } }
      const res = await userAPI.getStats();
      if (res?.success) {
        setStats(res.data || {});
      }
    } catch (err) {
      console.warn('Stats fetch failed:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      // GET /api/classes → { success, data: { classes: [], pagination: {} } }
      const res = await classAPI.getAll();
      if (res?.success) {
        const classesData = res.data?.classes || res.data || [];
        setClasses(Array.isArray(classesData) ? classesData : []);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.warn('Classes fetch failed:', err);
      setClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      // GET /api/results/user/history → { success, data: { history: [], pagination: {} } }
      const res = await resultAPI.getUserHistory({ limit: 5 });
      if (res?.success) {
        const historyData = res.data?.history || res.data || [];
        setHistory(Array.isArray(historyData) ? historyData : []);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.warn('History fetch failed:', err);
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!classCode.trim()) {
      toast.error('Masukkan kode kelas');
      return;
    }
    setJoining(true);
    try {
      await classAPI.joinClass(classCode.trim().toUpperCase());
      toast.success('Berhasil bergabung ke kelas!');
      setJoinModalOpen(false);
      setClassCode('');
      fetchClasses();
      fetchStats();
    } catch (err) {
      toast.error(err.message || 'Gagal bergabung ke kelas. Periksa kembali kodenya.');
    } finally {
      setJoining(false);
    }
  };

  const statsData = {
    // Backend getUserStats returns: total_quizzes, average_score, best_score, total_correct
    total_attempts: stats?.total_quizzes ?? 0,
    avg_score: stats?.average_score ?? 0,
    total_classes: stats?.total_classes ?? classes.length,
    best_score: stats?.best_score ?? 0,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-purple-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selamat Datang Kembali</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Halo, {user?.nama || 'Pelajar'}! 👋
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">
            Terus tingkatkan pemahamanmu dan raih skor terbaik dalam kuis interaktif hari ini.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="md"
            variant="white"
            onClick={() => setJoinModalOpen(true)}
            icon={Plus}
          >
            Gabung Kelas
          </Button>
          <Button
            size="md"
            variant="outline"
            onClick={() => navigate('/dashboard/quizzes')}
            icon={BookOpen}
            className="border-white/50 text-white hover:bg-white/10"
          >
            Jelajahi Kuis
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingStats ? (
          <Skeleton variant="rect" count={4} className="h-28 rounded-2xl" />
        ) : (
          [
            {
              label: 'Total Kuis Dikerjakan',
              value: statsData.total_attempts,
              icon: BookOpen,
              color: 'text-purple-600 bg-purple-50',
            },
            {
              label: 'Rata-rata Skor',
              value: `${Math.round(statsData.avg_score)}`,
              icon: TrendingUp,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              label: 'Kelas Terdaftar',
              value: statsData.total_classes,
              icon: GraduationCap,
              color: 'text-sky-600 bg-sky-50',
            },
            {
              label: 'Skor Terbaik',
              value: statsData.best_score || '-',
              icon: Trophy,
              color: 'text-amber-600 bg-amber-50',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium truncate">{item.label}</p>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                    {item.value}
                  </h3>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Classes & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Classes Section (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <span>Kelas Saya</span>
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/classes')}
              icon={ArrowRight}
              iconPosition="right"
            >
              Lihat Semua
            </Button>
          </div>

          {loadingClasses ? (
            <Skeleton variant="rect" count={2} className="h-28 rounded-2xl" />
          ) : classes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classes.slice(0, 4).map((c) => (
                <Card
                  key={c.id_kelas}
                  hover
                  onClick={() => navigate('/dashboard/classes')}
                  className="p-5 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="primary" size="sm">
                        {c.kode_kelas}
                      </Badge>
                      <span className="text-[11px] text-slate-400">
                        {c.jumlah_anggota || c.members_count || '—'} Anggota
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">
                      {c.nama_kelas}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {c.deskripsi || 'Kelas belajar interaktif'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-purple-600 font-semibold">
                    <span>Lihat Kuis Kelas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-800 mb-1">Belum Tergabung di Kelas</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                Minta kode kelas dari gurumu dan masukkan kodenya untuk mulai mengerjakan kuis.
              </p>
              <Button size="sm" variant="primary" onClick={() => setJoinModalOpen(true)}>
                Gabung Kelas Sekarang
              </Button>
            </div>
          )}
        </div>

        {/* Recent Attempts Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600" />
              <span>Aktivitas Terbaru</span>
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/history')}
            >
              Semua
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            {loadingHistory ? (
              <Skeleton variant="rect" count={3} className="h-16 rounded-xl" />
            ) : history.length > 0 ? (
              <div className="space-y-3">
                {history.slice(0, 5).map((att) => (
                  <div
                    key={att.id_percobaan}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-purple-200 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                    onClick={() => navigate(`/quiz/result/${att.id_percobaan}`)}
                  >
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs text-slate-800 truncate">
                        {att.judul || att.quiz_title || `Kuis #${att.id_kuis}`}
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatDate(att.waktu_mulai || att.created_at, 'dd MMM yyyy')}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                        {att.skor ?? '-'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                <p>Belum ada riwayat kuis.</p>
                <button
                  onClick={() => navigate('/dashboard/quizzes')}
                  className="mt-2 text-purple-600 font-semibold hover:underline block mx-auto"
                >
                  Mulai Kuis Pertama
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Join Class Modal */}
      <Modal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title="Gabung Kelas Belajar"
        description="Masukkan kode kelas yang diberikan oleh guru Anda."
        size="md"
      >
        <form onSubmit={handleJoinClass} className="space-y-4 pt-2">
          <Input
            label="Kode Kelas"
            placeholder="Contoh: MTK10A"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            autoFocus
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" size="md" type="button" onClick={() => setJoinModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={joining}>
              Gabung Sekarang
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
