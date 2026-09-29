import React from 'react';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const StepsSection: React.FC<{ onExplore?: () => void; onDetailedGuide?: () => void }> = ({
  onExplore,
  onDetailedGuide,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Your community shares a service',
      description:
        'A curated service campaign is created for your specific apartment complex with transparent community pricing.',
    },
    {
      num: '02',
      title: 'Residents express interest',
      description:
        'Neighbors click "I\'m Interested" on their private community portal to join the batch and select convenient time slots.',
    },
    {
      num: '03',
      title: 'Demand is collected',
      description:
        'As multiple flats register interest, aggregate volume builds toward confirming a dedicated technician batch.',
    },
    {
      num: '04',
      title: 'GK coordinates the provider',
      description:
        'We assign qualified, background-checked service partners equipped with specialized tools and eco-friendly supplies.',
    },
    {
      num: '05',
      title: 'The service is scheduled',
      description:
        'Gate passes are synchronized with your society security booth, ensuring quiet hours (1:00–2:30 PM) are respected.',
    },
    {
      num: '06',
      title: 'The service is completed',
      description:
        'Technicians deliver doorstep care. Residents inspect the finished work and settle payment directly upon satisfaction.',
    },
  ];

  return (
    <Section bg="bg" className="border-b border-[#E4E0D8]">
      <div className="space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
              How GK Apartment Care Works
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111111] leading-[1.08] tracking-tight">
              Community coordination made simple.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#5C5A56] max-w-md leading-relaxed">
            By pooling resident demand within your gated community, we eliminate random gate chaos and deliver coordinated doorstep care.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 bg-white rounded-[24px] border border-[#E4E0D8] space-y-3 shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <span className="font-display font-medium text-2xl text-[#2596be] font-mono">
                  {step.num}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-medium text-[#111111] leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5A56] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Row */}
        <div className="pt-2 flex flex-wrap items-center gap-4">
          {onExplore && (
            <Button variant="primary" size="md" onClick={onExplore} icon={<ArrowRight className="w-4 h-4" />}>
              Explore Services
            </Button>
          )}
          {onDetailedGuide && (
            <Button variant="secondary" size="md" onClick={onDetailedGuide}>
              View Detailed Workflow Guide
            </Button>
          )}
        </div>
      </div>
    </Section>
  );
};
