import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Apartment, Service, Campaign, ResidentRequest, Booking } from '../../types';
import { Logo } from '../common/Logo';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
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
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommunityCustomerPortalProps {
  apartment: Apartment;
  /** Campaigns scoped to this community (passed by the route loader). */
  campaigns: Campaign[];
  /** Services related to those campaigns (passed by the route loader). */
  services: Service[];
  /** Requests used for the status lookup (admin/resident mode only). */
  residentRequests?: ResidentRequest[];
  /** Whether the request-status lookup should be offered (anonymous link mode: false). */
  allowLookup?: boolean;
}

export const CommunityCustomerPortal: React.FC<CommunityCustomerPortalProps> = ({
  apartment,
  campaigns,
  services,
  residentRequests = [],
}) => {
  const {
    submitResidentInterest,
    getCustomerPortalUrl,
    bookings,
    setBookingModalService,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'services' | 'track'>('services');

  // Interest Modal state
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [interestSubmitted, setInterestSubmitted] = useState<ResidentRequest | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Campaigns this resident has already registered interest for (persisted in localStorage)
  const [registeredCampaignIds, setRegisteredCampaignIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(`gk_registered_campaigns_${apartment.id}`);
      return stored ? new Set(JSON.parse(stored)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const savedProfile = (() => {
    try {
      const raw = localStorage.getItem('gk_resident_profile');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  // Form State
  const [residentName, setResidentName] = useState(savedProfile?.name || '');
  const [phone, setPhone] = useState(savedProfile?.phone?.replace(/^\+91\s*/, '') || '');
  const [block, setBlock] = useState(savedProfile?.block || '');
  const [flatNumber, setFlatNumber] = useState(savedProfile?.flatNumber || '');
  const [preferredSlot, setPreferredSlot] = useState('');
  const [notes, setNotes] = useState('');

  // Status Lookup & Tracking State
  const [orderQuery, setOrderQuery] = useState(savedProfile?.flatNumber || '');
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);

  // Public URL for this community
  const portalUrl = getCustomerPortalUrl(apartment);

  // Campaigns exclusively belonging to this community
  const communityCampaigns = useMemo(() => {
    return campaigns.filter(c => c.apartmentId === apartment.id);
  }, [campaigns, apartment.id]);

  // Bookings belonging to this apartment
  const communityBookings = useMemo(() => {
    return bookings.filter(b => b.apartmentId === apartment.id);
  }, [bookings, apartment.id]);

  // Filtered tracked bookings
  const filteredBookings = useMemo(() => {
    if (!orderQuery.trim()) return communityBookings;
    const cleanQ = orderQuery.trim().toLowerCase();
    const cleanDigits = cleanQ.replace(/[^0-9]/g, '');

    return communityBookings.filter(b => {
      const flatMatch = b.flatNumber.toLowerCase().includes(cleanQ);
      const blockMatch = b.block.toLowerCase().includes(cleanQ);
      const nameMatch = b.residentName.toLowerCase().includes(cleanQ);
      const numMatch = b.bookingNumber.toLowerCase().includes(cleanQ);
      const phoneDigits = b.phone.replace(/[^0-9]/g, '');
      const phoneMatch = cleanDigits.length >= 4 && phoneDigits.includes(cleanDigits);

      return flatMatch || blockMatch || nameMatch || numMatch || phoneMatch;
    });
  }, [communityBookings, orderQuery]);

  const activeOrdersCount = communityBookings.filter(
    b => b.status === 'received' || b.status === 'vendor_assigned' || b.status === 'in_progress'
  ).length;

  // Sync registeredCampaignIds
  useEffect(() => {
    if (!savedProfile?.phone && !savedProfile?.flatNumber) return;
    const cleanPhone = (savedProfile.phone || '').replace(/[^0-9]/g, '').slice(-10);
    const cleanFlat = (savedProfile.flatNumber || '').trim().toLowerCase();

    const matchingCampaignIds = residentRequests
      .filter(r => {
        const rPhone = r.phone.replace(/[^0-9]/g, '').slice(-10);
        const rFlat = r.flatNumber.trim().toLowerCase();
        return (cleanPhone && rPhone === cleanPhone) || (cleanFlat && rFlat === cleanFlat);
      })
      .map(r => r.campaignId);

    if (matchingCampaignIds.length > 0) {
      setRegisteredCampaignIds(prev => {
        const next = new Set(prev);
        let changed = false;
        matchingCampaignIds.forEach(id => {
          if (!next.has(id)) {
            next.add(id);
            changed = true;
          }
        });
        if (changed) {
          try {
            localStorage.setItem(
              `gk_registered_campaigns_${apartment.id}`,
              JSON.stringify(Array.from(next))
            );
          } catch {
            // ignore
          }
          return next;
        }
        return prev;
      });
    }
  }, [residentRequests, apartment.id, savedProfile]);

  const handleOpenInterest = (camp: Campaign) => {
    setSelectedCampaign(camp);
    setPreferredSlot(camp.availableSlots[0] || '09:00 AM – 11:00 AM');
    setInterestSubmitted(null);
    setSubmitError(null);
    setAlreadyRegistered(false);
    setInterestModalOpen(true);
  };

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign || !residentName.trim() || !phone.trim() || !flatNumber.trim()) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitResidentInterest({
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

      if (result.success && result.data) {
        setInterestSubmitted(result.data);
        try {
          localStorage.setItem(
            'gk_resident_profile',
            JSON.stringify({
              name: residentName.trim(),
              phone: phone.trim(),
              block: block.trim() || 'Block A',
              flatNumber: flatNumber.trim(),
            })
          );
        } catch {
          // ignore
        }
        setRegisteredCampaignIds(prev => {
          const next = new Set(prev).add(selectedCampaign.id);
          try {
            localStorage.setItem(
              `gk_registered_campaigns_${apartment.id}`,
              JSON.stringify(Array.from(next))
            );
          } catch {
            // ignore
          }
          return next;
        });
      } else {
        if (result.alreadyRegistered) {
          setAlreadyRegistered(true);
          setRegisteredCampaignIds(prev => {
            const next = new Set(prev).add(selectedCampaign.id);
            try {
              localStorage.setItem(
                `gk_registered_campaigns_${apartment.id}`,
                JSON.stringify(Array.from(next))
              );
            } catch {
              // ignore
            }
            return next;
          });
        }
        setSubmitError(result.error || 'Could not save your request. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'Unexpected error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `GK APARTMENT CARE · ${apartment.name}

Hello neighbors 👋

Check out verified doorstep services, Sunday bulk pricing, and order tracking for our community:

${portalUrl}

[Open ${apartment.name} Resident Portal]`
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#111111] flex flex-col antialiased selection:bg-[#2596be]/20 selection:text-[#111111]">
      {/* 1. Header: Strictly isolated to this Community */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E4E0D8]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" showSubtitle={false} />
            <div className="h-5 w-px bg-[#E4E0D8]" />
            <div>
              <span className="font-display text-xs sm:text-sm font-semibold text-[#111111] block leading-tight truncate max-w-[180px] sm:max-w-xs uppercase">
                {apartment.name}
              </span>
              <span className="text-[11px] text-[#2596be] font-medium block leading-none">
                Resident Portal
              </span>
            </div>
          </div>

          <button
            onClick={handleShareWhatsApp}
            className="px-4 py-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            title="Share with apartment neighbors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share on WhatsApp</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-5 sm:px-8 py-8 space-y-6 sm:space-y-8">
        {/* 2. Community Banner & Gate Verification */}
        <section className="bg-white p-6 sm:p-8 rounded-[24px] border border-[#E4E0D8] space-y-5 shadow-2xs">
          <div className="space-y-2">
            <Badge variant="neutral" size="sm" icon={<Building2 className="w-3.5 h-3.5 text-[#2596be]" />}>
              {apartment.name} · {apartment.area}
            </Badge>
            <h1 className="font-display text-2xl sm:text-4xl font-medium text-[#111111] tracking-tight">
              Community Doorstep Care
            </h1>
            <p className="text-xs sm:text-sm text-[#5C5A56] leading-relaxed max-w-2xl">
              Verified doorstep services and Sunday bulk group savings for residents of {apartment.name}. Pre-cleared with {apartment.gateSecurityApp} gate passes and quiet hours compliance.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] text-center">
              <ShieldCheck className="w-4 h-4 text-[#2596be] mx-auto mb-1.5" />
              <div className="font-medium text-[#111111]">{apartment.gateSecurityApp}</div>
              <div className="text-[11px] text-[#5C5A56]">Pre-cleared entry</div>
            </div>

            <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] text-center">
              <Clock className="w-4 h-4 text-[#2596be] mx-auto mb-1.5" />
              <div className="font-medium text-[#111111]">Quiet Hours</div>
              <div className="text-[11px] text-[#5C5A56]">1:00–2:30 PM protected</div>
            </div>

            <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] text-center">
              <Users className="w-4 h-4 text-[#2596be] mx-auto mb-1.5" />
              <div className="font-medium text-[#111111]">Bulk Pools</div>
              <div className="text-[11px] text-[#5C5A56]">Up to 35% savings</div>
            </div>
          </div>
        </section>

        {/* 3. Primary Segmented Tabs: [ Services & Bulk Pools ] vs [ Track Orders & Bookings ] */}
        <div className="flex items-center gap-2 p-1.5 bg-[#F0EDE7] rounded-full border border-[#E4E0D8] self-start">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-[#111111] text-[#FAF8F5] shadow-2xs font-semibold'
                : 'text-[#5C5A56] hover:text-[#111111]'
            }`}
          >
            Services &amp; Bulk Pools ({communityCampaigns.length})
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'track'
                ? 'bg-[#111111] text-[#FAF8F5] shadow-2xs font-semibold'
                : 'text-[#5C5A56] hover:text-[#111111]'
            }`}
          >
            <span>Track Orders &amp; Bookings</span>
            {activeOrdersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#2596be] text-white text-[10px] font-bold inline-flex items-center justify-center font-mono">
                {activeOrdersCount}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: Services & Bulk Pools */}
        {activeTab === 'services' && (
          <section className="space-y-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-medium text-[#111111]">
                Available Services for {apartment.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5A56] mt-1">
                Register interest to trigger the Sunday bulk batch or book solo doorstep appointments.
              </p>
            </div>

            {communityCampaigns.length === 0 ? (
              <div className="p-8 bg-white rounded-[24px] border border-[#E4E0D8] text-center text-xs sm:text-sm text-[#5C5A56] space-y-2">
                <p className="font-medium text-[#111111]">Services are currently being synchronized for {apartment.name}</p>
                <p>Check back shortly or invite your tower neighbors to launch a bulk batch.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {communityCampaigns.map(camp => {
                  const srv = getServiceForCampaign(camp);
                  const safeMin = camp.minimumDemand > 0 ? camp.minimumDemand : 1;
                  const percent = Math.min(100, Math.round((camp.currentDemand / safeMin) * 100));
                  const needed = Math.max(0, camp.minimumDemand - camp.currentDemand);
                  const isTargetReached = camp.currentDemand >= camp.minimumDemand;

                  return (
                    <div
                      key={camp.id}
                      className="p-6 sm:p-7 bg-white rounded-[24px] border border-[#E4E0D8] space-y-5 hover:border-[#111111]/30 transition-all shadow-2xs flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#F0EDE7] border border-[#E4E0D8] flex items-center justify-center shrink-0 mt-0.5">
                              {getCategoryIcon(srv?.iconName)}
                            </div>
                            <div>
                              <h3 className="font-display text-lg font-medium text-[#111111]">
                                {srv?.name || 'Service'}
                              </h3>
                              <p className="text-xs text-[#5C5A56] mt-0.5 line-clamp-2 leading-relaxed">
                                {srv?.description || camp.notes}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                              camp.status === 'completed'
                                ? 'bg-[#2E8B57]/10 text-[#2E8B57]'
                                : isTargetReached || camp.status === 'target_reached' || camp.status === 'provider_confirmed'
                                ? 'bg-[#2596be]/10 text-[#2596be]'
                                : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                            }`}
                          >
                            {isTargetReached && camp.status === 'collecting_demand'
                              ? 'Target Reached'
                              : camp.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Pricing */}
                        <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[#5C5A56] block">Standard Street Price:</span>
                            <span className="text-xs sm:text-sm font-mono text-[#5C5A56] line-through">
                              ₹{camp.normalPrice.toLocaleString()}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-xs uppercase tracking-wider font-semibold text-[#2596be] block">
                              Community Rate:
                            </span>
                            <span className="font-display font-medium text-xl text-[#111111] font-mono tabular-nums">
                              ₹{camp.communityPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Demand Progress */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-[#111111]">Society Demand Pool:</span>
                            <span className="font-bold text-[#2596be]">
                              {camp.currentDemand} / {camp.minimumDemand} flats
                            </span>
                          </div>

                          <div className="w-full h-2 bg-[#E4E0D8] rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${isTargetReached ? 'bg-[#2E8B57]' : 'bg-[#2596be]'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.6 }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-[#5C5A56]">
                            <span>
                              {isTargetReached
                                ? '✓ Batch confirmed! Guaranteed bulk discount.'
                                : `${needed} more flats needed to trigger visit`}
                            </span>
                            <span>Slots: {camp.availableDates.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="pt-4 border-t border-[#E4E0D8]">
                        {registeredCampaignIds.has(camp.id) ? (
                          <div className="w-full py-3 px-4 bg-[#2E8B57]/10 border border-[#2E8B57]/30 text-[#2E8B57] text-xs font-bold rounded-full flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>REGISTERED FOR BATCH</span>
                          </div>
                        ) : (
                          <Button
                            variant="primary"
                            size="md"
                            fullWidth
                            onClick={() => handleOpenInterest(camp)}
                            icon={<ArrowRight className="w-4 h-4" />}
                          >
                            Join Community Bulk Pool
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: Track Orders & Bookings */}
        {activeTab === 'track' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-medium text-[#111111]">
                  Track Orders &amp; Bookings
                </h2>
                <p className="text-xs sm:text-sm text-[#5C5A56] mt-1">
                  Live status, assigned technicians, and digital gate passes for {apartment.name}.
                </p>
              </div>

              {/* Flat/Phone Quick Filter */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-[#5C5A56] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderQuery}
                  onChange={e => setOrderQuery(e.target.value)}
                  placeholder="Filter by Flat, Name, or Phone..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E4E0D8] rounded-full text-xs focus:outline-none focus:border-[#111111] text-[#111111]"
                />
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="p-10 bg-white rounded-[24px] border border-[#E4E0D8] text-center space-y-4 shadow-2xs">
                <Calendar className="w-12 h-12 text-[#5C5A56]/40 mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-display text-lg font-medium text-[#111111]">
                    No Active Orders Found
                  </h4>
                  <p className="text-xs text-[#5C5A56] max-w-sm mx-auto">
                    {orderQuery
                      ? `No bookings match "${orderQuery}" in ${apartment.name}. Try adjusting your search query.`
                      : `No resident bookings are currently scheduled for ${apartment.name}.`}
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab('services')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Community Services
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map(b => {
                  const isExpanded = expandedBookingId === b.id;
                  const stepIndex =
                    b.status === 'completed'
                      ? 4
                      : b.status === 'in_progress'
                      ? 3
                      : b.status === 'vendor_assigned'
                      ? 2
                      : 1;

                  return (
                    <motion.div
                      key={b.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-[24px] border border-[#E4E0D8] shadow-2xs overflow-hidden"
                    >
                      {/* Summary Card Header */}
                      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#2596be]">
                              {b.bookingNumber}
                            </span>
                            <span className="text-[#E4E0D8]">·</span>
                            <span className="text-xs text-[#5C5A56]">
                              {b.bookingType === 'sunday_bulk' ? 'Community Bulk Pool' : 'Doorstep Booking'}
                            </span>
                          </div>

                          <h3 className="font-display text-lg font-medium text-[#111111]">
                            {b.serviceName}
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5C5A56]">
                            <span className="flex items-center gap-1 font-medium text-[#111111]">
                              <Building2 className="w-3.5 h-3.5 text-[#2596be]" />
                              {b.residentName} ({b.block}, Flat {b.flatNumber})
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {b.date} · {b.slot}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E4E0D8]">
                          <div className="text-right">
                            <div className="font-display font-medium text-lg text-[#111111] font-mono tabular-nums">
                              ₹{b.price}
                            </div>
                            <span
                              className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full inline-block ${
                                b.status === 'completed'
                                  ? 'bg-[#2E8B57]/10 text-[#2E8B57]'
                                  : b.status === 'in_progress'
                                  ? 'bg-[#2596be]/10 text-[#2596be]'
                                  : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                              }`}
                            >
                              {b.status.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <button
                            onClick={() => setExpandedBookingId(isExpanded ? null : b.id)}
                            className="p-2 rounded-full hover:bg-[#FAF8F5] border border-[#E4E0D8] text-[#5C5A56] hover:text-[#111111] transition-colors cursor-pointer"
                            aria-label="Toggle tracking status"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Tracking Timeline */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-[#E4E0D8] bg-[#FAF8F5] p-5 sm:p-6 space-y-5"
                          >
                            {/* Live Timeline Steps */}
                            <div className="space-y-3">
                              <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                                Order Progress Timeline
                              </span>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                                {[
                                  { title: '1. Received', desc: 'Slot confirmed' },
                                  { title: '2. Assigned', desc: 'Gate pass issued' },
                                  { title: '3. In Progress', desc: 'On-site execution' },
                                  { title: '4. Completed', desc: 'Pay post service' },
                                ].map((s, idx) => {
                                  const done = stepIndex > idx;
                                  const current = stepIndex === idx + 1;
                                  return (
                                    <div
                                      key={idx}
                                      className={`p-3 rounded-2xl border text-xs space-y-1 ${
                                        done
                                          ? 'bg-[#2E8B57]/10 border-[#2E8B57]/30 text-[#2E8B57]'
                                          : current
                                          ? 'bg-[#2596be]/10 border-[#2596be]/30 text-[#2596be] font-bold'
                                          : 'bg-white border-[#E4E0D8] text-[#5C5A56]'
                                      }`}
                                    >
                                      <div className="font-semibold flex items-center justify-between">
                                        <span>{s.title}</span>
                                        {done && <Check className="w-3.5 h-3.5" />}
                                      </div>
                                      <div className="text-[11px] opacity-80">{s.desc}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Assigned Technician & Gate Pass */}
                            <div className="p-4 bg-white rounded-2xl border border-[#E4E0D8] space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-[#5C5A56]">Assigned Technician:</span>
                                <span className="font-medium text-[#111111]">
                                  {b.providerName || 'GK Care Specialist'}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-[#5C5A56]">Gate Pass Clearance:</span>
                                <span className="font-semibold text-[#2E8B57] flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  <span>Pre-Cleared with {apartment.gateSecurityApp}</span>
                                </span>
                              </div>

                              {b.notes && (
                                <div className="pt-2 border-t border-[#E4E0D8] text-[#5C5A56]">
                                  <span className="font-medium text-[#111111]">Resident Notes: </span>
                                  {b.notes.replace(/\[.*?\]/g, '').trim() || 'None'}
                                </div>
                              )}
                            </div>

                            {/* WhatsApp Direct Help */}
                            <div className="flex justify-end">
                              <a
                                href={`https://wa.me/919494335848?text=${encodeURIComponent(
                                  `Hi GK Apartment Care! Checking on my order ${b.bookingNumber} (${b.serviceName}) for ${apartment.name}, Flat ${b.flatNumber}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-semibold text-[#2E8B57] hover:underline"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>Need help? Message Operations on WhatsApp →</span>
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* 5. Footer trust block */}
        <section className="p-6 bg-white rounded-[24px] border border-[#E4E0D8] shadow-2xs text-xs text-[#5C5A56] space-y-1.5">
          <div className="flex items-center gap-2 font-medium text-[#111111]">
            <ShieldCheck className="w-4 h-4 text-[#2596be]" />
            <span>Pre-cleared with {apartment.gateSecurityApp} · Verified background-checked staff</span>
          </div>
          <p>
            Questions? Contact your community operations desk at +91 94943 35848 or care@gkapartmentcare.com.
          </p>
        </section>
      </main>

      {/* Modal / Sheet for "I'M INTERESTED" Form */}
      <AnimatePresence>
        {interestModalOpen && selectedCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] border border-[#E4E0D8] shadow-2xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-[#E4E0D8] flex items-center justify-between bg-[#FAF8F5]">
                <div>
                  <Badge variant="neutral" size="sm">
                    {apartment.name}
                  </Badge>
                  <h3 className="font-display text-lg font-medium text-[#111111] mt-1">
                    Register Interest · {getServiceForCampaign(selectedCampaign)?.name || 'Service'}
                  </h3>
                </div>
                <button
                  onClick={() => setInterestModalOpen(false)}
                  className="w-8 h-8 rounded-full border border-[#E4E0D8] bg-white flex items-center justify-center text-[#5C5A56] hover:text-[#111111] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {interestSubmitted ? (
                <div className="p-8 space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] mx-auto flex items-center justify-center">
                    <Check className="w-7 h-7" />
                  </div>
                  <h4 className="font-display text-xl font-medium text-[#111111]">
                    You&apos;re on the list!
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5C5A56] leading-relaxed">
                    Your interest has been recorded for{' '}
                    <strong className="text-[#111111]">
                      {selectedCampaign.currentDemand} / {selectedCampaign.minimumDemand} flats
                    </strong>
                    . We&apos;ll notify you via WhatsApp as soon as the batch is confirmed.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => setInterestModalOpen(false)}
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleInterestSubmit} className="p-6 overflow-y-auto space-y-4 max-h-[75vh]">
                  {alreadyRegistered && (
                    <div className="p-3 bg-[#2596be]/10 border border-[#2596be]/20 rounded-2xl text-xs text-[#2596be] flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>You have already expressed interest in this service.</span>
                    </div>
                  )}

                  {submitError && (
                    <div className="p-3 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-2xl text-xs text-[#DC2626] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Full Name <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={residentName}
                      onChange={e => setResidentName(e.target.value)}
                      placeholder="e.g. Rahul Kumar"
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      WhatsApp / Phone Number <span className="text-[#DC2626]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#5C5A56] absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98490 12345"
                        className="w-full pl-11 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                        Tower / Block
                      </label>
                      <input
                        type="text"
                        value={block}
                        onChange={e => setBlock(e.target.value)}
                        placeholder="e.g. Tower B"
                        className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                        Flat Number <span className="text-[#DC2626]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={flatNumber}
                        onChange={e => setFlatNumber(e.target.value)}
                        placeholder="e.g. 204"
                        className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Preferred Slot
                    </label>
                    <select
                      value={preferredSlot}
                      onChange={e => setPreferredSlot(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    >
                      {(selectedCampaign.availableSlots.length > 0
                        ? selectedCampaign.availableSlots
                        : ['09:00 AM – 11:00 AM']
                      ).map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Notes / Unit details (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="e.g. Car model, parking bay number, or floor..."
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting…' : 'Submit My Bulk Pool Request'}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="p-6 text-center text-xs text-[#5C5A56] border-t border-[#E4E0D8] bg-[#FAF8F5]">
        &copy; {new Date().getFullYear()} GK APARTMENT CARE · Coordinated Community Services
      </footer>
    </div>
  );
};
