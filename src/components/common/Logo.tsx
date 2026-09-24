import React from 'react';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showSubtitle = true,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const titleSizes = {
    sm: 'text-sm font-bold tracking-tight',
    md: 'text-base font-extrabold tracking-tight',
    lg: 'text-xl font-black tracking-tight',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon SVG */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-lg bg-[#2596be] flex items-center justify-center text-white shadow-sm`}
        style={{ backgroundColor: '#2596be' }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
        >
          {/* Apartment towers outline */}
          <path
            d="M6 26V11L14 6V26"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 13L26 9V26"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Windows / Care check */}
          <path
            d="M10 16H10.01M10 20H10.01M20 15H20.01M20 19H20.01M20 23H20.01"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Subtle shield / care foundation base line */}
          <path
            d="M4 26H28"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`${titleSizes[size]} text-[#142326] font-['Plus_Jakarta_Sans'] whitespace-nowrap`}
        >
          GK <span style={{ color: '#2596be' }}>APARTMENT CARE</span>
        </span>
        {showSubtitle && (
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#667085] mt-0.5">
            Hyderabad Communities
          </span>
        )}
      </div>
    </div>
  );
};
