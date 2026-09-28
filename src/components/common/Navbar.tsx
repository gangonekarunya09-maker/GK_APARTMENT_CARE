import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { Sparkles, Shield, Building2, Calendar, Menu, X, ArrowRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { residentTab, setResidentTab, bookings, setBookingModalService, services } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeBookingsCount = bookings.filter(
    b => b.status === 'received' || b.status === 'vendor_assigned' || b.status === 'in_progress'
  ).length;

  const handleBookClick = () => {
    setResidentTab('services');
    const featured = services.find(s => s.id === 'srv-deep-home-clean') || services[0];
    if (featured) {
      setBookingModalService(featured);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E4E0D8] shadow-xs'
          : 'bg-[#FAF8F5] border-b border-[#E4E0D8]/60'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 h-18 sm:h-20 flex items-center justify-between gap-6">
        {/* Left: Brand Logo */}
        <button
          onClick={() => {
            setResidentTab('services');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-lg transition-opacity hover:opacity-90 cursor-pointer shrink-0"
          aria-label="GK Apartment Care Home"
        >
          <Logo size="md" />
        </button>

        {/* Center: Main Editorial Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-[#5C5A56]">
          <button
            onClick={() => {
              setResidentTab('services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-[#111111] py-1 ${
              residentTab === 'services'
                ? 'text-[#111111] font-semibold underline underline-offset-8 decoration-2 decoration-[#2596be]'
                : ''
            }`}
          >
            Services Catalog
          </button>

          <button
            onClick={() => {
              setResidentTab('rwa');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-[#111111] py-1 ${
              residentTab === 'rwa'
                ? 'text-[#111111] font-semibold underline underline-offset-8 decoration-2 decoration-[#2596be]'
                : ''
            }`}
          >
            RWA Society Partners
          </button>

          <button
            onClick={() => {
              setResidentTab('vendor');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-[#111111] py-1 ${
              residentTab === 'vendor'
                ? 'text-[#111111] font-semibold underline underline-offset-8 decoration-2 decoration-[#2596be]'
                : ''
            }`}
          >
            Service Providers
          </button>
        </nav>

        {/* Right: Actions Cluster */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+919494335848"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C5A56] hover:text-[#111111] transition-colors py-2 px-3 rounded-full hover:bg-[#F0EDE7]"
            title="Helpline"
          >
            <Phone className="w-3.5 h-3.5 text-[#2596be]" />
            <span>+91 94943 35848</span>
          </a>

          {/* Primary Viewport CTA Pill */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleBookClick}
            className="hidden md:inline-flex"
          >
            Book a Service
          </Button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#111111] hover:bg-[#F0EDE7] rounded-full border border-[#E4E0D8] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="lg:hidden bg-[#FAF8F5] border-b border-[#E4E0D8] px-5 pt-4 pb-6 space-y-3"
          >
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setResidentTab('services');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-medium transition-colors ${
                  residentTab === 'services'
                    ? 'bg-white text-[#111111] font-bold border border-[#E4E0D8]'
                    : 'text-[#5C5A56] hover:bg-[#F0EDE7]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#2596be]" />
                  <span>Services Catalog</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5C5A56]" />
              </button>

              <button
                onClick={() => {
                  setResidentTab('rwa');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-medium transition-colors ${
                  residentTab === 'rwa'
                    ? 'bg-white text-[#111111] font-bold border border-[#E4E0D8]'
                    : 'text-[#5C5A56] hover:bg-[#F0EDE7]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-[#2596be]" />
                  <span>RWA Society Partnerships</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5C5A56]" />
              </button>

              <button
                onClick={() => {
                  setResidentTab('vendor');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-medium transition-colors ${
                  residentTab === 'vendor'
                    ? 'bg-white text-[#111111] font-bold border border-[#E4E0D8]'
                    : 'text-[#5C5A56] hover:bg-[#F0EDE7]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-[#2596be]" />
                  <span>Become a Service Partner</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5C5A56]" />
              </button>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  handleBookClick();
                  setMobileMenuOpen(false);
                }}
              >
                Book a Service
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
