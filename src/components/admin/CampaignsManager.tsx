import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Campaign, CampaignStatus } from '../../types';
import { CampaignDetail } from './CampaignDetail';
import {
  Sparkles,
  Plus,
  Search,
  Building2,
  Users,
  Copy,
  Check,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CampaignsManager: React.FC = () => {
  const {
    campaigns,
    apartments,
    services,
    createCampaign,
    activeCampaignId,
    setActiveCampaignId,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [filterApartmentId, setFilterApartmentId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for new campaign
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedAptId, setSelectedAptId] = useState(apartments[0]?.id || '');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [minimumDemand, setMinimumDemand] = useState('20');
  const [normalPrice, setNormalPrice] = useState('1000');
  const [communityPrice, setCommunityPrice] = useState('800');
  const [sundayBulkPrice, setSundayBulkPrice] = useState('700');
  const [availableDates, setAvailableDates] = useState('Saturday, Sunday');
  const [availableSlots, setAvailableSlots] = useState(
    '09:00 AM – 11:00 AM, 11:00 AM – 01:00 PM, 02:00 PM – 04:00 PM'
  );
  const [notes, setNotes] = useState('');

  // If a campaign is actively selected for operations detail, render CampaignDetail
  if (activeCampaignId) {
    return (
      <CampaignDetail
        campaignId={activeCampaignId}
        onBack={() => setActiveCampaignId(null)}
      />
    );
  }

  const handleOpenCreate = () => {
    setCreateError(null);
    setSelectedAptId(apartments[0]?.id || '');
    setSelectedServiceId(services[0]?.id || '');
    const srv = services[0];
    if (srv) {
      setNormalPrice(srv.normalPrice.toString());
      setCommunityPrice(srv.communityPrice.toString());
      setSundayBulkPrice((srv.sundayBulkPrice || 700).toString());
      setMinimumDemand((srv.minimumDemand || 20).toString());
    }
    setModalOpen(true);
  };

  const handleServiceChange = (srvId: string) => {
    setSelectedServiceId(srvId);
    const srv = services.find(s => s.id === srvId);
    if (srv) {
      setNormalPrice(srv.normalPrice.toString());
      setCommunityPrice(srv.communityPrice.toString());
      setSundayBulkPrice((srv.sundayBulkPrice || 700).toString());
      setMinimumDemand((srv.minimumDemand || 20).toString());
    }
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const apt = apartments.find(a => a.id === selectedAptId);
    const srv = services.find(s => s.id === selectedServiceId);
    if (!apt || !srv) return;

    const dates = availableDates.split(',').map(s => s.trim()).filter(Boolean);
    const slots = availableSlots.split(',').map(s => s.trim()).filter(Boolean);

    const result = await createCampaign({
      token: '', // token generated server-side / by crypto helper
      apartmentId: selectedAptId,
      serviceId: selectedServiceId,
      normalPrice: parseFloat(normalPrice) || 1000,
      communityPrice: parseFloat(communityPrice) || 800,
      sundayBulkPrice: parseFloat(sundayBulkPrice) || undefined,
      minimumDemand: parseInt(minimumDemand) || 20,
      availableDates: dates.length > 0 ? dates : ['Upcoming Sunday'],
      availableSlots: slots.length > 0 ? slots : ['09:00 AM – 11:00 AM', '11:00 AM – 01:00 PM'],
      status: 'collecting_demand',
      notes,
    });

    if (!result.success || !result.data) {
      setCreateError(result.error || 'Could not create campaign.');
      return;
    }

    setModalOpen(false);
    setActiveCampaignId(result.data.id);
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (filterApartmentId !== 'all' && c.apartmentId !== filterApartmentId) return false;
    const apt = apartments.find(a => a.id === c.apartmentId);
    const srv = services.find(s => s.id === c.serviceId);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        apt?.name.toLowerCase().includes(q) ||
        srv?.name.toLowerCase().includes(q) ||
        c.token.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleCopy = (token: string, aptSlug: string, srvId: string) => {
    const url = `${window.location.origin}/community/${aptSlug}/${srvId}/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#142326]">Campaign Management</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Create and track independent community service campaigns for specific apartments
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Campaign</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search campaigns by apartment, service, or token..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
          />
        </div>

        <select
          value={filterApartmentId}
          onChange={e => setFilterApartmentId(e.target.value)}
          className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#142326] cursor-pointer"
        >
          <option value="all">All Gated Communities ({apartments.length})</option>
          {apartments.map(a => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campaigns Grid - strictly NO overflowing horizontal rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCampaigns.map(camp => {
          const apt = apartments.find(a => a.id === camp.apartmentId);
          const srv = services.find(s => s.id === camp.serviceId);
          const percent = Math.min(100, Math.round((camp.currentDemand / camp.minimumDemand) * 100));
          const needed = Math.max(0, camp.minimumDemand - camp.currentDemand);
          const isTargetReached = needed === 0;

          return (
            <div
              key={camp.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#2596be]/40 p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#667085]">
                      <Building2 className="w-3.5 h-3.5 text-[#2596be]" />
                      <span className="font-semibold text-[#142326]">{apt?.name}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-[#142326] mt-0.5">
                      {srv?.name}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider shrink-0 ${
                      camp.status === 'completed'
                        ? 'bg-[#2E8B57]/10 text-[#2E8B57]'
                        : camp.status === 'target_reached' || camp.status === 'provider_confirmed'
                        ? 'bg-[#2596be]/10 text-[#2596be]'
                        : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                    }`}
                  >
                    {camp.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Demand Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#667085]">Resident Demand:</span>
                    <span className="font-mono font-bold text-[#142326]">
                      {camp.currentDemand} / {camp.minimumDemand}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isTargetReached ? 'bg-[#2E8B57]' : 'bg-[#2596be]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-[#667085] flex justify-between">
                    <span>{percent}% booked</span>
                    {isTargetReached ? (
                      <span className="text-[#2E8B57] font-semibold">Target Achieved</span>
                    ) : (
                      <span>{needed} more needed</span>
                    )}
                  </div>
                </div>

                {/* Pricing Box */}
                <div className="p-2.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#667085]">Community Price:</span>
                    <div className="font-extrabold text-[#142326] font-mono">
                      ₹{camp.communityPrice}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#667085]">Normal Price:</span>
                    <div className="text-[#667085] line-through font-mono">
                      ₹{camp.normalPrice}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopy(camp.token, apt?.slug || 'society', srv?.id || 'service')}
                  className="p-2 text-[#667085] hover:text-[#2596be] hover:bg-[#F8F9FA] rounded-lg transition-colors cursor-pointer"
                  title="Copy Public WhatsApp Link"
                >
                  {copiedToken === camp.token ? (
                    <Check className="w-4 h-4 text-[#2E8B57]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => setActiveCampaignId(camp.id)}
                  className="flex-1 py-2 px-3 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Operations &amp; Demand ({camp.currentDemand})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Campaign Wizard */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#142326]">
                    Create Community Campaign
                  </h3>
                  <p className="text-xs text-[#667085]">
                    Step 1 to 5: Set up service opportunity for a specific apartment
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-[#667085] hover:bg-[#F8F9FA] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCampaign} className="p-5 overflow-y-auto space-y-4 max-h-[75vh]">
                {createError && (
                  <div className="p-3 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-xl text-xs text-[#DC2626]">
                    {createError}
                  </div>
                )}

                {/* Step 1: Select Apartment */}
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Step 1: Select Apartment Community <span className="text-[#DC2626]">*</span>
                  </label>
                  <select
                    value={selectedAptId}
                    onChange={e => setSelectedAptId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  >
                    {apartments.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.area} · {a.totalUnits} flats)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 2: Select Service */}
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Step 2: Select Service Offer <span className="text-[#DC2626]">*</span>
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={e => handleServiceChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 3: Demand Target */}
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Step 3: Minimum Demand Target (Flats needed) <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={minimumDemand}
                    onChange={e => setMinimumDemand(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full px-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>

                {/* Step 4: Pricing */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#142326]">
                    Step 4: Pricing Breakdown
                  </label>
                  <div className="grid grid-cols-3 gap-2.5 bg-[#F8F9FA] p-3 rounded-xl border border-[#E5E7EB]">
                    <div>
                      <span className="text-[10px] text-[#667085] block mb-1">Normal (₹)</span>
                      <input
                        type="number"
                        required
                        value={normalPrice}
                        onChange={e => setNormalPrice(e.target.value)}
                        className="w-full p-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-bold font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#142326] font-bold block mb-1">Community (₹)</span>
                      <input
                        type="number"
                        required
                        value={communityPrice}
                        onChange={e => setCommunityPrice(e.target.value)}
                        className="w-full p-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-bold font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#2596be] font-bold block mb-1">Sunday Bulk (₹)</span>
                      <input
                        type="number"
                        value={sundayBulkPrice}
                        onChange={e => setSundayBulkPrice(e.target.value)}
                        className="w-full p-2 bg-white border border-[#2596be] rounded-lg text-xs font-bold font-mono text-[#2596be]"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 5: Dates & Slots */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Available Days
                    </label>
                    <input
                      type="text"
                      value={availableDates}
                      onChange={e => setAvailableDates(e.target.value)}
                      placeholder="Saturday, Sunday"
                      className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#142326]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Time Slots (comma-sep)
                    </label>
                    <input
                      type="text"
                      value={availableSlots}
                      onChange={e => setAvailableSlots(e.target.value)}
                      placeholder="9-11 AM, 11-1 PM"
                      className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#142326]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#667085] hover:bg-[#F8F9FA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Generate Campaign &amp; Public Link
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
