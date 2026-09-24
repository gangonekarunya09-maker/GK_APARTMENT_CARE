import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusTracker } from './StatusTracker';
import {
  Calendar,
  Clock,
  Building2,
  MapPin,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  PlusCircle,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MyBookingsView: React.FC = () => {
  const { bookings, setResidentTab, trackingBooking, setTrackingBooking, selectedApartment } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(trackingBooking?.id || null);

  // Strictly isolate bookings to the user's community
  const communityBookings = bookings.filter(
    b => !selectedApartment || b.apartmentId === selectedApartment.id
  );

  const filteredBookings = communityBookings.filter(b => {
    if (filter === 'active') return b.status !== 'completed' && b.status !== 'cancelled';
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-[11px] font-bold text-[#2596be] uppercase tracking-wider mb-0.5">
            {selectedApartment?.name || 'Your Community'}
          </div>
          <h2 className="text-2xl font-extrabold text-[#142326]">My Apartment Bookings</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Track service status, assigned technicians, and gate clearance for {selectedApartment?.name}
          </p>
        </div>

        {/* Filter controls (functional segmented buttons) */}
        <div className="flex items-center gap-1 p-1 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-[#142326] shadow-xs'
                : 'text-[#667085] hover:text-[#142326]'
            }`}
          >
            All ({communityBookings.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'active'
                ? 'bg-white text-[#2596be] shadow-xs'
                : 'text-[#667085] hover:text-[#142326]'
            }`}
          >
            Active (
            {communityBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length}
            )
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-white text-[#2E8B57] shadow-xs'
                : 'text-[#667085] hover:text-[#142326]'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Bookings List - clean vertical cards, no horizontal row tables */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB]">
            <Calendar className="w-10 h-10 text-[#667085]/40 mx-auto mb-2" />
            <h4 className="text-base font-bold text-[#142326]">No Bookings Found</h4>
            <p className="text-xs text-[#667085] max-w-sm mx-auto mt-1 mb-4">
              You haven&apos;t booked any home or automobile services for your flat yet.
            </p>
            <button
              onClick={() => setResidentTab('services')}
              className="px-5 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Explore Services &amp; Bulk Discounts</span>
            </button>
          </div>
        ) : (
          filteredBookings.map(b => {
            const isExpanded = expandedId === b.id;
            return (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#2596be]/30 shadow-xs overflow-hidden"
              >
                {/* Header Summary Card */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#2596be]">
                        {b.bookingNumber}
                      </span>
                      <span>·</span>
                      <span className="text-xs text-[#667085]">
                        {b.bookingType === 'sunday_bulk' ? 'Sunday Bulk Pool' : 'Regular Slot'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#142326]">{b.serviceName}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#667085]">
                      <span className="flex items-center gap-1 font-medium text-[#142326]">
                        <Building2 className="w-3.5 h-3.5 text-[#2596be]" />
                        {b.apartmentName} ({b.block}, Flat {b.flatNumber})
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {b.date} · {b.slot}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E7EB]">
                    <div className="text-right">
                      <div className="text-xs text-[#667085]">Amount</div>
                      <div className="text-base font-extrabold text-[#142326] font-mono tabular-nums">
                        ₹{b.price}
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : b.id)}
                      className="px-3 py-2 bg-[#F8F9FA] hover:bg-[#E5E7EB] text-[#142326] text-xs font-semibold rounded-xl border border-[#E5E7EB] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Tracker' : 'Track Service'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Live Tracker Area */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 sm:px-5 pb-5 border-t border-[#E5E7EB] pt-4 bg-white"
                    >
                      <StatusTracker booking={b} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
