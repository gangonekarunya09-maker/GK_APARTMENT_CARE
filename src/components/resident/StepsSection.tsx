import React from 'react';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const StepsSection: React.FC<{ onExplore?: () => void }> = ({ onExplore }) => {
  const steps = [
    {
      num: '01',
      title: 'Pick your society & service',
      description:
        'Select your gated community in Hyderabad and choose from verified deep cleaning, car care, pest control, or AC services.',
    },
    {
      num: '02',
      title: 'Join the Sunday bulk pool',
      description:
        'Aggregate with fellow tower residents for guaranteed 20% to 35% bulk savings, or pick any preferred weekday slot.',
    },
    {
      num: '03',
      title: 'Pre-cleared doorstep delivery',
      description:
        'Background-verified technicians arrive with official digital gate passes. Zero security hassle, no noise during 1:00–2:30 PM quiet hours.',
    },
  ];

  return (
    <Section bg="bg" className="border-b border-[#E4E0D8]">
      <div className="space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
              How Community Care Works
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111111] leading-[1.08] tracking-tight">
              Doorstep care made effortless.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#5C5A56] max-w-md leading-relaxed">
            We work directly with your Apartment Owners Association (RWA) so you get wholesale commercial pricing without random outside vendors roaming your corridors.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="pt-6 sm:pt-8 border-t border-[#E4E0D8] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="font-display font-medium text-3xl sm:text-4xl text-[#111111] tracking-tight text-[#2596be]">
                  {step.num}
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-medium text-[#111111] leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-[#5C5A56] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Row */}
        {onExplore && (
          <div className="pt-4 flex items-center justify-start">
            <Button variant="primary" size="md" onClick={onExplore} icon={<ArrowRight className="w-4 h-4" />}>
              Explore Available Society Services
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
};
