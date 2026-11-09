import React from 'react';

export default function ProgressBar({
  current = 1,
  total = 1,
  answeredCount = 0,
}) {
  const percentage = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
          Progres: {answeredCount} dari {total} Soal Terjawab
        </span>
        <span className="text-purple-600 font-bold">{percentage}% Selesai</span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200">
        <div
          className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

