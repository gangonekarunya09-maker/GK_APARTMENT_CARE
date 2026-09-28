import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'accent' | 'success' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'h-6 px-2.5 text-[11px] gap-1',
    md: 'h-7 px-3 text-xs gap-1.5',
  };

  const variantStyles = {
    neutral: 'bg-[#F0EDE7] text-[#5C5A56] border border-[#E4E0D8]',
    accent: 'bg-[#2596be]/10 text-[#2596be] border border-[#2596be]/20',
    success: 'bg-[#2E8B57]/10 text-[#2E8B57] border border-[#2E8B57]/20',
    outline: 'bg-white text-[#111111] border border-[#E4E0D8]',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full select-none uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
