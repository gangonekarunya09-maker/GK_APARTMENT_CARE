import React from 'react';
import { Section } from '../ui/Section';
import { ShieldCheck, Moon, Building2, UserCheck, KeySquare, Wrench, CheckCircle2 } from 'lucide-react';

export const AssociationTrustSection: React.FC = () => {
  const protocols = [
    {
      icon: <Moon className="w-5 h-5 text-[#2596be]" />,
      title: '1:00 PM – 2:30 PM Quiet Hours',
      desc: 'Zero noise policy during afternoon siesta across all society towers.',
    },
    {
      icon: <UserCheck className="w-5 h-5 text-[#2596be]" />,
      title: 'Aadhaar & Background Clearance',
      desc: 'Vetted personnel with company uniforms and digital identification badges.',
    },
    {
      icon: <KeySquare className="w-5 h-5 text-[#2596be]" />,
      title: 'Digital Gate Pre-Clearance',
      desc: 'Coordinated entry passes synchronized with MyGate, ApnaComplex, and security teams.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#2596be]" />,
      title: 'Quality & Rework Guarantee',
      desc: '24-hour complimentary re-service if any aspect fails to meet quality standards.',
    },
  ];

  return (
    <Section bg="surface-alt" className="border-b border-[#E4E0D8]">
      <div className="space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
            Operational Standards
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111111] leading-[1.08] tracking-tight">
            Built for apartment communities.
          </h2>
          <p className="text-sm sm:text-base text-[#5C5A56]">
            Every campaign operates under strict community protocols designed in collaboration with resident associations and facility managers.
          </p>
        </div>

        {/* 4 Society Protocols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {protocols.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-[24px] border border-[#E4E0D8] space-y-3 shadow-2xs hover:border-[#111111]/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#F0EDE7] border border-[#E4E0D8] flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-display text-base sm:text-lg font-medium text-[#111111]">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5C5A56] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* How Service Providers Work with GK */}
        <div className="p-8 bg-white rounded-[24px] border border-[#E4E0D8] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2596be]">
            <Wrench className="w-4 h-4" />
            <span>Service Provider Operations</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-medium text-[#111111]">
            How Service Providers Work With GK Apartment Care
          </h3>
          <p className="text-xs sm:text-sm text-[#5C5A56] leading-relaxed max-w-3xl">
            Service providers work with GK to serve organized community demand. GK coordinates campaign requirements, resident scheduling, gate passes, and community-level execution so specialized technician teams can focus entirely on high-quality workmanship.
          </p>
        </div>
      </div>
    </Section>
  );
};
