import React from 'react';
import classNames from 'classnames';

export default function Card({ children, hover = false, className = '', onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'bg-white rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-300 overflow-hidden',
        hover && 'hover:shadow-quiziz hover:-translate-y-1 hover:border-purple-200 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={classNames('p-5 border-b border-slate-100 flex items-center justify-between', className)}>
      <div>
        {title && <h3 className="font-semibold text-slate-900 text-lg">{title}</h3>}
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function CardBody({ children, className = '' }) {
  return <div className={classNames('p-5', className)}>{children}</div>;
}

function CardFooter({ children, className = '' }) {
  return (
    <div
      className={classNames(
        'p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between',
        className
      )}
    >
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

