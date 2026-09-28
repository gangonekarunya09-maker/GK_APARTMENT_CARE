import React from 'react';

export interface StatCardProps {
  numeral: string;
  label: string;
  description?: string;
  tag?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  numeral,
  label,
  description,
  tag,
  className = '',
}) => {
  return (
    <div
      className={`p-7 sm:p-9 bg-white rounded-[24px] border border-[#E4E0D8] hover:border-[#111111]/30 transition-all duration-300 flex flex-col justify-between group ${className}`}
    >
      <div>
        {tag && (
          <span className="inline-block text-[11px] uppercase tracking-wider font-semibold text-[#5C5A56] bg-[#F0EDE7] px-2.5 py-1 rounded-full mb-4">
            {tag}
          </span>
        )}
        <div className="font-display font-medium text-[clamp(44px,7vw,88px)] leading-[0.95] tracking-tight text-[#111111] mb-3 group-hover:text-[#2596be] transition-colors">
          {numeral}
        </div>
      </div>
      <div>
        <h4 className="text-base sm:text-lg font-medium text-[#111111] leading-snug">
          {label}
        </h4>
        {description && (
          <p className="text-xs sm:text-sm text-[#5C5A56] mt-1.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
