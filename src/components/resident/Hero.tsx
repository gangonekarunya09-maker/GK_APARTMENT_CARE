import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Marquee } from '../ui/Marquee';
import { Building2, ArrowRight, ShieldCheck, Clock, Sparkles, CheckCircle2, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onExploreClick: () => void;
  onHowItWorksClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onHowItWorksClick }) => {
  const tickerItems = [
    { icon: <Building2 className="w-3.5 h-3.5 text-[#2596be]" />, text: 'Gated Communities Across Hyderabad' },
    { icon: <Clock className="w-3.5 h-3.5 text-[#2596be]" />, text: '1:00 – 2:30 PM Quiet Hours Maintained' },
    { icon: <ShieldCheck className="w-3.5 h-3.5 text-[#2596be]" />, text: 'Vetted & Badged Service Personnel' },
    { icon: <Users className="w-3.5 h-3.5 text-[#2596be]" />, text: 'Pooled Resident Demand Campaigns' },
    { icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#2596be]" />, text: 'Pre-Cleared Gate Passes & Zero Gate Delays' },
    { icon: <Sparkles className="w-3.5 h-3.5 text-[#2596be]" />, text: 'Transparent Community-Specific Slabs' },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] border-b border-[#E4E0D8] pt-12 sm:pt-18 lg:pt-22 pb-0 relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center"
          >
            <Badge variant="neutral" size="md" icon={<Building2 className="w-3.5 h-3.5 text-[#2596be]" />}>
              Community-Coordinated Home Care
            </Badge>
          </motion.div>

          {/* Big Tight-Tracked Display Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="font-display text-[clamp(40px,7vw,88px)] font-medium text-[#111111] leading-[0.98] tracking-[-0.035em] text-balance"
          >
            Home services, organized <br className="hidden sm:inline" />
            <span className="text-[#5C5A56]">for your community.</span>
          </motion.h1>

          {/* Subcopy */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base sm:text-xl text-[#5C5A56] max-w-2xl mx-auto font-normal leading-relaxed text-balance"
          >
            Discover services arranged for your apartment community. Join a service campaign, help build demand, and GK Apartment Care coordinates the provider and service schedule.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={onExploreClick}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Services
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={onHowItWorksClick}
            >
              How It Works
            </Button>
          </motion.div>

          {/* Key Facts Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-6 pb-2 text-xs text-[#5C5A56] flex items-center justify-center gap-6 flex-wrap"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E8B57]" />
              <span>No advance payment required</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E8B57]" />
              <span>Pay on service completion</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E8B57]" />
              <span>Coordinated gate pass clearance</span>
            </span>
          </motion.div>
        </div>
      </div>

      {/* Pinned Stat Ticker Marquee Strip */}
      <div className="w-full mt-8 sm:mt-12 py-3.5 sm:py-4 bg-[#F0EDE7] border-t border-[#E4E0D8]">
        <Marquee speed="normal" direction="left" showControl={false} itemGap="gap-8 sm:gap-12">
          {tickerItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#111111] whitespace-nowrap"
            >
              {item.icon}
              <span>{item.text}</span>
              <span className="text-[#E4E0D8] ml-6">/</span>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};
