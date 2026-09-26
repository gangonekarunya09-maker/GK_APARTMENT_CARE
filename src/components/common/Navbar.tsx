import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { Shield, Calendar, Sparkles, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const {
    residentTab,
    setResidentTab,
    bookings,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeBookingsCount = bookings.filter(
    b => b.status === 'received' || b.status === 'vendor_assigned' || b.status === 'in_progress'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand element */}
        <button
          onClick={() => {
            setResidentTab('services');
          }}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2596be] rounded-md transition-opacity hover:opacity-90 cursor-pointer"
          aria-label="GK Apartment Care Home"
        >
          <Logo size="md" />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#667085]">
          <button
            onClick={() => setResidentTab('services')}
            className={`hover:text-[#142326] transition-colors whitespace-nowrap cursor-pointer ${
              residentTab === 'services' ? 'text-[#2596be] font-semibold' : ''
            }`}
          >
            Services
          </button>

          <button
            onClick={() => setResidentTab('rwa')}
            className={`hover:text-[#142326] transition-colors whitespace-nowrap cursor-pointer ${
              residentTab === 'rwa' ? 'text-[#2596be] font-semibold' : ''
            }`}
          >
            RWA Partnerships
          </button>

          <button
            onClick={() => setResidentTab('vendor')}
            className={`hover:text-[#142326] transition-colors whitespace-nowrap cursor-pointer ${
              residentTab === 'vendor' ? 'text-[#2596be] font-semibold' : ''
            }`}
          >
            Vendor Partner
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#142326] hover:bg-[#F8F9FA] rounded-lg border border-[#E5E7EB] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden bg-white border-b border-[#E5E7EB] px-4 pt-3 pb-5 shadow-sm"
          >
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setResidentTab('services');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${
                  residentTab === 'services'
                    ? 'bg-[#2596be]/10 text-[#2596be] font-bold'
                    : 'text-[#142326] hover:bg-[#F8F9FA]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2596be]" />
                  <span>Explore Services</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#667085]" />
              </button>

              <button
                onClick={() => {
                  setResidentTab('rwa');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${
                  residentTab === 'rwa'
                    ? 'bg-[#2596be]/10 text-[#2596be] font-bold'
                    : 'text-[#142326] hover:bg-[#F8F9FA]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#2596be]" />
                  <span>RWA Partnerships</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#667085]" />
              </button>

              <button
                onClick={() => {
                  setResidentTab('vendor');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${
                  residentTab === 'vendor'
                    ? 'bg-[#2596be]/10 text-[#2596be] font-bold'
                    : 'text-[#142326] hover:bg-[#F8F9FA]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#2596be]" />
                  <span>Become a Service Partner</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#667085]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
