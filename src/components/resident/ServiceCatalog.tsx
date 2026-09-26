import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCard } from './ServiceCard';
import {
  Search,
  Filter,
} from 'lucide-react';
import { motion } from 'motion/react';

export const ServiceCatalog: React.FC = () => {
  const { services, categories, selectedApartment } = useApp();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter services available to the public website
  const filteredServices = services.filter(srv => {
    // If a service is strictly restricted to specific communities, check if this apartment is in the list
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
    <section id="services-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
