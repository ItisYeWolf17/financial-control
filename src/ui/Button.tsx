import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './ui.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  block?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'secondary',
  block = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-${variant}${block ? ' btn-block' : ''}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {children}
    </button>
  );
}
