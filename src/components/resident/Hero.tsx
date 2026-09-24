import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Sparkles, ShieldCheck, Clock, ArrowRight, Users, Car, Armchair } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onExploreClick: () => void;
  onBookNowClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onBookNowClick }) => {
  const { selectedApartment } = useApp();

  return (
    <section className="bg-gradient-to-b from-[#F8F9FA] to-white border-b border-[#E5E7EB] pt-8 pb-10 sm:pt-12 sm:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Active Society Card Banner */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 py-1.5 px-3.5 bg-white border border-[#E5E7EB] rounded-full shadow-xs"
          >
            <Building2 className="w-4 h-4 text-[#2596be]" />
            <span className="text-xs font-medium text-[#667085]">Dedicated Portal:</span>
            <span className="text-xs font-bold text-[#142326] truncate max-w-[260px] sm:max-w-none">
              {selectedApartment?.name || 'Your Community'}
            </span>
          </motion.div>

          {/* Headline & Subheadline */}
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#142326] tracking-tight leading-[1.15]"
              style={{ textWrap: 'balance' }}
            >
              Premium Home &amp; Auto Care for Gated Communities
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="text-base sm:text-lg text-[#667085] max-w-2xl mx-auto font-normal leading-relaxed"
            >
              On-demand home services 7 days a week + exclusive Sunday bulk discounts. Pre-cleared gate entry for Hyderabad societies.
            </motion.p>
          </div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <button
              onClick={onBookNowClick}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#2596be] text-white font-bold text-sm rounded-xl hover:bg-[#1e7ca0] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Book Service Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#142326] font-semibold text-sm rounded-xl border border-[#E5E7EB] hover:bg-[#F8F9FA] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#2596be]" />
              <span>Explore Services</span>
            </button>
          </motion.div>

          {/* Trust points - compact & clean, no glows */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left"
          >
            <div className="p-3 bg-white rounded-xl border border-[#E5E7EB] shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2596be]/10 text-[#2596be] shrink-0 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-bold text-[#142326]">Pre-Registered Gate Entry</div>
                <div className="text-[11px] text-[#667085]">MyGate / NoBrokerHood sync</div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E5E7EB] shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2596be]/10 text-[#2596be] shrink-0 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-bold text-[#142326]">Quiet Hours Observed</div>
                <div className="text-[11px] text-[#667085]">1:00 PM – 2:30 PM no noise</div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E5E7EB] shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2596be]/10 text-[#2596be] shrink-0 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-bold text-[#142326]">Sunday Community Pool</div>
                <div className="text-[11px] text-[#667085]">Up to 35% bulk savings</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
