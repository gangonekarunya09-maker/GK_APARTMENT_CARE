import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { ShieldCheck, Phone, Mail, MessageCircle, X, ArrowRight, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Footer: React.FC = () => {
  const { setResidentTab, navigate } = useApp();
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'cancellation' | null>(null);

  return (
    <footer className="bg-[#FAF8F5] border-t border-[#E4E0D8] text-[#111111]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#E4E0D8]">
          {/* Col 1: Brand & Purpose (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-[#5C5A56] leading-relaxed max-w-sm">
              Hyper-local doorstep home and automobile services for gated communities across Hyderabad. Vetted professionals, synchronized gate passes, and quiet hour compliance.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2E8B57] pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Society Gate Pass Pre-Approved Network</span>
            </div>
          </div>

          {/* Col 2: Resident Services (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#111111]">
              Resident Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-[#5C5A56]">
              <li>
                <button
                  onClick={() => {
                    setResidentTab('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#111111] hover:underline transition-colors cursor-pointer"
                >
                  Services &amp; Rates Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setResidentTab('rwa');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#111111] hover:underline transition-colors cursor-pointer"
                >
                  RWA &amp; Society Partnerships
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setResidentTab('vendor');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#111111] hover:underline transition-colors cursor-pointer"
                >
                  Become a Verified Service Provider
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Hyderabad Operations Support (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#111111]">
              Hyderabad Operations Desk
            </h4>
            <div className="space-y-2.5 text-sm text-[#5C5A56]">
              <a
                href="https://wa.me/919494335848?text=Hi%20GK%20Apartment%20Care!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#2E8B57] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#2E8B57]" />
                <span>WhatsApp: +91 94943 35848</span>
              </a>

              <a
                href="tel:+919494335848"
                className="flex items-center gap-2 hover:text-[#111111] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#2596be]" />
                <span>Helpline: +91 94943 35848</span>
              </a>

              <a
                href="mailto:care@gkapartmentcare.com"
                className="flex items-center gap-2 hover:text-[#111111] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#2596be]" />
                <span>care@gkapartmentcare.com</span>
              </a>

              <p className="text-xs text-[#5C5A56] pt-1">
                Quiet Hours: 1:00 PM – 2:30 PM maintained across all towers.
              </p>
            </div>
          </div>

          {/* Col 4: Operations Portal (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#111111]">
              Operator Access
            </h4>
            <p className="text-xs text-[#5C5A56] leading-relaxed">
              For facility directors and community coordinators:
            </p>
            <button
              onClick={() => navigate('/admin/login')}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#F0EDE7] text-[#111111] text-xs font-semibold rounded-full border border-[#E4E0D8] transition-colors cursor-pointer text-center block shadow-2xs"
            >
              Operator Portal Login →
            </button>
          </div>
        </div>

        {/* Small-Print Editorial Disclaimer & Legal Footer */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-[#5C5A56]">
          <div className="max-w-2xl space-y-1.5 leading-relaxed">
            <p>
              &copy; {new Date().getFullYear()} GK Apartment Care. All rights reserved. Operating across Cyberabad, Hitec City, Gachibowli, Kondapur, and Greater Hyderabad.
            </p>
            <p className="text-[11px] text-[#5C5A56]/80">
              GK Apartment Care partners directly with Apartment Owners Associations (RWAs) to provide community-managed doorstep services. All service personnel are background-checked and carry digital gate passes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 shrink-0 text-xs">
            <button
              onClick={() => setLegalModal('privacy')}
              className="hover:text-[#111111] hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setLegalModal('terms')}
              className="hover:text-[#111111] hover:underline cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setLegalModal('cancellation')}
              className="hover:text-[#111111] hover:underline cursor-pointer"
            >
              Cancellation &amp; Refund
            </button>
          </div>
        </div>
      </div>

      {/* Legal Modals */}
      <AnimatePresence>
        {legalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] border border-[#E4E0D8] max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-[#E4E0D8] pb-4">
                <h3 className="font-display text-xl font-medium text-[#111111] capitalize">
                  {legalModal === 'privacy' && 'Privacy Policy'}
                  {legalModal === 'terms' && 'Terms of Service'}
                  {legalModal === 'cancellation' && 'Cancellation & Refund Policy'}
                </h3>
                <button
                  onClick={() => setLegalModal(null)}
                  className="w-8 h-8 rounded-full border border-[#E4E0D8] flex items-center justify-center text-[#5C5A56] hover:text-[#111111] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs sm:text-sm text-[#5C5A56] space-y-3 leading-relaxed">
                {legalModal === 'privacy' && (
                  <>
                    <p>
                      At GK Apartment Care, we respect your privacy. We collect resident names, flat numbers, and phone numbers solely to execute requested home and automobile services and to issue pre-cleared digital gate passes.
                    </p>
                    <p>
                      We never sell or share resident data with unauthorized third-party advertisers. All service records are stored securely.
                    </p>
                  </>
                )}

                {legalModal === 'terms' && (
                  <>
                    <p>
                      All service bookings are subject to gated community association bylaws. Technicians must be granted safe access to the flat/parking slot.
                    </p>
                    <p>
                      Quiet hours from 1:00 PM to 2:30 PM are strictly maintained across all partner societies.
                    </p>
                  </>
                )}

                {legalModal === 'cancellation' && (
                  <>
                    <p>
                      Residents may reschedule or cancel any regular or Sunday bulk booking at no penalty up to 2 hours prior to the scheduled service slot.
                    </p>
                    <p>
                      If you are unsatisfied with the service quality, notify our operations team within 24 hours for a complimentary re-service or full refund.
                    </p>
                  </>
                )}
              </div>

              <div className="pt-4 border-t border-[#E4E0D8] flex justify-end">
                <button
                  onClick={() => setLegalModal(null)}
                  className="px-6 py-2 bg-[#111111] text-[#FAF8F5] text-xs font-semibold rounded-full hover:bg-[#2596be] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};
