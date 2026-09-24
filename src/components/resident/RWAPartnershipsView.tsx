import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight, Users, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const RWAPartnershipsView: React.FC = () => {
  const { submitRWAApplication } = useApp();

  const [societyName, setSocietyName] = useState('');
  const [rwaContact, setRwaContact] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [totalUnits, setTotalUnits] = useState('');
  const [area, setArea] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!societyName || !rwaContact || !phone) return;

    submitRWAApplication({
      societyName,
      rwaContact,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email,
      totalUnits: parseInt(totalUnits) || 100,
      area: area || 'Hyderabad',
      message,
    });

    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2596be]/10 text-[#2596be] rounded-full text-xs font-bold">
          <Building2 className="w-3.5 h-3.5" />
          <span>RWA &amp; Facility Committee Program</span>
        </div>
        <h2 className="text-3xl font-extrabold text-[#142326]">
          Partner Your Community with GK Apartment Care
        </h2>
        <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
          Unlock exclusive bulk rates, synchronized doorstep visits, and zero gate clutter for your apartment society in Hyderabad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Side: Benefits */}
        <div className="md:col-span-2 space-y-4">
          <div className="p-5 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] space-y-3">
            <h3 className="text-sm font-bold text-[#142326]">Why RWA Boards Partner With Us:</h3>
            <div className="space-y-3 text-xs text-[#667085]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#142326] block">Gate Security Alignment</strong>
                  Pre-cleared technician batches via MyGate / NoBrokerHood. No random vendors wandering towers.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#142326] block">20% to 35% Resident Savings</strong>
                  Community pooling unlocks wholesale rates for car washing, sofa extraction, and AC servicing.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#142326] block">Zero Management Overhead</strong>
                  GK handles resident scheduling, vendor coordination, dispute resolution, and payment collection.
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] text-xs space-y-1.5">
            <div className="font-bold text-[#142326]">Direct Operations Desk:</div>
            <div className="text-[#667085]">Email: rwa@gkapartmentcare.com</div>
            <div className="text-[#667085]">Helpline: +91 98490 12345 (Hyderabad)</div>
          </div>
        </div>

        {/* Right Side: Partnership Application Form */}
        <div className="md:col-span-3">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#142326]">
                Application Received!
              </h3>
              <p className="text-xs text-[#667085] max-w-md mx-auto leading-relaxed">
                Thank you for reaching out on behalf of <strong className="text-[#142326]">{societyName}</strong>. Our community relations team will connect with your committee within 24 business hours to set up your dedicated portal.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSocietyName('');
                  setRwaContact('');
                  setPhone('');
                  setEmail('');
                  setTotalUnits('');
                  setArea('');
                  setMessage('');
                }}
                className="px-5 py-2.5 bg-[#2596be] text-white text-xs font-bold rounded-xl hover:bg-[#1e7ca0] transition-colors cursor-pointer"
              >
                Submit Another Request
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4"
            >
              <h3 className="text-base font-bold text-[#142326] border-b border-[#E5E7EB] pb-2">
                Society Details
              </h3>

              <div>
                <label className="block text-xs font-bold text-[#142326] mb-1">
                  Apartment / Society Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={societyName}
                  onChange={e => setSocietyName(e.target.value)}
                  placeholder="e.g. Prestige High Fields, Nanakramguda"
                  className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    RWA Contact Person <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={rwaContact}
                    onChange={e => setRwaContact(e.target.value)}
                    placeholder="e.g. Ramesh Varma (President)"
                    className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Contact Phone (+91) <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98490 12345"
                    className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="rwa@society.com"
                    className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Total Number of Flats / Units
                  </label>
                  <input
                    type="number"
                    value={totalUnits}
                    onChange={e => setTotalUnits(e.target.value)}
                    placeholder="e.g. 450"
                    className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142326] mb-1">
                  Locality / Area in Hyderabad
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  placeholder="e.g. Gachibowli, Kondapur, Madhapur, Manikonda"
                  className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142326] mb-1">
                  Community Needs or Message
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Specify services your residents need most (e.g. regular Sunday car washing, AC monsoon maintenance)..."
                  className="w-full px-3.5 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2596be] hover:bg-[#1e7ca0] text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Submit RWA Partnership Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
