import React from 'react';
import { Section } from '../ui/Section';
import { Star, ShieldCheck, Moon, Building2, UserCheck, KeySquare, Sparkles } from 'lucide-react';

export const AssociationTrustSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        'GK Apartment Care eliminated the chaotic crowd of random vendors at our main gate on weekends. The synchronized batches and strict 1:00 PM quiet hour discipline has made a huge difference to our residents.',
      author: 'Rajeshwar V.',
      role: 'RWA President, My Home Bhooja',
      rating: 5,
    },
    {
      quote:
        'Our society bulk campaign booked 42 sofa extractions and car detailing sessions in one Sunday. Residents saved over 30% and the quality was top-notch with eco-friendly steam equipment.',
      author: 'Sunita M.',
      role: 'Management Committee, Aparna Serene Park',
      rating: 5,
    },
    {
      quote:
        'Finally a service that understands apartment community bylaws. No loud drilling during afternoon rest hours, and every technician has a digital badge that checks out seamlessly with MyGate.',
      author: 'Kalyan Chakravarthy',
      role: 'Facility Lead, Jayabheri Silicon County',
      rating: 5,
    },
  ];

  const protocols = [
    {
      icon: <Moon className="w-5 h-5 text-[#2596be]" />,
      title: '1:00 PM – 2:30 PM Quiet Hours',
      desc: 'Zero noise policy during afternoon siesta across all society towers.',
    },
    {
      icon: <UserCheck className="w-5 h-5 text-[#2596be]" />,
      title: 'Police & Aadhaar Clearance',
      desc: '100% verified staff with official photo badges and company uniforms.',
    },
    {
      icon: <KeySquare className="w-5 h-5 text-[#2596be]" />,
      title: 'Digital Gate Pre-Clearance',
      desc: 'Seamless integration with MyGate, ApnaComplex, and security booths.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#2596be]" />,
      title: 'Doorstep Service Warranty',
      desc: 'Complete peace of mind with 100% rework guarantee if not fully satisfied.',
    },
  ];

  return (
    <Section bg="surface-alt" className="border-b border-[#E4E0D8]">
      <div className="space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
            Verified Community Trust
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111111] leading-[1.08] tracking-tight">
            Built for apartment life.
          </h2>
          <p className="text-sm sm:text-base text-[#5C5A56]">
            Endorsed by resident welfare associations and facility management boards across Hyderabad.
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

        {/* Association Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-7 sm:p-8 bg-white rounded-[24px] border border-[#E4E0D8] flex flex-col justify-between space-y-6 shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#2596be]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-[#111111] leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#E4E0D8] space-y-0.5">
                <div className="font-display font-medium text-sm text-[#111111]">
                  {t.author}
                </div>
                <div className="text-xs text-[#5C5A56]">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
