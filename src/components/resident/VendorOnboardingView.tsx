import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Wrench, ShieldCheck, CheckCircle2, ArrowRight, Phone, MessageSquare, Briefcase, Mail } from 'lucide-react';
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
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !contactPerson || !phone || submitting) return;

    setSubmitting(true);
    await submitVendorApplication({
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
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <Section bg="bg" className="min-h-[80vh]">
      <div className="space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="neutral" size="md" icon={<Wrench className="w-3.5 h-3.5 text-[#2596be]" />}>
            Service Provider Network
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-[#111111] leading-[1.02] tracking-tight text-balance">
            Become a GK Apartment Care service partner.
          </h1>
          <p className="text-base sm:text-lg text-[#5C5A56] max-w-2xl mx-auto leading-relaxed">
            Gain direct, pre-approved access to premium gated communities and high-volume Sunday bulk service batches across Hyderabad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Side: Benefits (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-white rounded-[24px] border border-[#E4E0D8] space-y-6 shadow-2xs">
              <h3 className="font-display text-xl font-medium text-[#111111]">
                Service Partner Advantages:
              </h3>

              <div className="space-y-5 text-sm text-[#5C5A56]">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#111111] block font-medium">Guaranteed Batch Volumes</strong>
                    Instead of crisscrossing town for 1 booking, service 15 to 30 flats or vehicles in a single gated society visit.
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#111111] block font-medium">Pre-Cleared Gate Passes</strong>
                    Our operations team arranges digital security approvals for all your verified technicians.
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#111111] block font-medium">Zero Commission Traps</strong>
                    Transparent partnership terms with timely direct bank/UPI disbursements.
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor Desk */}
            <div className="p-6 bg-[#F0EDE7] rounded-[24px] border border-[#E4E0D8] space-y-3">
              <div className="font-display font-medium text-sm text-[#111111]">
                Vendor Relations Desk:
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-[#5C5A56]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#2596be]" />
                  <span>+91 94943 35848</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#2596be]" />
                  <span>partners@gkapartmentcare.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form (7 cols) */}
          <div className="lg:col-span-7">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 bg-white rounded-[24px] border border-[#E4E0D8] text-center space-y-5 shadow-2xs"
              >
                <div className="w-16 h-16 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-medium text-[#111111]">
                  Partner Application Submitted!
                </h3>
                <p className="text-sm text-[#5C5A56] max-w-md mx-auto leading-relaxed">
                  Thank you for applying with <strong className="text-[#111111]">{businessName}</strong>. Our vendor coordinator will reach out for capability audit and onboarding verification.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setSubmitted(false);
                    setBusinessName('');
                    setContactPerson('');
                    setPhone('');
                    setServicesOffered('');
                  }}
                >
                  Submit Another Profile
                </Button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 sm:p-10 bg-white rounded-[24px] border border-[#E4E0D8] space-y-6 shadow-2xs"
              >
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-medium text-[#111111]">
                    Service Provider Application Form
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5A56] mt-1">
                    Enter your business and team details to start servicing gated community batches.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Business / Agency Name <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      placeholder="e.g. Apex Detailing / CleanPro Services"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Primary Contact Person <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={e => setContactPerson(e.target.value)}
                      placeholder="e.g. Rohan Sharma"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Phone Number <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. 98490 12345"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Service Category <span className="text-[#DC2626]">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111] cursor-pointer"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={e => setExperienceYears(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Services &amp; Equipment Offered
                    </label>
                    <input
                      type="text"
                      value={servicesOffered}
                      onChange={e => setServicesOffered(e.target.value)}
                      placeholder="e.g. Foam car wash, steam sofa extraction, deep tile descaling"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Preferred Service Areas in Hyderabad
                    </label>
                    <input
                      type="text"
                      value={serviceAreas}
                      onChange={e => setServiceAreas(e.target.value)}
                      placeholder="e.g. Hitec City, Gachibowli, Kondapur, Financial District"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    type="submit"
                    disabled={submitting}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {submitting ? 'Submitting Application…' : 'Submit Service Partner Application'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};
