import React, { useState } from 'react';
import { Section } from '../ui/Section';
import { StatCard } from '../ui/StatCard';
import { Button } from '../ui/Button';
import { MapPin, Search, CheckCircle2, Building2 } from 'lucide-react';

export const NetworkSection: React.FC<{ onExplore?: () => void }> = ({ onExplore }) => {
  const [query, setQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<string | null>(null);

  const coveredAreas = [
    'Hitec City',
    'Gachibowli',
    'Kondapur',
    'Financial District',
    'Nallagandla',
    'Madhapur',
    'Miyapur',
    'Kukatpally',
    'Kokapet',
    'Tellapur',
    'Manikonda',
    'Banjara Hills',
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const match = coveredAreas.some(area =>
      area.toLowerCase().includes(query.trim().toLowerCase())
    );
    if (match || /5000\d\d/.test(query.trim())) {
      setLookupResult(`Active Service Hub: We have dedicated batch managers across ${query.trim()}!`);
    } else {
      setLookupResult(`We are expanding rapidly to ${query.trim()} — submit your society to fast-track onboarding.`);
    }
  };

  return (
    <Section bg="bg" className="border-b border-[#E4E0D8]">
      <div className="space-y-12 sm:space-y-16">
        {/* Header & Area Checker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
              Hyper-Local Presence
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111111] leading-[1.08] tracking-tight">
              Powering 45+ premier societies across Hyderabad.
            </h2>
            <p className="text-sm sm:text-base text-[#5C5A56] leading-relaxed max-w-xl">
              From high-rise towers in Financial District to expansive villas in Tellapur, our verified technician hubs ensure fast, quiet doorstep execution.
            </p>
          </div>

          {/* Area / Society Lookup */}
          <div className="lg:col-span-5 p-6 bg-white rounded-[24px] border border-[#E4E0D8] shadow-2xs space-y-3">
            <div className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2596be]" />
              <span>Check Your Community or Area Coverage</span>
            </div>

            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value);
                    setLookupResult(null);
                  }}
                  placeholder="e.g. Kondapur, 500081, My Home"
                  className="w-full pl-4 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-xs sm:text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                />
              </div>
              <Button variant="primary" size="sm" type="submit">
                Check
              </Button>
            </form>

            {lookupResult && (
              <div className="p-3 bg-[#F0EDE7] rounded-xl text-xs text-[#111111] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2596be] shrink-0" />
                <span>{lookupResult}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4 Stat Cards with Big Numerals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            numeral="25K+"
            label="Flats Covered"
            description="Active resident households serviced across Cyberabad."
            tag="Reach"
          />
          <StatCard
            numeral="45+"
            label="Gated Societies"
            description="Official RWA partnership agreements in place."
            tag="Partners"
          />
          <StatCard
            numeral="35%"
            label="Average Savings"
            description="Unlocked through organized Sunday bulk batch pooling."
            tag="Discounts"
          />
          <StatCard
            numeral="4.9★"
            label="Resident Rating"
            description="Across 12,000+ completed doorstep visits."
            tag="Satisfaction"
          />
        </div>
      </div>
    </Section>
  );
};
