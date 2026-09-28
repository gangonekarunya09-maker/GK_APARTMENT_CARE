import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const PromoBar: React.FC<{ onExplore?: () => void }> = ({ onExplore }) => {
  return (
    <aside aria-label="Announcement" className="bg-[#111111] text-[#FAF8F5] text-xs font-medium py-2.5 px-4 border-b border-white/10 select-none">
      <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-2 text-center flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#2596be]/20 text-[#2596be] text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          Sunday Bulk Batches
        </span>
        <span className="text-[#FAF8F5]/90">
          Save up to 35% on complete home deep cleaning &amp; car care in your society pool.
        </span>
        {onExplore && (
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-1 text-[#2596be] hover:text-white underline underline-offset-2 font-semibold cursor-pointer ml-1"
          >
            <span>View Services</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </aside>
  );
};
