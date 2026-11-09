import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  RefreshCw,
} from 'lucide-react';
import { quizAPI, quizAttemptAPI } from '../../utils/api';
import { toast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';

export default function QuizPlayPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchQuizData();
  }, [id]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz(true); // Auto submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const fetchQuizData = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching quiz data for ID:', id);
      
      // Get quiz detail
      const quizRes = await quizAPI.getById(id);
      console.log('✅ Quiz detail response:', quizRes);
      
      if (!quizRes.success) {
        throw new Error(quizRes.message || 'Quiz tidak ditemukan');
      }

      const quizData = quizRes.data;
      console.log('📝 Quiz data:', quizData);
      setQuiz(quizData);

      // Get questions
      console.log('🔍 Fetching questions for quiz ID:', id);
      const questionsRes = await quizAPI.getQuestions(id);
      console.log('✅ Questions response:', questionsRes);
      
      if (!questionsRes.success) {
        throw new Error(questionsRes.message || 'Gagal memuat soal');
      }

      const questionsData = questionsRes.data || [];
      console.log('📋 Questions data:', questionsData);
      
      if (questionsData.length === 0) {
        throw new Error('Quiz ini belum memiliki soal');
      }
      
      setQuestions(questionsData);

      // Start attempt
      console.log('🚀 Starting quiz attempt...');
      const attemptRes = await quizAttemptAPI.start(id);
      console.log('✅ Attempt response:', attemptRes);
      
      if (!attemptRes.success) {
        throw new Error(attemptRes.message || 'Gagal memulai quiz');
      }

      const attemptData = attemptRes.data;
      console.log('✅ Attempt started:', attemptData);
      setAttemptId(attemptData.id_percobaan);
      setStartTime(new Date());
      setTimeRemaining(quizData.durasi_menit * 60); // Convert to seconds

      toast.success('Quiz dimulai! Semoga sukses!');
    } catch (error) {
      console.error('❌ Error fetching quiz:', error);
      toast.error(error.message || 'Gagal memuat quiz');
      
      // Delay before redirect to show error
      setTimeout(() => {
        navigate('/dashboard/quizzes');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitQuiz = async (isAutoSubmit = false) => {
    if (!isAutoSubmit) {
      const answeredCount = Object.keys(answers).length;
      if (answeredCount < questions.length) {
        const confirm = window.confirm(
          `Anda baru menjawab ${answeredCount} dari ${questions.length} soal. Yakin ingin submit?`
        );
        if (!confirm) return;
      }
    }

    setSubmitting(true);
    try {
      console.log('📤 Submitting quiz...');
      console.log('Attempt ID:', attemptId);
      console.log('Answers:', answers);
      
      // Submit answers
      const answerData = questions.map((q) => ({
        id_soal: q.id_soal,
        jawaban: answers[q.id_soal] || '',
      }));

      console.log('📋 Answer data to submit:', answerData);

      const submitRes = await quizAttemptAPI.submitAnswers(attemptId, answerData);
      console.log('✅ Submit response:', submitRes);
      
      if (!submitRes.success) {
        throw new Error(submitRes.message || 'Gagal submit jawaban');
      }

      // Complete attempt
      console.log('🏁 Completing attempt...');
      const completeRes = await quizAttemptAPI.complete(attemptId);
      console.log('✅ Complete response:', completeRes);
      
      if (!completeRes.success) {
        throw new Error(completeRes.message || 'Gagal menyelesaikan quiz');
      }

      toast.success('Quiz berhasil disubmit!');
      
      // Redirect to result page
      console.log('🎯 Redirecting to result page...');
      navigate(`/dashboard/quiz-result/${attemptId}`);
    } catch (error) {
      console.error('❌ Error submitting quiz:', error);
      toast.error(error.message || 'Gagal submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Memuat quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {quiz?.judul}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Soal {currentQuestionIndex + 1} dari {questions.length}
              </p>
            </div>

            {/* Timer */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg ${
                timeRemaining < 300
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 mb-6">
          {/* Question Text */}
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                {currentQuestionIndex + 1}
              </span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {currentQuestion?.pertanyaan}
                </h2>
                {currentQuestion?.jenis_soal === 'pilihan_ganda' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pilih satu jawaban yang benar
                  </p>
                )}
                {currentQuestion?.jenis_soal === 'benar_salah' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pilih Benar atau Salah
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion?.options?.map((option) => {
              const isSelected = answers[currentQuestion.id_soal] === option.teks_opsi;

              return (
                <button
                  key={option.id_opsi}
                  onClick={() =>
                    handleAnswerChange(currentQuestion.id_soal, option.teks_opsi)
                  }
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {option.label_opsi}.
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {option.teks_opsi}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            icon={ChevronLeft}
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Sebelumnya
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {answeredCount} dari {questions.length} soal terjawab
            </p>
          </div>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              variant="primary"
              icon={ChevronRight}
              iconPosition="right"
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))
              }
            >
              Selanjutnya
            </Button>
          ) : (
            <Button
              variant="success"
              icon={Send}
              onClick={() => handleSubmitQuiz(false)}
              disabled={submitting}
            >
              {submitting ? 'Mengirim...' : 'Submit Quiz'}
            </Button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
            Navigasi Soal
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id_soal];
              const isCurrent = idx === currentQuestionIndex;

              return (
                <button
                  key={q.id_soal}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`aspect-square rounded-lg font-semibold transition-all ${
                    isCurrent
                      ? 'bg-purple-600 text-white'
                      : isAnswered
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Warning */}
        {answeredCount < questions.length && (
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                  Perhatian!
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Anda masih memiliki {questions.length - answeredCount} soal yang belum
                  dijawab. Pastikan untuk menjawab semua soal sebelum submit.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
