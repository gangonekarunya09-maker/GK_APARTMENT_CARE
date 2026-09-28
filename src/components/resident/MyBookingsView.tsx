import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StatusTracker } from './StatusTracker';
import {
  Calendar,
  Clock,
  Building2,
  MapPin,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Phone,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MyBookingsView: React.FC = () => {
  const { bookings, setResidentTab, trackingBooking, selectedApartment } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(trackingBooking?.id || null);

  const communityBookings = bookings.filter(
    b => !selectedApartment || b.apartmentId === selectedApartment.id
  );

  const filteredBookings = communityBookings.filter(b => {
    if (filter === 'active') return b.status !== 'completed' && b.status !== 'cancelled';
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <Section bg="bg" className="min-h-[80vh]">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
        {/* Title and Segmented Filter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#E4E0D8]">
          <div className="space-y-2">
            <Badge variant="neutral" size="sm" icon={<Building2 className="w-3.5 h-3.5 text-[#2596be]" />}>
              {selectedApartment?.name || 'Gated Society Bookings'}
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-medium text-[#111111] leading-tight">
              My Apartment Bookings
            </h1>
            <p className="text-xs sm:text-sm text-[#5C5A56]">
              Real-time service status, assigned technicians, and digital gate pass clearance.
            </p>
          </div>

          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F0EDE7] rounded-full border border-[#E4E0D8] self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`h-9 px-4 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#111111] text-[#FAF8F5] shadow-xs'
                  : 'text-[#5C5A56] hover:text-[#111111]'
              }`}
            >
              All ({communityBookings.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`h-9 px-4 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filter === 'active'
                  ? 'bg-[#111111] text-[#FAF8F5] shadow-xs'
                  : 'text-[#5C5A56] hover:text-[#111111]'
              }`}
            >
              Active ({communityBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`h-9 px-4 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filter === 'completed'
                  ? 'bg-[#111111] text-[#FAF8F5] shadow-xs'
                  : 'text-[#5C5A56] hover:text-[#111111]'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4 sm:space-y-5">
          {filteredBookings.length === 0 ? (
            <div className="p-10 sm:p-12 text-center bg-white rounded-[24px] border border-[#E4E0D8] space-y-4 shadow-2xs">
              <Calendar className="w-12 h-12 text-[#5C5A56]/40 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-display text-xl font-medium text-[#111111]">
                  No Bookings Found
                </h4>
                <p className="text-xs sm:text-sm text-[#5C5A56] max-w-sm mx-auto">
                  You have not scheduled any home or auto care bookings for your apartment yet.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => setResidentTab('services')}
                icon={<PlusCircle className="w-4 h-4" />}
              >
                Explore Services &amp; Bulk Rates
              </Button>
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
                  className="bg-white rounded-[24px] border border-[#E4E0D8] hover:border-[#111111]/30 transition-colors shadow-2xs overflow-hidden"
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
                      <h3 className="font-display text-lg sm:text-xl font-medium text-[#111111]">
                        {b.serviceName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5C5A56]">
                        <span className="flex items-center gap-1 font-medium text-[#111111]">
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
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : b.id)}
                        className="p-2 rounded-full hover:bg-[#F0EDE7] border border-[#E4E0D8] text-[#5C5A56] hover:text-[#111111] transition-colors cursor-pointer"
                        aria-label="Toggle tracking status"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Status & Tracking Component */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-[#E4E0D8] bg-[#FAF8F5] p-5 sm:p-6"
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
    </Section>
  );
};
