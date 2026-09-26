import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getPublicBaseUrl } from '../../lib/router';
import { MessageCircle, Copy, Check, Share2, Sparkles, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

export const WhatsAppCampaigns: React.FC = () => {
  const { apartments, services } = useApp();
  const [selectedAptId, setSelectedAptId] = useState<string>(apartments[0]?.id || '');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const selectedApt = apartments.find(a => a.id === selectedAptId) || apartments[0];
  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

  const serviceLink = `${getPublicBaseUrl()}/?society=${selectedApt?.slug || 'green-valley'}&service=${selectedService?.id || 'srv-car-wash'}`;

  const needed = selectedService
    ? Math.max(0, selectedService.minimumDemand - selectedService.currentDemand)
    : 3;

  const campaignMessage = `🚗 GK APARTMENT CARE — ${selectedApt?.name || 'Society Group'}

Exclusive Sunday Community Service Batch:
⭐ ${selectedService?.name || 'Doorstep Service'}

💰 PRICING:
• Individual Rate: ₹${selectedService?.normalPrice || 1000}
• Society Community Rate: ₹${selectedService?.communityPrice || 850}
• Sunday Bulk Discount: ₹${selectedService?.sundayBulkPrice || 700} (Save ₹${(selectedService?.normalPrice || 1000) - (selectedService?.sundayBulkPrice || 700)}!)

📊 PROGRESS:
${selectedService?.currentDemand || 17} of ${selectedService?.minimumDemand || 20} residents booked.
Only ${needed} more flats needed to lock bulk rate for the whole society!

✅ Pre-registered gate entry through ${selectedApt?.gateSecurityApp || 'MyGate'}.
✅ Quiet hours 1:00 PM – 2:30 PM respected.
✅ 100% background-verified staff.

Book in 30 seconds for your flat:
${serviceLink}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(campaignMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(campaignMessage)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#142326]">WhatsApp Community Campaigns</h2>
        <p className="text-xs text-[#667085] mt-0.5">
          Generate high-conversion WhatsApp announcements tailored to each gated community group
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#142326] border-b border-[#E5E7EB] pb-2">
            Campaign Parameters
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#142326] mb-1">
              Target Society / Community
            </label>
            <select
              value={selectedAptId}
              onChange={e => setSelectedAptId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#142326] cursor-pointer"
            >
              {apartments.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.area})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#142326] mb-1">
              Featured Service Offer
            </label>
            <select
              value={selectedServiceId}
              onChange={e => setSelectedServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#142326] cursor-pointer"
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} (Bulk: ₹{s.sundayBulkPrice})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] text-xs space-y-1">
            <div className="text-[#667085]">Deep-linked URL:</div>
            <div className="font-mono text-[11px] text-[#2596be] break-all">
              {serviceLink}
            </div>
          </div>
        </div>

        {/* Preview & Action Column */}
        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#142326] flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-[#2E8B57]" />
              <span>Prepared WhatsApp Message</span>
            </h3>
            <span className="text-[11px] text-[#667085]">Formatted for WhatsApp</span>
          </div>

          <div className="p-4 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] font-mono text-xs whitespace-pre-line text-[#142326] leading-relaxed max-h-[420px] overflow-y-auto">
            {campaignMessage}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 px-4 bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] text-[#142326] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#2E8B57]" />
                  <span className="text-[#2E8B57]">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#667085]" />
                  <span>Copy Message Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleLaunchWhatsApp}
              className="flex-1 py-3 px-4 bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open in WhatsApp &amp; Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
