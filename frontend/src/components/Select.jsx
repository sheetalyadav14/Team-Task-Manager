import { forwardRef } from 'react';
import { cn } from '../utils/cn.js';

const Select = forwardRef(function Select(
  { className = '', error, children, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-800 transition-colors',
        error ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-brand-500',
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
});

export default Select;
