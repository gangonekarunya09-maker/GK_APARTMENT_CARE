import React from 'react';
import { Section } from '../ui/Section';
import { Check, Minus, ShieldCheck, Sparkles } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const features = [
    {
      label: 'Staff Badging & Pre-Clearance',
      others: 'Unvetted individual contractors',
      gk: 'Background-Checked & Uniformed Personnel',
    },
    {
      label: 'Gate Security Synchronization',
      others: 'Security hold-ups & manual calls',
      gk: 'Advance Roster via Security Apps (MyGate)',
    },
    {
      label: 'Quiet Hours (1:00 – 2:30 PM)',
      others: 'Frequent corridor & drilling noise',
      gk: 'Strictly Enforced Afternoon Pause',
    },
    {
      label: 'Community Batch Coordination',
      others: 'Individual random appointments',
      gk: 'Organized Apartment Service Campaigns',
    },
    {
      label: 'Payment Model',
      others: 'Advance deposit or arbitrary cash',
      gk: 'Zero Deposit · Pay on Inspection',
    },
    {
      label: 'Society RWA Alignment',
      others: 'None (ad-hoc residential entry)',
      gk: 'Coordinated with Association Bylaws',
    },
    {
      label: 'Service Quality Guarantee',
      others: 'Difficult to hold contractors accountable',
      gk: 'Complimentary Rework within 24 Hours',
    },
  ];

  return (
    <Section bg="surface-alt" className="border-b border-[#E4E0D8]">
      <div className="space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
            Why Communities Choose GK Apartment Care
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111111] leading-[1.08] tracking-tight">
            Designed for gated apartment life.
          </h2>
          <p className="text-sm sm:text-base text-[#5C5A56]">
            Instead of random contractors entering your tower at all hours, GK coordinates organized community batches with pre-cleared access and quiet hour compliance.
          </p>
        </div>

        {/* Comparison Table Desktop */}
        <div className="bg-white rounded-[24px] border border-[#E4E0D8] overflow-hidden shadow-2xs">
          <div className="grid grid-cols-12 text-left border-b border-[#E4E0D8] bg-[#FAF8F5] p-5 sm:p-6 text-xs sm:text-sm font-semibold text-[#111111]">
            <div className="col-span-5 sm:col-span-6 text-[#5C5A56] uppercase tracking-wider text-[11px]">
              Operational Standard
            </div>
            <div className="col-span-3 sm:col-span-3 text-[#5C5A56] uppercase tracking-wider text-[11px]">
              Unorganized Outside Vendors
            </div>
            <div className="col-span-4 sm:col-span-3 text-[#111111] uppercase tracking-wider text-[11px] flex items-center gap-1 font-bold text-[#2596be]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GK Apartment Care</span>
            </div>
          </div>

          <div className="divide-y divide-[#E4E0D8]">
            {features.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 items-center p-5 sm:p-6 text-xs sm:text-sm hover:bg-[#FAF8F5]/60 transition-colors"
              >
                <div className="col-span-5 sm:col-span-6 font-medium text-[#111111]">
                  {row.label}
                </div>

                <div className="col-span-3 sm:col-span-3 text-[#5C5A56] flex items-center gap-2">
                  <Minus className="w-4 h-4 text-[#5C5A56]/60 shrink-0 hidden sm:inline" />
                  <span className="line-clamp-2">{row.others}</span>
                </div>

                <div className="col-span-4 sm:col-span-3 font-semibold text-[#111111] flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2E8B57] shrink-0" />
                  <span className="text-[#111111]">{row.gk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};
