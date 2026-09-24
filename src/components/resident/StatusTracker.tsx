import React from 'react';
import { Booking, BookingStatus } from '../../types';
import { CheckCircle2, Clock, UserCheck, Wrench, ShieldCheck, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface StatusTrackerProps {
  booking: Booking;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({ booking }) => {
  const steps: { key: BookingStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'received',
      label: 'Booking Received',
      desc: 'Request logged & queued for gate clearance schedule',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      key: 'vendor_assigned',
      label: 'Vendor Assigned',
      desc: booking.providerName
        ? `Assigned to ${booking.providerName}`
        : 'Dedicated community specialist assigned',
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      key: 'in_progress',
      label: 'Service in Progress',
      desc: 'Technicians on-site at your tower / flat unit',
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      key: 'completed',
      label: 'Completed',
      desc: 'Job verified and signed off by resident',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  ];

  const statusOrder: Record<BookingStatus, number> = {
    received: 1,
    vendor_assigned: 2,
    in_progress: 3,
    completed: 4,
    cancelled: 0,
  };

  const currentLevel = statusOrder[booking.status] || 1;

  return (
    <div className="bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#142326]">Live Status Tracker</span>
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded capitalize ${
            booking.status === 'completed'
              ? 'bg-[#2E8B57]/10 text-[#2E8B57]'
              : booking.status === 'in_progress'
              ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
              : 'bg-[#2596be]/10 text-[#2596be]'
          }`}
        >
          {booking.status.replace('_', ' ')}
        </span>
      </div>

      {/* Vertical Tracker Layout (strictly no overflowing horizontal rows) */}
      <div className="space-y-4 relative pl-2">
        {steps.map((step, idx) => {
          const stepLevel = idx + 1;
          const isDone = currentLevel > stepLevel;
          const isCurrent = currentLevel === stepLevel;
          const isPending = currentLevel < stepLevel;

          return (
            <div key={step.key} className="flex items-start gap-3 relative">
              {/* Connecting vertical line */}
              {idx < steps.length - 1 && (
                <div
                  className={`absolute left-[13px] top-6 bottom-[-16px] w-0.5 ${
                    currentLevel > stepLevel ? 'bg-[#2596be]' : 'bg-[#E5E7EB]'
                  }`}
                />
              )}

              {/* Status node */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-xs transition-all ${
                  isDone
                    ? 'bg-[#2596be] text-white'
                    : isCurrent
                    ? 'bg-white border-2 border-[#2596be] text-[#2596be] font-bold shadow-xs'
                    : 'bg-white border border-[#E5E7EB] text-[#667085]'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <div className="w-2 h-2 rounded-full bg-[#2596be]" />
                ) : (
                  <span className="text-[10px]">{idx + 1}</span>
                )}
              </div>

              {/* Step info */}
              <div className="flex-1 pb-1">
                <div className="flex items-baseline justify-between">
                  <h4
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-[#2596be]'
                        : isDone
                        ? 'text-[#142326]'
                        : 'text-[#667085]'
                    }`}
                  >
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-[10px] uppercase font-bold text-[#2596be] tracking-wider">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#667085] leading-snug mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assigned Vendor Details if available */}
      {booking.providerName && (
        <div className="pt-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <div className="text-[10px] text-[#667085] uppercase tracking-wider font-semibold">Assigned Service Provider</div>
            <div className="font-bold text-[#142326]">{booking.providerName}</div>
          </div>
          <div className="flex items-center gap-2">
            {booking.providerPhone && (
              <a
                href={`tel:${booking.providerPhone}`}
                className="px-2.5 py-1 bg-white border border-[#E5E7EB] hover:border-[#2596be] text-[#142326] rounded-md font-semibold text-xs flex items-center gap-1.5"
              >
                <Phone className="w-3 h-3 text-[#2596be]" />
                <span>Call Provider</span>
              </a>
            )}
            <a
              href={`https://wa.me/${booking.providerPhone?.replace(/\D/g, '') || '919849012345'}?text=${encodeURIComponent(
                `Hi! Regarding booking ${booking.bookingNumber} (${booking.serviceName}) for Flat ${booking.flatNumber}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-[#2E8B57]/10 hover:bg-[#2E8B57]/20 text-[#2E8B57] rounded-md font-semibold text-xs flex items-center gap-1.5"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
