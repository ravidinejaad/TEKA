import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import { useApi } from '../../hooks/useApi';
import { quizAPI } from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import {
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  LayoutDashboard,
  ChevronDown,
  ChevronUp,
  Award,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

export default function QuizResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [displayScore, setDisplayScore] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const { data: resultData, loading, error } = useApi(
    () => quizAPI.getAttemptResults(attemptId),
    [attemptId]
  );

  const result = resultData?.result || resultData?.data || resultData;
  const targetScore = Number(result?.skor ?? 0);

  // Animated Count Up Effect for Score
  useEffect(() => {
    if (result && targetScore > 0) {
      let start = 0;
      const duration = 1200;
      const increment = targetScore / (duration / 20);

      const timer = setInterval(() => {
        start += increment;
        if (start >= targetScore) {
          setDisplayScore(targetScore);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(start));
        }
      }, 20);

      return () => clearInterval(timer);
    } else {
      setDisplayScore(targetScore);
    }
  }, [result, targetScore]);

  if (loading) {
    return <Loader fullScreen text="Menghitung skor dan hasil evaluasi..." />;
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Hasil Tidak Ditemukan</h2>
          <p className="text-slate-500 text-sm mb-6">
            Data evaluasi kuis ini mungkin belum selesai dinilai atau Anda tidak berhak mengaksesnya.
          </p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const answers = result.answers || result.jawaban || [];
  const correctCount = answers.filter((a) => a.is_benar).length;
  const wrongCount = answers.length - correctCount;

  // Grade color and remarks
  const getGradeInfo = (score) => {
    if (score >= 85) return { text: 'Sangat Memuaskan! 🎉', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score >= 70) return { text: 'Bagus Sekali! 👍', color: 'text-purple-600', bg: 'bg-purple-50' };
    if (score >= 50) return { text: 'Cukup Baik, Tingkatkan Lagi! 💪', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { text: 'Perlu Banyak Latihan 📚', color: 'text-rose-600', bg: 'bg-rose-50' };
  };

  const gradeInfo = getGradeInfo(targetScore);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Score Card Hero */}
        <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 rounded-3xl text-white p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
              <Trophy className="w-8 h-8 text-amber-300" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-purple-100">
              Hasil Evaluasi Kuis
            </h1>

            {/* Score Big Display */}
            <div className="py-2">
              <div className="text-6xl sm:text-7xl font-black tracking-tight text-white drop-shadow-sm">
                {displayScore}
                <span className="text-3xl text-purple-200 font-bold">/100</span>
              </div>
              <p className="mt-3 text-sm font-semibold inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                {gradeInfo.text}
              </p>
            </div>

            {/* Breakdown Mini Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/15 text-xs">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <span className="text-purple-200">Jawaban Benar</span>
                <p className="text-lg font-bold text-emerald-300 mt-0.5">{correctCount} Soal</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <span className="text-purple-200">Jawaban Salah</span>
                <p className="text-lg font-bold text-rose-300 mt-0.5">{wrongCount} Soal</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm col-span-2 sm:col-span-1">
                <span className="text-purple-200">Status</span>
                <p className="text-lg font-bold text-purple-100 mt-0.5 capitalize">
                  {result.status || 'Selesai'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => navigate('/dashboard')}
            icon={LayoutDashboard}
          >
            Kembali ke Dashboard
          </Button>

          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto shadow-md shadow-purple-200"
            onClick={() => navigate(`/dashboard/quizzes/${result.id_kuis}`)}
            icon={RotateCcw}
          >
            Halaman Kuis
          </Button>
        </div>

        {/* Detailed Question Review */}
        {answers && answers.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-lg">Pembahasan Butir Soal</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {answers.length} Butir Soal Ditinjau
              </span>
            </div>

            <div className="space-y-4">
              {answers.map((ans, idx) => {
                const isExpanded = expandedIndex === idx;
                const isCorrect = Boolean(ans.is_benar);

                return (
                  <div
                    key={ans.id_jawaban || idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200"
                  >
                    {/* Header Item */}
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-800 line-clamp-1">
                          {ans.pertanyaan}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        {isCorrect ? (
                          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Benar (+{ans.poin ?? 10})</span>
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Salah</span>
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Expandable Body */}
                    {isExpanded && (
                      <div className="p-4 bg-slate-50/70 border-t border-slate-100 space-y-3 text-sm">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Pertanyaan:
                          </p>
                          <p className="text-slate-800 font-medium">{ans.pertanyaan}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3 bg-white rounded-xl border border-slate-200">
                            <p className="text-[11px] font-bold text-slate-400 uppercase">
                              Jawaban Anda:
                            </p>
                            <p
                              className={`font-semibold mt-1 ${
                                isCorrect ? 'text-emerald-700' : 'text-rose-600'
                              }`}
                            >
                              {(() => {
                                if (!ans.jawaban) return '(Kosong / Tidak dijawab)';
                                const opt = ans.options?.find(
                                  (o) =>
                                    String(o.label_opsi).trim().toLowerCase() === String(ans.jawaban).trim().toLowerCase() ||
                                    String(o.teks_opsi).trim().toLowerCase() === String(ans.jawaban).trim().toLowerCase()
                                );
                                return opt ? `${opt.label_opsi}. ${opt.teks_opsi}` : ans.jawaban;
                              })()}
                            </p>
                          </div>

                          {ans.kunci_jawaban && (
                            <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-200">
                              <p className="text-[11px] font-bold text-emerald-700 uppercase">
                                Kunci Jawaban:
                              </p>
                              <p className="font-semibold text-emerald-900 mt-1">
                                {(() => {
                                  const opt = ans.options?.find(
                                    (o) =>
                                      String(o.label_opsi).trim().toLowerCase() === String(ans.kunci_jawaban).trim().toLowerCase() ||
                                      String(o.teks_opsi).trim().toLowerCase() === String(ans.kunci_jawaban).trim().toLowerCase()
                                  );
                                  return opt ? `${opt.label_opsi}. ${opt.teks_opsi}` : ans.kunci_jawaban;
                                })()}
                              </p>
                            </div>
                          )}
                        </div>

                        {ans.pembahasan && (
                          <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100 text-xs leading-relaxed text-purple-900">
                            <span className="font-bold block mb-1">💡 Pembahasan:</span>
                            {ans.pembahasan}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
