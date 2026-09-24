import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Apartment, GateSecurityApp, Campaign } from '../../types';
import { CampaignDetail } from './CampaignDetail';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Users,
  ShieldCheck,
  Phone,
  Mail,
  Edit2,
  CheckCircle2,
  X,
  ExternalLink,
  Copy,
  Check,
  MessageCircle,
  RefreshCw,
  Globe,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Megaphone,
  CalendarCheck,
  Tag,
  Clock,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ApartmentsManager: React.FC = () => {
  const {
    apartments,
    services,
    campaigns,
    residentRequests,
    bookings,
    addApartment,
    updateApartment,
    toggleApartmentStatus,
    generateCustomerPortalToken,
    getCustomerPortalUrl,
    createCampaign,
    adminSelectedCommunityId,
    setAdminSelectedCommunityId,
    navigate
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<Apartment | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [justCreatedApt, setJustCreatedApt] = useState<Apartment | null>(null);

  // Drilldown states inside community
  const [viewingCampaignId, setViewingCampaignId] = useState<string | null>(null);
  const [addCampaignModalOpen, setAddCampaignModalOpen] = useState(false);

  // New Campaign Form State
  const [campServiceId, setCampServiceId] = useState('');
  const [campNormalPrice, setCampNormalPrice] = useState('1000');
  const [campCommunityPrice, setCampCommunityPrice] = useState('800');
  const [campSundayBulkPrice, setCampSundayBulkPrice] = useState('700');
  const [campMinDemand, setCampMinDemand] = useState('20');

  // Form state for creating / editing community
  const [name, setName] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [area, setArea] = useState('HITEC City');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('500081');
  const [totalUnits, setTotalUnits] = useState('250');
  const [rwaContact, setRwaContact] = useState('');
  const [rwaPhone, setRwaPhone] = useState('');
  const [rwaEmail, setRwaEmail] = useState('');
  const [gateSecurityApp, setGateSecurityApp] = useState<GateSecurityApp>('MyGate');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [notes, setNotes] = useState('');

  // Selected community object if admin clicked drill-down
  const activeCommunity = apartments.find(a => a.id === adminSelectedCommunityId);

  const filtered = apartments.filter(
    a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.portalToken && a.portalToken.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingApt(null);
    setName('');
    setCity('Hyderabad');
    setArea('Financial District');
    setAddress('');
    setPincode('500032');
    setTotalUnits('250');
    setRwaContact('');
    setRwaPhone('');
    setRwaEmail('');
    setGateSecurityApp('MyGate');
    setStatus('active');
    setNotes('');
    setModalOpen(true);
  };

  const handleOpenEdit = (apt: Apartment) => {
    setEditingApt(apt);
    setName(apt.name);
    setCity(apt.city);
    setArea(apt.area);
    setAddress(apt.address);
    setPincode(apt.pincode);
    setTotalUnits(apt.totalUnits.toString());
    setRwaContact(apt.rwaContact);
    setRwaPhone(apt.rwaPhone);
    setRwaEmail(apt.rwaEmail);
    setGateSecurityApp(apt.gateSecurityApp);
    setStatus(apt.status);
    setNotes(apt.notes || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingApt) {
      updateApartment(editingApt.id, {
        name: name.trim(),
        city: city.trim(),
        area: area.trim(),
        address: address.trim(),
        pincode: pincode.trim(),
        totalUnits: parseInt(totalUnits) || 100,
        rwaContact: rwaContact.trim(),
        rwaPhone: rwaPhone.trim(),
        rwaEmail: rwaEmail.trim(),
        gateSecurityApp,
        status,
        notes: notes.trim(),
      });
      setModalOpen(false);
    } else {
      const created = addApartment({
        name: name.trim(),
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        portalToken: '',
        city: city.trim(),
        area: area.trim(),
        address: address.trim(),
        pincode: pincode.trim(),
        totalUnits: parseInt(totalUnits) || 100,
        rwaContact: rwaContact.trim(),
        rwaPhone: rwaPhone.trim(),
        rwaEmail: rwaEmail.trim(),
        gateSecurityApp,
        status,
        notes: notes.trim(),
      });
      setModalOpen(false);
      setJustCreatedApt(created);
    }
  };

  const handleCopyLink = (apt: Apartment) => {
    const url = getCustomerPortalUrl(apt);
    navigator.clipboard.writeText(url);
    setCopiedToken(apt.id);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleOpenPortal = (apt: Apartment) => {
    const path = `/c/${apt.slug}/${apt.portalToken || '7H4K92'}`;
    navigate(path);
  };

  // Section 4: WhatsApp Message format
  const handleShareWhatsApp = (apt: Apartment) => {
    const url = getCustomerPortalUrl(apt);
    const message = encodeURIComponent(
`GK APARTMENT CARE

Hello ${apt.name} residents 👋

You can view the available community services and register your interest here:

${url}

[Open Community Portal]`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleGeneratePortal = (apt: Apartment) => {
    generateCustomerPortalToken(apt.id);
  };

  // Add campaign for this community
  const handleOpenAddCampaign = (apt: Apartment) => {
    const firstSrv = services[0];
    if (firstSrv) {
      setCampServiceId(firstSrv.id);
      setCampNormalPrice(firstSrv.normalPrice.toString());
      setCampCommunityPrice(firstSrv.communityPrice.toString());
      setCampSundayBulkPrice(firstSrv.sundayBulkPrice.toString());
      setCampMinDemand(firstSrv.minimumDemand?.toString() || '20');
    }
    setAddCampaignModalOpen(true);
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommunity || !campServiceId) return;

    const srv = services.find(s => s.id === campServiceId);
    const cleanSlug = activeCommunity.slug.substring(0, 3).toUpperCase();
    const srvCode = campServiceId.substring(4, 6).toUpperCase();
    const token = `${cleanSlug}-${srvCode}-${Math.floor(100 + Math.random() * 900)}`;

    createCampaign({
      token,
      apartmentId: activeCommunity.id,
      serviceId: campServiceId,
      normalPrice: parseInt(campNormalPrice) || 1000,
      communityPrice: parseInt(campCommunityPrice) || 800,
      sundayBulkPrice: parseInt(campSundayBulkPrice) || 700,
      minimumDemand: parseInt(campMinDemand) || 20,
      availableDates: ['Sunday'],
      availableSlots: srv?.availableSlots || ['09:00 AM – 11:00 AM', '11:00 AM – 01:00 PM', '02:00 PM – 04:00 PM'],
      status: 'collecting_demand',
      notes: `${srv?.name || 'Service'} campaign created for ${activeCommunity.name}`,
    });

    setAddCampaignModalOpen(false);
  };

  // IF viewing a specific campaign within a community: Render CampaignDetail
  if (viewingCampaignId) {
    return (
      <CampaignDetail
        campaignId={viewingCampaignId}
        onBack={() => setViewingCampaignId(null)}
      />
    );
  }

  // IF viewing a specific community: Render Section 12 (ADMIN COMMUNITY VIEW)
  if (activeCommunity) {
    const communityCampaigns = campaigns.filter(c => c.apartmentId === activeCommunity.id);
    const communityRequests = residentRequests.filter(r => r.apartmentId === activeCommunity.id);
    const communityBookings = bookings.filter(b => b.apartmentId === activeCommunity.id);
    const completedServices = communityBookings.filter(b => b.status === 'completed').length;
    const portalUrl = getCustomerPortalUrl(activeCommunity);
    const isCopied = copiedToken === activeCommunity.id;

    return (
      <div className="space-y-6">
        {/* Breadcrumb & Community Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAdminSelectedCommunityId(null)}
              className="p-2 bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] rounded-xl text-[#142326] transition-colors cursor-pointer"
              title="Back to All Communities"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#667085]">COMMUNITY OVERVIEW</span>
                <span>·</span>
                <span className="text-xs font-mono font-bold text-[#2596be]">{activeCommunity.id}</span>
              </div>
              <h2 className="text-2xl font-black text-[#142326] tracking-tight">
                {activeCommunity.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenEdit(activeCommunity)}
              className="px-3.5 py-2 bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] text-[#142326] text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#667085]" />
              <span>Edit Details</span>
            </button>

            <button
              onClick={() => handleOpenPortal(activeCommunity)}
              className="px-3.5 py-2 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Customer Portal</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards (Section 12 specification) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-[#667085]">
              <span>Active Services</span>
              <Sparkles className="w-4 h-4 text-[#2596be]" />
            </div>
            <div className="text-2xl font-black text-[#142326]">
              {communityCampaigns.length > 0 ? communityCampaigns.length : services.length}
            </div>
            <div className="text-[11px] text-[#667085]">Available in society catalog</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-[#667085]">
              <span>Active Campaigns</span>
              <Megaphone className="w-4 h-4 text-[#2596be]" />
            </div>
            <div className="text-2xl font-black text-[#142326]">{communityCampaigns.length}</div>
            <div className="text-[11px] text-[#2596be] font-semibold">Bulk demand pools</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-[#667085]">
              <span>Total Requests</span>
              <CalendarCheck className="w-4 h-4 text-[#2596be]" />
            </div>
            <div className="text-2xl font-black text-[#2596be]">{communityRequests.length}</div>
            <div className="text-[11px] text-[#2E8B57] font-semibold">Inbound resident pledges</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-[#667085]">
              <span>Completed Services</span>
              <CheckCheck className="w-4 h-4 text-[#2E8B57]" />
            </div>
            <div className="text-2xl font-black text-[#2E8B57]">{completedServices}</div>
            <div className="text-[11px] text-[#667085]">Delivered doorstep jobs</div>
          </div>
        </div>

        {/* Customer Portal Link Box (Section 3 & 12 specification) */}
        <div className="p-5 bg-gradient-to-br from-[#2596be]/10 to-[#82c2db]/10 rounded-2xl border border-[#2596be]/20 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#2596be]" />
              <h3 className="font-extrabold text-sm text-[#142326]">
                Customer Portal Link ({activeCommunity.name})
              </h3>
            </div>
            <span className="text-xs font-mono font-bold bg-white px-2.5 py-0.5 rounded-md border border-[#2596be]/20 text-[#2596be] self-start sm:self-auto">
              Token: {activeCommunity.portalToken || '7H4K92'}
            </span>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-[#E5E7EB] text-xs font-mono text-[#142326] truncate select-all">
            {portalUrl}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => handleCopyLink(activeCommunity)}
              className="px-4 py-2 bg-white hover:bg-[#F8F9FA] text-[#142326] border border-[#E5E7EB] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2E8B57]" />
                  <span className="text-[#2E8B57]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#667085]" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleShareWhatsApp(activeCommunity)}
              className="px-4 py-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={() => handleGeneratePortal(activeCommunity)}
              className="px-3.5 py-2 bg-white hover:bg-[#F8F9FA] text-[#667085] hover:text-[#2596be] border border-[#E5E7EB] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate Token</span>
            </button>
          </div>
        </div>

        {/* Section 12: Community Campaigns List */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
            <div>
              <h3 className="text-base font-black text-[#142326]">
                Campaigns for {activeCommunity.name} ({communityCampaigns.length})
              </h3>
              <p className="text-xs text-[#667085]">
                Demand aggregation pools configured specifically for {activeCommunity.name} residents
              </p>
            </div>

            <button
              onClick={() => handleOpenAddCampaign(activeCommunity)}
              className="px-3.5 py-2 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Campaign for this Community</span>
            </button>
          </div>

          {communityCampaigns.length === 0 ? (
            <div className="p-8 text-center bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] space-y-2">
              <p className="text-sm font-bold text-[#142326]">No campaigns configured for this community yet</p>
              <p className="text-xs text-[#667085]">
                Launch services like Car Wash or AC Cleaning with discounted community rates.
              </p>
              <button
                onClick={() => handleOpenAddCampaign(activeCommunity)}
                className="mt-2 px-4 py-2 bg-[#2596be] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                + Add First Campaign
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {communityCampaigns.map(camp => {
                const srv = services.find(s => s.id === camp.serviceId);
                const reqs = residentRequests.filter(r => r.campaignId === camp.id);
                const percent = Math.min(100, Math.round((camp.currentDemand / camp.minimumDemand) * 100));
                const isTargetReached = camp.currentDemand >= camp.minimumDemand;

                return (
                  <div
                    key={camp.id}
                    className="p-4 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-[#142326] text-sm">{srv?.name || 'Service'}</h4>
                        <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#E5E7EB] text-[#2596be] font-bold">
                          {camp.token}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
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

                      <div className="flex items-center gap-3 text-xs text-[#667085]">
                        <span>Normal: <del>₹{camp.normalPrice}</del></span>
                        <span>·</span>
                        <span className="font-bold text-[#142326]">Community: ₹{camp.communityPrice}</span>
                        {camp.sundayBulkPrice && (
                          <>
                            <span>·</span>
                            <span className="font-bold text-[#2596be]">Sunday Bulk: ₹{camp.sundayBulkPrice}</span>
                          </>
                        )}
                      </div>

                      {/* Demand Progress Bar */}
                      <div className="w-full max-w-xs space-y-1 pt-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-bold text-[#142326]">
                            {camp.currentDemand} / {camp.minimumDemand} requests
                          </span>
                          <span className="text-[#667085]">{percent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isTargetReached ? 'bg-[#2E8B57]' : 'bg-[#2596be]'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setViewingCampaignId(camp.id)}
                        className="px-4 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Manage Requests &amp; Dispatch</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal: Add New Campaign to this Community */}
        <AnimatePresence>
          {addCampaignModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl max-w-md w-full overflow-hidden text-[#142326]"
              >
                <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#142326]">
                      Add Campaign for {activeCommunity.name}
                    </h3>
                    <p className="text-xs text-[#667085]">
                      Enable a service with custom community &amp; bulk rates
                    </p>
                  </div>
                  <button
                    onClick={() => setAddCampaignModalOpen(false)}
                    className="p-1.5 text-[#667085] hover:bg-[#F8F9FA] rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateCampaignSubmit} className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Select Service
                    </label>
                    <select
                      value={campServiceId}
                      onChange={e => {
                        const sId = e.target.value;
                        setCampServiceId(sId);
                        const match = services.find(s => s.id === sId);
                        if (match) {
                          setCampNormalPrice(match.normalPrice.toString());
                          setCampCommunityPrice(match.communityPrice.toString());
                          setCampSundayBulkPrice(match.sundayBulkPrice.toString());
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be]"
                    >
                      {services.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} (Normal ₹{s.normalPrice})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#142326] mb-1">
                        Normal Price (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={campNormalPrice}
                        onChange={e => setCampNormalPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#142326] mb-1">
                        Community Price (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={campCommunityPrice}
                        onChange={e => setCampCommunityPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#142326] mb-1">
                        Sunday Bulk Price (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={campSundayBulkPrice}
                        onChange={e => setCampSundayBulkPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#142326] mb-1">
                        Target Demand (flats)
                      </label>
                      <input
                        type="number"
                        required
                        value={campMinDemand}
                        onChange={e => setCampMinDemand(e.target.value)}
                        placeholder="20"
                        className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAddCampaignModalOpen(false)}
                      className="px-4 py-2 border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#667085] hover:bg-[#F8F9FA] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Launch Campaign
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // DEFAULT: Communities List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-[#142326] tracking-tight">Communities</h2>
            <span className="px-2.5 py-0.5 bg-[#2596be]/10 text-[#2596be] text-xs font-bold rounded-full">
              {apartments.length} Active Societies
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-1">
            Central community management, unique identity allocation, and customer portal links
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Community</span>
        </button>
      </div>

      {/* Just Created Success Banner */}
      <AnimatePresence>
        {justCreatedApt && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-[#2E8B57]/10 border border-[#2E8B57]/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div>
              <div className="flex items-center gap-2 font-bold text-[#2E8B57]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Community Created: {justCreatedApt.name}</span>
              </div>
              <p className="text-[#142326] mt-0.5">
                Internal ID: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#2E8B57]/30 font-bold">{justCreatedApt.id}</code> • Unique Customer Portal Generated!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyLink(justCreatedApt)}
                className="px-3 py-1.5 bg-white border border-[#2E8B57]/30 hover:bg-[#2E8B57]/10 text-[#2E8B57] font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Public Link</span>
              </button>
              <button
                onClick={() => setJustCreatedApt(null)}
                className="p-1.5 text-[#667085] hover:text-[#142326] rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by community name, area, ID (community_...), or portal token..."
            className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326] shadow-xs"
          />
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(apt => {
          const portalUrl = getCustomerPortalUrl(apt);
          const isCopied = copiedToken === apt.id;
          const aptRequests = residentRequests.filter(r => r.apartmentId === apt.id);
          const aptCampaigns = campaigns.filter(c => c.apartmentId === apt.id);

          return (
            <div
              key={apt.id}
              className={`p-5 rounded-2xl border transition-all space-y-4 bg-white ${
                apt.status === 'active'
                  ? 'border-[#E5E7EB] shadow-xs'
                  : 'border-[#E5E7EB] opacity-60 bg-[#F8F9FA]'
              }`}
            >
              {/* Top Community Badge & Title */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-extrabold text-[#142326]">{apt.name}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold capitalize ${
                        apt.status === 'active'
                          ? 'bg-[#2E8B57]/10 text-[#2E8B57]'
                          : 'bg-[#DC2626]/10 text-[#DC2626]'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  {/* Internal ID */}
                  <div className="flex items-center gap-1.5 text-xs text-[#667085]">
                    <span className="font-mono text-[11px] bg-[#F8F9FA] px-2 py-0.5 rounded border border-[#E5E7EB] text-[#2596be] font-bold">
                      {apt.id}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-1.5 text-xs text-[#667085]">
                    <MapPin className="w-3.5 h-3.5 text-[#2596be] shrink-0" />
                    <span>{apt.address || apt.area}, {apt.city} - {apt.pincode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(apt)}
                    className="p-2 text-[#667085] hover:text-[#2596be] hover:bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] cursor-pointer transition-colors"
                    title="Edit Community Settings"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* RWA & Gate info & Counts */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
                  <span className="text-[#667085] block text-[11px]">Total Gated Flats</span>
                  <span className="font-bold text-[#142326] text-sm">{apt.totalUnits} Units</span>
                </div>
                <div className="p-2.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
                  <span className="text-[#667085] block text-[11px]">Gate Integration</span>
                  <span className="font-bold text-[#2596be] text-xs flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {apt.gateSecurityApp}
                  </span>
                </div>
                <div className="p-2.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
                  <span className="text-[#667085] block text-[11px]">Inbound Demands</span>
                  <span className="font-bold text-[#2596be] text-sm">{aptRequests.length} requests</span>
                </div>
                <div className="p-2.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
                  <span className="text-[#667085] block text-[11px]">Active Campaigns</span>
                  <span className="font-bold text-[#142326] text-sm">{aptCampaigns.length} campaigns</span>
                </div>
              </div>

              {/* DEDICATED CUSTOMER PORTAL BOX (Section 3 & 4) */}
              <div className="p-3.5 bg-gradient-to-br from-[#2596be]/5 to-[#82c2db]/10 rounded-xl border border-[#2596be]/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2596be]">
                    <Globe className="w-3.5 h-3.5" />
                    <span>CUSTOMER PORTAL</span>
                  </div>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#2596be]/20 text-[#142326] font-bold">
                    Token: {apt.portalToken || '7H4K92'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-[#667085]">
                    Public Link ({apt.name}):
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#E5E7EB] text-xs font-mono text-[#142326] truncate select-all">
                    {portalUrl}
                  </div>
                </div>

                {/* Core Action Buttons: Copy Link, Share on WhatsApp, Open Portal */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => handleCopyLink(apt)}
                    className="py-2 px-2 bg-white hover:bg-[#F8F9FA] text-[#142326] border border-[#E5E7EB] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    title="Copy Customer Portal Link"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#2E8B57]" />
                        <span className="text-[#2E8B57]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#667085]" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleShareWhatsApp(apt)}
                    className="py-2 px-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    title="Share Link to Apartment WhatsApp Community"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleOpenPortal(apt)}
                    className="py-2 px-2 bg-[#2596be] hover:bg-[#1e7ca0] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    title="Open Community Resident Portal"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Portal</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <button
                    onClick={() => handleGeneratePortal(apt)}
                    className="text-[#667085] hover:text-[#2596be] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Create / Regenerate Portal</span>
                  </button>
                  <button
                    onClick={() => toggleApartmentStatus(apt.id)}
                    className={`font-semibold cursor-pointer ${
                      apt.status === 'active' ? 'text-[#DC2626] hover:underline' : 'text-[#2E8B57] hover:underline'
                    }`}
                  >
                    {apt.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>

              {/* Drilldown button to Community Overview (Section 12) */}
              <button
                onClick={() => setAdminSelectedCommunityId(apt.id)}
                className="w-full py-2.5 px-4 bg-[#F8F9FA] hover:bg-[#E5E7EB] text-[#142326] text-xs font-bold rounded-xl border border-[#E5E7EB] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Community Overview &amp; Campaigns ({aptCampaigns.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2596be]" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit Community */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden text-[#142326]"
            >
              <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#142326]">
                    {editingApt ? 'Edit Community' : 'Create Community'}
                  </h3>
                  <p className="text-xs text-[#667085]">
                    {editingApt ? 'Modify gated community parameters' : 'Will assign unique internal ID & generate dedicated customer portal'}
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-[#667085] hover:bg-[#F8F9FA] rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 max-h-[75vh]">
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Community Name <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. XYZ Apartments"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      City / Location <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Hyderabad"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Area / Neighborhood <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={area}
                      onChange={e => setArea(e.target.value)}
                      placeholder="e.g. Financial District"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="e.g. Plot 18, Main Road, Nanakramguda"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Number of Flats / Units
                    </label>
                    <input
                      type="number"
                      value={totalUnits}
                      onChange={e => setTotalUnits(e.target.value)}
                      placeholder="250"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={e => setPincode(e.target.value)}
                      placeholder="500032"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      RWA Contact Person
                    </label>
                    <input
                      type="text"
                      value={rwaContact}
                      onChange={e => setRwaContact(e.target.value)}
                      placeholder="e.g. Mr. Sharma"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      RWA Phone (+91)
                    </label>
                    <input
                      type="text"
                      value={rwaPhone}
                      onChange={e => setRwaPhone(e.target.value)}
                      placeholder="+91 98490 12345"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Gate Security App
                    </label>
                    <select
                      value={gateSecurityApp}
                      onChange={e => setGateSecurityApp(e.target.value as GateSecurityApp)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    >
                      <option value="MyGate">MyGate</option>
                      <option value="NoBrokerHood">NoBrokerHood</option>
                      <option value="GateBuzz">GateBuzz</option>
                      <option value="Traditional">Traditional Register</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value as 'active' | 'inactive')}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Internal Society Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Quiet hours strictly observed, gate pass process..."
                    className="w-full px-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#667085] hover:bg-[#F8F9FA] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{editingApt ? 'Save Changes' : 'Create Community'}</span>
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
