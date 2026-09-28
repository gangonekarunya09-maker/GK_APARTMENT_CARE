import React from 'react';
import { Section } from '../ui/Section';
import { Marquee } from '../ui/Marquee';
import {
  Sparkles,
  Car,
  Home,
  Wind,
  Droplets,
  Bug,
  ShieldAlert,
  Hammer,
  Layers,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

export const ServicesMarquee: React.FC = () => {
  const row1 = [
    { icon: <Home className="w-4 h-4 text-[#2596be]" />, label: 'Deep Home Cleaning' },
    { icon: <Car className="w-4 h-4 text-[#2596be]" />, label: 'Waterless Foam Car Wash' },
    { icon: <Wind className="w-4 h-4 text-[#2596be]" />, label: 'AC Jet Deep Clean & Gas Refill' },
    { icon: <Droplets className="w-4 h-4 text-[#2596be]" />, label: 'Sofa & Mattress Steam Extraction' },
    { icon: <Bug className="w-4 h-4 text-[#2596be]" />, label: 'Odourless Herbal Pest Control' },
    { icon: <ShieldAlert className="w-4 h-4 text-[#2596be]" />, label: 'Balcony Pigeon Netting (SS 304)' },
  ];

  const row2 = [
    { icon: <Sparkles className="w-4 h-4 text-[#2596be]" />, label: 'Bathroom Tile Scale Descaling' },
    { icon: <Layers className="w-4 h-4 text-[#2596be]" />, label: 'Kitchen Chimney & Hob Degreasing' },
    { icon: <Hammer className="w-4 h-4 text-[#2596be]" />, label: 'Move-in / Move-out Turnover' },
    { icon: <Wrench className="w-4 h-4 text-[#2596be]" />, label: 'Water Purifier & Geyser Descaling' },
    { icon: <Car className="w-4 h-4 text-[#2596be]" />, label: 'SUV & Sedan Interior Detailing' },
    { icon: <CheckCircle2 className="w-4 h-4 text-[#2596be]" />, label: 'Pre-Festival Association Batches' },
  ];

  return (
    <Section bg="surface-alt" className="border-b border-[#E4E0D8] overflow-hidden">
      <div className="space-y-8">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
            Comprehensive Apartment Scope
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111111] leading-[1.08] tracking-tight mt-2">
            What we take care of.
          </h2>
          <p className="text-sm sm:text-base text-[#5C5A56] mt-2">
            Every home service executed by vetted specialists with hospital-grade equipment and eco-safe consumables.
          </p>
        </div>

        {/* Dual Marquee Rows */}
        <div className="space-y-3.5 -mx-5 sm:-mx-8 lg:-mx-10">
          <Marquee speed="slow" direction="left" itemGap="gap-3.5 sm:gap-4">
            {row1.map((item, idx) => (
              <div
                key={idx}
                className="h-12 sm:h-14 px-5 sm:px-6 rounded-full bg-white border border-[#E4E0D8] hover:border-[#111111] transition-colors flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#111111] whitespace-nowrap shadow-2xs select-none"
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </Marquee>

          <Marquee speed="slow" direction="right" itemGap="gap-3.5 sm:gap-4">
            {row2.map((item, idx) => (
              <div
                key={idx}
                className="h-12 sm:h-14 px-5 sm:px-6 rounded-full bg-white border border-[#E4E0D8] hover:border-[#111111] transition-colors flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#111111] whitespace-nowrap shadow-2xs select-none"
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </Section>
  );
};
