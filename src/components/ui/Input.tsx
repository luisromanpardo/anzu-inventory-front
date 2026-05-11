import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full px-5 py-3 rounded-[9999px] bg-transparent text-ink-black text-body',
          'placeholder:text-placeholder-text',
          'border border-subtle-gray',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-shop-violet focus:ring-offset-2 focus:border-shop-violet',
          'hover:border-shop-violet/50',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('text-body-sm text-muted-text font-medium', className)}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = 'Label';