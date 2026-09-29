import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Search,
  Filter,
  Sparkles,
  Building2,
  Clock,
  CheckCircle2,
  Car,
  Wind,
  Droplets,
  Home,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, categories, navigate, setBookingModalService } = useApp();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(srv => {
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

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
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
    <div className="space-y-0">
      {/* Header */}
      <Section bg="bg" className="border-b border-[#E4E0D8] pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="neutral" size="md" icon={<Sparkles className="w-3.5 h-3.5 text-[#2596be]" />}>
            Service Catalog
          </Badge>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium text-[#111111] leading-[1.04] tracking-tight">
            Doorstep Home &amp; Auto Services
          </h1>

          <p className="text-base sm:text-xl text-[#5C5A56] max-w-2xl mx-auto leading-relaxed">
            Professional apartment cleaning, vehicle detailing, AC maintenance, and sanitization coordinated specifically for gated residential communities.
          </p>
        </div>
      </Section>

      {/* Community Access Explanation Notice */}
      <Section bg="surface" className="border-b border-[#E4E0D8] py-6 sm:py-8">
        <div className="max-w-4xl mx-auto p-5 sm:p-6 bg-[#FAF8F5] rounded-[24px] border border-[#E4E0D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-[#2596be]/10 flex items-center justify-center text-[#2596be] shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-display text-sm sm:text-base font-medium text-[#111111]">
                Accessing Services in Your Society
              </h4>
              <p className="text-xs sm:text-sm text-[#5C5A56] leading-relaxed">
                Services and bulk rates are activated through private community portal links (<code className="text-[#111111] font-mono">/c/:slug/:token</code>) shared via your society channels or RWA committee.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/rwa')}
            className="shrink-0"
          >
            Partner Your Society
          </Button>
        </div>
      </Section>

      {/* Catalog & Filter Grid */}
      <Section bg="bg" className="border-b border-[#E4E0D8]">
        <div className="space-y-8 sm:space-y-10">
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-2 bg-[#F0EDE7] rounded-3xl border border-[#E4E0D8]">
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

          {/* Cards Grid */}
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
                const normalPrice = srv.normalPrice;
                const communityPrice = srv.communityPrice;
                const savings = normalPrice > communityPrice ? normalPrice - communityPrice : 0;

                return (
                  <div
                    key={srv.id}
                    className="bg-white rounded-[24px] border border-[#E4E0D8] hover:border-[#111111]/30 transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between group shadow-2xs"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-[#F0EDE7] border border-[#E4E0D8] flex items-center justify-center shrink-0">
                            {getCategoryIcon(srv.iconName)}
                          </div>
                          <div>
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5C5A56]">
                              {cat?.name || 'Apartment Care'}
                            </span>
                            <h3 className="font-display text-lg sm:text-xl font-medium text-[#111111] leading-snug">
                              {srv.name}
                            </h3>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#5C5A56] line-clamp-2 leading-relaxed">
                        {srv.description}
                      </p>

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

                      <div className="flex items-center justify-between text-xs text-[#5C5A56] pt-1">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#2596be]" />
                          <span>{srv.durationMinutes} mins approx</span>
                        </div>
                        {srv.providerName && (
                          <div className="truncate max-w-[150px] text-right">
                            by <span className="font-medium text-[#111111]">{srv.providerName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 mt-4 border-t border-[#E4E0D8] space-y-2">
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => setBookingModalService(srv)}
                      >
                        Request Service · ₹{communityPrice}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Section>

      {/* CTA Footer */}
      <Section bg="inverse" className="text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-2xl sm:text-4xl font-medium text-[#FAF8F5]">
            Looking for customized services for your society?
          </h2>
          <p className="text-sm sm:text-base text-[#FAF8F5]/80 leading-relaxed">
            We work with resident associations to tailor service packages, quiet hour windows, and dedicated technician allocations.
          </p>
          <div className="flex justify-center pt-2">
            <Button
              variant="inverse"
              size="lg"
              onClick={() => navigate('/rwa')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Contact Community Partnerships
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};
