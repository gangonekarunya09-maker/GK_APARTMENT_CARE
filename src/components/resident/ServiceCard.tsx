import React from 'react';
import { Service, ServiceCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import {
  Car,
  Sparkles,
  Wind,
  Droplets,
  Home,
  ShieldCheck,
  Clock,
  Share2,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceCardProps {
  service: Service;
  category?: ServiceCategory;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, category }) => {
  const { setBookingModalService, setShareModalService, selectedApartment, campaigns } = useApp();

  const campaign = campaigns.find(
    c => c.apartmentId === selectedApartment?.id && c.serviceId === service.id
  );

  const normalPrice = campaign ? campaign.normalPrice : service.normalPrice;
  const communityPrice = campaign ? campaign.communityPrice : service.communityPrice;
  const savings = normalPrice > communityPrice ? normalPrice - communityPrice : 0;

  const getIcon = (name: string) => {
    switch (name) {
      case 'Car':
        return <Car className="w-5 h-5 text-[#2596be]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#2596be]" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-[#2596be]" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-[#2596be]" />;
      case 'Home':
        return <Home className="w-5 h-5 text-[#2596be]" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#2596be]" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-[24px] border border-[#E4E0D8] hover:border-[#111111]/30 transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1"
    >
      {/* Top Details */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F0EDE7] border border-[#E4E0D8] flex items-center justify-center shrink-0 group-hover:bg-[#2596be]/10 transition-colors">
              {getIcon(service.iconName)}
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5C5A56]">
                {category?.name || 'Apartment Care'}
              </span>
              <h3 className="font-display text-lg sm:text-xl font-medium text-[#111111] leading-snug">
                {service.name}
              </h3>
            </div>
          </div>

          {/* WhatsApp share trigger */}
          <button
            onClick={() => setShareModalService(service)}
            className="w-8 h-8 rounded-full border border-[#E4E0D8] text-[#5C5A56] hover:text-[#111111] hover:border-[#111111] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Share with society WhatsApp group"
            aria-label="Share service"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#5C5A56] line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        {/* Pricing Block */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E4E0D8] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5C5A56]">
            <span>Standard Street Price</span>
            <span className="line-through font-mono tabular-nums">
              ₹{normalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#E4E0D8]">
            <span className="font-medium text-[#111111]">Doorstep Rate</span>
            <div className="flex items-center gap-2">
              {savings > 0 && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#2E8B57]/10 text-[#2E8B57]">
                  Save ₹{savings.toLocaleString('en-IN')}
                </span>
              )}
              <span className="font-display font-medium text-xl text-[#111111] font-mono tabular-nums">
                ₹{communityPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-[#5C5A56] pt-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#2596be]" />
            <span>{service.durationMinutes} mins approx</span>
          </div>
          {service.providerName && (
            <div className="truncate max-w-[150px] text-right">
              by <span className="font-medium text-[#111111]">{service.providerName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-6 mt-4 border-t border-[#E4E0D8] space-y-2">
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => setBookingModalService(service)}
          icon={<CalendarCheck className="w-4 h-4" />}
        >
          Book Service · ₹{communityPrice}
        </Button>

        <button
          onClick={() => setShareModalService(service)}
          className="w-full py-1.5 text-center text-xs text-[#5C5A56] hover:text-[#111111] hover:underline cursor-pointer"
        >
          Share with tower neighbors →
        </button>
      </div>
    </motion.div>
  );
};
