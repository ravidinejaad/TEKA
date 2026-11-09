import React from 'react';
import classNames from 'classnames';

export default function Skeleton({
  variant = 'text',
  count = 1,
  className = '',
  height,
  width,
}) {
  const baseClasses = 'bg-slate-200 animate-pulse rounded-lg';

  const variants = {
    text: 'h-4 w-full',
    rect: 'h-24 w-full',
    circle: 'rounded-full h-10 w-10 shrink-0',
  };

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {items.map((i) => (
        <div
          key={i}
          className={classNames(baseClasses, variants[variant], className)}
          style={{ height, width }}
        />
      ))}
    </>
  );
}

