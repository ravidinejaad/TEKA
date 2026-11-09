import React from 'react';
import classNames from 'classnames';
import { Clock, AlertTriangle } from 'lucide-react';
import { formatTimeLeft } from '../../utils/helpers';

export default function Timer({ timeLeft = 0 }) {
  const isUrgent = timeLeft < 60 && timeLeft > 0;
  const isTimeUp = timeLeft <= 0;

  return (
    <div
      className={classNames(
        'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border transition-all duration-300',
        isTimeUp
          ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
          : isUrgent
          ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
          : 'bg-purple-50 text-purple-700 border-purple-200'
      )}
    >
      {isUrgent ? (
        <AlertTriangle className="w-4 h-4 text-amber-500 animate-bounce" />
      ) : (
        <Clock className="w-4 h-4 text-purple-600" />
      )}
      <span>{formatTimeLeft(timeLeft)}</span>
    </div>
  );
}

