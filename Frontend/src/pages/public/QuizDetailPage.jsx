import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { toast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';
import { useApi } from '../../hooks/useApi';
import { quizAPI } from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import {
  Clock,
  HelpCircle,
  GraduationCap,
  Play,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  History,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

export default function QuizDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { startQuiz } = useQuiz();
  const [starting, setStarting] = useState(false);

  // Fetch quiz detail
  const { data: quizData, loading, error } = useApi(() => quizAPI.getById(id), [id]);

  // Fetch student attempts on this quiz
  const { data: historyData } = useApi(
    () => (isAuthenticated ? quizAPI.getQuizHistory(id) : Promise.resolve(null)),
    [id, isAuthenticated]
  );

  const quiz = quizData?.quiz || quizData;
  const history = historyData?.attempts || historyData || [];

  const handleStartQuiz = async () => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu untuk memulai kuis');
      navigate('/login', { state: { from: { pathname: `/quizzes/${id}` } } });
      return;
    }

    setStarting(true);
    try {
      const attempt = await startQuiz(id);
      toast.success('Kuis dimulai! Semoga berhasil.');
      navigate(`/quiz/play/${attempt.id_percobaan}`);
    } catch (err) {
      toast.error(err.message || 'Gagal memulai kuis. Pastikan Anda telah tergabung di kelas ini.');
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <Loader fullScreen text="Memuat informasi kuis..." />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-xl mx-auto py-20 px-4 text-center">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Kuis Tidak Ditemukan</h2>
          <p className="text-slate-500 text-sm mb-6">
            Kuis ini mungkin belum dipublikasikan atau Anda tidak memiliki akses ke kelas terkait.
          </p>
          <Button variant="outline" onClick={() => navigate('/quizzes')} icon={ArrowLeft}>
            Kembali ke Katalog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isClosed = quiz.status === 'closed';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white text-purple-700 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 shadow-sm mb-6 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  {quiz.nama_kelas || 'Kelas Terdaftar'}
                </span>
                <Badge
                  variant={quiz.status === 'published' ? 'success' : 'error'}
                  size="sm"
                  dot
                >
                  {quiz.status === 'published' ? 'Kuis Aktif' : 'Kuis Ditutup'}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                {quiz.judul}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                {quiz.deskripsi || 'Tidak ada deskripsi rinci untuk kuis ini.'}
              </p>

              {/* Key Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100/60">
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Durasi</span>
                  </div>
                  <p className="text-lg font-extrabold text-slate-900">{quiz.durasi_menit} Menit</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100/60">
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <HelpCircle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Jumlah Soal</span>
                  </div>
                  <p className="text-lg font-extrabold text-slate-900">
                    {quiz.total_soal || quiz.jumlah_soal || '10'} Soal
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100/60 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Coba Ulang</span>
                  </div>
                  <p className="text-lg font-extrabold text-slate-900">
                    {quiz.bisa_coba_ulang ? 'Diizinkan' : '1 Kali Saja'}
                  </p>
                </div>
              </div>
            </div>

            {/* Rules / Important Notes */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <span>Petunjuk & Peraturan Ujian</span>
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    Pastikan koneksi internet stabil sebelum menekan tombol <strong>Mulai Kuis</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    Waktu ujian akan otomatis berjalan mundur dan tidak dapat dijeda.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    Setiap jawaban tersimpan otomatis ke server saat Anda memilih opsi.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    Jawaban akan otomatis terkirim saat waktu habis walaupun Anda belum menekan tombol submit.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar CTA & Past Attempts */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Siap Memulai?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tekan tombol di bawah untuk membuka lembar soal kuis interaktif ini.
              </p>

              <Button
                variant="primary"
                size="lg"
                className="w-full font-bold shadow-lg shadow-purple-200"
                onClick={handleStartQuiz}
                isLoading={starting}
                disabled={isClosed}
                icon={Play}
              >
                {isClosed ? 'Kuis Sudah Ditutup' : 'Mulai Kerjakan Sekarang'}
              </Button>

              {!isAuthenticated && (
                <p className="text-[11px] text-amber-600 text-center font-medium bg-amber-50 p-2 rounded-xl border border-amber-200">
                  * Anda akan diminta login/daftar terlebih dahulu.
                </p>
              )}
            </div>

            {/* History of attempts if logged in */}
            {isAuthenticated && history && history.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-600" />
                  <span>Riwayat Pengerjaan Anda</span>
                </h4>
                <div className="space-y-2.5">
                  {history.map((att) => (
                    <div
                      key={att.id_percobaan}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-800">Skor: {att.skor ?? '-'}</p>
                        <p className="text-slate-400 text-[10px]">
                          {formatDate(att.waktu_mulai, 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/quiz/result/${att.id_percobaan}`)}
                      >
                        Lihat Hasil
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

