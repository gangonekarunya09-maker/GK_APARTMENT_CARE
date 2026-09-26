import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getPublicBaseUrl } from '../../lib/router';
import { Campaign, CampaignStatus, ServiceProvider } from '../../types';
import {
  ArrowLeft,
  Building2,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Share2,
  Copy,
  Check,
  UserCheck,
  Calendar,
  AlertCircle,
  ExternalLink,
  Wrench,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CampaignDetailProps {
  campaignId: string;
  onBack: () => void;
}

export const CampaignDetail: React.FC<CampaignDetailProps> = ({ campaignId, onBack }) => {
  const {
    campaigns,
    apartments,
    services,
    providers,
    residentRequests,
    updateCampaignStatus,
    assignProviderToCampaign,
  } = useApp();

  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const campaign = campaigns.find(c => c.id === campaignId);
  const apartment = apartments.find(a => a.id === campaign?.apartmentId);
  const service = services.find(s => s.id === campaign?.serviceId);
  const provider = providers.find(p => p.id === campaign?.providerId);

  // Filter requests belonging exclusively to this campaign
  const requests = residentRequests.filter(r => r.campaignId === campaignId);

  if (!campaign || !apartment || !service) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#E5E7EB]">
        <p className="text-sm font-bold text-[#142326]">Campaign Not Found</p>
        <button onClick={onBack} className="mt-3 text-xs text-[#2596be] underline">
          Back to Campaigns
        </button>
      </div>
    );
  }

  const percent = Math.min(100, Math.round((campaign.currentDemand / campaign.minimumDemand) * 100));
  const needed = Math.max(0, campaign.minimumDemand - campaign.currentDemand);
  const isTargetReached = needed === 0;

  // Build public URL
  const publicUrl = `${getPublicBaseUrl()}/community/${apartment.slug}/${service.id}/${campaign.token}`;

  const shareText = `🚗 GK APARTMENT CARE — ${apartment.name}

Community ${service.name} available for ${apartment.name} residents!

• Community Price: ₹${campaign.communityPrice}
• Normal Price: ₹${campaign.normalPrice}
${campaign.sundayBulkPrice ? `• Sunday Bulk Price: ₹${campaign.sundayBulkPrice}\n` : ''}
${campaign.currentDemand} residents are already interested.

If you'd like this service for your flat, register here:
${publicUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  // Filter eligible providers by service category
  const eligibleProviders = providers.filter(
    p => p.categoryIds.includes(service.categoryId) || p.categoryIds.length === 0
  );

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] rounded-xl text-[#142326] transition-colors cursor-pointer"
            aria-label="Back to Campaigns list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#2596be]">TOKEN: {campaign.token}</span>
              <span>·</span>
              <span className="text-xs text-[#667085]">{apartment.name}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#142326]">
              {service.name} Campaign
            </h2>
          </div>
        </div>

        {/* Campaign Lifecycle Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-3 py-1 rounded-lg font-extrabold uppercase tracking-wider ${
              campaign.status === 'completed'
                ? 'bg-[#2E8B57]/10 text-[#2E8B57]'
                : campaign.status === 'target_reached' || campaign.status === 'provider_confirmed'
                ? 'bg-[#2596be]/10 text-[#2596be]'
                : 'bg-[#F59E0B]/10 text-[#F59E0B]'
            }`}
          >
            {campaign.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Grid: Overview & Public Link & Demand */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Demand Target */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">
              Demand Counter
            </span>
            <Users className="w-4 h-4 text-[#2596be]" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#142326] font-mono tabular-nums">
              {campaign.currentDemand}
            </span>
            <span className="text-sm font-semibold text-[#667085]">
              / {campaign.minimumDemand} needed
            </span>
          </div>

          <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isTargetReached ? 'bg-[#2E8B57]' : 'bg-[#2596be]'}`}
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="text-[11px] text-[#667085]">
            {isTargetReached ? (
              <span className="text-[#2E8B57] font-bold">
                ✓ Community target reached! Ready to confirm vendor.
              </span>
            ) : (
              <span>{needed} more flats needed to trigger visit</span>
            )}
          </div>
        </div>

        {/* Card 2: Pricing Setup */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
          <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block">
            Pricing Configuration
          </span>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#667085]">Normal Price:</span>
              <span className="line-through font-mono">₹{campaign.normalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#142326]">Community Price:</span>
              <span className="font-bold text-[#142326] font-mono">₹{campaign.communityPrice}</span>
            </div>
            {campaign.sundayBulkPrice && (
              <div className="flex justify-between text-[#2596be] font-bold pt-1 border-t border-[#E5E7EB]">
                <span>Sunday Bulk Price:</span>
                <span className="font-mono">₹{campaign.sundayBulkPrice}</span>
              </div>
            )}
            <div className="text-[11px] text-[#2E8B57] font-semibold pt-1">
              Residents save ₹{campaign.normalPrice - campaign.communityPrice} per unit
            </div>
          </div>
        </div>

        {/* Card 3: Public Link Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
          <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block">
            Public WhatsApp Link
          </span>
          <p className="text-[11px] text-[#667085] truncate font-mono bg-[#F8F9FA] p-2 rounded-lg border border-[#E5E7EB]">
            {publicUrl}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="py-2 px-3 bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] text-[#142326] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#2E8B57]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="py-2 px-3 bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Provider Assignment & Contact Section (Section 10, 11, 12) */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#142326]">
              Service Provider Assignment
            </h3>
            <p className="text-xs text-[#667085]">
              Select and coordinate with the specialized verified partner for {apartment.name}
            </p>
          </div>

          <button
            onClick={() => setProviderModalOpen(true)}
            className="px-3.5 py-2 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>{provider ? 'Change Provider' : 'Select Service Provider'}</span>
          </button>
        </div>

        {provider ? (
          <div className="p-4 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#142326]">{provider.businessName}</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#2E8B57]/10 text-[#2E8B57] font-bold rounded">
                  Verified Partner
                </span>
              </div>
              <div className="text-xs text-[#667085]">
                Contact: <strong className="text-[#142326]">{provider.contactPerson}</strong> · {provider.completedJobs} jobs completed · {provider.rating} ★
              </div>
              <div className="text-xs text-[#667085]">
                Operating Hub: {provider.address}
              </div>
            </div>

            {/* Actionable Phone & WhatsApp Buttons (Sections 11 & 18) */}
            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              <a
                href={`tel:${provider.phone}`}
                className="px-3.5 py-2 bg-white border border-[#E5E7EB] hover:border-[#2596be] text-[#142326] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#2596be]" />
                <span>Call Provider</span>
              </a>

              <a
                href={`https://wa.me/${provider.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hi ${provider.contactPerson}! Connecting from GK Apartment Care regarding ${service.name} batch for ${apartment.name}. We have ${campaign.currentDemand} confirmed resident requests.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Provider</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#F8F9FA] rounded-xl border border-dashed border-[#E5E7EB] text-center text-xs text-[#667085]">
            No provider assigned yet. Once demand reaches target ({campaign.minimumDemand} flats), select a provider to dispatch.
          </div>
        )}

        {/* Campaign Lifecycle Status Advancer */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#667085] mr-1">Update Status:</span>

          <button
            onClick={() => updateCampaignStatus(campaign.id, 'target_reached')}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold border cursor-pointer ${
              campaign.status === 'target_reached'
                ? 'bg-[#2596be] text-white border-[#2596be]'
                : 'bg-white border-[#E5E7EB] text-[#142326] hover:bg-[#F8F9FA]'
            }`}
          >
            Target Reached
          </button>

          <button
            onClick={() => updateCampaignStatus(campaign.id, 'provider_confirmed')}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold border cursor-pointer ${
              campaign.status === 'provider_confirmed'
                ? 'bg-[#2596be] text-white border-[#2596be]'
                : 'bg-white border-[#E5E7EB] text-[#142326] hover:bg-[#F8F9FA]'
            }`}
          >
            Mark Provider Confirmed
          </button>

          <button
            onClick={() => updateCampaignStatus(campaign.id, 'scheduled')}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold border cursor-pointer ${
              campaign.status === 'scheduled'
                ? 'bg-[#2596be] text-white border-[#2596be]'
                : 'bg-white border-[#E5E7EB] text-[#142326] hover:bg-[#F8F9FA]'
            }`}
          >
            Mark Scheduled
          </button>

          <button
            onClick={() => updateCampaignStatus(campaign.id, 'in_progress')}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold border cursor-pointer ${
              campaign.status === 'in_progress'
                ? 'bg-[#F59E0B] text-white border-[#F59E0B]'
                : 'bg-white border-[#E5E7EB] text-[#142326] hover:bg-[#F8F9FA]'
            }`}
          >
            In Progress
          </button>

          <button
            onClick={() => updateCampaignStatus(campaign.id, 'completed')}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold border cursor-pointer ${
              campaign.status === 'completed'
                ? 'bg-[#2E8B57] text-white border-[#2E8B57]'
                : 'bg-white border-[#E5E7EB] text-[#142326] hover:bg-[#F8F9FA]'
            }`}
          >
            Mark Completed
          </button>
        </div>
      </div>

      {/* Resident Requests (Private to Admin) (Sections 7, 9, 26) */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#142326]">
              Resident Demand Requests ({requests.length})
            </h3>
            <p className="text-xs text-[#667085]">
              Private operator view. Residents only see aggregate counts.
            </p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="p-8 text-center bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] text-xs text-[#667085]">
            No resident requests recorded yet. Share the campaign link on the {apartment.name} WhatsApp group.
          </div>
        ) : (
          <div className="space-y-2.5">
            {requests.map(req => (
              <div
                key={req.id}
                className="p-3.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-[#142326]">{req.residentName}</strong>
                    <span className="font-semibold text-[#2596be]">
                      {req.block}, Flat {req.flatNumber}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 text-[#667085]">
                    <a href={`tel:${req.phone}`} className="text-[#2596be] hover:underline font-mono">
                      {req.phone}
                    </a>
                    <span>·</span>
                    <span>Prefers: {req.preferredDate || 'Sunday'} · {req.preferredSlot || 'Morning'}</span>
                  </div>
                  {req.notes && (
                    <div className="text-[11px] text-[#667085] italic">Note: {req.notes}</div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-[#667085]">
                    {new Date(req.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <a
                    href={`https://wa.me/${req.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hi ${req.residentName}! Connecting from GK Apartment Care regarding your ${service.name} request for Flat ${req.flatNumber} at ${apartment.name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-[#2E8B57]/10 text-[#2E8B57] hover:bg-[#2E8B57]/20 rounded-lg"
                    title="WhatsApp resident"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Provider Selection Modal (Section 10) */}
      <AnimatePresence>
        {providerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#142326]">
                    Select Service Provider
                  </h3>
                  <p className="text-xs text-[#667085]">
                    Verified providers eligible for {service.name}
                  </p>
                </div>
                <button
                  onClick={() => setProviderModalOpen(false)}
                  className="p-1.5 text-[#667085] hover:bg-[#F8F9FA] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-3 max-h-[60vh]">
                {eligibleProviders.map(p => (
                  <div
                    key={p.id}
                    className="p-3.5 bg-white border border-[#E5E7EB] hover:border-[#2596be] rounded-xl flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-[#142326]">{p.businessName}</div>
                      <div className="text-xs text-[#667085]">
                        Lead: {p.contactPerson} · Phone: {p.phone}
                      </div>
                      <div className="text-[11px] text-[#2E8B57] font-semibold">
                        ★ {p.rating} · {p.completedJobs} completed jobs · Verified
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        assignProviderToCampaign(campaign.id, p.id);
                        setProviderModalOpen(false);
                      }}
                      className="px-3 py-1.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
