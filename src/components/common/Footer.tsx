import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { Building2, ShieldCheck, Phone, Mail, MessageCircle, Heart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Footer: React.FC = () => {
  const { setResidentTab, navigate, setSocietySelectorOpen } = useApp();
  const [legalModal, setLegalModal] = useState<string | null>(null);

  return (
    <footer className="bg-white border-t border-[#E5E7EB] text-[#142326]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <Logo size="md" />
            <p className="text-xs text-[#667085] leading-relaxed">
              Hyper-local community services platform for Hyderabad gated societies. Pre-cleared gate passes and exclusive Sunday bulk pricing.
            </p>
            <div className="text-[11px] text-[#2E8B57] font-semibold flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MyGate &amp; NoBrokerHood Approved</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#142326]">
              Resident Services
            </h4>
            <ul className="space-y-2 text-xs text-[#667085]">
              <li>
                <button
                  onClick={() => setResidentTab('services')}
                  className="hover:text-[#2596be] transition-colors cursor-pointer"
                >
                  Explore Home &amp; Auto Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSocietySelectorOpen(true)}
                  className="hover:text-[#2596be] transition-colors cursor-pointer"
                >
                  Select / Switch Community
                </button>
              </li>
              <li>
                <button
                  onClick={() => setResidentTab('my-bookings')}
                  className="hover:text-[#2596be] transition-colors cursor-pointer"
                >
                  Track My Bookings
                </button>
              </li>
              <li>
                <button
                  onClick={() => setResidentTab('rwa')}
                  className="hover:text-[#2596be] transition-colors cursor-pointer"
                >
                  RWA Society Partnerships
                </button>
              </li>
              <li>
                <button
                  onClick={() => setResidentTab('vendor')}
                  className="hover:text-[#2596be] transition-colors cursor-pointer"
                >
                  Become a Service Partner
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Hyderabad Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#142326]">
              Local Operations
            </h4>
            <div className="space-y-2 text-xs text-[#667085]">
              <a
                href="https://wa.me/919849012345?text=Hi%20GK%20Apartment%20Care!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#2E8B57] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#2E8B57]" />
                <span>WhatsApp: +91 98490 12345</span>
              </a>

              <a
                href="tel:+919849012345"
                className="flex items-center gap-2 hover:text-[#2596be] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#2596be]" />
                <span>Phone: +91 98490 12345</span>
              </a>

              <a
                href="mailto:care@gkapartmentcare.com"
                className="flex items-center gap-2 hover:text-[#2596be] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#2596be]" />
                <span>care@gkapartmentcare.com</span>
              </a>

              <div className="text-[11px] text-[#667085] pt-1 leading-snug">
                Quiet Hours: 1:00 PM – 2:30 PM strictly maintained across all towers.
              </div>
            </div>
          </div>

          {/* Col 4: Operations Switch & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#142326]">
              Operations &amp; Security
            </h4>
            <p className="text-xs text-[#667085]">
              For facility directors and community coordinators:
            </p>
            <button
              onClick={() => navigate('/admin/login')}
              className="w-full py-2 px-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] text-[#142326] text-xs font-semibold rounded-xl border border-[#E5E7EB] transition-colors cursor-pointer text-center block"
            >
              Operator Portal Login
            </button>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#667085] pt-1">
              <button
                onClick={() => setLegalModal('privacy')}
                className="hover:text-[#2596be] underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setLegalModal('terms')}
                className="hover:text-[#2596be] underline cursor-pointer"
              >
                Terms of Service
              </button>
              <button
                onClick={() => setLegalModal('cancellation')}
                className="hover:text-[#2596be] underline cursor-pointer"
              >
                Cancellation Policy
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#667085]">
          <div>
            © {new Date().getFullYear()} GK APARTMENT CARE. Serving Hyderabad Gated Communities.
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Community-First Hyper-Local Operations</span>
          </div>
        </div>
      </div>

      {/* Legal Dialog */}
      <AnimatePresence>
        {legalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl max-w-md w-full p-5 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                <h3 className="text-base font-bold text-[#142326] capitalize">
                  {legalModal === 'cancellation'
                    ? 'Cancellation Policy'
                    : legalModal === 'privacy'
                    ? 'Privacy & Resident Data'
                    : 'Community Service Terms'}
                </h3>
                <button
                  onClick={() => setLegalModal(null)}
                  className="p-1 text-[#667085] hover:bg-[#F8F9FA] rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-[#667085] leading-relaxed space-y-2 max-h-60 overflow-y-auto">
                {legalModal === 'cancellation' ? (
                  <>
                    <p>• Free cancellation up to 2 hours prior to scheduled technician visit.</p>
                    <p>• If cancelled after technician has checked in at society security gate, a nominal ₹100 gate mobilization charge applies.</p>
                    <p>• Rescheduling is completely free anytime before technician entry.</p>
                  </>
                ) : legalModal === 'privacy' ? (
                  <>
                    <p>• Resident contact information is strictly used for service dispatch and security gate clearance pass generation.</p>
                    <p>• Data is never sold or shared with third-party telemarketers.</p>
                    <p>• Gate passes are securely synchronized through official society security systems (MyGate / NoBrokerHood).</p>
                  </>
                ) : (
                  <>
                    <p>• All services observe strict community bylaws including quiet hours from 1:00 PM to 2:30 PM.</p>
                    <p>• Bulk Sunday discounts apply when community demand quota is achieved.</p>
                    <p>• All technicians are verified and insured during service delivery.</p>
                  </>
                )}
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setLegalModal(null)}
                  className="px-4 py-2 bg-[#2596be] text-white text-xs font-bold rounded-xl"
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
