import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, CalendarCheck } from 'lucide-react';

export const MobileStickyCTA: React.FC = () => {
  const { services, setBookingModalService, residentTab } = useApp();

  if (residentTab !== 'services') return null;

  // Default to popular car wash or first service
  const featured = services.find(s => s.id === 'srv-car-wash') || services[0];
  if (!featured) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] z-30 lg:hidden shadow-sm">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <div className="leading-tight">
          <div className="text-[10px] text-[#667085] uppercase tracking-wider font-semibold">Sunday Bulk Special</div>
          <div className="text-xs font-bold text-[#142326] truncate max-w-[150px] sm:max-w-[200px]">
            {featured.name}
          </div>
          <div className="text-xs text-[#2596be] font-extrabold font-mono tabular-nums">
            From ₹{featured.sundayBulkPrice}
          </div>
        </div>

        <button
          onClick={() => setBookingModalService(featured)}
          className="px-5 py-2.5 bg-[#2596be] active:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-transform active:scale-[0.98] shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Book Service</span>
        </button>
      </div>
    </div>
  );
};
