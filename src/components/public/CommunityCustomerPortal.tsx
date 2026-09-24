import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Apartment, Service, Campaign, ResidentRequest } from '../../types';
import { Logo } from '../common/Logo';
import {
  Building2,
  Sparkles,
  ShieldCheck,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  Share2,
  Check,
  MessageCircle,
  Copy,
  Car,
  Wind,
  Droplets,
  Home,
  Armchair,
  Wrench,
  X,
  Phone,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommunityCustomerPortalProps {
  apartment: Apartment;
}

export const CommunityCustomerPortal: React.FC<CommunityCustomerPortalProps> = ({ apartment }) => {
  const {
    services,
    campaigns,
    residentRequests,
    submitResidentInterest,
    getCustomerPortalUrl
  } = useApp();

  // Interest Modal state
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [interestSubmitted, setInterestSubmitted] = useState<ResidentRequest | null>(null);

  // Form State matching Section 9 specification
  const [residentName, setResidentName] = useState('');
  const [phone, setPhone] = useState('');
  const [block, setBlock] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('');
  const [notes, setNotes] = useState('');

  // Status Lookup State
  const [lookupQuery, setLookupQuery] = useState('');
  const [searchedRequests, setSearchedRequests] = useState<ResidentRequest[] | null>(null);

  // Share link state
  const [copiedLink, setCopiedLink] = useState(false);

  // Public URL for this community
  const portalUrl = getCustomerPortalUrl(apartment);

  // Campaigns exclusively belonging to this community (Section 8: "This campaign belongs ONLY to XYZ Apartments")
  const communityCampaigns = useMemo(() => {
    return campaigns.filter(c => c.apartmentId === apartment.id);
  }, [campaigns, apartment.id]);

  const handleOpenInterest = (camp: Campaign) => {
    setSelectedCampaign(camp);
    setPreferredSlot(camp.availableSlots[0] || '09:00 AM – 11:00 AM');
    setInterestSubmitted(null);
    setInterestModalOpen(true);
  };

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign || !residentName.trim() || !phone.trim() || !flatNumber.trim()) return;

    // Section 10: "The request must be saved to the application's shared data...
    // Both customer portal and admin portal use the SAME campaign data!"
    const newReq = submitResidentInterest({
      campaignId: selectedCampaign.id,
      apartmentId: apartment.id,
      residentName: residentName.trim(),
      phone: phone.trim(),
      block: block.trim() || 'Block A',
      flatNumber: flatNumber.trim(),
      preferredDate: selectedCampaign.availableDates[0] || 'Sunday',
      preferredSlot: preferredSlot || selectedCampaign.availableSlots[0] || '09:00 AM – 11:00 AM',
      notes: notes.trim(),
    });

    setInterestSubmitted(newReq);
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    const query = lookupQuery.trim().toLowerCase();
    const cleanPhone = query.replace(/[^0-9]/g, '');

    const matches = residentRequests.filter(r => {
      if (r.apartmentId !== apartment.id) return false;
      const flatMatch = r.flatNumber.toLowerCase().includes(query) || (r.block && r.block.toLowerCase().includes(query));
      const phoneMatch = cleanPhone.length >= 5 && r.phone.replace(/[^0-9]/g, '').includes(cleanPhone);
      return flatMatch || phoneMatch;
    });

    setSearchedRequests(matches);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
`GK APARTMENT CARE

Hello ${apartment.name} residents 👋

You can view the available community services and register your interest here:

${portalUrl}

[Open Community Portal]`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const getServiceForCampaign = (camp: Campaign): Service | undefined => {
    return services.find(s => s.id === camp.serviceId);
  };

  const getCategoryIcon = (iconName: string = '') => {
    switch (iconName) {
      case 'Car':
        return <Car className="w-5 h-5 text-[#2596be]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#2596be]" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-[#2596be]" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-[#2596be]" />;
      case 'Home':
        return <Home className="w-5 h-5 text-[#2596be]" />;
      case 'Armchair':
        return <Armchair className="w-5 h-5 text-[#2596be]" />;
      default:
        return <Wrench className="w-5 h-5 text-[#2596be]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#142326] flex flex-col antialiased selection:bg-[#2596be]/20 selection:text-[#142326]">
      {/* 1. Header: Strictly isolated to this Community (Section 5 & 6) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" showSubtitle={false} />
            <div className="h-5 w-px bg-[#E5E7EB]" />
            <div>
              <span className="text-xs font-black text-[#142326] block leading-tight truncate max-w-[160px] sm:max-w-xs uppercase">
                {apartment.name}
              </span>
              <span className="text-[10px] text-[#2596be] font-bold block leading-none">
                Resident Service Portal
              </span>
            </div>
          </div>

          <button
            onClick={handleShareWhatsApp}
            className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1ebd5a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Share with apartment neighbors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share on WhatsApp</span>
          </button>
        </div>
      </header>

      {/* Main Mobile-First Container (Section 5: "simple, mobile-first customer experience") */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-5">
        {/* 2. Community Banner & Gate Verification */}
        <section className="bg-white p-5 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#2596be]/10 rounded-md text-[11px] font-bold text-[#2596be]">
              <Building2 className="w-3.5 h-3.5" />
              <span>{apartment.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#142326] tracking-tight">
              Community Doorstep Care
            </h1>
            <p className="text-xs text-[#667085] leading-relaxed">
              Doorstep services with verified rates and bulk group savings for residents of {apartment.name}. Pre-cleared with {apartment.gateSecurityApp} gate pass.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="p-2.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] text-center">
              <ShieldCheck className="w-4 h-4 text-[#2596be] mx-auto mb-1" />
              <div className="font-bold text-[#142326]">{apartment.gateSecurityApp}</div>
              <div className="text-[10px] text-[#667085]">Pre-cleared entry</div>
            </div>

            <div className="p-2.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] text-center">
              <Clock className="w-4 h-4 text-[#2596be] mx-auto mb-1" />
              <div className="font-bold text-[#142326]">Quiet Hours</div>
              <div className="text-[10px] text-[#667085]">Strictly respected</div>
            </div>

            <div className="p-2.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] text-center">
              <Users className="w-4 h-4 text-[#2596be] mx-auto mb-1" />
              <div className="font-bold text-[#142326]">Group Savings</div>
              <div className="text-[10px] text-[#667085]">Sunday bulk rates</div>
            </div>
          </div>
        </section>

        {/* 3. Community Campaigns List (Section 8 & 9) */}
        <section className="space-y-3">
          <div>
            <h2 className="text-base font-black text-[#142326]">
              Available Services for {apartment.name}
            </h2>
            <p className="text-xs text-[#667085]">
              Register your interest to join the community bulk pool and unlock discounted rates
            </p>
          </div>

          {communityCampaigns.length === 0 ? (
            <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] text-center text-xs text-[#667085] space-y-2">
              <p className="font-bold text-[#142326]">Services are currently being coordinated for {apartment.name}</p>
              <p>Check back shortly or invite neighbors to join the waitlist.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {communityCampaigns.map(camp => {
                const srv = getServiceForCampaign(camp);
                const percent = Math.min(100, Math.round((camp.currentDemand / camp.minimumDemand) * 100));
                const needed = Math.max(0, camp.minimumDemand - camp.currentDemand);
                const isTargetReached = camp.currentDemand >= camp.minimumDemand;

                return (
                  <div
                    key={camp.id}
                    className="p-5 bg-white rounded-3xl border border-[#E5E7EB] shadow-xs space-y-4 hover:border-[#2596be]/30 transition-all"
                  >
                    {/* Header: Service Name & Description */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#2596be]/10 flex items-center justify-center shrink-0 mt-0.5">
                          {getCategoryIcon(srv?.iconName)}
                        </div>
                        <div>
                          {/* Exact format: CAR WASH */}
                          <h3 className="text-base font-black text-[#142326] tracking-tight uppercase">
                            {srv?.name || 'Service'}
                          </h3>
                          <p className="text-xs text-[#667085] mt-0.5 line-clamp-2">
                            {srv?.description || camp.notes}
                          </p>
                        </div>
                      </div>

                      {/* Status indicator (Section 16: "Customers see only the appropriate simplified status") */}
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase shrink-0 ${
                          camp.status === 'completed'
                            ? 'bg-[#2E8B57]/10 text-[#2E8B57]'
                            : isTargetReached || camp.status === 'target_reached' || camp.status === 'provider_confirmed'
                            ? 'bg-[#2596be]/10 text-[#2596be]'
                            : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                        }`}
                      >
                        {isTargetReached && camp.status === 'collecting_demand'
                          ? 'TARGET REACHED'
                          : camp.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Pricing section (Section 9 specification) */}
                    <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[#667085] text-[11px] block">Normal Price:</span>
                        <span className="text-sm font-semibold text-[#667085] line-through">
                          ₹{camp.normalPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[#2596be] font-bold text-[11px] block">Community Price:</span>
                        <span className="text-lg font-black text-[#2596be]">
                          ₹{camp.communityPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Current Demand Counter (Section 9 & 11: "17 / 20 residents interested") */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-xs font-bold text-[#142326]">Current Demand:</span>
                        <span className="text-xs font-black text-[#2596be]">
                          {camp.currentDemand} / {camp.minimumDemand} residents interested
                        </span>
                      </div>

                      <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${isTargetReached ? 'bg-[#2E8B57]' : 'bg-[#2596be]'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#667085]">
                        <span>
                          {isTargetReached
                            ? '✓ Target reached! Service is confirmed.'
                            : `${needed} more resident requests needed to trigger visit`}
                        </span>
                        <span>Slots: {camp.availableDates.join(', ')}</span>
                      </div>
                    </div>

                    {/* Core CTA: [ I'M INTERESTED ] (Section 9 specification) */}
                    <button
                      onClick={() => handleOpenInterest(camp)}
                      className="w-full py-3 px-4 bg-[#2596be] hover:bg-[#1e7ca0] active:scale-[0.99] text-white text-xs sm:text-sm font-black rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>I'M INTERESTED</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 4. Resident Booking / Request Status Lookup (Isolated to this apartment) */}
        <section className="p-5 bg-white rounded-3xl border border-[#E5E7EB] shadow-xs space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[#142326]">Check Your Request Status</h3>
            <p className="text-xs text-[#667085]">
              Enter your Flat Number or Mobile Number to check requests in {apartment.name}
            </p>
          </div>

          <form onSubmit={handleLookupSubmit} className="flex gap-2">
            <input
              type="text"
              required
              value={lookupQuery}
              onChange={e => setLookupQuery(e.target.value)}
              placeholder="e.g. B-204 or 9876543210"
              className="flex-1 px-3.5 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#142326] hover:bg-[#2596be] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shrink-0"
            >
              Lookup
            </button>
          </form>

          {searchedRequests !== null && (
            <div className="space-y-2 pt-2">
              {searchedRequests.length > 0 ? (
                searchedRequests.map(req => {
                  const camp = campaigns.find(c => c.id === req.campaignId);
                  const srv = camp ? getServiceForCampaign(camp) : undefined;

                  return (
                    <div
                      key={req.id}
                      className="p-3 bg-[#F8F9FA] rounded-xl border border-[#2596be]/20 text-xs space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#142326]">{srv?.name || 'Service'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-[#2596be]/10 text-[#2596be]">
                          {req.status}
                        </span>
                      </div>
                      <div className="text-[#667085] text-[11px]">
                        Resident: {req.residentName} · Flat: {req.block} - {req.flatNumber}
                      </div>
                      <div className="text-[#667085] text-[11px]">
                        Preferred: {req.preferredDate || 'Sunday'} ({req.preferredSlot})
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-[#DC2626] font-semibold text-center py-2">
                  No matching request found for {lookupQuery} in {apartment.name}.
                </p>
              )}
            </div>
          )}
        </section>

        {/* 5. WhatsApp Share Box */}
        <section className="p-4 bg-gradient-to-r from-[#25D366]/10 to-[#2596be]/10 rounded-3xl border border-[#25D366]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-black text-[#142326]">
              Share with {apartment.name} Neighbors
            </h3>
            <p className="text-[11px] text-[#667085]">
              Pool requests with other flats in your society to reach targets faster!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-white text-[#142326] border border-[#E5E7EB] rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#1ebd5a] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white py-5 px-4 text-center text-xs text-[#667085] space-y-1">
        <div className="font-bold text-[#142326]">
          GK APARTMENT CARE · {apartment.name}
        </div>
        <p className="text-[11px]">
          Direct doorstep fulfillment · Pre-cleared on {apartment.gateSecurityApp}
        </p>
      </footer>

      {/* Section 9: "I'M INTERESTED" Simple Modal Form */}
      <AnimatePresence>
        {interestModalOpen && selectedCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl max-w-md w-full overflow-hidden text-[#142326]"
            >
              {interestSubmitted ? (
                /* Success Screen (Section 10 Confirmation) */
                <div className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#142326]">Interest Registered!</h3>
                    <p className="text-xs text-[#667085] mt-1">
                      Your request for <strong>{selectedCampaign.serviceId.replace('srv-', '').replace('-', ' ').toUpperCase()}</strong> has been added to the {apartment.name} community pool.
                    </p>
                  </div>

                  <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] text-xs text-left space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Flat &amp; Block:</span>
                      <span className="font-bold text-[#142326]">{interestSubmitted.block}, Flat {interestSubmitted.flatNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Resident Name:</span>
                      <span className="font-bold text-[#142326]">{interestSubmitted.residentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Community Price:</span>
                      <span className="font-bold text-[#2596be]">₹{selectedCampaign.communityPrice}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#E5E7EB] pt-1.5">
                      <span className="text-[#667085]">Updated Demand:</span>
                      <span className="font-black text-[#2E8B57]">
                        {selectedCampaign.currentDemand} / {selectedCampaign.minimumDemand} requests
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setInterestModalOpen(false)}
                      className="w-full py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Simple Form: Name, Phone, Block, Flat Number, Preferred Slot, Optional Notes */
                <>
                  <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-[#142326]">
                        Register Interest
                      </h3>
                      <p className="text-xs text-[#2596be] font-bold">
                        {getServiceForCampaign(selectedCampaign)?.name || 'Service'} · {apartment.name}
                      </p>
                    </div>
                    <button
                      onClick={() => setInterestModalOpen(false)}
                      className="p-1.5 text-[#667085] hover:bg-[#F8F9FA] rounded-lg cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleInterestSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Price and Demand summary */}
                    <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[#667085] block text-[11px]">Community Rate:</span>
                        <span className="font-black text-base text-[#2596be]">
                          ₹{selectedCampaign.communityPrice}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#667085] block text-[11px]">Demand:</span>
                        <span className="font-bold text-[#142326]">
                          {selectedCampaign.currentDemand} / {selectedCampaign.minimumDemand} flats
                        </span>
                      </div>
                    </div>

                    {/* Resident Details */}
                    <div>
                      <label className="block text-xs font-bold text-[#142326] mb-1">
                        Full Name <span className="text-[#DC2626]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={residentName}
                        onChange={e => setResidentName(e.target.value)}
                        placeholder="e.g. Rahul Kumar"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#142326] mb-1">
                        Phone Number (+91) <span className="text-[#DC2626]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#142326] mb-1">
                          Block / Tower <span className="text-[#DC2626]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={block}
                          onChange={e => setBlock(e.target.value)}
                          placeholder="e.g. Tower B"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be]"
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
                          className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#142326] mb-1">
                        Preferred Slot
                      </label>
                      <select
                        value={preferredSlot}
                        onChange={e => setPreferredSlot(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be]"
                      >
                        {selectedCampaign.availableSlots.map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#142326] mb-1">
                        Optional Notes / Parking Slot
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="e.g. White Creta parked at basement slot B-14..."
                        className="w-full px-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be]"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setInterestModalOpen(false)}
                        className="px-4 py-2 border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#667085] hover:bg-[#F8F9FA] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
