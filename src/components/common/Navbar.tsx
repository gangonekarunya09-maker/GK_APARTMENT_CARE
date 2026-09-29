import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import {
  Sparkles,
  Building2,
  Menu,
  X,
  ArrowRight,
  Phone,
  Info,
  HelpCircle,
  Mail,
  Shield,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { currentPath, navigate } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrent = (path: string) => {
    if (path === '/' && (currentPath === '/' || currentPath === '')) return true;
    return currentPath === path;
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
          onClick={() => handleNav('/')}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-lg transition-opacity hover:opacity-90 cursor-pointer shrink-0"
          aria-label="GK Apartment Care Home"
        >
          <Logo size="md" />
        </button>

        {/* Center: Main Public Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#5C5A56]">
          <button
            onClick={() => handleNav('/')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-[#111111] py-1 ${
              isCurrent('/')
                ? 'text-[#111111] font-semibold underline underline-offset-8 decoration-2 decoration-[#2596be]'
                : ''
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('/about')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-[#111111] py-1 ${
              isCurrent('/about')
                ? 'text-[#111111] font-semibold underline underline-offset-8 decoration-2 decoration-[#2596be]'
                : ''
            }`}
          >
            About
          </button>

          <button
            onClick={() => handleNav('/how-it-works')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-[#111111] py-1 ${
              isCurrent('/how-it-works')
                ? 'text-[#111111] font-semibold underline underline-offset-8 decoration-2 decoration-[#2596be]'
                : ''
            }`}
          >
            How It Works
          </button>

          <button
            onClick={() => handleNav('/services')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-[#111111] py-1 ${
              isCurrent('/services')
                ? 'text-[#111111] font-semibold underline underline-offset-8 decoration-2 decoration-[#2596be]'
                : ''
            }`}
          >
            Services
          </button>

          <button
            onClick={() => handleNav('/contact')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-[#111111] py-1 ${
              isCurrent('/contact')
                ? 'text-[#111111] font-semibold underline underline-offset-8 decoration-2 decoration-[#2596be]'
                : ''
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right: Actions Cluster */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/919494335848?text=Hi%20GK%20Apartment%20Care!"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C5A56] hover:text-[#111111] transition-colors py-2 px-3 rounded-full hover:bg-[#F0EDE7]"
            title="Helpline / WhatsApp"
          >
            <Phone className="w-3.5 h-3.5 text-[#2596be]" />
            <span>+91 94943 35848</span>
          </a>

          {/* Primary Action CTA Pill */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleNav('/services')}
            className="hidden md:inline-flex"
          >
            Explore Services
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
                onClick={() => handleNav('/')}
                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-medium transition-colors ${
                  isCurrent('/')
                    ? 'bg-white text-[#111111] font-bold border border-[#E4E0D8]'
                    : 'text-[#5C5A56] hover:bg-[#F0EDE7]'
                }`}
              >
                <span>Home</span>
                <ArrowRight className="w-4 h-4 text-[#5C5A56]" />
              </button>

              <button
                onClick={() => handleNav('/about')}
                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-medium transition-colors ${
                  isCurrent('/about')
                    ? 'bg-white text-[#111111] font-bold border border-[#E4E0D8]'
                    : 'text-[#5C5A56] hover:bg-[#F0EDE7]'
                }`}
              >
                <span>About</span>
                <ArrowRight className="w-4 h-4 text-[#5C5A56]" />
              </button>

              <button
                onClick={() => handleNav('/how-it-works')}
                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-medium transition-colors ${
                  isCurrent('/how-it-works')
                    ? 'bg-white text-[#111111] font-bold border border-[#E4E0D8]'
                    : 'text-[#5C5A56] hover:bg-[#F0EDE7]'
                }`}
              >
                <span>How It Works</span>
                <ArrowRight className="w-4 h-4 text-[#5C5A56]" />
              </button>

              <button
                onClick={() => handleNav('/services')}
                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-medium transition-colors ${
                  isCurrent('/services')
                    ? 'bg-white text-[#111111] font-bold border border-[#E4E0D8]'
                    : 'text-[#5C5A56] hover:bg-[#F0EDE7]'
                }`}
              >
                <span>Services Catalog</span>
                <ArrowRight className="w-4 h-4 text-[#5C5A56]" />
              </button>

              <button
                onClick={() => handleNav('/contact')}
                className={`flex items-center justify-between p-3 rounded-2xl text-sm font-medium transition-colors ${
                  isCurrent('/contact')
                    ? 'bg-white text-[#111111] font-bold border border-[#E4E0D8]'
                    : 'text-[#5C5A56] hover:bg-[#F0EDE7]'
                }`}
              >
                <span>Contact Operations</span>
                <ArrowRight className="w-4 h-4 text-[#5C5A56]" />
              </button>

              <div className="pt-2 border-t border-[#E4E0D8] space-y-1">
                <button
                  onClick={() => handleNav('/rwa')}
                  className="flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-[#5C5A56] hover:bg-[#F0EDE7] w-full"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#2596be]" />
                    <span>RWA Society Partnerships</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#5C5A56]" />
                </button>

                <button
                  onClick={() => handleNav('/vendor')}
                  className="flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-[#5C5A56] hover:bg-[#F0EDE7] w-full"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#2596be]" />
                    <span>Service Providers</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#5C5A56]" />
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleNav('/services')}
              >
                Explore Services
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
