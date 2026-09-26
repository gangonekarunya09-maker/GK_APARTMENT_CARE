import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingStatus } from '../../types';
import {
  CalendarCheck,
  Search,
  Filter,
  Building2,
  Clock,
  User,
  Phone,
  MessageSquare,
  CheckCircle2,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export const BookingsManager: React.FC = () => {
  const { bookings, apartments, providers, updateBookingStatus, defaultCommissionRate, setAdminSection } = useApp();
  const [selectedApartmentId, setSelectedApartmentId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = bookings.filter(b => {
    if (selectedApartmentId !== 'all' && b.apartmentId !== selectedApartmentId) return false;
    if (selectedStatus !== 'all' && b.status !== selectedStatus) return false;
    if (
      searchQuery &&
      !b.residentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.flatNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#142326]">Bookings Operations &amp; Dispatch</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Advance service stages, assign verified vendors, and coordinate gate entry
          </p>
        </div>
        <div className="text-xs font-semibold text-[#667085]">
          Showing {filtered.length} of {bookings.length} total orders
        </div>
      </div>

      {/* Filter and Search Bar (no horizontal rows, cleanly wrapped) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search booking ID, resident name, or flat number..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
          />
        </div>

        {/* Society filter */}
        <select
          value={selectedApartmentId}
          onChange={e => setSelectedApartmentId(e.target.value)}
          className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#142326] cursor-pointer"
        >
          <option value="all">All Gated Communities</option>
          {apartments.map(a => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#142326] cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="received">Received</option>
          <option value="vendor_assigned">Vendor Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings Card List - strictly NO horizontal rows or overflowing tables */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#E5E7EB]">
            <CalendarCheck className="w-10 h-10 mx-auto text-[#667085]/40 mb-2" />
            <h4 className="text-sm font-bold text-[#142326]">No Bookings Found</h4>
            <p className="text-xs text-[#667085] mt-1">Try resetting the society or status filter.</p>
          </div>
        ) : (
          filtered.map(b => (
            <div
              key={b.id}
              className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Resident & Service Details */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#2596be]">{b.bookingNumber}</span>
                  <span>·</span>
                  <span className="text-sm font-bold text-[#142326]">{b.serviceName}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold capitalize ${
                      b.bookingType === 'sunday_bulk'
                        ? 'bg-[#2596be]/10 text-[#2596be]'
                        : 'bg-[#F8F9FA] text-[#667085]'
                    }`}
                  >
                    {b.bookingType === 'sunday_bulk' ? 'Sunday Bulk Pool' : 'Regular Slot'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#667085]">
                  <span className="flex items-center gap-1 font-semibold text-[#142326]">
                    <Building2 className="w-3.5 h-3.5 text-[#2596be]" />
                    {b.apartmentName} ({b.block}, Flat {b.flatNumber})
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-medium text-[#142326]">
                    <User className="w-3.5 h-3.5 text-[#667085]" />
                    {b.residentName} ({b.phone})
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#667085]" />
                    {b.date} · {b.slot}
                  </span>
                </div>

                {b.notes && (
                  <div className="text-[11px] text-[#667085] bg-[#F8F9FA] px-2.5 py-1 rounded-md inline-block">
                    Note: {b.notes}
                  </div>
                )}
              </div>

              {/* Status Advance & Provider Assignment Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E5E7EB] shrink-0">
                {/* Service Fee & Commission Split */}
                {(() => {
                  const prov = providers.find(p => p.id === b.providerId);
                  const rate = b.commissionRate ?? prov?.commissionPercentage ?? defaultCommissionRate ?? 15;
                  const comm = b.commissionAmount ?? Math.round(((b.price || 0) * rate) / 100);
                  const vendorPayout = b.vendorPayoutAmount ?? Math.max(0, (b.price || 0) - comm);

                  return (
                    <div className="text-right sm:pr-2">
                      <div className="text-[10px] text-[#667085] uppercase tracking-wider font-semibold">Customer Fee</div>
                      <div className="text-base font-extrabold text-[#142326] font-mono tabular-nums">
                        ₹{b.price}
                      </div>
                      <div className="text-[10px] text-[#2596be] font-bold">
                        GK: ₹{comm} ({rate}%)
                      </div>
                      <div className="text-[10px] text-[#2E8B57] font-semibold">
                        Vendor: ₹{vendorPayout}
                      </div>
                    </div>
                  );
                })()}

                {/* Provider select */}
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-[#667085]">
                    Assign Provider
                  </label>
                  <select
                    value={b.providerId || ''}
                    onChange={e => updateBookingStatus(b.id, b.status, e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#142326] cursor-pointer"
                  >
                    <option value="">Select Vendor</option>
                    {providers.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.businessName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status lifecycle select */}
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-[#667085]">
                    Order Stage
                  </label>
                  <select
                    value={b.status}
                    onChange={e => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border ${
                      b.status === 'completed'
                        ? 'bg-[#2E8B57]/10 text-[#2E8B57] border-[#2E8B57]/30'
                        : b.status === 'in_progress'
                        ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
                        : 'bg-[#2596be]/10 text-[#2596be] border-[#2596be]/30'
                    }`}
                  >
                    <option value="received">1. Booking Received</option>
                    <option value="vendor_assigned">2. Vendor Assigned</option>
                    <option value="in_progress">3. Service In Progress</option>
                    <option value="completed">4. Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Quick WhatsApp message to resident */}
                <a
                  href={`https://wa.me/${b.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hi ${b.residentName}! Updating you regarding your GK Apartment Care booking ${b.bookingNumber} (${b.serviceName}) for ${b.apartmentName}, Flat ${b.flatNumber}. Current status: ${b.status.replace('_', ' ')}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[#2E8B57] hover:bg-[#2E8B57]/10 rounded-lg border border-[#E5E7EB] flex items-center justify-center cursor-pointer"
                  title="WhatsApp Resident"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
