import React, { useState } from 'react';
import { Section } from '../ui/Section';
import { StatCard } from '../ui/StatCard';
import { Button } from '../ui/Button';
import { MapPin, Search, CheckCircle2, ShieldCheck, Clock, Users, RefreshCw } from 'lucide-react';

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
      setLookupResult(`Active Service Hub: We coordinate society service batches across ${query.trim()}!`);
    } else {
      setLookupResult(`We are expanding across Hyderabad — submit your society details to fast-track portal activation.`);
    }
  };

  return (
    <Section bg="bg" className="border-b border-[#E4E0D8]">
      <div className="space-y-12 sm:space-y-16">
        {/* Header & Area Checker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
              Hyderabad Community Coverage
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111111] leading-[1.08] tracking-tight">
              Serving premier gated communities.
            </h2>
            <p className="text-sm sm:text-base text-[#5C5A56] leading-relaxed max-w-xl">
              From high-rise towers in the Financial District and Gachibowli to expansive residential communities in Tellapur and Kondapur.
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
                  placeholder="e.g. Kondapur, Gachibowli, Tellapur..."
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

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-[24px] border border-[#E4E0D8] space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-[#F0EDE7] flex items-center justify-center text-[#2596be]">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-medium text-[#111111]">
              Pooled Demand
            </h3>
            <p className="text-xs text-[#5C5A56] leading-relaxed">
              When more residents join the same campaign, providers offer community-specific pricing slabs.
            </p>
          </div>

          <div className="p-6 bg-white rounded-[24px] border border-[#E4E0D8] space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-[#F0EDE7] flex items-center justify-center text-[#2596be]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-medium text-[#111111]">
              Gate Pass Integration
            </h3>
            <p className="text-xs text-[#5C5A56] leading-relaxed">
              Pre-cleared technician rosters submitted in advance to MyGate and society security booths.
            </p>
          </div>

          <div className="p-6 bg-white rounded-[24px] border border-[#E4E0D8] space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-[#F0EDE7] flex items-center justify-center text-[#2596be]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-medium text-[#111111]">
              Quiet Hours Respected
            </h3>
            <p className="text-xs text-[#5C5A56] leading-relaxed">
              1:00 PM – 2:30 PM noise-free rest period strictly observed across residential towers.
            </p>
          </div>

          <div className="p-6 bg-white rounded-[24px] border border-[#E4E0D8] space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-[#F0EDE7] flex items-center justify-center text-[#2596be]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-medium text-[#111111]">
              Rework Guarantee
            </h3>
            <p className="text-xs text-[#5C5A56] leading-relaxed">
              Complete peace of mind with 24-hour complimentary re-inspection if not fully satisfied.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
};
