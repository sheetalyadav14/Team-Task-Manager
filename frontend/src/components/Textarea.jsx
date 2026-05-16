import { forwardRef } from 'react';
import { cn } from '../utils/cn.js';

const Textarea = forwardRef(function Textarea({ className = '', error, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[80px] w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 transition-colors',
        error ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-brand-500',
        className,
      )}
      {...rest}
    />
  );
});

export default Textarea;
