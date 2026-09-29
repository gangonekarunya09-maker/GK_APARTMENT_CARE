import React from 'react';
import { Section } from '../ui/Section';
import { Badge } from '../ui/Badge';
import { CreditCard, CheckCircle2, ShieldCheck, Clock, HelpCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export const PaymentInfoPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="space-y-0">
      {/* Header */}
      <Section bg="bg" className="border-b border-[#E4E0D8] pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Badge variant="neutral" size="md" icon={<CreditCard className="w-3.5 h-3.5 text-[#2596be]" />}>
            Payment &amp; Billing
          </Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-medium text-[#111111] leading-[1.06] tracking-tight">
            Payment &amp; Service Billing
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5A56]">
            Transparent pricing, zero advance deposits, and straightforward settlement for apartment communities.
          </p>
        </div>
      </Section>

      {/* Main Content */}
      <Section bg="surface" className="border-b border-[#E4E0D8]">
        <div className="max-w-3xl mx-auto space-y-10 text-xs sm:text-sm text-[#5C5A56] leading-relaxed">
          {/* Section 1: How Payment Works */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              1. Current Payment Workflow (Pilot &amp; Operations Stage)
            </h2>
            <p>
              In our current operating model across Hyderabad gated communities, payment is handled transparently post-service:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] space-y-1.5">
                <div className="text-xs font-bold text-[#2596be]">STEP 1</div>
                <div className="font-medium text-[#111111]">Register Interest</div>
                <div className="text-[11px] text-[#5C5A56]">
                  Join a community campaign for ₹0. No credit card or deposit required.
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] space-y-1.5">
                <div className="text-xs font-bold text-[#2596be]">STEP 2</div>
                <div className="font-medium text-[#111111]">Service Execution</div>
                <div className="text-[11px] text-[#5C5A56]">
                  Vetted technicians arrive and complete the requested service in your flat or parking bay.
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] space-y-1.5">
                <div className="text-xs font-bold text-[#2E8B57]">STEP 3</div>
                <div className="font-medium text-[#111111]">Inspect &amp; Pay</div>
                <div className="text-[11px] text-[#5C5A56]">
                  Verify satisfaction and settle the agreed community rate via UPI QR / direct transfer.
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Transparent Pricing Breakdown */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              2. Transparent Pricing Slabs
            </h2>
            <p>
              Every campaign clearly presents standard retail pricing alongside the unlocked community rate:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-[#111111]">Standard Retail Rate:</strong> The regular single-order market price for standalone visits.
              </li>
              <li>
                <strong className="text-[#111111]">Community Bulk Rate:</strong> The discounted rate applied when your society reaches the aggregate batch threshold.
              </li>
              <li>
                <strong className="text-[#111111]">Zero Hidden Fees:</strong> No separate platform convenience fees, gate entry charges, or travel surcharges are added at checkout.
              </li>
            </ul>
          </div>

          {/* Section 3: Future Automated Payment Gateway Onboarding */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              3. Automated Digital Payment Integration (Roadmap)
            </h2>
            <p>
              As part of our upcoming platform release, GK Apartment Care will integrate authorized digital payment gateway processors to offer automated UPI intent, net banking, and card settlements with instant digital invoices and receipts.
            </p>
            <p className="text-[11px] text-[#5C5A56] bg-[#FAF8F5] p-3 rounded-xl border border-[#E4E0D8]">
              <em>Note for Payment Gateway Partners &amp; Merchant Evaluators:</em> This public portal serves residential apartment communities across Hyderabad. All transactions correspond to physical on-site home and automobile maintenance services delivered at the customer&apos;s registered apartment unit.
            </p>
          </div>

          {/* Section 4: Billing Queries */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
              4. Billing Inquiries &amp; Invoices
            </h2>
            <p>
              For tax invoices, corporate billing receipts, or payment verification:
            </p>
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] space-y-1 text-xs">
              <div><strong className="text-[#111111]">Email:</strong> care@gkapartmentcare.com</div>
              <div><strong className="text-[#111111]">Helpline / WhatsApp:</strong> +91 94943 35848</div>
              <div><strong className="text-[#111111]">Operations Location:</strong> Cyberabad &amp; Greater Hyderabad, Telangana</div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
