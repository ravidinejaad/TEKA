import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { classAPI, quizAPI } from '../../utils/api';
import QuizCard from '../../components/quiz/QuizCard';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { BookOpen, Plus, GraduationCap, Filter } from 'lucide-react';

export default function MyQuizzesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeClassId = searchParams.get('classId');

  const isTeacher = user?.role === 'teacher';

  // Fetch enrolled classes to get quizzes
  const { data: classesData, loading: loadingClasses } = useApi(
    () => classAPI.getAll({ page: 1, limit: 20 }),
    []
  );

  const classes = classesData?.classes || classesData || [];

  // Extract all quizzes from classes
  const allQuizzes = [];
  classes.forEach((c) => {
    if (c.quizzes && Array.isArray(c.quizzes)) {
      c.quizzes.forEach((q) => {
        if (!activeClassId || String(c.id_kelas) === String(activeClassId)) {
          allQuizzes.push({ ...q, nama_kelas: c.nama_kelas, id_kelas: c.id_kelas });
        }
      });
    }
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isTeacher ? 'Kelola Kuis' : 'Daftar Kuis Terjadwal'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {activeClassId
              ? `Menampilkan kuis untuk kelas terpilih.`
              : 'Seluruh kuis yang ditugaskan oleh guru pada kelas Anda.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeClassId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/my-quizzes')}
            >
              Tampilkan Semua Kelas
            </Button>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/quizzes')}
            icon={BookOpen}
          >
            Jelajahi Kuis Publik
          </Button>
        </div>
      </div>

      {loadingClasses ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton variant="rect" count={6} className="h-56 rounded-2xl" />
        </div>
      ) : allQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allQuizzes.map((quiz) => (
            <QuizCard key={quiz.id_kuis} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Belum Ada Kuis Terjadwal</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Guru kelas Anda belum mempublikasikan kuis baru. Anda tetap dapat menjelajahi kuis publik untuk latihan.
          </p>
          <Button variant="primary" size="md" onClick={() => navigate('/quizzes')}>
            Buka Katalog Kuis
          </Button>
        </div>
      )}
    </div>
  );
}

