import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, MessageCircle, Copy, Check, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const WhatsAppShareModal: React.FC = () => {
  const { shareModalService, setShareModalService, selectedApartment, getCustomerPortalUrl, campaigns } = useApp();
  const [copied, setCopied] = useState(false);

  if (!shareModalService) return null;

  const societyName = selectedApartment?.name || 'our gated community';
  const portalUrl = selectedApartment ? getCustomerPortalUrl(selectedApartment) : window.location.href;

  const campaign = campaigns.find(
    c => c.apartmentId === selectedApartment?.id && c.serviceId === shareModalService.id
  );

  const normalPrice = campaign ? campaign.normalPrice : shareModalService.normalPrice;
  const communityPrice = campaign ? campaign.communityPrice : shareModalService.communityPrice;

  const messageText = `GK APARTMENT CARE

Hello ${societyName} residents 👋

Check out verified doorstep services available for our apartment:

${portalUrl}

Service: ${shareModalService.name}
Price: ₹${communityPrice} (Standard: ₹${normalPrice})

Doorstep service by verified professionals. Open the link above to schedule your booking!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleWhatsAppRedirect = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl max-w-lg w-full overflow-hidden"
      >
        <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#142326]">
                Share on Community WhatsApp Group
              </h3>
              <p className="text-xs text-[#667085]">
                Share doorstep service details with your neighbors
              </p>
            </div>
          </div>
          <button
            onClick={() => setShareModalService(null)}
            className="p-1.5 rounded-lg text-[#667085] hover:bg-[#F8F9FA] hover:text-[#142326] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#142326]">Preview WhatsApp Message</span>
              <span className="text-[11px] text-[#2596be] font-medium">Ready to share</span>
            </div>
            <div className="p-3.5 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] text-xs font-mono text-[#142326] whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
              {messageText}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleCopy}
              className="py-3 px-4 bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] text-[#142326] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#2E8B57]" />
                  <span className="text-[#2E8B57]">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#667085]" />
                  <span>Copy Message &amp; Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsAppRedirect}
              className="py-3 px-4 bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
