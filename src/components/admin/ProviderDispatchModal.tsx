import React, { useState, useMemo } from 'react';
import {
  Apartment,
  Service,
  ServiceProvider,
  Booking,
  ResidentRequest,
} from '../../types';
import {
  MessageSquare,
  Copy,
  Check,
  Send,
  Building2,
  Calendar,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  X,
  Users,
  ShieldCheck,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface DispatchHousehold {
  id: string;
  flatNumber: string;
  block: string;
  residentName: string;
  phone: string;
  slot?: string;
  date?: string;
  notes?: string;
  price?: number;
  sourceType: 'booking' | 'request';
}

interface ProviderDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartment: Apartment;
  service: Service;
  provider: ServiceProvider;
  households: DispatchHousehold[];
  scheduledDate?: string;
  onConfirmStatusUpdate?: () => Promise<void> | void;
}

export const ProviderDispatchModal: React.FC<ProviderDispatchModalProps> = ({
  isOpen,
  onClose,
  apartment,
  service,
  provider,
  households,
  scheduledDate = 'Upcoming Sunday',
  onConfirmStatusUpdate,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    households.map(h => h.id)
  );
  const [date, setDate] = useState<string>(scheduledDate);
  const [timeWindow, setTimeWindow] = useState<string>('08:30 AM – 05:00 PM');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  // Sync selected households if household prop changes
  React.useEffect(() => {
    setSelectedIds(households.map(h => h.id));
  }, [households]);

  // Selected list
  const activeHouseholds = useMemo(() => {
    return households.filter(h => selectedIds.includes(h.id));
  }, [households, selectedIds]);

  const toggleHousehold = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedIds(households.map(h => h.id));
  const deselectAll = () => setSelectedIds([]);

  // Calculate pricing & payout estimates
  const unitPrice = service.sundayBulkPrice || service.communityPrice || 499;
  const totalValue = activeHouseholds.reduce((acc, curr) => acc + (curr.price || unitPrice), 0);
  const commissionRate = provider.commissionPercentage ?? 15;
  const gkCommission = Math.round((totalValue * commissionRate) / 100);
  const vendorPayout = totalValue - gkCommission;

  // Format the WhatsApp message text
  const dispatchMessage = useMemo(() => {
    const divider = '══════════════════════════════';
    
    // Group or list flats
    const flatLines = activeHouseholds.map((h, idx) => {
      const blockStr = h.block ? `Block ${h.block}, ` : '';
      const slotStr = h.slot ? ` · ⏰ ${h.slot}` : '';
      const noteStr = h.notes ? `\n   📝 *Note:* ${h.notes}` : '';
      return `${idx + 1}. *${blockStr}Flat ${h.flatNumber}* — ${h.residentName}\n   📱 Ph: ${h.phone}${slotStr}${noteStr}`;
    }).join('\n\n');

    const addressFull = apartment.address
      ? apartment.address
      : `${apartment.name}, ${apartment.area}, ${apartment.city} - ${apartment.pincode}`;

    const message = `🛠️ *GK APARTMENT CARE — WORK ORDER DISPATCH*
${divider}
Dear *${provider.contactPerson}* (*${provider.businessName}*),

Please find the confirmed doorstep service dispatch schedule and flat list for *${apartment.name}*:

📍 *APARTMENT LOCATION & ENTRY DETAILS:*
• *Society Name:* ${apartment.name}
• *Full Address:* ${addressFull}
• *Locality / Area:* ${apartment.area}, ${apartment.city}
• *Gate Pass / Security Protocol:* ${apartment.gateSecurityApp} (Inform security: GK Apartment Care bulk service batch)
• *RWA / Security Desk Contact:* ${apartment.rwaContact || 'Facility Office'} (${apartment.rwaPhone || 'Direct gate coordination'})

📋 *SERVICE SPECIFICATIONS:*
• *Service Required:* ${service.name}
• *Execution Date:* ${date}
• *Operating Hours:* ${timeWindow}
• *Total Households Requiring Job:* *${activeHouseholds.length} Flats / Households*
• *Total Service Value:* ₹${totalValue}
• *Your Payout Due:* *₹${vendorPayout}* (${100 - commissionRate}% after ${commissionRate}% platform share)

🏢 *CONFIRMED HOUSEHOLDS & FLAT NUMBERS (${activeHouseholds.length} Flats):*
${divider}
${flatLines || '(No flats currently selected)'}
${divider}

${additionalNotes ? `📌 *SPECIAL OPERATOR INSTRUCTIONS:*\n${additionalNotes}\n\n` : ''}⚠️ *IMPORTANT DISPATCH GUIDELINES:*
1. Arrive at society security gate 15 minutes before the start slot.
2. Carry technician photo ID and register vehicle at visitor gate under GK Apartment Care.
3. Call resident prior to ringing doorbell if running ahead/behind schedule.
4. Update GK Operations after completing each floor/block.

📞 *GK Operations Emergency Helpline:* +91 94943 35848`;

    return message;
  }, [
    apartment,
    service,
    provider,
    activeHouseholds,
    date,
    timeWindow,
    additionalNotes,
    totalValue,
    vendorPayout,
    commissionRate,
  ]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(dispatchMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchWhatsApp = async () => {
    const cleanPhone = (provider.whatsapp || provider.phone).replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(dispatchMessage)}`;
    window.open(waUrl, '_blank');
    
    if (onConfirmStatusUpdate) {
      await onConfirmStatusUpdate();
    }
    setDispatchedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl max-w-4xl w-full my-6 flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#142326] to-[#1e3438] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2596be]/20 border border-[#2596be]/40 flex items-center justify-center text-[#2596be]">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                  Dispatch Flat List to Service Provider
                </h3>
                <span className="px-2 py-0.5 bg-[#2E8B57] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  WhatsApp Work Order
                </span>
              </div>
              <p className="text-xs text-white/70">
                Send apartment location, total households, and complete flat numbers directory to {provider.businessName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto p-4 sm:p-6 gap-6">
          {/* Left Column: Job & Flat Selection Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Society & Provider Badge */}
            <div className="p-3.5 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                    Gated Community Location
                  </span>
                  <div className="text-sm font-bold text-[#142326] flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-4 h-4 text-[#2596be]" />
                    <span>{apartment.name}</span>
                  </div>
                  <div className="text-xs text-[#667085] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#667085]" />
                    <span>{apartment.area}, {apartment.city} (PIN: {apartment.pincode})</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#667085] block">Security / Gate Pass:</span>
                  <span className="font-semibold text-[#142326]">{apartment.gateSecurityApp}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] block">RWA Contact:</span>
                  <span className="font-semibold text-[#142326]">{apartment.rwaPhone}</span>
                </div>
              </div>
            </div>

            {/* Provider Details */}
            <div className="p-3.5 bg-[#2596be]/5 rounded-2xl border border-[#2596be]/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2596be]">
                  Assigned Service Partner
                </span>
                <span className="text-[10px] bg-[#2E8B57]/10 text-[#2E8B57] font-bold px-1.5 py-0.5 rounded">
                  Verified
                </span>
              </div>
              <div className="text-sm font-bold text-[#142326]">{provider.businessName}</div>
              <div className="text-xs text-[#667085] flex flex-wrap items-center gap-x-2">
                <span>Lead: <strong className="text-[#142326]">{provider.contactPerson}</strong></span>
                <span>·</span>
                <a href={`tel:${provider.phone}`} className="text-[#2596be] font-bold hover:underline">
                  {provider.phone}
                </a>
              </div>
            </div>

            {/* Dispatch Schedule Parameters */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#142326] mb-1">
                  Scheduled Service Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    placeholder="e.g. Sunday, 4 Oct 2026"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#142326] focus:outline-none focus:border-[#2596be]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142326] mb-1">
                  Daily Execution Window
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={timeWindow}
                    onChange={e => setTimeWindow(e.target.value)}
                    placeholder="e.g. 09:00 AM – 05:00 PM"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#142326] focus:outline-none focus:border-[#2596be]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142326] mb-1">
                  Additional Operator Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  placeholder="e.g., Gate passes are pre-approved at Tower B security desk. Park mobile rig in visitor slot 14."
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#142326] focus:outline-none focus:border-[#2596be]"
                />
              </div>
            </div>

            {/* Flat Households Selector */}
            <div className="space-y-2 pt-1 border-t border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#2596be]" />
                  <span className="text-xs font-bold text-[#142326]">
                    Households to Include ({activeHouseholds.length}/{households.length})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    onClick={selectAll}
                    className="text-[#2596be] hover:underline font-bold"
                  >
                    All
                  </button>
                  <span className="text-[#667085]">·</span>
                  <button
                    onClick={deselectAll}
                    className="text-[#667085] hover:text-[#DC2626]"
                  >
                    None
                  </button>
                </div>
              </div>

              <div className="max-h-44 overflow-y-auto space-y-1.5 p-1 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
                {households.length === 0 ? (
                  <div className="p-3 text-center text-xs text-[#667085]">
                    No households recorded for this service batch yet.
                  </div>
                ) : (
                  households.map(h => {
                    const isSelected = selectedIds.includes(h.id);
                    return (
                      <label
                        key={h.id}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-white border border-[#2596be]/30 shadow-2xs'
                            : 'hover:bg-white/60 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleHousehold(h.id)}
                            className="rounded text-[#2596be] focus:ring-0 cursor-pointer"
                          />
                          <div>
                            <span className="font-bold text-[#142326]">
                              {h.block ? `Block ${h.block}, ` : ''}Flat {h.flatNumber}
                            </span>
                            <span className="text-[#667085] ml-1.5">
                              ({h.residentName})
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-[#667085]">
                          {h.slot || 'Morning'}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Financial Summary card */}
            <div className="p-3 bg-[#2E8B57]/10 rounded-xl border border-[#2E8B57]/30 flex items-center justify-between text-xs">
              <div>
                <span className="text-[#667085] block text-[10px]">Total Service Value:</span>
                <strong className="text-sm font-extrabold text-[#142326] font-mono">
                  ₹{totalValue}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-[#667085] block text-[10px]">Vendor Net Payout:</span>
                <strong className="text-sm font-extrabold text-[#2E8B57] font-mono">
                  ₹{vendorPayout}
                </strong>
              </div>
            </div>
          </div>

          {/* Right Column: Live Formatted WhatsApp Message Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#25D366]"></div>
                <span className="text-xs font-extrabold text-[#142326] tracking-wide uppercase">
                  WhatsApp Work Order Message Preview
                </span>
              </div>
              <span className="text-[11px] text-[#667085] font-semibold">
                Formatted with bold, emojis &amp; bullet points
              </span>
            </div>

            {/* WhatsApp Phone Mockup Container */}
            <div className="flex-1 bg-[#ECE5DD] p-4 rounded-2xl border border-[#D1D7DB] relative flex flex-col overflow-hidden shadow-inner">
              <div className="bg-white rounded-2xl rounded-tl-xs p-4 shadow-sm font-mono text-xs whitespace-pre-wrap text-[#111B21] leading-relaxed overflow-y-auto max-h-[380px] select-text">
                {dispatchMessage}
              </div>

              {dispatchedSuccess && (
                <div className="mt-3 p-3 bg-[#2E8B57] text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>WhatsApp dispatch sent &amp; work order confirmed!</span>
                  </div>
                  <button
                    onClick={() => setDispatchedSuccess(false)}
                    className="text-xs text-white/80 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopy}
                className="w-full sm:w-auto flex-1 py-3 px-4 bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] text-[#142326] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#2E8B57]" />
                    <span className="text-[#2E8B57]">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#667085]" />
                    <span>Copy Full Message</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLaunchWhatsApp}
                disabled={activeHouseholds.length === 0}
                className="w-full sm:w-auto flex-1 py-3 px-5 bg-[#2E8B57] hover:bg-[#257347] disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Open in WhatsApp &amp; Send to Provider</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-[#F8F9FA] border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#667085]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2596be]" />
            <span>
              Direct coordination with <strong>{provider.contactPerson}</strong> ({provider.whatsapp || provider.phone})
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-[#667085] hover:text-[#142326] cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </motion.div>
    </div>
  );
};
