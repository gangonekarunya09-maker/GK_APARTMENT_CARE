import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { X, MessageCircle, Copy, Check } from 'lucide-react';
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
        className="bg-white rounded-[24px] border border-[#E4E0D8] shadow-2xl max-w-lg w-full overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-[#E4E0D8] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-medium text-[#111111]">
                Share on Community WhatsApp
              </h3>
              <p className="text-xs text-[#5C5A56]">
                Share doorstep service details with your tower neighbors
              </p>
            </div>
          </div>
          <button
            onClick={() => setShareModalService(null)}
            className="w-8 h-8 rounded-full border border-[#E4E0D8] bg-white flex items-center justify-center text-[#5C5A56] hover:text-[#111111] hover:border-[#111111] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-[#111111]">
                Preview Message
              </span>
              <span className="text-[11px] text-[#2596be] font-medium">Ready to post</span>
            </div>
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] text-xs font-mono text-[#111111] whitespace-pre-line leading-relaxed max-h-52 overflow-y-auto">
              {messageText}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Button
              variant="secondary"
              size="md"
              onClick={handleCopy}
              icon={copied ? <Check className="w-4 h-4 text-[#2E8B57]" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied Link!' : 'Copy Message'}
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleWhatsAppRedirect}
              icon={<MessageCircle className="w-4 h-4" />}
              className="bg-[#2E8B57] hover:bg-[#257347] text-white"
            >
              Open WhatsApp
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
