import React from 'react';
import { useApp } from '../../context/AppContext';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Building2,
  Users,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  Wrench,
  CheckCircle2,
  Mail,
  Phone,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="space-y-0">
      {/* Hero Header */}
      <Section bg="bg" className="border-b border-[#E4E0D8] pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="neutral" size="md" icon={<Building2 className="w-3.5 h-3.5 text-[#2596be]" />}>
            About GK Apartment Care
          </Badge>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium text-[#111111] leading-[1.04] tracking-tight">
            Home services, organized for your community.
          </h1>

          <p className="text-base sm:text-xl text-[#5C5A56] max-w-2xl mx-auto leading-relaxed">
            GK Apartment Care coordinates trusted doorstep home and automobile services for gated apartment communities across Hyderabad through community-specific service campaigns, pooled demand, and organized scheduling.
          </p>
        </div>
      </Section>

      {/* Core Mission & The Problem We Solve */}
      <Section bg="surface" className="border-b border-[#E4E0D8]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="p-8 bg-[#FAF8F5] rounded-[24px] border border-[#E4E0D8] space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F0EDE7] border border-[#E4E0D8] flex items-center justify-center text-[#DC2626]">
                <Layers className="w-5 h-5 text-[#111111]" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-medium text-[#111111]">
                The Problem in Gated Communities
              </h3>
              <p className="text-sm sm:text-base text-[#5C5A56] leading-relaxed">
                Conventional on-demand platforms dispatch individual service providers on ad-hoc, random schedules. This leads to continuous security congestion at society gates, unvetted personnel in residential corridors, disrupted afternoon quiet hours, and higher individual retail costs for residents.
              </p>
            </div>

            <div className="p-8 bg-[#FAF8F5] rounded-[24px] border border-[#E4E0D8] space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F0EDE7] border border-[#E4E0D8] flex items-center justify-center text-[#2596be]">
                <Sparkles className="w-5 h-5 text-[#2596be]" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-medium text-[#111111]">
                The Community-First Solution
              </h3>
              <p className="text-sm sm:text-base text-[#5C5A56] leading-relaxed">
                GK Apartment Care transforms doorstep care into an organized community campaign. By aggregating resident demand for deep cleaning, car detailing, pest control, and AC care, we synchronize technician arrivals into planned batch visits with pre-cleared gate passes and community pricing.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Key Stakeholders */}
      <Section bg="surface-alt" className="border-b border-[#E4E0D8]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
              How the Ecosystem Works
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#111111]">
              Collaboration across the community
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-[24px] border border-[#E4E0D8] space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-2xl bg-[#F0EDE7] border border-[#E4E0D8] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#2596be]" />
              </div>
              <h3 className="font-display text-lg font-medium text-[#111111]">
                For Residents
              </h3>
              <p className="text-xs sm:text-sm text-[#5C5A56] leading-relaxed">
                Access your private apartment portal, browse curated services, express interest in community bulk batches, and enjoy reliable doorstep execution without advance payment.
              </p>
            </div>

            <div className="p-6 bg-white rounded-[24px] border border-[#E4E0D8] space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-2xl bg-[#F0EDE7] border border-[#E4E0D8] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#2596be]" />
              </div>
              <h3 className="font-display text-lg font-medium text-[#111111]">
                For RWAs &amp; Facility Boards
              </h3>
              <p className="text-xs sm:text-sm text-[#5C5A56] leading-relaxed">
                Eliminate gate clutter and ad-hoc vendor entries. Maintain strict 1:00 PM – 2:30 PM quiet hours and receive advance batch rosters for society security teams.
              </p>
            </div>

            <div className="p-6 bg-white rounded-[24px] border border-[#E4E0D8] space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-2xl bg-[#F0EDE7] border border-[#E4E0D8] flex items-center justify-center">
                <Wrench className="w-5 h-5 text-[#2596be]" />
              </div>
              <h3 className="font-display text-lg font-medium text-[#111111]">
                For Service Providers
              </h3>
              <p className="text-xs sm:text-sm text-[#5C5A56] leading-relaxed">
                Service providers partner with GK to serve organized demand clusters. Concentrated tower bookings reduce travel downtime and optimize service equipment utilization.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Operational Principles */}
      <Section bg="bg" className="border-b border-[#E4E0D8]">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
              Operational Principles
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#111111]">
              Standards tailored for high-rise living
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                title: 'Community-Specific Portals',
                desc: 'Every community is configured with its own private link (/c/:slug/:token) so residents only see campaigns, dates, and slots scheduled for their specific society.',
              },
              {
                title: 'Demand-Driven Batching',
                desc: 'Campaigns collect interest from residents until a minimum threshold is reached, allowing providers to allocate dedicated crews and specialized equipment.',
              },
              {
                title: 'Quiet Hours Enforcement',
                desc: 'Service activities with noise potential are paused between 1:00 PM and 2:30 PM to respect afternoon rest across all residential blocks.',
              },
              {
                title: 'Security App Coordination',
                desc: 'Technician schedules and identity details are coordinated in advance with society security management systems like MyGate and ApnaComplex.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 bg-white rounded-[24px] border border-[#E4E0D8] flex items-start gap-4 shadow-2xs"
              >
                <div className="w-8 h-8 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-base font-medium text-[#111111]">
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

      {/* CTA Section */}
      <Section bg="inverse" className="text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-2xl sm:text-4xl font-medium text-[#FAF8F5]">
            Ready to bring organized care to your apartment?
          </h2>
          <p className="text-sm sm:text-base text-[#FAF8F5]/80 leading-relaxed">
            Connect with our operations desk to set up a dedicated service portal for your society.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="inverse"
              size="lg"
              onClick={() => navigate('/rwa')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Partner Your RWA Society
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/how-it-works')}
              className="bg-transparent text-[#FAF8F5] border-white/20 hover:border-white hover:bg-white/10"
            >
              See How It Works
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};
