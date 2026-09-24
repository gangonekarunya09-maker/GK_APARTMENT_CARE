import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const DemandManager: React.FC = () => {
  const { services, bookings, apartments, setAdminSection, updateService } = useApp();
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');

  const activeService = services.find(s => s.id === selectedServiceId) || services[0];

  // Bookings associated with active service
  const serviceBookings = bookings.filter(b => b.serviceId === activeService?.id);

  const percent = activeService
    ? Math.min(100, Math.round((activeService.currentDemand / activeService.minimumDemand) * 100))
    : 0;

  const needed = activeService
    ? Math.max(0, activeService.minimumDemand - activeService.currentDemand)
    : 0;

  const handleUnlockTarget = () => {
    if (!activeService) return;
    updateService(activeService.id, {
      currentDemand: activeService.minimumDemand,
      status: 'target_reached',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#142326]">Demand Aggregation Center</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Monitor real-time resident interest pools to unlock Sunday bulk wholesale rates
          </p>
        </div>
      </div>

      {/* Select Service Dropdown / Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {services.map(srv => {
          const isSelected = srv.id === activeService?.id;
          const pct = Math.min(100, Math.round((srv.currentDemand / srv.minimumDemand) * 100));
          const isReady = srv.currentDemand >= srv.minimumDemand;

          return (
            <button
              key={srv.id}
              onClick={() => setSelectedServiceId(srv.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#2596be] bg-[#2596be]/5 shadow-xs'
                  : 'border-[#E5E7EB] bg-white hover:border-[#2596be]/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#142326] truncate">{srv.name}</span>
                <span className="text-[10px] font-mono font-bold text-[#2596be] tabular-nums">
                  {srv.currentDemand}/{srv.minimumDemand}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full ${isReady ? 'bg-[#2E8B57]' : 'bg-[#2596be]'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-[10px] text-[#667085] flex justify-between">
                <span>{pct}% pledged</span>
                {isReady ? (
                  <span className="text-[#2E8B57] font-bold">Target Reached</span>
                ) : (
                  <span>{srv.minimumDemand - srv.currentDemand} more</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Demand Card for Selected Service */}
      {activeService && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
            <div>
              <div className="text-xs font-semibold text-[#667085] uppercase tracking-wider">
                Active Pool Analysis
              </div>
              <h3 className="text-xl font-extrabold text-[#142326] mt-0.5">
                {activeService.name}
              </h3>
              <p className="text-xs text-[#667085] mt-0.5">{activeService.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleUnlockTarget}
                className="px-3.5 py-2 bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Mark Target Unlocked
              </button>
              <button
                onClick={() => setAdminSection('whatsapp')}
                className="px-3.5 py-2 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Blast WhatsApp Alert</span>
              </button>
            </div>
          </div>

          {/* Big Progress Meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#142326] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#2596be]" />
                <span>Demand Progress Toward Sunday Wholesale Visit</span>
              </span>
              <span className="text-sm font-extrabold text-[#2596be] font-mono tabular-nums">
                {activeService.currentDemand} / {activeService.minimumDemand} Flats ({percent}%)
              </span>
            </div>

            <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full ${
                  needed === 0 ? 'bg-[#2E8B57]' : 'bg-[#2596be]'
                }`}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#667085]">
              <span>Regular Price: ₹{activeService.communityPrice}</span>
              <span className="font-semibold text-[#2596be]">
                Sunday Target Price: ₹{activeService.sundayBulkPrice} (Save ₹{activeService.normalPrice - activeService.sundayBulkPrice})
              </span>
            </div>
          </div>

          {/* Resident Pledges Card List (strictly NO horizontal rows) */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Resident Bookings in this Pool ({serviceBookings.length})
            </h4>

            {serviceBookings.length === 0 ? (
              <div className="p-6 text-center bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] text-xs text-[#667085]">
                No flat bookings registered for this service yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviceBookings.map(b => (
                  <div
                    key={b.id}
                    className="p-3.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#142326]">{b.residentName}</span>
                      <span className="text-xs font-mono font-bold text-[#2596be]">{b.bookingNumber}</span>
                    </div>
                    <div className="text-xs text-[#667085]">
                      {b.apartmentName} · {b.block}, Flat {b.flatNumber}
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#E5E7EB]">
                      <span className="text-[#667085]">{b.date} · {b.slot}</span>
                      <span className="font-bold text-[#2E8B57]">₹{b.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
