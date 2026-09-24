import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Search, MapPin, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SocietySelectorModal: React.FC = () => {
  const {
    apartments,
    selectedApartmentId,
    setSelectedApartmentId,
    societySelectorOpen,
    setSocietySelectorOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  if (!societySelectorOpen) return null;

  const filteredApartments = apartments.filter(
    apt =>
      apt.status === 'active' &&
      (apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = (id: string) => {
    setSelectedApartmentId(id);
    setSocietySelectorOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2596be]/10 text-[#2596be] flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#142326]">Select Your Community</h3>
                <p className="text-xs text-[#667085]">Exclusive community pricing for verified Hyderabad apartments</p>
              </div>
            </div>
            <button
              onClick={() => setSocietySelectorOpen(false)}
              className="p-1.5 rounded-lg text-[#667085] hover:bg-[#F8F9FA] hover:text-[#142326] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search box */}
          <div className="p-4 bg-[#F8F9FA] border-b border-[#E5E7EB]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search apartment name or Hyderabad locality..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                autoFocus
              />
            </div>
          </div>

          {/* Societies list - rendered as vertical cards without horizontal overflow */}
          <div className="p-4 overflow-y-auto space-y-2.5 max-h-[55vh]">
            {filteredApartments.length === 0 ? (
              <div className="py-8 text-center">
                <Building2 className="w-10 h-10 mx-auto text-[#667085]/40 mb-2" />
                <p className="text-sm font-semibold text-[#142326]">No community found</p>
                <p className="text-xs text-[#667085] mt-1">Want to bring GK Apartment Care to your society?</p>
                <button
                  onClick={() => {
                    setSocietySelectorOpen(false);
                  }}
                  className="mt-3 px-3 py-1.5 text-xs font-semibold text-[#2596be] border border-[#2596be] rounded-lg hover:bg-[#2596be]/5"
                >
                  Partner With Us
                </button>
              </div>
            ) : (
              filteredApartments.map(apt => {
                const isSelected = apt.id === selectedApartmentId;
                return (
                  <button
                    key={apt.id}
                    onClick={() => handleSelect(apt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-[#2596be] bg-[#2596be]/5'
                        : 'border-[#E5E7EB] bg-white hover:border-[#2596be]/40 hover:bg-[#F8F9FA]'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#142326]">{apt.name}</span>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#2596be] text-white rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#667085]">
                        <MapPin className="w-3.5 h-3.5 text-[#2596be] shrink-0" />
                        <span>{apt.address}, {apt.area}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#667085] pt-1">
                        <span>{apt.totalUnits} Units</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-[#2E8B57]">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{apt.gateSecurityApp} Approved</span>
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 mt-0.5">
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-[#2596be]" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-[#E5E7EB]" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-3.5 bg-[#F8F9FA] border-t border-[#E5E7EB] text-center text-xs text-[#667085]">
            Can&apos;t find your society? WhatsApp our team at <a href="https://wa.me/919849012345" target="_blank" rel="noopener noreferrer" className="text-[#2596be] font-semibold underline">+91 98490 12345</a> to onboard your community.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
