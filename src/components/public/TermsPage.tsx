import React from 'react';
import { Section } from '../ui/Section';
import { Badge } from '../ui/Badge';
import { FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const lastUpdated = 'September 2026';

  return (
    <div className="space-y-0">
      {/* Header */}
      <Section bg="bg" className="border-b border-[#E4E0D8] pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Badge variant="neutral" size="md" icon={<FileText className="w-3.5 h-3.5 text-[#2596be]" />}>
            Terms &amp; Conditions
          </Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-medium text-[#111111] leading-[1.06] tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5A56]">
            Effective Date: {lastUpdated} · GK Apartment Care (Hyderabad, Telangana)
          </p>
        </div>
      </Section>

      {/* Main Terms Content */}
      <Section bg="surface" className="border-b border-[#E4E0D8]">
        <div className="max-w-3xl mx-auto space-y-10 text-xs sm:text-sm text-[#5C5A56] leading-relaxed">
          {/* 1 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              1. Platform Purpose &amp; Operational Model
            </h2>
            <p>
              GK Apartment Care operates a community-coordinated home and automobile service platform. Unlike conventional open marketplaces, services on our platform are arranged as community-specific service campaigns. By accessing our public website or private community portals, you agree to these Terms of Service.
            </p>
          </div>

          {/* 2 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              2. Campaign Participation &amp; &ldquo;I&apos;m Interested&rdquo; Requests
            </h2>
            <p>
              Submitting an &ldquo;I&apos;m Interested&rdquo; request records your participation in a society demand pool. This allows GK operations to aggregate required volume, coordinate provider schedules, and issue gate passes. It does not constitute an instant contract until the batch is confirmed and scheduled by our operations desk.
            </p>
          </div>

          {/* 3 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              3. Community Pricing &amp; Slabs
            </h2>
            <p>
              Discounted community rates apply when the campaign reaches the stated minimum demand threshold for that society. If a batch threshold is not met, GK operations may reschedule the batch or offer direct doorstep execution with resident consent.
            </p>
          </div>

          {/* 4 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              4. Observance of Society Quiet Hours &amp; Bylaws
            </h2>
            <p>
              All service operations strictly respect gated community bylaws. In accordance with standard residential guidelines, all noisy operations (heavy scrubbers, drillers, high-decibel pressure washers) are suspended between <strong className="text-[#111111]">1:00 PM and 2:30 PM</strong>.
            </p>
          </div>

          {/* 5 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              5. Gate Clearance &amp; Resident Responsibilities
            </h2>
            <p>
              Residents are responsible for ensuring that technician access is permitted to their flat or parking slot. GK Apartment Care coordinates digital visitor entry with society security tools (MyGate, ApnaComplex), but residents must ensure reasonable access during their confirmed time window.
            </p>
          </div>

          {/* 6 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              6. Payment Terms &amp; Settlement
            </h2>
            <p>
              No advance deposits are required to join a bulk pool. Payment for doorstep services is settled directly upon service completion to your complete satisfaction via UPI, cards, or digital links.
            </p>
          </div>

          {/* 7 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              7. Service Quality &amp; Rework Guarantee
            </h2>
            <p>
              If any aspect of the service does not meet agreed quality standards, residents must notify our operations desk within <strong className="text-[#111111]">24 hours</strong> of completion. GK Apartment Care will arrange a complimentary re-inspection or rework slot.
            </p>
          </div>

          {/* 8 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              8. Contact Details
            </h2>
            <p>
              For legal and operational inquiries:
            </p>
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] space-y-1 text-xs">
              <div><strong className="text-[#111111]">Email:</strong> care@gkapartmentcare.com</div>
              <div><strong className="text-[#111111]">Helpline:</strong> +91 94943 35848</div>
              <div><strong className="text-[#111111]">Location:</strong> Hyderabad, Telangana, India</div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
