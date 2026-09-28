import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCard } from './ServiceCard';
import { Section } from '../ui/Section';
import { Search, Filter, Sparkles } from 'lucide-react';

export const ServiceCatalog: React.FC = () => {
  const { services, categories, selectedApartment } = useApp();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(srv => {
    if (
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
    <Section id="services-catalog" bg="bg" className="border-b border-[#E4E0D8]">
      <div className="space-y-8 sm:space-y-12">
        {/* Title & Introduction */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
              Hyderabad Resident Catalog
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111111] leading-[1.08] tracking-tight">
              Verified doorstep services.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#5C5A56] max-w-md leading-relaxed">
            All services include hospital-grade hygiene, certified equipment, insurance coverage, and compliance with society quiet hours.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-2 bg-[#F0EDE7] rounded-3xl border border-[#E4E0D8]">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryId('all')}
              className={`h-10 px-5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategoryId === 'all'
                  ? 'bg-[#111111] text-[#FAF8F5] shadow-xs'
                  : 'bg-white text-[#5C5A56] hover:text-[#111111] border border-[#E4E0D8]'
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
                  className={`h-10 px-4.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#111111] text-[#FAF8F5] shadow-xs'
                      : 'bg-white text-[#5C5A56] hover:text-[#111111] border border-[#E4E0D8]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px] p-1">
            <Search className="w-4 h-4 text-[#5C5A56] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search services, e.g. car, deep clean..."
              className="w-full pl-10 pr-4 h-10 bg-white border border-[#E4E0D8] rounded-full text-xs sm:text-sm focus:outline-none focus:border-[#111111] text-[#111111] placeholder:text-[#5C5A56]/70"
            />
          </div>
        </div>

        {/* Services Grid (24px radius cards, hairline borders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-[24px] border border-[#E4E0D8] space-y-3">
              <Filter className="w-10 h-10 mx-auto text-[#5C5A56]/40" />
              <h4 className="font-display text-lg font-medium text-[#111111]">
                No services found
              </h4>
              <p className="text-xs sm:text-sm text-[#5C5A56] max-w-sm mx-auto">
                No services match your active filter. Try resetting your search query or category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategoryId('all');
                  setSearchQuery('');
                }}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#2596be] hover:underline"
              >
                Reset all filters →
              </button>
            </div>
          ) : (
            filteredServices.map(srv => {
              const cat = categories.find(c => c.id === srv.categoryId);
              return <ServiceCard key={srv.id} service={srv} category={cat} />;
            })
          )}
        </div>
      </div>
    </Section>
  );
};
