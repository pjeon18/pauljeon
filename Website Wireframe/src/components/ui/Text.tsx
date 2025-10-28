import { ReactNode } from 'react';
import { cn } from '../../lib/utilities';

interface TextProps {
  children: ReactNode;
  as?: 'p' | 'span' | 'div';
  variant?: 'body' | 'caption' | 'small' | 'lead';
  className?: string;
}

const variantClasses = {
  body: 'text-base text-gray-700',
  caption: 'text-sm text-gray-600',
  small: 'text-xs text-gray-600',
  lead: 'text-lg leading-relaxed',
};

export function Text({ children, as: Component = 'p', variant = 'body', className }: TextProps) {
  return (
    <Component className={cn(variantClasses[variant], className)}>
      {children}
    </Component>
  );
}

