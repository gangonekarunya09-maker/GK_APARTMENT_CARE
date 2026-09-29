import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { ShieldCheck, Phone, Mail, MessageCircle, Clock, Building2, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FAF8F5] border-t border-[#E4E0D8] text-[#111111]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#E4E0D8]">
          {/* Col 1: Brand & Purpose (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" />
            <p className="text-xs sm:text-sm text-[#5C5A56] leading-relaxed max-w-sm">
              Home services, organized for your community. Coordinating verified doorstep care, pooled demand batches, and synchronized gate passes across Hyderabad apartment communities.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2E8B57] pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Society Gate Pass Pre-Approved Network</span>
            </div>
          </div>

          {/* Col 2: Platform Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#111111]">
              Platform &amp; Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#5C5A56]">
              <li>
                <button
                  onClick={() => handleNav('/')}
                  className="hover:text-[#111111] hover:underline transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/about')}
                  className="hover:text-[#111111] hover:underline transition-colors cursor-pointer"
                >
                  About GK Apartment Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/how-it-works')}
                  className="hover:text-[#111111] hover:underline transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/services')}
                  className="hover:text-[#111111] hover:underline transition-colors cursor-pointer"
                >
                  Services Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/rwa')}
                  className="hover:text-[#111111] hover:underline transition-colors cursor-pointer"
                >
                  RWA &amp; Society Partnerships
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/vendor')}
                  className="hover:text-[#111111] hover:underline transition-colors cursor-pointer"
                >
                  Service Provider Onboarding
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/contact')}
                  className="hover:text-[#111111] hover:underline transition-colors cursor-pointer"
                >
                  Contact Operations
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Policy (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#111111]">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#5C5A56]">
              <li>
                <button
                  onClick={() => handleNav('/privacy-policy')}
                  className="hover:text-[#111111] hover:underline transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/terms')}
                  className="hover:text-[#111111] hover:underline transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/refund-policy')}
                  className="hover:text-[#111111] hover:underline transition-colors cursor-pointer"
                >
                  Cancellation &amp; Refund
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/payment-info')}
                  className="hover:text-[#111111] hover:underline transition-colors cursor-pointer"
                >
                  Payment &amp; Billing Info
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Hyderabad Operations Support (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#111111]">
              Hyderabad Operations Hub
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-[#5C5A56]">
              <a
                href="https://wa.me/919494335848?text=Hi%20GK%20Apartment%20Care!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#2E8B57] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#2E8B57] shrink-0" />
                <span>WhatsApp: +91 94943 35848</span>
              </a>

              <a
                href="tel:+919494335848"
                className="flex items-center gap-2 hover:text-[#111111] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#2596be] shrink-0" />
                <span>Helpline: +91 94943 35848</span>
              </a>

              <a
                href="mailto:care@gkapartmentcare.com"
                className="flex items-center gap-2 hover:text-[#111111] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#2596be] shrink-0" />
                <span>care@gkapartmentcare.com</span>
              </a>

              <div className="pt-2 text-[11px] text-[#5C5A56]">
                Quiet Hours: 1:00 PM – 2:30 PM maintained across all towers.
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleNav('/admin/login')}
                  className="py-1.5 px-3 bg-white hover:bg-[#F0EDE7] text-[#111111] text-[11px] font-semibold rounded-full border border-[#E4E0D8] transition-colors cursor-pointer"
                >
                  Operator Portal Login →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Small-Print Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#5C5A56]">
          <div className="space-y-1 max-w-2xl leading-relaxed">
            <p>
              &copy; {new Date().getFullYear()} GK Apartment Care. All rights reserved. Operating across Cyberabad, Hitec City, Gachibowli, Kondapur, Tellapur, and Greater Hyderabad.
            </p>
            <p className="text-[11px] text-[#5C5A56]/80">
              Community service campaigns are coordinated directly with registered gated communities and resident associations. All on-site personnel are background-checked and carry synchronized gate passes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
