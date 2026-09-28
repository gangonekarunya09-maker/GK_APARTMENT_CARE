import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
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
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking } from '../../types';

export const BookingModal: React.FC = () => {
  const {
    bookingModalService,
    setBookingModalService,
    selectedApartment,
    apartments,
    campaigns,
    createBooking,
    setResidentTab,
    setTrackingBooking,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingApartmentId, setBookingApartmentId] = useState<string>(
    selectedApartment?.id || (apartments[0]?.id ?? '')
  );
  const [customSocietyName, setCustomSocietyName] = useState<string>('');

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

  React.useEffect(() => {
    if (selectedApartment?.id) {
      setBookingApartmentId(selectedApartment.id);
    } else if (apartments.length > 0 && !bookingApartmentId) {
      setBookingApartmentId(apartments[0].id);
    }
  }, [selectedApartment, apartments, bookingApartmentId]);

  if (!bookingModalService) return null;

  const currentPrice = bookingModalService.communityPrice;

  const slots = bookingModalService.availableSlots || [
    '09:00 AM – 11:00 AM',
    '11:00 AM – 01:00 PM',
    '02:30 PM – 04:30 PM',
  ];

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
      const chosenAptId =
        selectedApartment?.id ||
        bookingApartmentId ||
        apartments[0]?.id ||
        'community_hyderabad_central';
      const activeCampaign = campaigns.find(
        c => c.apartmentId === chosenAptId && c.serviceId === bookingModalService.id
      );

      const bookingNotesArray: string[] = [];
      if (notes.trim()) bookingNotesArray.push(notes.trim());
      if (customSocietyName.trim()) bookingNotesArray.push(`Society: ${customSocietyName.trim()}`);

      const result = await createBooking({
        serviceId: bookingModalService.id,
        apartmentId: chosenAptId,
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
        notes: bookingNotesArray.length > 0 ? bookingNotesArray.join(' · ') : undefined,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-[24px] border border-[#E4E0D8] shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 border-b border-[#E4E0D8] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <Badge variant="neutral" size="sm">
              {selectedApartment?.name || 'Doorstep Service'}
            </Badge>
            <h3 className="font-display text-lg sm:text-xl font-medium text-[#111111] mt-1">
              {bookingModalService.name}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full border border-[#E4E0D8] bg-white flex items-center justify-center text-[#5C5A56] hover:text-[#111111] hover:border-[#111111] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[75vh]">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              {/* Pricing Summary */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#111111]">
                    {bookingModalService.name}
                  </div>
                  <div className="text-xs text-[#5C5A56]">Doorstep appointment</div>
                </div>
                <div className="text-right">
                  <div className="font-display font-medium text-xl text-[#111111] font-mono tabular-nums">
                    ₹{bookingModalService.communityPrice}
                  </div>
                  {bookingModalService.normalPrice > bookingModalService.communityPrice && (
                    <div className="text-xs text-[#5C5A56] line-through font-mono">
                      ₹{bookingModalService.normalPrice}
                    </div>
                  )}
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2596be]" />
                  <span>Select Service Date</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['Tomorrow', 'Day After Tomorrow', 'Upcoming Weekend'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`py-3 px-2 rounded-full border text-center text-xs font-medium cursor-pointer transition-all ${
                        selectedDate === d
                          ? 'border-[#111111] bg-[#111111] text-[#FAF8F5] font-semibold'
                          : 'border-[#E4E0D8] bg-white text-[#111111] hover:border-[#111111]/40'
                      }`}
                    >
                      {d === 'Day After Tomorrow' ? 'Day After' : d === 'Upcoming Weekend' ? 'Weekend' : d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#2596be]" />
                  <span>Preferred Time Slot</span>
                </label>
                <div className="space-y-2">
                  {slots.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSlot(s)}
                      className={`w-full py-3 px-4 rounded-full border text-left text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-all ${
                        activeSlot === s
                          ? 'border-[#111111] bg-[#111111] text-[#FAF8F5] font-semibold'
                          : 'border-[#E4E0D8] bg-white text-[#111111] hover:border-[#111111]/40'
                      }`}
                    >
                      <span>{s}</span>
                      {activeSlot === s && <CheckCircle2 className="w-4 h-4 text-[#2596be]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Continue Button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleNextToDetails}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Resident Details
              </Button>
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
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#5C5A56]">{selectedDate} · {activeSlot}</span>
                  <div className="font-medium text-[#111111] text-sm mt-0.5">
                    {selectedApartment?.name ||
                      apartments.find(a => a.id === bookingApartmentId)?.name ||
                      customSocietyName ||
                      'Doorstep Service'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#5C5A56]">Pay Post Service</span>
                  <div className="text-base font-display font-medium text-[#111111]">
                    ₹{currentPrice}
                  </div>
                </div>
              </div>

              {/* Community Selector if not preset */}
              {!selectedApartment && (
                <div>
                  {apartments.length > 0 ? (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                        Select Your Gated Community <span className="text-[#DC2626]">*</span>
                      </label>
                      <select
                        value={bookingApartmentId}
                        onChange={e => setBookingApartmentId(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111] cursor-pointer"
                      >
                        {apartments.map(apt => (
                          <option key={apt.id} value={apt.id}>
                            {apt.name} ({apt.area})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                        Apartment / Society Name <span className="text-[#DC2626]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customSocietyName}
                        onChange={e => setCustomSocietyName(e.target.value)}
                        placeholder="e.g. My Home Bhooja / Aparna Zenith"
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                  Full Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                  WhatsApp / Phone Number <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#5C5A56]">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98490 12345"
                    className="w-full pl-12 pr-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                  />
                </div>
              </div>

              {/* Block & Flat Number */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                    Tower / Block <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={block}
                    onChange={e => setBlock(e.target.value)}
                    placeholder="e.g. Tower B"
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
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
                    placeholder="e.g. B-204"
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                  />
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Basement parking bay 14 or specific timing notes"
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                />
              </div>

              {bookingError && (
                <div className="p-3.5 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-2xl text-xs text-[#DC2626]">
                  {bookingError}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  type="submit"
                  disabled={bookingSubmitting}
                  icon={<ShieldCheck className="w-4 h-4" />}
                >
                  {bookingSubmitting ? 'Creating booking…' : 'Confirm Booking Request'}
                </Button>
              </div>
            </motion.form>
          )}

          {step === 3 && createdBooking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-5 py-2"
            >
              <div className="w-16 h-16 bg-[#2E8B57]/10 text-[#2E8B57] rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-2xl font-medium text-[#111111]">
                  Booking Confirmed!
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5A56]">
                  Your request is registered for {createdBooking.apartmentName}
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-[#FAF8F5] border border-[#E4E0D8] rounded-2xl p-5 text-left space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-[#E4E0D8] pb-2.5">
                  <span className="text-[#5C5A56]">Booking ID:</span>
                  <span className="font-mono font-bold text-[#2596be]">
                    {createdBooking.bookingNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5A56]">Service:</span>
                  <span className="font-medium text-[#111111]">{createdBooking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5A56]">Date &amp; Slot:</span>
                  <span className="font-medium text-[#111111]">
                    {createdBooking.date} · {createdBooking.slot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5A56]">Resident:</span>
                  <span className="font-medium text-[#111111]">
                    {createdBooking.residentName} ({createdBooking.block}, Flat {createdBooking.flatNumber})
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#E4E0D8] pt-2.5">
                  <span className="text-[#5C5A56]">Amount (Post Service):</span>
                  <span className="font-display font-medium text-base text-[#111111] font-mono tabular-nums">
                    ₹{createdBooking.price}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    handleClose();
                    setResidentTab('my-bookings');
                    setTrackingBooking(createdBooking);
                  }}
                  icon={<Calendar className="w-4 h-4" />}
                >
                  View &amp; Track My Booking
                </Button>

                <a
                  href={`https://wa.me/919494335848?text=${encodeURIComponent(
                    `Hi GK Apartment Care! I just booked ${createdBooking.serviceName} (${createdBooking.bookingNumber}) for ${createdBooking.apartmentName}, Flat ${createdBooking.flatNumber}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white border border-[#E4E0D8] text-[#111111] hover:border-[#111111] font-medium text-xs sm:text-sm rounded-full transition-colors flex items-center justify-center gap-2"
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
