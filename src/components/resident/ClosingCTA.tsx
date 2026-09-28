import React from 'react';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles, Building2 } from 'lucide-react';

export const ClosingCTA: React.FC<{
  onBookNow: () => void;
  onExploreServices: () => void;
  onPartnerRWA: () => void;
}> = ({ onBookNow, onExploreServices, onPartnerRWA }) => {
  return (
    <Section bg="inverse" className="text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#2596be] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hyper-Local Care Across Hyderabad</span>
        </span>

        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium text-[#FAF8F5] leading-[1.02] tracking-tight text-balance">
          Tired of vendor chaos at your society gate? <br />
          <span className="text-white/60">Experience effortless apartment care.</span>
        </h2>

        <p className="text-base sm:text-lg text-[#FAF8F5]/80 max-w-xl mx-auto leading-relaxed">
          Book verified home deep cleaning, waterless car wash, or AC servicing with transparent pricing and synchronized gate passes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            variant="inverse"
            size="lg"
            onClick={onBookNow}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Book a Service Today
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onPartnerRWA}
            className="bg-transparent text-[#FAF8F5] border-white/20 hover:border-white hover:bg-white/10"
          >
            Partner Your RWA Society
          </Button>
        </div>
      </div>
    </Section>
  );
};
