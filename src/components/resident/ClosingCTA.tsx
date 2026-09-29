import React from 'react';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles, Building2 } from 'lucide-react';

export const ClosingCTA: React.FC<{
  onExploreServices: () => void;
  onPartnerRWA: () => void;
}> = ({ onExploreServices, onPartnerRWA }) => {
  return (
    <Section bg="inverse" className="text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-[#2596be] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Home services, organized for your community</span>
        </span>

        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium text-[#FAF8F5] leading-[1.02] tracking-tight text-balance">
          Tired of vendor chaos at your society gate? <br />
          <span className="text-white/60">Experience coordinated apartment care.</span>
        </h2>

        <p className="text-base sm:text-lg text-[#FAF8F5]/80 max-w-xl mx-auto leading-relaxed">
          Join scheduled service campaigns, pool demand with neighbors, and enjoy verified doorstep care with synchronized gate passes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            variant="inverse"
            size="lg"
            onClick={onExploreServices}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Services
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
