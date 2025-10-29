import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utilities';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  as?: React.ElementType;
  to?: string;
}

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  ghost: 'hover:bg-gray-100',
  outline: 'border border-gray-300 hover:bg-gray-50',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  icon: 'p-2',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  as: Component = 'button',
  to,
  ...props
}: ButtonProps) {
  const componentProps = Component === 'button' 
    ? props 
    : { to, ...props };

  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...componentProps}
    >
      {children}
    </Component>
  );
}
