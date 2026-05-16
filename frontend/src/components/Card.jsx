import { cn } from '../utils/cn.js';

export default function Card({ className = '', interactive = false, children, ...rest }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-5 shadow-sm',
        interactive && 'sy-card-hover',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
