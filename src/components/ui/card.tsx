import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * Card — a separate object on the page. Use it by role (a listing, a booking,
 * a summary), not as a default wrapper: sections are laid out with spacing,
 * not boxes. `interactive` adds press feedback for whole-card taps; give it
 * an `onClick` or wrap a real link inside.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padded?: boolean;
  as?: 'div' | 'article' | 'section';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ interactive = false, padded = true, as = 'div', className, ...props }, ref) => {
    const Tag = as as 'div';
    return (
    <Tag
      ref={ref}
      className={cn(
        'bg-dg-surface border border-dg-line rounded-dg-lg min-w-0',
        padded && 'p-4',
        interactive &&
          'cursor-pointer transition-[transform,box-shadow,border-color] duration-200 ease-dg-out hover:shadow-dg-card hover:border-dg-line-strong active:scale-[0.985]',
        className,
      )}
      {...props}
    />
    );
  },
);
Card.displayName = 'Card';

/** Back-compat for the shadcn-style composition the /design demo uses. */
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
  <div className={cn('flex flex-col gap-1.5 p-5', className)} {...p} />
);
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...p }) => (
  <h3 className={cn('font-dg-display text-lg font-semibold leading-tight text-dg-ink', className)} {...p} />
);
export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...p }) => (
  <p className={cn('text-sm text-dg-ink-2', className)} {...p} />
);
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
  <div className={cn('p-5 pt-0', className)} {...p} />
);
