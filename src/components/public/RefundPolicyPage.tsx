import React from 'react';
import { Section } from '../ui/Section';
import { Badge } from '../ui/Badge';
import { RefreshCw, CheckCircle2, Clock, HelpCircle, Mail, Phone } from 'lucide-react';

export const RefundPolicyPage: React.FC = () => {
  const lastUpdated = 'September 2026';

  return (
    <div className="space-y-0">
      {/* Header */}
      <Section bg="bg" className="border-b border-[#E4E0D8] pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Badge variant="neutral" size="md" icon={<RefreshCw className="w-3.5 h-3.5 text-[#2596be]" />}>
            Refund &amp; Cancellation
          </Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-medium text-[#111111] leading-[1.06] tracking-tight">
            Cancellation &amp; Refund Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5A56]">
            Effective Date: {lastUpdated} · GK Apartment Care (Hyderabad, Telangana)
          </p>
        </div>
      </Section>

      {/* Main Content */}
      <Section bg="surface" className="border-b border-[#E4E0D8]">
        <div className="max-w-3xl mx-auto space-y-10 text-xs sm:text-sm text-[#5C5A56] leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              1. Zero Advance Deposit Model
            </h2>
            <p>
              In our standard community operations, expressing interest in a service campaign or booking a regular doorstep appointment requires <strong className="text-[#111111]">no advance deposit</strong>. You pay only after the service is fully completed and inspected.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              2. Resident Cancellation &amp; Rescheduling Window
            </h2>
            <p>
              We understand schedules change in busy apartment communities:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-[#111111]">Free Cancellation:</strong> You may cancel or reschedule your requested time slot at zero penalty up to <strong className="text-[#111111]">2 hours prior</strong> to the scheduled arrival window.
              </li>
              <li>
                <strong className="text-[#111111]">How to Cancel/Reschedule:</strong> Message our WhatsApp desk at <code className="text-[#111111] font-mono">+91 94943 35848</code> with your Booking/Request Number, or contact your society batch coordinator.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              3. Unmet Campaign Thresholds
            </h2>
            <p>
              If a Sunday bulk campaign does not reach the minimum required flats by the cutoff deadline, GK operations will notify all registered residents via WhatsApp. Residents may choose to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Roll over their interest to the following weekend batch.</li>
              <li>Proceed with an individual weekday appointment.</li>
              <li>Cancel the request with zero obligation or fees.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              4. Service Quality Guarantee &amp; Rework
            </h2>
            <p>
              Your satisfaction is our primary metric. If any aspect of the completed service does not meet expected standards:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Notify our support desk within <strong className="text-[#111111]">24 hours</strong> of completion.</li>
              <li>Our team will schedule a complimentary rework slot with an expert technician at no additional cost.</li>
              <li>If the issue cannot be resolved satisfactorily upon re-service, a full refund of the amount paid for that specific service will be processed.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              5. Refund Settlement Timeline
            </h2>
            <p>
              In any instance where a digital refund is approved, funds will be returned to the original source account (UPI / Bank Account / Card) within <strong className="text-[#111111]">2 to 4 business days</strong>.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              6. Contact Support Desk
            </h2>
            <p>
              For cancellation or refund assistance:
            </p>
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] space-y-1 text-xs">
              <div><strong className="text-[#111111]">WhatsApp Desk:</strong> +91 94943 35848</div>
              <div><strong className="text-[#111111]">Email:</strong> care@gkapartmentcare.com</div>
              <div><strong className="text-[#111111]">Operating Hours:</strong> 8:00 AM – 8:00 PM (Monday – Sunday)</div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
