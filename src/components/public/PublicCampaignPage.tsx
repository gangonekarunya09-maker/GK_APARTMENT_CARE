import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Campaign } from '../../types';
import { Logo } from '../common/Logo';
import {
  Building2,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Share2,
  Check,
  MessageCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PublicCampaignPageProps {
  campaign: Campaign;
}

export const PublicCampaignPage: React.FC<PublicCampaignPageProps> = ({ campaign }) => {
  const { apartments, services, submitResidentInterest } = useApp();

  const apartment = apartments.find(a => a.id === campaign.apartmentId);
  const service = services.find(s => s.id === campaign.serviceId);

  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [block, setBlock] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState(campaign.availableDates[0] || 'Upcoming Sunday');
  const [preferredSlot, setPreferredSlot] = useState(campaign.availableSlots[0] || '09:00 AM – 11:00 AM');
  const [notes, setNotes] = useState('');

  if (!service || !apartment) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] text-center max-w-sm w-full">
          <p className="text-sm font-bold text-[#142326]">Campaign Not Found</p>
          <p className="text-xs text-[#667085] mt-1">This community link may have expired or is invalid.</p>
        </div>
      </div>
    );
  }

  const percent = Math.min(100, Math.round((campaign.currentDemand / campaign.minimumDemand) * 100));
  const needed = Math.max(0, campaign.minimumDemand - campaign.currentDemand);
  const isTargetReached = needed === 0;
  const savings = campaign.normalPrice - campaign.communityPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !block || !flatNumber) return;

    submitResidentInterest({
      campaignId: campaign.id,
      apartmentId: apartment.id,
      residentName: fullName,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      block,
      flatNumber,
      email: email || undefined,
      preferredDate,
      preferredSlot,
      notes: notes || undefined,
    });

    setSubmitted(true);
    setFormOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simplified public status
  const getStatusLevel = () => {
    switch (campaign.status) {
      case 'completed':
        return 5;
      case 'in_progress':
      case 'scheduled':
        return 4;
      case 'provider_confirmed':
        return 3;
      case 'target_reached':
      case 'provider_selected':
        return 2;
      default:
        return 1;
    }
  };

  const statusLevel = getStatusLevel();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#142326] flex flex-col justify-between antialiased selection:bg-[#2596be]/20">
      {/* Public Top Header - strictly resident oriented, NO admin controls */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="sm" showSubtitle={false} />
          <button
            onClick={handleCopyLink}
            className="p-2 text-[#667085] hover:text-[#2596be] hover:bg-[#F8F9FA] rounded-xl transition-colors cursor-pointer"
            title="Share with neighbors"
            aria-label="Share"
          >
            {copied ? <Check className="w-4 h-4 text-[#2E8B57]" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Public Service View */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-4">
        {/* Apartment Community Badge */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-full shadow-xs"
        >
          <Building2 className="w-3.5 h-3.5 text-[#2596be]" />
          <span className="text-xs font-bold text-[#142326]">{apartment.name}</span>
          <span className="text-[11px] text-[#667085]">· {apartment.area}</span>
        </motion.div>

        {/* Service Core Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-4"
        >
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#2596be]">
              Community Coordinated Service
            </div>
            <h1 className="text-2xl font-extrabold text-[#142326] leading-tight">
              {service.name}
            </h1>
            <p className="text-xs text-[#667085] leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E5E7EB] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#667085]">Normal Individual Price:</span>
              <span className="line-through text-[#667085] font-mono tabular-nums">
                ₹{campaign.normalPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-[#142326]">Community Price:</span>
              <span className="text-lg font-black text-[#142326] font-mono tabular-nums">
                ₹{campaign.communityPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs font-bold text-[#2596be]">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Resident Community Savings</span>
              </div>
              <span className="px-2 py-0.5 bg-[#2596be]/10 rounded font-mono">
                SAVE ₹{savings.toLocaleString('en-IN')}
              </span>
            </div>

            {campaign.sundayBulkPrice && (
              <div className="text-[11px] text-[#667085] pt-1">
                Sunday Bulk Discount: <strong className="text-[#2596be]">₹{campaign.sundayBulkPrice}</strong> when aggregate society target is met.
              </div>
            )}
          </div>

          {/* Community Demand Section */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#142326] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#2596be]" />
                <span>Community Demand</span>
              </span>
              <span className="font-mono font-bold text-[#2596be] tabular-nums">
                {campaign.currentDemand} / {campaign.minimumDemand} residents interested
              </span>
            </div>

            {/* Animated Demand Progress Bar */}
            <div className="w-full h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  isTargetReached ? 'bg-[#2E8B57]' : 'bg-[#2596be]'
                }`}
              />
            </div>

            <div className="text-[11px] text-[#667085] flex items-center justify-between">
              {isTargetReached ? (
                <span className="text-[#2E8B57] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Target reached! Coordinated visit in progress.
                </span>
              ) : (
                <span>
                  <strong className="text-[#142326] font-bold">{needed} more</strong> residents needed to unlock service visit
                </span>
              )}
              <span className="font-mono">{percent}%</span>
            </div>
          </div>

          {/* Available Slots Information */}
          <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] text-xs space-y-1.5">
            <div className="font-bold text-[#142326] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2596be]" />
              <span>Available Time Slots for {apartment.name}</span>
            </div>
            <div className="text-[11px] text-[#667085] space-y-0.5">
              <div>Dates: <span className="text-[#142326] font-medium">{campaign.availableDates.join(', ')}</span></div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {campaign.availableSlots.map(slot => (
                  <span key={slot} className="px-2 py-0.5 bg-white border border-[#E5E7EB] rounded text-[11px] font-mono">
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Action Button: I'M INTERESTED */}
          <div className="pt-2">
            {submitted ? (
              <div className="p-4 bg-[#2E8B57]/10 rounded-xl border border-[#2E8B57]/30 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#2E8B57] text-white mx-auto flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#142326]">You&apos;re interested!</h4>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Your request has been recorded. <strong>{campaign.currentDemand} / {campaign.minimumDemand}</strong> residents are interested. If the community target is reached, we&apos;ll coordinate with the verified service provider.
                </p>
              </div>
            ) : (
              <button
                onClick={() => setFormOpen(true)}
                className="w-full py-3.5 bg-[#2596be] hover:bg-[#1e7ca0] active:scale-[0.98] text-white text-sm font-extrabold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>I&apos;m Interested</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Simplified Public Status Tracker */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-[#142326] uppercase tracking-wider">
            Community Service Progress
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#2E8B57] text-white flex items-center justify-center text-[10px]">
                ✓
              </div>
              <span className="font-semibold text-[#142326]">Interest Recorded</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  statusLevel >= 2
                    ? 'bg-[#2E8B57] text-white'
                    : 'border border-[#E5E7EB] text-[#667085]'
                }`}
              >
                {statusLevel >= 2 ? '✓' : '○'}
              </div>
              <span className={statusLevel >= 2 ? 'font-semibold text-[#142326]' : 'text-[#667085]'}>
                Community Target Reached
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  statusLevel >= 3
                    ? 'bg-[#2E8B57] text-white'
                    : 'border border-[#E5E7EB] text-[#667085]'
                }`}
              >
                {statusLevel >= 3 ? '✓' : '○'}
              </div>
              <span className={statusLevel >= 3 ? 'font-semibold text-[#142326]' : 'text-[#667085]'}>
                Service Provider Confirmed
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  statusLevel >= 4
                    ? 'bg-[#2596be] text-white'
                    : 'border border-[#E5E7EB] text-[#667085]'
                }`}
              >
                {statusLevel >= 4 ? '●' : '○'}
              </div>
              <span className={statusLevel >= 4 ? 'font-semibold text-[#2596be]' : 'text-[#667085]'}>
                Service Scheduled
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  statusLevel >= 5
                    ? 'bg-[#2E8B57] text-white'
                    : 'border border-[#E5E7EB] text-[#667085]'
                }`}
              >
                {statusLevel >= 5 ? '✓' : '○'}
              </div>
              <span className={statusLevel >= 5 ? 'font-semibold text-[#2E8B57]' : 'text-[#667085]'}>
                Service Completed
              </span>
            </div>
          </div>
        </div>

        {/* Association Trust Footer */}
        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs text-xs text-[#667085] space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-[#142326]">
            <ShieldCheck className="w-4 h-4 text-[#2596be]" />
            <span>Pre-cleared with {apartment.gateSecurityApp}</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Quiet hours (1:00 PM – 2:30 PM) observed. All technicians are background-checked and pre-registered at the security gate.
          </p>
        </div>
      </main>

      {/* Modal / Sheet for "I'M INTERESTED" Form */}
      <AnimatePresence>
        {formOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white rounded-t-3xl sm:rounded-2xl border border-[#E5E7EB] shadow-xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden"
            >
              <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#2596be] tracking-wider">
                    {apartment.name}
                  </div>
                  <h3 className="text-base font-bold text-[#142326]">
                    Register Interest · {service.name}
                  </h3>
                </div>
                <button
                  onClick={() => setFormOpen(false)}
                  className="p-1.5 text-[#667085] hover:bg-[#F8F9FA] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 max-h-[75vh]">
                {/* Community notice - locked to this apartment */}
                <div className="p-2.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] flex items-center justify-between text-xs">
                  <span className="text-[#667085]">Community:</span>
                  <span className="font-bold text-[#142326]">{apartment.name}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Full Name <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Kumar"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Mobile / WhatsApp Number <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#667085]">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      className="w-full pl-12 pr-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Tower / Block <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={block}
                      onChange={e => setBlock(e.target.value)}
                      placeholder="e.g. Tower B"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Flat Number <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={flatNumber}
                      onChange={e => setFlatNumber(e.target.value)}
                      placeholder="e.g. 204"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Preferred Day
                    </label>
                    <select
                      value={preferredDate}
                      onChange={e => setPreferredDate(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#142326]"
                    >
                      {campaign.availableDates.map(d => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Preferred Slot
                    </label>
                    <select
                      value={preferredSlot}
                      onChange={e => setPreferredSlot(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#142326]"
                    >
                      {campaign.availableSlots.map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142326] mb-1">
                    Notes or Vehicle / Unit details (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Car model, parking bay number, or floor..."
                    className="w-full px-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#142326]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Submit My Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="p-4 text-center text-xs text-[#667085] border-t border-[#E5E7EB] bg-white">
        © {new Date().getFullYear()} GK APARTMENT CARE · Coordinated Community Services
      </footer>
    </div>
  );
};
