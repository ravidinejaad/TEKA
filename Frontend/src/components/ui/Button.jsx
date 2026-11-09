import React from 'react';
import classNames from 'classnames';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] shadow-sm';

  const variants = {
    // Solid Purple Background with High-Contrast White Text
    primary:
      'bg-purple-600 hover:bg-purple-700 text-white border border-purple-600 hover:border-purple-700 focus:ring-purple-500 shadow-purple-200',

    // Solid White Background with High-Contrast Deep Purple Text & Border
    white:
      'bg-white hover:bg-purple-50 text-purple-700 hover:text-purple-800 border-2 border-purple-600 hover:border-purple-700 focus:ring-purple-500',

    // Solid White Background with Purple Text (No Border, for colored Hero banners)
    'white-solid':
      'bg-white hover:bg-purple-50 text-purple-700 hover:text-purple-900 border border-white focus:ring-white shadow-md',

    // Frosted / Outlined White for dark or colored banners
    'white-outline':
      'bg-white/15 hover:bg-white text-white hover:text-purple-800 border-2 border-white focus:ring-white',

    // Standard Outline: White background with purple border and text
    outline:
      'bg-white hover:bg-purple-50 text-purple-700 hover:text-purple-800 border-2 border-purple-600 hover:border-purple-700 focus:ring-purple-500',

    // Light Purple Background with High-Contrast Dark Purple Text
    secondary:
      'bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 focus:ring-purple-400',

    // Soft Gray Background with High-Contrast Dark Slate Text
    ghost:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-900 border border-slate-300 hover:border-slate-400 focus:ring-slate-400',

    // Solid Red Background with High-Contrast White Text
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white border border-rose-600 hover:border-rose-700 focus:ring-rose-500 shadow-rose-200',

    // Solid Green Background with High-Contrast White Text
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 hover:border-emerald-700 focus:ring-emerald-500 shadow-emerald-200',

    // Solid Dark Slate Background with White Text
    dark:
      'bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 focus:ring-slate-700',

    // Custom: caller provides full background & text styling via className
    custom: '',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
    lg: 'text-base px-6 py-3.5 gap-2.5 rounded-2xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={classNames(
        baseStyles,
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Memuat...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
