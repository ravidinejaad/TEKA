import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Home,
  RefreshCw,
  Clock,
  Award,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';
import { quizAttemptAPI } from '../../utils/api';
import { toast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';

export default function QuizResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching result for attempt ID:', attemptId);
      
      const response = await quizAttemptAPI.getResult(attemptId);
      console.log('✅ Result response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Gagal memuat hasil');
      }
      
      const resultData = response.data;
      console.log('🎯 Result data:', resultData);
      setResult(resultData);
      
    } catch (error) {
      console.error('❌ Error fetching result:', error);
      toast.error(error.message || 'Gagal memuat hasil quiz');
      
      setTimeout(() => {
        navigate('/dashboard/history');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Memuat hasil...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Hasil tidak ditemukan
          </h2>
          <Button variant="primary" onClick={() => navigate('/dashboard/history')}>
            Kembali ke Riwayat
          </Button>
        </div>
      </div>
    );
  }

  const score = result.skor || 0;
  const totalQuestions = result.total_questions || 0;
  const correctAnswers = result.total_correct || 0;
  const wrongAnswers = totalQuestions - correctAnswers;
  
  // Calculate duration in seconds
  const waktuMulai = new Date(result.waktu_mulai);
  const waktuKirim = new Date(result.waktu_kirim);
  const duration = Math.floor((waktuKirim - waktuMulai) / 1000);
  
  const answers = result.answers || [];
  const nama_kelas = result.nama_kelas || 'Kelas';
  const judul_kuis = result.judul_kuis || 'Quiz';

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-600 to-emerald-600';
    if (score >= 60) return 'from-blue-600 to-cyan-600';
    if (score >= 40) return 'from-yellow-600 to-orange-600';
    return 'from-red-600 to-pink-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Luar Biasa! 🎉';
    if (score >= 60) return 'Bagus! 👍';
    if (score >= 40) return 'Cukup Baik 👌';
    return 'Tetap Semangat! 💪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-8">
        {/* Score Display */}
        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getScoreColor(
              score
            )} text-white mb-4 shadow-lg`}
          >
            <span className="text-4xl font-bold">{score.toFixed(0)}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {getScoreMessage(score)}
          </h1>
          <p className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-1">
            {judul_kuis}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {nama_kelas} • {new Date(result.waktu_mulai).toLocaleDateString('id-ID')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {correctAnswers}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Benar</p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {wrongAnswers}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Salah</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
            <Award className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalQuestions}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Soal</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
              {Math.floor(duration / 60)}m {duration % 60}s
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Waktu</p>
          </div>
        </div>

        {/* Performance Message */}
        <div
          className={`rounded-xl p-6 ${
            score >= 60
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <TrendingUp
              className={`w-6 h-6 flex-shrink-0 ${
                score >= 60
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-yellow-600 dark:text-yellow-400'
              }`}
            />
            <div>
              <h3
                className={`font-bold mb-1 ${
                  score >= 60
                    ? 'text-green-900 dark:text-green-100'
                    : 'text-yellow-900 dark:text-yellow-100'
                }`}
              >
                {score >= 80
                  ? 'Prestasi Cemerlang!'
                  : score >= 60
                  ? 'Kinerja Baik!'
                  : 'Terus Berlatih!'}
              </h3>
              <p
                className={`text-sm ${
                  score >= 60
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-yellow-800 dark:text-yellow-200'
                }`}
              >
                {score >= 80
                  ? 'Anda menguasai materi dengan sangat baik. Pertahankan!'
                  : score >= 60
                  ? 'Pemahaman Anda terhadap materi sudah cukup baik.'
                  : 'Jangan menyerah! Terus belajar dan coba lagi untuk hasil yang lebih baik.'}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Review */}
        {answers && answers.length > 0 && (
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Pembahasan Soal</h3>
            </div>

            <div className="space-y-3">
              {answers.map((ans, idx) => {
                const isExpanded = expandedIndex === idx;
                const isCorrect = ans.is_benar;

                return (
                  <div
                    key={idx}
                    className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCorrect
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-left line-clamp-1">
                          {ans.pertanyaan}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 space-y-3 text-sm">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                            Pertanyaan:
                          </p>
                          <p className="text-gray-800 dark:text-gray-200">{ans.pertanyaan}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                              Jawaban Anda:
                            </p>
                            <p
                              className={`font-semibold ${
                                isCorrect ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {ans.jawaban || '(Tidak dijawab)'}
                            </p>
                          </div>

                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                              Jawaban Benar:
                            </p>
                            <p className="font-semibold text-green-900 dark:text-green-100">
                              {ans.kunci_jawaban}
                            </p>
                          </div>
                        </div>

                        {ans.pembahasan && (
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1">
                              💡 Pembahasan:
                            </p>
                            <p className="text-purple-900 dark:text-purple-100">
                              {ans.pembahasan}
                            </p>
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

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="primary"
            icon={Home}
            onClick={() => navigate('/dashboard')}
            className="flex-1"
          >
            Dashboard
          </Button>
          <Button
            variant="outline"
            icon={RefreshCw}
            onClick={() => navigate('/dashboard/quizzes')}
            className="flex-1"
          >
            Quiz Lainnya
          </Button>
        </div>

        {/* Additional Info */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Selesai pada{' '}
            {new Date(result.waktu_kirim).toLocaleString('id-ID', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
