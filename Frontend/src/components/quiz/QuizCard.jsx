import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Clock, HelpCircle, GraduationCap, ArrowRight, Play } from 'lucide-react';

export default function QuizCard({ quiz, onStart, onView }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onView) {
      onView(quiz.id_kuis);
    } else {
      navigate(`/dashboard/quizzes/${quiz.id_kuis}`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <Badge variant="success" size="sm" dot>Tersedia</Badge>;
      case 'closed':
        return <Badge variant="error" size="sm" dot>Ditutup</Badge>;
      case 'draft':
      default:
        return <Badge variant="secondary" size="sm" dot>Draft</Badge>;
    }
  };

  return (
    <Card hover className="flex flex-col h-full group" onClick={handleCardClick}>
      <Card.Body className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              {quiz.nama_kelas || 'Kelas Umum'}
            </span>
            {getStatusBadge(quiz.status)}
          </div>

          <h3 className="font-bold text-slate-900 text-lg group-hover:text-purple-600 transition-colors line-clamp-2 mb-2">
            {quiz.judul}
          </h3>

          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {quiz.deskripsi || 'Tidak ada deskripsi untuk kuis ini.'}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-500" />
            <span>{quiz.durasi_menit} Menit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-purple-500" />
            <span>{quiz.total_soal || quiz.jumlah_soal || '10'} Soal</span>
          </div>
        </div>
      </Card.Body>

      <Card.Footer className="bg-slate-50/50">
        <span className="text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
          Lihat Detail <ArrowRight className="w-3.5 h-3.5" />
        </span>

        {quiz.status === 'published' && (
          <Button
            size="sm"
            variant="primary"
            icon={Play}
            onClick={(e) => {
              e.stopPropagation();
              if (onStart) {
                onStart(quiz.id_kuis);
              } else {
                navigate(`/dashboard/quizzes/${quiz.id_kuis}`);
              }
            }}
          >
            Mulai
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
}
