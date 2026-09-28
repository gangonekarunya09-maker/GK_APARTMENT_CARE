import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'inverse' | 'accent' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'right',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none rounded-full disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 active:scale-[0.98]';

  const sizeStyles = {
    sm: 'h-10 px-5 text-xs gap-1.5',
    md: 'h-12 sm:h-14 px-6 sm:px-7 text-sm sm:text-base gap-2',
    lg: 'h-14 sm:h-16 px-8 sm:px-9 text-base sm:text-lg gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#111111] text-[#FAF8F5] hover:bg-[#2596be] hover:text-white border border-transparent shadow-xs',
    secondary:
      'bg-white text-[#111111] border border-[#E4E0D8] hover:border-[#111111] hover:bg-[#FAF8F5]',
    inverse:
      'bg-[#FAF8F5] text-[#111111] hover:bg-white border border-transparent font-semibold shadow-xs',
    accent:
      'bg-[#2596be] text-white hover:bg-[#1e7ca0] border border-transparent shadow-xs font-semibold',
    link:
      'bg-transparent text-[#111111] hover:text-[#2596be] underline underline-offset-4 px-0 h-auto rounded-none border-0 active:scale-100',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
