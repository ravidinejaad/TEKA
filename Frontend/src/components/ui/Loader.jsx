import React from 'react';
import classNames from 'classnames';

export default function Loader({ size = 'md', fullScreen = false, text = 'Memuat data...' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={classNames(
          'rounded-full border-purple-200 border-t-purple-600 animate-spin',
          sizeClasses[size] || sizeClasses.md
        )}
      />
      {text && <p className="text-sm font-medium text-slate-500 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return <div className="py-12 flex items-center justify-center">{spinner}</div>;
}

