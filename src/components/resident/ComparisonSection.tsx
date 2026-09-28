import React from 'react';
import { Section } from '../ui/Section';
import { Check, Minus, ShieldCheck, Sparkles } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const features = [
    {
      label: 'Staff Verification & Badging',
      others: 'Unverified / Random workers',
      gk: '100% Police & Aadhaar Verified',
      gkHighlight: true,
    },
    {
      label: 'Gate Security & Pass Clearance',
      others: 'Security hold-ups at entry',
      gk: 'Pre-Approved Digital Batch Passes',
      gkHighlight: true,
    },
    {
      label: 'Quiet Hours (1:00 – 2:30 PM)',
      others: 'Ignored / Corridor noise',
      gk: 'Strictly Enforced & Observed',
      gkHighlight: true,
    },
    {
      label: 'Pricing Structure',
      others: 'Arbitrary high individual quote',
      gk: 'Guaranteed 20%–35% Bulk Discount',
      gkHighlight: true,
    },
    {
      label: 'Payment Model',
      others: 'Advance demand or cash only',
      gk: 'Pay After Service Satisfaction',
      gkHighlight: true,
    },
    {
      label: 'Society RWA Coordination',
      others: 'None (ad-hoc entry)',
      gk: 'Official Association Partnership',
      gkHighlight: true,
    },
    {
      label: 'Damage & Service Warranty',
      others: 'Zero accountability',
      gk: '100% Re-service Guarantee',
      gkHighlight: true,
    },
  ];

  return (
    <Section bg="surface-alt" className="border-b border-[#E4E0D8]">
      <div className="space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
            Why Hyderabad Gated Communities Choose Us
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111111] leading-[1.08] tracking-tight">
            The community standard.
          </h2>
          <p className="text-sm sm:text-base text-[#5C5A56]">
            Traditional on-demand apps flood towers with unvetted independent contractors. GK organizes unified society batches.
          </p>
        </div>

        {/* Comparison Table Desktop */}
        <div className="bg-white rounded-[24px] border border-[#E4E0D8] overflow-hidden shadow-2xs">
          <div className="grid grid-cols-12 text-left border-b border-[#E4E0D8] bg-[#FAF8F5] p-5 sm:p-6 text-xs sm:text-sm font-semibold text-[#111111]">
            <div className="col-span-5 sm:col-span-6 text-[#5C5A56] uppercase tracking-wider text-[11px]">
              Service Standards
            </div>
            <div className="col-span-3 sm:col-span-3 text-[#5C5A56] uppercase tracking-wider text-[11px]">
              Random Outside Vendors
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
