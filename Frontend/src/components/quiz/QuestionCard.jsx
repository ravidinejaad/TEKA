import React from 'react';
import classNames from 'classnames';
import { Flag, CheckCircle2 } from 'lucide-react';

export default function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  isFlagged = false,
  onToggleFlag,
  questionNumber = 1,
  totalQuestions = 1,
}) {
  if (!question) return null;

  const options = question.options || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-fade-in">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Soal {questionNumber} dari {totalQuestions}
          </span>
          {question.bobot && (
            <span className="text-xs font-medium text-slate-500">
              Bobot: {question.bobot} poin
            </span>
          )}
        </div>

        {onToggleFlag && (
          <button
            type="button"
            onClick={onToggleFlag}
            className={classNames(
              'flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-xl border transition-all shadow-sm',
              isFlagged
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500 font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 font-medium'
            )}
          >
            <Flag
              className={classNames(
                'w-3.5 h-3.5',
                isFlagged ? 'fill-white text-white' : 'text-slate-500'
              )}
            />
            <span>{isFlagged ? 'Ditandai Ragu' : 'Tandai Ragu'}</span>
          </button>
        )}
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 leading-relaxed">
          {question.pertanyaan}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selectedAnswer === opt.label_opsi;
          return (
            <button
              key={opt.id_opsi || opt.label_opsi}
              type="button"
              onClick={() => onSelectAnswer(opt.label_opsi)}
              className={classNames(
                'w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group shadow-sm',
                isSelected
                  ? 'border-purple-600 bg-purple-600 text-white shadow-purple-200'
                  : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/40 text-slate-800'
              )}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={classNames(
                    'w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors',
                    isSelected
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-purple-100 group-hover:text-purple-700'
                  )}
                >
                  {opt.label_opsi}
                </span>
                <span
                  className={classNames(
                    'text-sm leading-relaxed',
                    isSelected ? 'text-white font-semibold' : 'text-slate-800 font-medium'
                  )}
                >
                  {opt.teks_opsi}
                </span>
              </div>

              {isSelected && (
                <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-3" />
              )}
            </button>
          );
        })}

        {/* If question is essay / short text */}
        {options.length === 0 && question.jenis_soal !== 'pilihan_ganda' && (
          <div className="pt-2">
            <textarea
              rows={4}
              value={selectedAnswer || ''}
              onChange={(e) => onSelectAnswer(e.target.value)}
              placeholder="Tulis jawaban Anda di sini secara lengkap..."
              className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
