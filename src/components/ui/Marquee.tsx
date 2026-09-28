import React, { useState } from 'react';
import { Pause, Play } from 'lucide-react';

export interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: 'slow' | 'normal' | 'fast';
  showControl?: boolean;
  className?: string;
  itemGap?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  direction = 'left',
  speed = 'normal',
  showControl = true,
  className = '',
  itemGap = 'gap-4 sm:gap-6',
}) => {
  const [isPaused, setIsPaused] = useState(false);

  const durationClass =
    speed === 'slow' ? 'duration-[65s]' : speed === 'fast' ? 'duration-[25s]' : 'duration-[45s]';

  const animationName =
    direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div className={`relative w-full overflow-hidden group ${isPaused ? 'marquee-paused' : ''} ${className}`}>
      <div className={`flex items-center ${itemGap} ${animationName} ${durationClass}`}>
        {/* Render items twice for continuous infinite loop */}
        <div className={`flex items-center shrink-0 ${itemGap}`}>
          {children}
        </div>
        <div className={`flex items-center shrink-0 ${itemGap}`} aria-hidden="true">
          {children}
        </div>
      </div>

      {showControl && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-auto">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-8 h-8 rounded-full bg-white/90 border border-[#E4E0D8] shadow-xs flex items-center justify-center text-[#111111] hover:bg-white cursor-pointer focus:opacity-100"
            aria-label={isPaused ? 'Resume animation' : 'Pause animation'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
          </button>
        </div>
      )}
    </div>
  );
};
