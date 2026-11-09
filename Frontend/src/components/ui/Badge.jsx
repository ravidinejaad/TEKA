import React from 'react';
import classNames from 'classnames';

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  className = '',
}) {
  const variants = {
    primary: 'bg-purple-100 text-purple-700 border-purple-200',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  const dotColors = {
    primary: 'bg-purple-500',
    secondary: 'bg-slate-400',
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-semibold',
  };

  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 rounded-full border',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
    >
      {dot && (
        <span
          className={classNames('w-1.5 h-1.5 rounded-full', dotColors[variant] || dotColors.primary)}
        />
      )}
      {children}
    </span>
  );
}

