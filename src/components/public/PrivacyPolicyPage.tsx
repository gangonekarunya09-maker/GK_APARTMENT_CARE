import React from 'react';
import { Section } from '../ui/Section';
import { Badge } from '../ui/Badge';
import { ShieldCheck, Lock, Eye, Database, FileText, Mail, Phone } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = 'September 2026';

  return (
    <div className="space-y-0">
      {/* Header */}
      <Section bg="bg" className="border-b border-[#E4E0D8] pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Badge variant="neutral" size="md" icon={<ShieldCheck className="w-3.5 h-3.5 text-[#2596be]" />}>
            Legal &amp; Compliance
          </Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-medium text-[#111111] leading-[1.06] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5A56]">
            Effective Date &amp; Last Updated: {lastUpdated} · GK Apartment Care (Hyderabad, Telangana)
          </p>
        </div>
      </Section>

      {/* Main Policy Content */}
      <Section bg="surface" className="border-b border-[#E4E0D8]">
        <div className="max-w-3xl mx-auto space-y-10 text-xs sm:text-sm text-[#5C5A56] leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              1. Overview &amp; Commitment
            </h2>
            <p>
              GK Apartment Care (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates a community-coordinated home and automobile service platform designed for gated residential communities across Hyderabad. This Privacy Policy explains how we collect, process, and protect your personal information when you access our public website or community portals (<code className="text-[#111111] font-mono">/c/:slug/:token</code>).
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              2. Information We Collect
            </h2>
            <p>
              We collect only the minimum necessary information required to coordinate doorstep services and gate passes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-[#111111]">Resident Contact Details:</strong> Full name, WhatsApp/phone number.
              </li>
              <li>
                <strong className="text-[#111111]">Location &amp; Unit Information:</strong> Gated society name, tower/block, flat number, and parking bay (for car detailing).
              </li>
              <li>
                <strong className="text-[#111111]">Service Scheduling Preferences:</strong> Selected service, preferred date, slot selection, and special service notes.
              </li>
              <li>
                <strong className="text-[#111111]">Partnership Inquiries:</strong> Society name, committee contact designation, vendor credentials, and service areas for RWA and provider applications.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              3. How We Use Your Information
            </h2>
            <p>
              Your personal data is utilized strictly for service fulfillment and operational coordination:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Aggregating community demand thresholds to unlock bulk service batches.</li>
              <li>Dispatching WhatsApp notifications and SMS updates regarding batch status, confirmed arrival windows, and completion receipts.</li>
              <li>Generating pre-cleared visitor passes for your society security gate (MyGate, ApnaComplex, or on-site security booths).</li>
              <li>Enforcing community quiet hours (1:00 PM – 2:30 PM) and assigning verified technicians.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              4. Data Sharing &amp; Third Parties
            </h2>
            <p>
              We maintain a strict non-disclosure standard:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-[#111111]">No Advertising Sales:</strong> We do not sell, rent, or trade resident personal information with third-party advertisers or lead brokers.
              </li>
              <li>
                <strong className="text-[#111111]">Assigned Service Partners:</strong> Contact and unit details are shared solely with the specific background-vetted technician or vendor crew assigned to execute your scheduled batch.
              </li>
              <li>
                <strong className="text-[#111111]">Society Security Desks:</strong> Name, flat number, and technician ID details are shared with your community RWA security officers to permit safe physical access.
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              5. Data Storage &amp; Security
            </h2>
            <p>
              Application data is stored securely using PostgreSQL on Supabase infrastructure protected by Row Level Security (RLS) policies. For resident convenience, basic flat profile details may be cached in your local device browser storage to streamline future campaign registrations.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              6. Your Rights &amp; Contact Information
            </h2>
            <p>
              You may request access, correction, or deletion of your service records at any time by contacting our Hyderabad operations team:
            </p>
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] space-y-1 text-xs">
              <div><strong className="text-[#111111]">Email:</strong> care@gkapartmentcare.com</div>
              <div><strong className="text-[#111111]">WhatsApp / Phone:</strong> +91 94943 35848</div>
              <div><strong className="text-[#111111]">Operational Hub:</strong> Cyberabad &amp; Greater Hyderabad, Telangana</div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
