import { ReactNode } from 'react';
import { cn } from '../../lib/utilities';

interface HeadingProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl';
  className?: string;
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl md:text-5xl',
  '5xl': 'text-5xl md:text-6xl',
  '6xl': 'text-6xl md:text-7xl',
  '7xl': 'text-7xl md:text-8xl',
  '8xl': 'text-8xl',
};

export function Heading({ children, as: Component = 'h2', size = 'base', className }: HeadingProps) {
  return (
    <Component className={cn('font-semibold tracking-tight', sizeClasses[size], className)}>
      {children}
    </Component>
  );
}

