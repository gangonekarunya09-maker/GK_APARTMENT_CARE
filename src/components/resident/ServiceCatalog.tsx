import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCard } from './ServiceCard';
import {
  Sparkles,
  Layers,
  Search,
  Filter,
  Users,
  ShieldCheck,
  Calendar,
  Building2,
  Car,
  Wind,
  Droplets,
  Home
} from 'lucide-react';
import { motion } from 'motion/react';

export const ServiceCatalog: React.FC = () => {
  const { services, categories, selectedApartment, campaigns, setBookingModalService } = useApp();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Identify services configured for this community (via community campaigns or direct apartment assignment)
  const communityCampaigns = campaigns.filter(c => c.apartmentId === selectedApartment?.id);
  const communityCampaignServiceIds = new Set(communityCampaigns.map(c => c.serviceId));

  // Filter services strictly available to this community
  const filteredServices = services.filter(srv => {
    // If campaigns exist for this community, show only services configured for this community
    if (communityCampaigns.length > 0) {
      const inCampaigns = communityCampaignServiceIds.has(srv.id);
      const inAptIds = srv.apartmentIds && srv.apartmentIds.length > 0 && selectedApartment ? srv.apartmentIds.includes(selectedApartment.id) : false;
      if (!inCampaigns && !inAptIds) {
        return false;
      }
    } else if (
      srv.apartmentIds &&
      srv.apartmentIds.length > 0 &&
      selectedApartment &&
      !srv.apartmentIds.includes(selectedApartment.id)
    ) {
      return false;
    }

    if (selectedCategoryId !== 'all' && srv.categoryId !== selectedCategoryId) {
      return false;
    }

    if (
      searchQuery &&
      !srv.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !srv.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <section id="services-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Sunday Bulk Promo Feature Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-5 sm:p-6 bg-gradient-to-r from-[#2596be]/10 via-[#82c2db]/15 to-white rounded-2xl border border-[#2596be]/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2596be] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Collective Power</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142326]">
            Unlock Sunday Bulk Discounts for {selectedApartment?.name || 'Your Society'}
          </h2>
          <p className="text-xs text-[#667085] max-w-xl">
            When neighbors coordinate doorstep services on the same Sunday, providers save on travel and pass up to 35% savings directly to you!
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              const carWash = services.find(s => s.id === 'srv-car-wash') || services[0];
              if (carWash) setBookingModalService(carWash);
            }}
            className="px-5 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer active:scale-[0.98]"
          >
            Join This Sunday&apos;s Pool
          </button>
        </div>
      </motion.div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Category Tabs (functional filter buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryId === 'all'
                ? 'bg-[#142326] text-white shadow-xs'
                : 'bg-[#F8F9FA] text-[#667085] hover:text-[#142326] border border-[#E5E7EB]'
            }`}
          >
            All Services ({filteredServices.length})
          </button>

          {categories.map(cat => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2596be] text-white shadow-xs'
                    : 'bg-[#F8F9FA] text-[#667085] hover:text-[#142326] border border-[#E5E7EB]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search service..."
            className="w-full pl-9 pr-3.5 py-1.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
          />
        </div>
      </div>

      {/* Services Grid (responsive cards, vertical layout, strictly no horizontal row overflow) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB]">
            <Filter className="w-8 h-8 mx-auto text-[#667085]/40 mb-2" />
            <h4 className="text-sm font-bold text-[#142326]">No services match your search</h4>
            <p className="text-xs text-[#667085] mt-1 mb-4">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategoryId('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#142326] text-xs font-semibold rounded-xl hover:bg-[#F8F9FA]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredServices.map(srv => {
            const cat = categories.find(c => c.id === srv.categoryId);
            return <ServiceCard key={srv.id} service={srv} category={cat} />;
          })
        )}
      </div>
    </section>
  );
};
