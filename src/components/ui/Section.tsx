import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  bg?: 'bg' | 'surface' | 'surface-alt' | 'inverse';
  bleed?: boolean;
  containerClassName?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  bg = 'bg',
  bleed = false,
  className = '',
  containerClassName = '',
  id,
  ...props
}) => {
  const bgStyles = {
    bg: 'bg-[#FAF8F5] text-[#111111]',
    surface: 'bg-white text-[#111111]',
    'surface-alt': 'bg-[#F0EDE7] text-[#111111]',
    inverse: 'bg-[#111111] text-[#FAF8F5]',
  };

  return (
    <section
      id={id}
      className={`w-full py-16 sm:py-24 lg:py-32 ${bgStyles[bg]} ${className}`}
      {...props}
    >
      {bleed ? (
        children
      ) : (
        <div
          className={`max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 w-full ${containerClassName}`}
        >
          {children}
        </div>
      )}
    </section>
  );
};
