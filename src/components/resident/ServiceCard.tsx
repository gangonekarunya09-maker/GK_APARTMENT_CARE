import React from 'react';
import { Service, ServiceCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Car,
  Sparkles,
  Wind,
  Droplets,
  Home,
  ShieldCheck,
  Clock,
  Users,
  Share2,
  CalendarCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceCardProps {
  service: Service;
  category?: ServiceCategory;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, category }) => {
  const { setBookingModalService, setShareModalService, selectedApartment, campaigns } = useApp();

  // Connect to the exact community campaign for this apartment and service
  const campaign = campaigns.find(
    c => c.apartmentId === selectedApartment?.id && c.serviceId === service.id
  );

  const normalPrice = campaign ? campaign.normalPrice : service.normalPrice;
  const communityPrice = campaign ? campaign.communityPrice : service.communityPrice;
  const sundayBulkPrice = campaign ? (campaign.sundayBulkPrice ?? service.sundayBulkPrice) : service.sundayBulkPrice;
  const currentDemand = campaign ? campaign.currentDemand : service.currentDemand;
  const minimumDemand = campaign ? campaign.minimumDemand : service.minimumDemand;

  const getIcon = (name: string) => {
    switch (name) {
      case 'Car':
        return <Car className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Wind':
        return <Wind className="w-5 h-5" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5" />;
      case 'Home':
        return <Home className="w-5 h-5" />;
      default:
        return <ShieldCheck className="w-5 h-5" />;
    }
  };

  const percentBooked = Math.min(
    100,
    Math.round((currentDemand / minimumDemand) * 100)
  );

  const neededResidents = Math.max(0, minimumDemand - currentDemand);
  const isTargetReached = neededResidents === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#2596be]/50 transition-all p-5 flex flex-col justify-between shadow-xs relative"
    >
      {/* Top Meta info */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2596be]/10 text-[#2596be] flex items-center justify-center shrink-0">
              {getIcon(service.iconName)}
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider">
                {category?.name || 'Home Care'}
              </div>
              <h3 className="text-base font-bold text-[#142326] leading-snug">
                {service.name}
              </h3>
            </div>
          </div>

          {/* WhatsApp quick share trigger */}
          <button
            onClick={() => setShareModalService(service)}
            className="p-2 text-[#667085] hover:text-[#2596be] hover:bg-[#F8F9FA] rounded-lg transition-colors cursor-pointer"
            title="Share with society WhatsApp group"
            aria-label="Share service"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed mb-4">
          {service.description}
        </p>

        {/* Pricing comparison - clean vertical breakdown */}
        <div className="bg-[#F8F9FA] rounded-xl p-3 border border-[#E5E7EB] mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#667085]">Individual Doorstep</span>
            <span className="text-[#667085] line-through font-mono tabular-nums">
              ₹{normalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#142326]">Community Resident Price</span>
            <span className="font-bold text-[#142326] font-mono tabular-nums">
              ₹{communityPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-1.5 text-[#2596be] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sunday Bulk Pool</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-1.5 py-0.5 bg-[#2596be]/10 text-[#2596be] font-bold rounded">
                Save ₹{(normalPrice - sundayBulkPrice).toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-extrabold text-[#2596be] font-mono tabular-nums">
                ₹{sundayBulkPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Sunday Community Demand Meter */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
            <span className="text-[#142326] font-semibold flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#2596be]" />
              <span>Sunday Demand Pool</span>
            </span>
            <span className="text-[#667085] font-mono tabular-nums">
              {currentDemand} / {minimumDemand} booked
            </span>
          </div>

          {/* Animated Progress bar */}
          <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                isTargetReached ? 'bg-[#2E8B57]' : 'bg-[#2596be]'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${percentBooked}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            {isTargetReached ? (
              <span className="text-[#2E8B57] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Bulk discount target achieved!</span>
              </span>
            ) : (
              <span className="text-[#667085]">
                <strong className="text-[#142326] font-semibold">{neededResidents} more</strong> residents needed to unlock ₹{sundayBulkPrice}
              </span>
            )}
            <span className="text-[10px] text-[#667085]">{percentBooked}%</span>
          </div>
        </div>

        {/* Service specs: duration & provider */}
        <div className="flex items-center justify-between text-[11px] text-[#667085] mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{service.durationMinutes} mins per unit</span>
          </div>
          {service.providerName && (
            <div className="truncate max-w-[150px] text-right">
              by <span className="font-semibold text-[#142326]">{service.providerName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Booking Action CTA */}
      <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
        <button
          onClick={() => setBookingModalService(service)}
          className="w-full py-2.5 px-4 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Book Service · From ₹{sundayBulkPrice}</span>
        </button>

        <button
          onClick={() => setShareModalService(service)}
          className="w-full py-1.5 text-center text-xs font-semibold text-[#2596be] hover:text-[#1e7ca0] transition-colors cursor-pointer"
        >
          Share on WhatsApp Group
        </button>
      </div>
    </motion.div>
  );
};
