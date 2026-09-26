import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CheckCircle2, ArrowRight, Wrench, Briefcase, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const VendorOnboardingView: React.FC = () => {
  const { categories, submitVendorApplication } = useApp();

  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Automotive');
  const [servicesOffered, setServicesOffered] = useState('');
  const [serviceAreas, setServiceAreas] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [pricingNotes, setPricingNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !contactPerson || !phone) return;

    submitVendorApplication({
      businessName,
      contactPerson,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      whatsapp: whatsapp || phone,
      email,
      category,
      servicesOffered,
      serviceAreas,
      experienceYears: parseInt(experienceYears) || 3,
      pricingNotes,
    });

    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2596be]/10 text-[#2596be] rounded-full text-xs font-bold">
          <Wrench className="w-3.5 h-3.5" />
          <span>Service Provider Network</span>
        </div>
        <h2 className="text-3xl font-extrabold text-[#142326]">
          Become a GK Apartment Care Service Partner
        </h2>
        <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
          Gain direct, pre-approved access to premium gated communities and high-volume Sunday bulk service batches across Hyderabad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Side: Partner Perks */}
        <div className="md:col-span-2 space-y-4">
          <div className="p-5 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] space-y-3">
            <h3 className="text-sm font-bold text-[#142326]">Partner Benefits:</h3>
            <div className="space-y-3 text-xs text-[#667085]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#142326] block">Guaranteed Bulk Volumes</strong>
                  Instead of driving across town for 1 car, service 15 to 25 cars or flats in one single gated society visit.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#142326] block">Pre-Cleared Gate Passes</strong>
                  Our operations team manages digital gate passes and security pre-approvals for all your technicians.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#142326] block">Zero Commission Trap</strong>
                  Transparent community volume contracts with timely direct payouts.
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] text-xs space-y-2">
            <div className="font-bold text-[#142326]">Vendor Helpdesk:</div>
            <div className="flex items-center gap-1.5 text-[#667085]">
              <Phone className="w-3.5 h-3.5 text-[#2596be]" />
              <span>+91 98495 11224</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#667085]">
              <MessageSquare className="w-3.5 h-3.5 text-[#2E8B57]" />
              <span>partners@gkapartmentcare.com</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
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
                Application Submitted for Verification!
              </h3>
              <p className="text-xs text-[#667085] max-w-md mx-auto leading-relaxed">
                Thank you for applying with <strong className="text-[#142326]">{businessName}</strong>. Our vendor relations manager will contact you for background verification and equipment audit.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setBusinessName('');
                  setContactPerson('');
                  setPhone('');
                }}
                className="px-5 py-2.5 bg-[#2596be] text-white text-xs font-bold rounded-xl hover:bg-[#1e7ca0] transition-colors cursor-pointer"
              >
                Submit Another Application
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4"
            >
              <h3 className="text-base font-bold text-[#142326] border-b border-[#E5E7EB] pb-2">
                Business &amp; Capability Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Business / Agency Name <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Auto Detailing"
                    className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Lead Contact Person <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Phone (+91) <span className="text-[#DC2626]">*</span>
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
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Same as phone or WhatsApp"
                    className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Primary Service Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Years of Field Experience
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={e => setExperienceYears(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142326] mb-1">
                  Specific Services Offered
                </label>
                <input
                  type="text"
                  value={servicesOffered}
                  onChange={e => setServicesOffered(e.target.value)}
                  placeholder="e.g. Foam car wash, interior vacuuming, sofa shampooing"
                  className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142326] mb-1">
                  Covered Areas / Hubs in Hyderabad
                </label>
                <input
                  type="text"
                  value={serviceAreas}
                  onChange={e => setServiceAreas(e.target.value)}
                  placeholder="e.g. HITEC City, Kondapur, Gachibowli, Banjara Hills"
                  className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142326] mb-1">
                  Equipment &amp; Pricing Notes
                </label>
                <textarea
                  rows={2}
                  value={pricingNotes}
                  onChange={e => setPricingNotes(e.target.value)}
                  placeholder="e.g. Own high pressure washer, vacuum extraction machine, 4 staff members..."
                  className="w-full px-3.5 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] focus:bg-white text-[#142326]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2596be] hover:bg-[#1e7ca0] text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Submit for Partner Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
