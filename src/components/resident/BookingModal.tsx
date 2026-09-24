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
    createBooking,
    setResidentTab,
    setTrackingBooking,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Slot & Type, 2: Resident Details, 3: Success Confirmation
  const [bookingType, setBookingType] = useState<'sunday_bulk' | 'regular'>('sunday_bulk');
  const [selectedDate, setSelectedDate] = useState<string>('Upcoming Sunday (27 Sep)');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [block, setBlock] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  if (!bookingModalService) return null;

  const currentPrice =
    bookingType === 'sunday_bulk'
      ? bookingModalService.sundayBulkPrice
      : bookingModalService.communityPrice;

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

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !flatNumber || !block) return;

    const newBooking = createBooking({
      serviceId: bookingModalService.id,
      apartmentId: selectedApartment?.id || 'apt-green-valley',
      residentName: fullName,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email: email || undefined,
      block,
      flatNumber,
      date: selectedDate,
      slot: activeSlot,
      price: currentPrice,
      bookingType,
      notes: notes || undefined,
    });

    setCreatedBooking(newBooking);
    setStep(3);
  };

  const handleClose = () => {
    setBookingModalService(null);
    setStep(1);
    setCreatedBooking(null);
  };

  const percentBooked = Math.min(
    100,
    Math.round((bookingModalService.currentDemand / bookingModalService.minimumDemand) * 100)
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
              {/* Option Selector: Regular vs Sunday Bulk */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#142326]">Select Booking Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setBookingType('sunday_bulk')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      bookingType === 'sunday_bulk'
                        ? 'border-[#2596be] bg-[#2596be]/5'
                        : 'border-[#E5E7EB] hover:border-[#2596be]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#2596be]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sunday Bulk Pool</span>
                      </div>
                      <span className="text-sm font-extrabold text-[#2596be] font-mono tabular-nums">
                        ₹{bookingModalService.sundayBulkPrice}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#667085] leading-tight">
                      Exclusive community rate coordinated on Sunday
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingType('regular')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      bookingType === 'regular'
                        ? 'border-[#2596be] bg-[#2596be]/5'
                        : 'border-[#E5E7EB] hover:border-[#2596be]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#142326]">Regular Day Slot</span>
                      <span className="text-sm font-bold text-[#142326] font-mono tabular-nums">
                        ₹{bookingModalService.communityPrice}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#667085] leading-tight">
                      Scheduled anytime on weekdays &amp; Saturdays
                    </p>
                  </button>
                </div>
              </div>

              {/* Sunday bulk explainer if selected */}
              {bookingType === 'sunday_bulk' && (
                <div className="p-3.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#142326] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#2596be]" />
                      <span>{selectedApartment?.name} Sunday Pool</span>
                    </span>
                    <span className="font-mono text-xs font-bold text-[#2596be] tabular-nums">
                      {bookingModalService.currentDemand} / {bookingModalService.minimumDemand} Booked
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2596be] rounded-full"
                      style={{ width: `${percentBooked}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#667085]">
                    Sunday community pricing applies when the required number of residents book this service. Coordinated provider visits mean zero gate hassles.
                  </p>
                </div>
              )}

              {/* Date selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#142326] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2596be]" />
                  <span>Service Date</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {bookingType === 'sunday_bulk' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedDate('Upcoming Sunday (27 Sep)')}
                        className={`p-2.5 rounded-lg border text-left text-xs font-medium cursor-pointer ${
                          selectedDate.includes('27 Sep')
                            ? 'border-[#2596be] bg-[#2596be]/10 text-[#2596be] font-bold'
                            : 'border-[#E5E7EB] text-[#142326]'
                        }`}
                      >
                        <div className="text-[10px] text-[#667085]">Recommended</div>
                        Sunday, 27 Sep
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDate('Next Sunday (4 Oct)')}
                        className={`p-2.5 rounded-lg border text-left text-xs font-medium cursor-pointer ${
                          selectedDate.includes('4 Oct')
                            ? 'border-[#2596be] bg-[#2596be]/10 text-[#2596be] font-bold'
                            : 'border-[#E5E7EB] text-[#142326]'
                        }`}
                      >
                        <div className="text-[10px] text-[#667085]">Following Week</div>
                        Sunday, 4 Oct
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedDate('Tomorrow (Weekday)')}
                        className={`p-2.5 rounded-lg border text-left text-xs font-medium cursor-pointer ${
                          selectedDate.includes('Tomorrow')
                            ? 'border-[#2596be] bg-[#2596be]/10 text-[#2596be] font-bold'
                            : 'border-[#E5E7EB] text-[#142326]'
                        }`}
                      >
                        Tomorrow
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDate('Saturday Regular Slot')}
                        className={`p-2.5 rounded-lg border text-left text-xs font-medium cursor-pointer ${
                          selectedDate.includes('Saturday')
                            ? 'border-[#2596be] bg-[#2596be]/10 text-[#2596be] font-bold'
                            : 'border-[#E5E7EB] text-[#142326]'
                        }`}
                      >
                        This Saturday
                      </button>
                    </>
                  )}
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
                  className="flex-1 py-3 bg-[#2596be] hover:bg-[#1e7ca0] text-white font-bold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Booking Request</span>
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
