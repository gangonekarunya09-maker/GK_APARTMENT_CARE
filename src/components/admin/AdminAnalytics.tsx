import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Building2,
  Sparkles,
  Users,
  CalendarCheck,
  ShieldCheck,
  ArrowUpRight,
  ExternalLink,
  Percent,
  IndianRupee
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminAnalytics: React.FC = () => {
  const { apartments, bookings, services, campaigns, residentRequests, navigate } = useApp();

  const totalFlats = apartments.reduce((acc, a) => acc + a.totalUnits, 0);
  const totalRevenue = bookings.reduce((acc, b) => acc + (b.price || 0), 0);
  const totalSavings = bookings.reduce((acc, b) => {
    const srv = services.find(s => s.id === b.serviceId);
    if (srv && srv.normalPrice > b.price) {
      return acc + (srv.normalPrice - b.price);
    }
    return acc + 150;
  }, 0);

  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const inProgressBookings = bookings.filter(b => b.status === 'in_progress' || b.status === 'vendor_assigned').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#142326] tracking-tight">Operations &amp; Community Analytics</h2>
        <p className="text-xs text-[#667085] mt-1">
          Hyper-local performance, society demand aggregation, and resident savings delivered
        </p>
      </div>

      {/* Top 4 KPI Cards - No horizontal rows, vertical/grid stack */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#667085]">
            <span>Communities Under Care</span>
            <Building2 className="w-4 h-4 text-[#2596be]" />
          </div>
          <div className="text-2xl font-black text-[#142326]">{apartments.length}</div>
          <div className="text-[11px] text-[#2E8B57] font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{totalFlats.toLocaleString()} Total Gated Units</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#667085]">
            <span>Total Bookings Delivered</span>
            <CalendarCheck className="w-4 h-4 text-[#2596be]" />
          </div>
          <div className="text-2xl font-black text-[#142326]">{bookings.length}</div>
          <div className="text-[11px] text-[#2596be] font-semibold">
            {completedBookings} Completed • {inProgressBookings} Active
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#667085]">
            <span>Total GMV Processed</span>
            <IndianRupee className="w-4 h-4 text-[#2596be]" />
          </div>
          <div className="text-2xl font-black text-[#142326]">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-[#2E8B57] font-semibold">
            Avg Order: ₹{bookings.length ? Math.round(totalRevenue / bookings.length) : 0}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#667085]">
            <span>Resident Savings Delivered</span>
            <Sparkles className="w-4 h-4 text-[#2596be]" />
          </div>
          <div className="text-2xl font-black text-[#2E8B57]">₹{totalSavings.toLocaleString()}</div>
          <div className="text-[11px] text-[#667085]">
            Through Sunday bulk demand pools
          </div>
        </div>
      </div>

      {/* Community-by-Community Breakdown */}
      <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#142326]">Community Penetration &amp; Activity</h3>
            <p className="text-xs text-[#667085]">Breakdown of gated communities and customer portal metrics</p>
          </div>
        </div>

        <div className="space-y-3">
          {apartments.map(apt => {
            const aptBookings = bookings.filter(b => b.apartmentId === apt.id);
            const aptRequests = residentRequests.filter(r => r.apartmentId === apt.id);
            const aptCampaigns = campaigns.filter(c => c.apartmentId === apt.id);

            return (
              <div
                key={apt.id}
                className="p-4 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#142326] text-sm">{apt.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#E5E7EB] text-[#2596be] font-bold">
                        {apt.id}
                      </span>
                    </div>
                    <p className="text-xs text-[#667085] mt-0.5">
                      {apt.area}, {apt.city} • {apt.totalUnits} Units • Gate: {apt.gateSecurityApp}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/c/${apt.slug}/${apt.portalToken || '7H4K92'}`)}
                    className="px-3 py-1.5 bg-white hover:bg-[#E5E7EB] text-[#2596be] border border-[#E5E7EB] text-xs font-bold rounded-lg flex items-center gap-1.5 self-start cursor-pointer transition-colors"
                  >
                    <span>View Customer Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-[#E5E7EB]">
                    <span className="text-[#667085] block text-[11px]">Bookings Made</span>
                    <span className="font-bold text-[#142326] text-sm">{aptBookings.length} orders</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#E5E7EB]">
                    <span className="text-[#667085] block text-[11px]">Campaigns / Deals</span>
                    <span className="font-bold text-[#142326] text-sm">{aptCampaigns.length} live</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#E5E7EB]">
                    <span className="text-[#667085] block text-[11px]">Resident Requests</span>
                    <span className="font-bold text-[#2E8B57] text-sm">{aptRequests.length} inquiries</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Services by Demand */}
      <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#142326]">High-Demand Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map(srv => {
            const count = bookings.filter(b => b.serviceId === srv.id).length;
            return (
              <div
                key={srv.id}
                className="p-3.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-[#142326]">{srv.name}</h4>
                  <div className="text-[11px] text-[#667085] mt-0.5">
                    Community: ₹{srv.communityPrice} • Sunday Bulk: ₹{srv.sundayBulkPrice}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-[#2596be] text-sm">{count} bookings</div>
                  <span className="text-[10px] text-[#2E8B57] font-semibold">Active Pool</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
