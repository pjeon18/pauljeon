import { ReactNode } from 'react';
import { cn } from '../../lib/utilities';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: 'section' | 'div';
}

export function Section({ children, className, id, as: Component = 'section' }: SectionProps) {
  return (
    <Component
      id={id}
      className={cn('py-16 md:py-24 lg:py-32', className)}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      {children}
    </Component>
  );
}

