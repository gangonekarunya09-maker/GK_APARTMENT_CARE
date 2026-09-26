import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  Building2,
  Phone,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking } from '../../types';

export const BookingModal: React.FC = () => {
  const {
    bookingModalService,
    setBookingModalService,
    selectedApartment,
    campaigns,
    createBooking,
    setResidentTab,
    setTrackingBooking,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Slot & Date, 2: Resident Details, 3: Success Confirmation
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  
  const savedProfile = (() => {
    try {
      const raw = localStorage.getItem('gk_resident_profile');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [fullName, setFullName] = useState(savedProfile?.name || '');
  const [phone, setPhone] = useState(savedProfile?.phone || '');
  const [block, setBlock] = useState(savedProfile?.block || '');
  const [flatNumber, setFlatNumber] = useState(savedProfile?.flatNumber || '');
  const [email, setEmail] = useState(savedProfile?.email || '');
  const [notes, setNotes] = useState('');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  if (!bookingModalService) return null;

  const currentPrice = bookingModalService.communityPrice;

  // Generate available slots based on service
  const slots = bookingModalService.availableSlots || [
    '09:00 AM – 11:00 AM',
    '11:00 AM – 01:00 PM',
    '02:30 PM – 04:30 PM',
  ];

  // Set default slot if none selected
  const activeSlot = selectedSlot || slots[0];

  const handleNextToDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !flatNumber || !block) return;

    setBookingError(null);
    setBookingSubmitting(true);
    try {
      const activeCampaign = campaigns.find(
        c => c.apartmentId === selectedApartment?.id && c.serviceId === bookingModalService.id
      );

      const result = await createBooking({
        serviceId: bookingModalService.id,
        apartmentId: selectedApartment?.id || 'community_green_valley_001',
        residentName: fullName,
        phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
        email: email || undefined,
        block,
        flatNumber,
        date: selectedDate,
        slot: activeSlot,
        price: currentPrice,
        bookingType: 'regular',
        campaignId: activeCampaign?.id,
        notes: notes || undefined,
      });

      if (result.success && result.data) {
        setCreatedBooking(result.data);
        try {
          localStorage.setItem(
            'gk_resident_profile',
            JSON.stringify({
              name: fullName,
              phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
              block,
              flatNumber,
              email: email || '',
            })
          );
        } catch {
          // ignore
        }
        setStep(3);
      } else {
        setBookingError(result.error || 'Could not create booking. Please try again.');
      }
    } catch (err: any) {
      setBookingError(err?.message || 'Unexpected error. Please try again.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleClose = () => {
    setBookingModalService(null);
    setStep(1);
    setCreatedBooking(null);
  };

  const safeMinDemand = bookingModalService.minimumDemand > 0 ? bookingModalService.minimumDemand : 1;
  const percentBooked = Math.min(
    100,
    Math.round((bookingModalService.currentDemand / safeMinDemand) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#2596be]">
              {selectedApartment?.name}
            </div>
            <h3 className="text-base font-bold text-[#142326]">
              {bookingModalService.name}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#667085] hover:bg-[#F8F9FA] hover:text-[#142326] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 max-h-[75vh]">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-5"
            >
              {/* Service Pricing Summary */}
              <div className="p-3.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#142326]">{bookingModalService.name}</div>
                  <div className="text-[11px] text-[#667085]">Solo doorstep appointment</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-[#2596be] font-mono tabular-nums">
                    ₹{bookingModalService.communityPrice}
                  </div>
                  {bookingModalService.normalPrice > bookingModalService.communityPrice && (
                    <div className="text-[10px] text-[#667085] line-through font-mono">
                      ₹{bookingModalService.normalPrice}
                    </div>
                  )}
                </div>
              </div>

              {/* Date selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#142326] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2596be]" />
                  <span>Select Service Date</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDate('Tomorrow')}
                    className={`p-2.5 rounded-lg border text-center text-xs font-medium cursor-pointer ${
                      selectedDate === 'Tomorrow'
                        ? 'border-[#2596be] bg-[#2596be]/10 text-[#2596be] font-bold'
                        : 'border-[#E5E7EB] text-[#142326] hover:border-[#2596be]/30'
                    }`}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDate('Day After Tomorrow')}
                    className={`p-2.5 rounded-lg border text-center text-xs font-medium cursor-pointer ${
                      selectedDate === 'Day After Tomorrow'
                        ? 'border-[#2596be] bg-[#2596be]/10 text-[#2596be] font-bold'
                        : 'border-[#E5E7EB] text-[#142326] hover:border-[#2596be]/30'
                    }`}
                  >
                    Day After
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDate('Upcoming Weekend')}
                    className={`p-2.5 rounded-lg border text-center text-xs font-medium cursor-pointer ${
                      selectedDate === 'Upcoming Weekend'
                        ? 'border-[#2596be] bg-[#2596be]/10 text-[#2596be] font-bold'
                        : 'border-[#E5E7EB] text-[#142326] hover:border-[#2596be]/30'
                    }`}
                  >
                    Weekend
                  </button>
                </div>
              </div>

              {/* Time slot selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#142326] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#2596be]" />
                  <span>Preferred Time Slot</span>
                </label>
                <div className="space-y-2">
                  {slots.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSlot(s)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between cursor-pointer transition-all ${
                        activeSlot === s
                          ? 'border-[#2596be] bg-[#2596be]/5 font-bold text-[#2596be]'
                          : 'border-[#E5E7EB] text-[#142326] hover:border-[#2596be]/30'
                      }`}
                    >
                      <span>{s}</span>
                      {activeSlot === s && <CheckCircle2 className="w-4 h-4 text-[#2596be]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Continue button */}
              <button
                type="button"
                onClick={handleNextToDetails}
                className="w-full py-3 bg-[#2596be] hover:bg-[#1e7ca0] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Continue to Resident Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleConfirmBooking}
              className="space-y-4"
            >
              {/* Summary Bar */}
              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#667085]">{selectedDate} · {activeSlot}</span>
                  <div className="font-bold text-[#142326]">{selectedApartment?.name}</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#667085]">Pay on Service</span>
                  <div className="text-sm font-extrabold text-[#2596be]">₹{currentPrice}</div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#142326] mb-1">
                  Full Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-[#142326] mb-1">
                  WhatsApp / Mobile Number <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#667085]">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98490 12345"
                    className="w-full pl-12 pr-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>
                <p className="text-[11px] text-[#667085] mt-1">
                  Booking confirmation &amp; gate pass updates will be sent here.
                </p>
              </div>

              {/* Block & Flat Number */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Tower / Block <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={block}
                    onChange={e => setBlock(e.target.value)}
                    placeholder="e.g. Tower B"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Flat Number <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={flatNumber}
                    onChange={e => setFlatNumber(e.target.value)}
                    placeholder="e.g. B-204"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>
              </div>

              {/* Optional Email & Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#142326] mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="rahul.k@example.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142326] mb-1">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Basement parking bay 14 or specific unit instructions"
                  className="w-full px-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
                />
              </div>

              {bookingError && (
                <div className="p-3 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-xl text-xs text-[#DC2626]">
                  {bookingError}
                </div>
              )}

              {/* Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#667085] hover:bg-[#F8F9FA] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="flex-1 py-3 bg-[#2596be] hover:bg-[#1e7ca0] text-white font-bold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{bookingSubmitting ? 'Creating booking…' : 'Confirm Booking Request'}</span>
                </button>
              </div>
            </motion.form>
          )}

          {step === 3 && createdBooking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-2"
            >
              <div className="w-14 h-14 bg-[#2E8B57]/10 text-[#2E8B57] rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#142326]">
                  Booking Request Received
                </h3>
                <p className="text-xs text-[#667085]">
                  Your request has been registered with {createdBooking.apartmentName}
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl p-4 text-left space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                  <span className="text-[#667085]">Booking ID:</span>
                  <span className="font-mono font-bold text-[#2596be]">{createdBooking.bookingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Service:</span>
                  <span className="font-semibold text-[#142326]">{createdBooking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Date &amp; Slot:</span>
                  <span className="font-semibold text-[#142326]">{createdBooking.date} · {createdBooking.slot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Resident:</span>
                  <span className="font-semibold text-[#142326]">
                    {createdBooking.residentName} ({createdBooking.block}, Flat {createdBooking.flatNumber})
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#E5E7EB] pt-2">
                  <span className="text-[#667085]">Total Amount (Post Service):</span>
                  <span className="text-sm font-extrabold text-[#2596be] font-mono tabular-nums">
                    ₹{createdBooking.price}
                  </span>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setResidentTab('my-bookings');
                    setTrackingBooking(createdBooking);
                  }}
                  className="w-full py-3 bg-[#2596be] hover:bg-[#1e7ca0] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>View &amp; Track My Booking</span>
                </button>

                <a
                  href={`https://wa.me/919849012345?text=${encodeURIComponent(
                    `Hi GK Apartment Care! I just booked ${createdBooking.serviceName} (${createdBooking.bookingNumber}) for ${createdBooking.apartmentName}, Flat ${createdBooking.flatNumber}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-white border border-[#E5E7EB] text-[#142326] hover:bg-[#F8F9FA] font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#2E8B57]" />
                  <span>WhatsApp Support &amp; Queries</span>
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
