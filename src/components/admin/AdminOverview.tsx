import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Sparkles,
  Users,
  CalendarCheck,
  Megaphone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminOverview: React.FC = () => {
  const {
    apartments,
    services,
    providers,
    campaigns,
    residentRequests,
    setAdminSection,
    setActiveCampaignId,
    setAdminSelectedCommunityId,
  } = useApp();

  const totalFlats = apartments.reduce((acc, curr) => acc + curr.totalUnits, 0);

  // Pending Actions computation
  const targetReachedCampaigns = campaigns.filter(
    c => c.status === 'target_reached' || (c.currentDemand >= c.minimumDemand && !c.providerId)
  );
  const unassignedCampaigns = campaigns.filter(c => !c.providerId);
  const newRequestsCount = residentRequests.filter(r => r.status === 'interested').length;

  const handleDrilldownCommunity = (aptId: string) => {
    setAdminSelectedCommunityId(aptId);
    setAdminSection('apartments');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#142326]">Operations Dashboard</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Real-time hyper-local community demand aggregation across Hyderabad
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAdminSection('campaigns');
              setActiveCampaignId(null);
            }}
            className="px-3.5 py-2 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Manage Campaigns</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid - strictly NO horizontal rows */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#667085] mb-2">
            <span>Active Campaigns</span>
            <Megaphone className="w-4 h-4 text-[#2596be]" />
          </div>
          <div className="text-2xl font-extrabold text-[#142326] font-mono tabular-nums">
            {campaigns.length}
          </div>
          <div className="text-[11px] text-[#667085] mt-1">
            Running across societies
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#667085] mb-2">
            <span>Total Demand Pledges</span>
            <CalendarCheck className="w-4 h-4 text-[#2596be]" />
          </div>
          <div className="text-2xl font-extrabold text-[#2596be] font-mono tabular-nums">
            {residentRequests.length}
          </div>
          <div className="text-[11px] text-[#2E8B57] font-semibold mt-1">
            Resident requests logged
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#667085] mb-2">
            <span>Service Providers</span>
            <Users className="w-4 h-4 text-[#2596be]" />
          </div>
          <div className="text-2xl font-extrabold text-[#142326] font-mono tabular-nums">
            {providers.length}
          </div>
          <div className="text-[11px] text-[#2E8B57] font-semibold mt-1">
            100% background cleared
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#667085] mb-2">
            <span>Apartments / Societies</span>
            <Building2 className="w-4 h-4 text-[#2596be]" />
          </div>
          <div className="text-2xl font-extrabold text-[#142326] font-mono tabular-nums">
            {apartments.length}
          </div>
          <div className="text-[11px] text-[#667085] mt-1">
            {totalFlats.toLocaleString('en-IN')} total gated units
          </div>
        </div>
      </div>

      {/* Pending Admin Actions Alert Box (Section 20) */}
      <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#142326] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#2596be]" />
          <span>Pending Operator Actions</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
            <span className="text-[#667085] block">Target Reached:</span>
            <strong className="text-sm font-bold text-[#2E8B57]">
              {targetReachedCampaigns.length} campaigns
            </strong>
            <span className="text-[11px] text-[#667085] block mt-0.5">
              Ready to select &amp; contact vendor
            </span>
          </div>

          <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
            <span className="text-[#667085] block">Provider Assignment:</span>
            <strong className="text-sm font-bold text-[#F59E0B]">
              {unassignedCampaigns.length} campaigns
            </strong>
            <span className="text-[11px] text-[#667085] block mt-0.5">
              Awaiting partner matching
            </span>
          </div>

          <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
            <span className="text-[#667085] block">New Inbound Requests:</span>
            <strong className="text-sm font-bold text-[#2596be]">
              {newRequestsCount} resident votes
            </strong>
            <span className="text-[11px] text-[#667085] block mt-0.5">
              Logged in current cycle
            </span>
          </div>
        </div>
      </div>

      {/* Community Demand Breakdown (Section 18 Global Dashboard) */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#142326] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2596be]" />
              <span>Community Demand Breakdown</span>
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Click any community to manage its customer portal, services, and live resident requests
            </p>
          </div>
          <button
            onClick={() => {
              setAdminSelectedCommunityId(null);
              setAdminSection('apartments');
            }}
            className="text-xs font-semibold text-[#2596be] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Communities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {apartments.map(apt => {
            const reqCount = residentRequests.filter(r => r.apartmentId === apt.id).length;
            const aptCampaigns = campaigns.filter(c => c.apartmentId === apt.id);
            const activeCampaignsCount = aptCampaigns.length;

            return (
              <div
                key={apt.id}
                onClick={() => handleDrilldownCommunity(apt.id)}
                className="p-3.5 bg-[#F8F9FA] hover:bg-[#F0F7FA] border border-[#E5E7EB] hover:border-[#2596be]/40 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-sm text-[#142326] group-hover:text-[#2596be] transition-colors truncate">
                    {apt.name}
                  </div>
                  <div className="text-xs text-[#667085] flex items-center gap-2">
                    <span className="font-semibold text-[#2596be]">{reqCount} requests</span>
                    <span>·</span>
                    <span>{activeCampaignsCount} campaigns</span>
                  </div>
                </div>

                <div className="p-2 bg-white rounded-lg border border-[#E5E7EB] group-hover:bg-[#2596be] group-hover:text-white group-hover:border-[#2596be] text-[#667085] transition-all shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Campaigns List (Section 20) */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#142326] flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#2596be]" />
            <span>Active Community Campaigns</span>
          </h3>
          <button
            onClick={() => {
              setAdminSection('campaigns');
              setActiveCampaignId(null);
            }}
            className="text-xs font-semibold text-[#2596be] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Campaigns</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {campaigns.slice(0, 4).map(camp => {
            const apt = apartments.find(a => a.id === camp.apartmentId);
            const srv = services.find(s => s.id === camp.serviceId);
            const percent = Math.min(100, Math.round((camp.currentDemand / camp.minimumDemand) * 100));

            return (
              <div
                key={camp.id}
                className="p-4 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#142326]">{srv?.name}</span>
                    <span>·</span>
                    <span className="text-xs font-semibold text-[#2596be]">{apt?.name}</span>
                  </div>
                  <div className="text-xs text-[#667085] flex items-center gap-2">
                    <span>Demand: <strong className="text-[#142326] font-mono">{camp.currentDemand} / {camp.minimumDemand}</strong> flats</span>
                    <span>·</span>
                    <span>Community Price: <strong className="text-[#142326] font-mono">₹{camp.communityPrice}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#E5E7EB]">
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                      camp.status === 'completed'
                        ? 'bg-[#2E8B57]/10 text-[#2E8B57]'
                        : camp.status === 'target_reached' || camp.status === 'provider_confirmed'
                        ? 'bg-[#2596be]/10 text-[#2596be]'
                        : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                    }`}
                  >
                    {camp.status.replace('_', ' ')}
                  </span>

                  <button
                    onClick={() => {
                      setAdminSection('campaigns');
                      setActiveCampaignId(camp.id);
                    }}
                    className="px-3 py-1.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Operations →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
