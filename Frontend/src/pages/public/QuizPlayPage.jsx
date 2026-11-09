import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionCard from '../../components/quiz/QuestionCard';
import ProgressBar from '../../components/quiz/ProgressBar';
import Timer from '../../components/quiz/Timer';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import { toast } from '../../components/ui/Toast';
import { useQuiz } from '../../context/QuizContext';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Flag,
  Grid,
} from 'lucide-react';

export default function QuizPlayPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const {
    attempt,
    questions,
    currentIndex,
    currentQuestion,
    answers,
    flagged,
    timeLeft,
    loading,
    submitting,
    loadAttempt,
    selectAnswer,
    toggleFlag,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    submitQuiz,
  } = useQuiz();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [paletteModalOpen, setPaletteModalOpen] = useState(false);

  // Load attempt data on mount if not already in context
  useEffect(() => {
    if (!attempt || String(attempt.id_percobaan) !== String(attemptId)) {
      loadAttempt(attemptId).catch((err) => {
        toast.error('Gagal memuat sesi kuis atau sesi sudah kedaluwarsa.');
        navigate('/dashboard/my-quizzes');
      });
    }
  }, [attemptId]);

  // Prevent accidental exit / reload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Ujian sedang berlangsung. Yakin ingin meninggalkan halaman?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = flagged.length;

  const handleSubmit = async () => {
    try {
      const result = await submitQuiz();
      toast.success('Kuis berhasil disubmit!');
      navigate(`/quiz/result/${attemptId}`, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Gagal mengirim kuis. Silakan coba lagi.');
    }
  };

  if (loading || !attempt) {
    return <Loader fullScreen text="Menyiapkan lembar soal kuis..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Floating Sub-Header (Progress & Timer) */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <ProgressBar
              current={currentIndex + 1}
              total={totalQuestions}
              answeredCount={answeredCount}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPaletteModalOpen(true)}
              className="sm:hidden p-2 rounded-xl text-purple-700 bg-purple-50 border border-purple-200"
              title="Daftar Soal"
            >
              <Grid className="w-4 h-4" />
            </button>
            <Timer timeLeft={timeLeft} />
          </div>
        </div>
      </div>

      {/* Main Examination Canvas */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col lg:flex-row gap-8">
        {/* Left Column: Current Question */}
        <div className="flex-1 space-y-6">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion?.id_soal]}
            onSelectAnswer={(val) => selectAnswer(currentQuestion.id_soal, val)}
            isFlagged={flagged.includes(currentQuestion?.id_soal)}
            onToggleFlag={() => toggleFlag(currentQuestion?.id_soal)}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
          />

          {/* Navigation Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="md"
              disabled={currentIndex === 0}
              onClick={prevQuestion}
              icon={ArrowLeft}
            >
              Sebelumnya
            </Button>

            <div className="flex items-center gap-2">
              {currentIndex < totalQuestions - 1 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={nextQuestion}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Selanjutnya
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="md"
                  onClick={() => setConfirmModalOpen(true)}
                  icon={Send}
                  iconPosition="right"
                >
                  Selesai Ujian
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Question Numbers Palette (Desktop) */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm sticky top-36 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center justify-between">
              <span>Nomor Soal</span>
              <span className="text-xs text-purple-600 font-semibold">
                {answeredCount}/{totalQuestions} Terisi
              </span>
            </h4>

            {/* Grid Palette */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answers[q.id_soal] !== undefined;
                const isMarked = flagged.includes(q.id_soal);

                let btnStyle = 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300 font-medium';
                if (isCurrent) {
                  btnStyle = 'ring-2 ring-purple-600 bg-purple-600 text-white font-bold border-purple-600 shadow-sm';
                } else if (isMarked) {
                  btnStyle = 'bg-amber-500 text-white border-amber-600 font-bold shadow-sm';
                } else if (isAnswered) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm';
                }

                return (
                  <button
                    key={q.id_soal}
                    type="button"
                    onClick={() => jumpToQuestion(idx)}
                    className={`h-9 rounded-xl border text-xs flex items-center justify-center transition-all ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-emerald-50 border border-emerald-300" />
                <span>Sudah Dijawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300" />
                <span>Ragu-ragu ({flaggedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-slate-100 border border-slate-200" />
                <span>Belum Dijawab ({unansweredCount})</span>
              </div>
            </div>

            <Button
              variant="success"
              size="md"
              className="w-full mt-2 font-bold shadow-sm"
              onClick={() => setConfirmModalOpen(true)}
              icon={Send}
            >
              Kirim Jawaban
            </Button>
          </div>
        </div>
      </main>

      {/* Confirmation Modal before Final Submit */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Kirim dan Selesaikan Ujian?"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Periksa ringkasan pengerjaan Anda sebelum mengirim jawaban secara permanen:
          </p>

          <div className="grid grid-cols-3 gap-3 text-center py-2">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-xl font-bold text-emerald-700">{answeredCount}</span>
              <p className="text-[11px] text-emerald-600 font-medium">Terjawab</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-xl font-bold text-amber-700">{flaggedCount}</span>
              <p className="text-[11px] text-amber-600 font-medium">Ragu-ragu</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
              <span className="text-xl font-bold text-rose-700">{unansweredCount}</span>
              <p className="text-[11px] text-rose-600 font-medium">Kosong</p>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                Masih terdapat <strong>{unansweredCount} soal</strong> yang belum Anda jawab. Soal kosong tidak akan mendapatkan poin.
              </span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setConfirmModalOpen(false)}
            >
              Periksa Kembali
            </Button>
            <Button
              variant="success"
              size="md"
              isLoading={submitting}
              onClick={handleSubmit}
            >
              Ya, Kirim Sekarang
            </Button>
          </div>
        </div>
      </Modal>

      {/* Mobile Palette Modal */}
      <Modal
        isOpen={paletteModalOpen}
        onClose={() => setPaletteModalOpen(false)}
        title="Daftar Soal Ujian"
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto p-1">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = answers[q.id_soal] !== undefined;
              const isMarked = flagged.includes(q.id_soal);

              let btnStyle = 'bg-slate-100 text-slate-800 border border-slate-300';
              if (isCurrent) btnStyle = 'ring-2 ring-purple-600 bg-purple-600 text-white font-bold';
              else if (isMarked) btnStyle = 'bg-amber-500 text-white font-bold';
              else if (isAnswered) btnStyle = 'bg-emerald-600 text-white font-bold';

              return (
                <button
                  key={q.id_soal}
                  onClick={() => {
                    jumpToQuestion(idx);
                    setPaletteModalOpen(false);
                  }}
                  className={`h-10 rounded-xl font-semibold text-xs flex items-center justify-center ${btnStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => setPaletteModalOpen(false)}
          >
            Tutup
          </Button>
        </div>
      </Modal>
    </div>
  );
}

