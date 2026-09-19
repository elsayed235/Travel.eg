import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

/**
 * Dahab Button — same API shape as shadcn's button (variant/size/asChild-style
 * polymorphism omitted where unused), but every color routes through the
 * project's theme-reactive tokens (`--color-accent-primary` etc.) so the
 * component recolors itself when ThemeContext swaps data-theme-id.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-accent-primary text-[var(--accent-primary-ink)] hover:brightness-110 shadow-sm',
        outline:
          'border border-border-subtle bg-transparent text-text-primary hover:bg-surface-container',
        ghost: 'text-text-secondary hover:bg-surface-container hover:text-text-primary',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-3.5 text-[--text-xs]',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export { Button, buttonVariants };
