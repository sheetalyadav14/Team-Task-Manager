import { forwardRef } from 'react';
import { cn } from '../utils/cn.js';

const Input = forwardRef(function Input({ className = '', error, ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors',
        error
          ? 'border-red-400 focus:border-red-500'
          : 'border-slate-300 focus:border-brand-500',
        className,
      )}
      {...rest}
    />
  );
});

export default Input;
