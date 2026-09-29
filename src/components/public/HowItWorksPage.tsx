import React from 'react';
import { useApp } from '../../context/AppContext';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Building2,
  Users,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Wrench,
  ShieldCheck,
  Clock,
  HelpCircle,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { navigate } = useApp();

  const lifecycleSteps = [
    {
      step: '01',
      phase: 'COMMUNITY ONBOARDING',
      title: 'Community Portal Configuration',
      desc: 'GK operations registers the apartment community and configures a private digital portal link (/c/:slug/:token) with society-specific block names and gate security app parameters.',
    },
    {
      step: '02',
      phase: 'SERVICE SELECTION',
      title: 'Curated Service Catalog',
      desc: 'Services suitable for high-rise apartment living (such as waterless foam car detailing, sofa sanitization, deep kitchen cleaning, and AC servicing) are mapped to the community.',
    },
    {
      step: '03',
      phase: 'CAMPAIGN LAUNCH',
      title: 'Service Campaign Creation',
      desc: 'A dedicated service campaign is published for the society with defined target minimum flats, preferred service dates (e.g. Sunday batch), and transparent community pricing slabs.',
    },
    {
      step: '04',
      phase: 'RESIDENT INTEREST',
      title: 'Expressing Interest ("I\'m Interested")',
      desc: 'Residents open their private community portal link and click "I\'m Interested" to select their preferred time slot and unit details. No advance payment is required to join.',
    },
    {
      step: '05',
      phase: 'DEMAND AGGREGATION',
      title: 'Pooling Society Demand',
      desc: 'As neighbors join the pool, the live demand progress bar advances toward the minimum threshold required to confirm the dedicated on-site crew.',
    },
    {
      step: '06',
      phase: 'PROVIDER ASSIGNMENT',
      title: 'Specialist Crew Selection',
      desc: 'Once the batch criteria are met, GK assigns a qualified service provider equipped with commercial-grade tools and pre-vetted personnel.',
    },
    {
      step: '07',
      phase: 'GATE CLEARANCE & SCHEDULING',
      title: 'Coordinated Society Scheduling',
      desc: 'GK issues advance entry rosters and digital gate passes to the society security desk (MyGate/ApnaComplex) to ensure zero gate delays and respect 1:00–2:30 PM quiet hours.',
    },
    {
      step: '08',
      phase: 'EXECUTION & SETTLEMENT',
      title: 'Doorstep Service & Payment',
      desc: 'Technicians execute the service doorstep-by-doorstep. Residents inspect the completed work and settle payment directly upon complete satisfaction.',
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero */}
      <Section bg="bg" className="border-b border-[#E4E0D8] pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="neutral" size="md" icon={<Sparkles className="w-3.5 h-3.5 text-[#2596be]" />}>
            The Workflow
          </Badge>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium text-[#111111] leading-[1.04] tracking-tight">
            How GK Apartment Care Works
          </h1>

          <p className="text-base sm:text-xl text-[#5C5A56] max-w-2xl mx-auto leading-relaxed">
            From society campaign creation to doorstep execution — here is the step-by-step lifecycle of our coordinated community home care platform.
          </p>
        </div>
      </Section>

      {/* Important Clarification Box */}
      <Section bg="surface" className="border-b border-[#E4E0D8] py-8 sm:py-10">
        <div className="max-w-3xl mx-auto p-6 sm:p-8 bg-[#FAF8F5] rounded-[24px] border border-[#E4E0D8] space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2596be]">
            <HelpCircle className="w-4 h-4 text-[#2596be]" />
            <span>Key Difference: Demand Pooling vs. Instant Booking</span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
            Why we use &ldquo;I&apos;m Interested&rdquo; instead of instant checkout
          </h3>
          <p className="text-xs sm:text-sm text-[#5C5A56] leading-relaxed">
            GK Apartment Care is not an open marketplace where uncoordinated individual contractors arrive at random hours. When you click <strong className="text-[#111111]">&ldquo;I&apos;m Interested&rdquo;</strong>, you register for a synchronized society batch. This enables wholesale community rates, pre-cleared gate passes, and peaceful quiet hours for your tower.
          </p>
        </div>
      </Section>

      {/* Complete Step-by-Step Lifecycle Grid */}
      <Section bg="bg" className="border-b border-[#E4E0D8]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
              The 8-Stage Lifecycle
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#111111]">
              From launch to doorstep completion
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {lifecycleSteps.map((item, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 bg-white rounded-[24px] border border-[#E4E0D8] space-y-4 shadow-2xs hover:border-[#111111]/30 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-medium text-2xl text-[#2596be] font-mono">
                      {item.step}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#F0EDE7] text-[#5C5A56]">
                      {item.phase}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-medium text-[#111111]">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5C5A56] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Safety & Protocol Pillars */}
      <Section bg="surface-alt" className="border-b border-[#E4E0D8]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
              Community Protocols
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#111111]">
              Guaranteed apartment standards
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-[24px] border border-[#E4E0D8] space-y-2.5 text-center">
              <ShieldCheck className="w-6 h-6 text-[#2596be] mx-auto mb-2" />
              <h4 className="font-display text-base font-medium text-[#111111]">
                Verified Personnel
              </h4>
              <p className="text-xs text-[#5C5A56] leading-relaxed">
                Aadhaar and police-checked staff wearing uniforms and ID badges.
              </p>
            </div>

            <div className="p-6 bg-white rounded-[24px] border border-[#E4E0D8] space-y-2.5 text-center">
              <Clock className="w-6 h-6 text-[#2596be] mx-auto mb-2" />
              <h4 className="font-display text-base font-medium text-[#111111]">
                Quiet Hours Maintained
              </h4>
              <p className="text-xs text-[#5C5A56] leading-relaxed">
                1:00 PM to 2:30 PM noise-free rest period respected across all blocks.
              </p>
            </div>

            <div className="p-6 bg-white rounded-[24px] border border-[#E4E0D8] space-y-2.5 text-center">
              <CheckCircle2 className="w-6 h-6 text-[#2E8B57] mx-auto mb-2" />
              <h4 className="font-display text-base font-medium text-[#111111]">
                Pay Post Completion
              </h4>
              <p className="text-xs text-[#5C5A56] leading-relaxed">
                Zero advance deposit. Direct settlement upon complete satisfaction.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section bg="inverse" className="text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-2xl sm:text-4xl font-medium text-[#FAF8F5]">
            Experience organized community care
          </h2>
          <p className="text-sm sm:text-base text-[#FAF8F5]/80 leading-relaxed">
            View available services or request a customized community portal for your apartment complex.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="inverse"
              size="lg"
              onClick={() => navigate('/services')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Services Catalog
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/rwa')}
              className="bg-transparent text-[#FAF8F5] border-white/20 hover:border-white hover:bg-white/10"
            >
              RWA Society Partnerships
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};
