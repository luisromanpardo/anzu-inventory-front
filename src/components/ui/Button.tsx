import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'rounded-white' | 'pill' | 'flat-square' | 'primary';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'rounded-white', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      ghost:
        'bg-transparent text-ink-black px-4 py-2 rounded-[9999px] border border-transparent hover:bg-subtle-gray active:scale-[0.97]',
      'rounded-white':
        'bg-canvas text-ink-black border border-subtle-gray px-5 py-[11px] rounded-[22.8092px] shadow-[0px_4px_24px_rgba(69,36,219,0.15)] hover:shadow-[0px_6px_28px_rgba(69,36,219,0.25)] active:scale-[0.97]',
      pill: 'bg-canvas text-ink-black border border-subtle-gray px-4 py-2 rounded-[30px] hover:border-shop-violet/30 hover:shadow-[0px_4px_24px_rgba(69,36,219,0.15)] active:scale-[0.97]',
      'flat-square':
        'bg-transparent text-ink-black px-3 py-3 rounded-none hover:bg-subtle-gray active:scale-[0.97]',
      primary:
        'bg-shop-violet text-white px-5 py-[11px] rounded-[22.8092px] shadow-[0px_4px_24px_rgba(69,36,219,0.25)] hover:shadow-[0px_6px_28px_rgba(69,36,219,0.35)] hover:bg-shop-violet/90 active:scale-[0.97]',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';