import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { resultAPI } from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { History, ArrowRight, BookOpen, Clock, Award } from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();

  const { data: historyData, loading } = useApi(
    () => resultAPI.getUserHistory({ page: 1, limit: 30 }),
    []
  );

  const history = historyData?.history || historyData || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Riwayat Evaluasi Kuis
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Pantau seluruh hasil percobaan dan skor kuis yang telah Anda selesaikan.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton variant="rect" count={4} className="h-20 rounded-2xl" />
        </div>
      ) : history.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {history.map((att) => {
              const score = att.skor != null ? Number(att.skor) : null;
              const isPassing = score !== null && score >= 70;

              return (
                <div
                  key={att.id_percobaan}
                  className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                        {att.nama_kelas || 'Kelas'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(att.waktu_mulai, 'dd MMMM yyyy, HH:mm')}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">
                      {att.judul || `Kuis #${att.id_kuis}`}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Status: <strong className="capitalize">{att.status || 'Selesai'}</strong></span>
                      {att.durasi_menit && <span>• {att.durasi_menit} Menit</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Skor Akhir</span>
                      <span
                        className={`text-xl font-extrabold ${
                          isPassing ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {score !== null ? `${score}/100` : '-'}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/quiz/result/${att.id_percobaan}`)}
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      Buka Review
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Belum Ada Riwayat Kuis</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Hasil evaluasi dan skor Anda akan tercatat di sini setelah Anda menyelesaikan kuis pertama Anda.
          </p>
          <Button variant="primary" size="md" onClick={() => navigate('/quizzes')}>
            Mulai Kuis Sekarang
          </Button>
        </div>
      )}
    </div>
  );
}

