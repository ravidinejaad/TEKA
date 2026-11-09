import React, { forwardRef } from 'react';
import classNames from 'classnames';

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative rounded-xl">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={classNames(
              'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20',
              Icon ? 'pl-11' : 'pl-3.5',
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-purple-600',
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
            <span>•</span>
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

