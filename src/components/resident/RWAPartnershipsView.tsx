import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight, Users, Sparkles, Mail, Phone } from 'lucide-react';
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
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!societyName || !rwaContact || !phone || submitting) return;

    setSubmitting(true);
    await submitRWAApplication({
      societyName,
      rwaContact,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email,
      totalUnits: parseInt(totalUnits) || 100,
      area: area || 'Hyderabad',
      message,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <Section bg="bg" className="min-h-[80vh]">
      <div className="space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="neutral" size="md" icon={<Building2 className="w-3.5 h-3.5 text-[#2596be]" />}>
            RWA &amp; Facility Management Program
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-[#111111] leading-[1.02] tracking-tight text-balance">
            Partner your society with GK Apartment Care.
          </h1>
          <p className="text-base sm:text-lg text-[#5C5A56] max-w-2xl mx-auto leading-relaxed">
            Eliminate gate clutter, protect afternoon quiet hours, and unlock guaranteed wholesale rates for every resident in your community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Side: Benefits & Direct Desk (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-white rounded-[24px] border border-[#E4E0D8] space-y-6 shadow-2xs">
              <h3 className="font-display text-xl font-medium text-[#111111]">
                Why Management Committees Partner:
              </h3>

              <div className="space-y-5 text-sm text-[#5C5A56]">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#111111] block font-medium">Gate Security &amp; Passes</strong>
                    Pre-cleared digital technician batches. No unauthorized workers roaming elevators or towers.
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#111111] block font-medium">20% to 35% Bulk Savings</strong>
                    Organized tower pooling unlocks wholesale rates for sofa shampooing, deep cleaning, and AC service.
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#111111] block font-medium">Zero RWA Management Overhead</strong>
                    GK handles resident slotting, technician coordination, dispute resolution, and payment collection.
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Operations Desk Card */}
            <div className="p-6 bg-[#F0EDE7] rounded-[24px] border border-[#E4E0D8] space-y-3">
              <div className="font-display font-medium text-sm text-[#111111]">
                Direct Community Relations Desk:
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-[#5C5A56]">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#2596be]" />
                  <span>rwa@gkapartmentcare.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#2596be]" />
                  <span>Helpline: +91 94943 35848 (Hyderabad)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Application Form (7 cols) */}
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
                  Society Application Received!
                </h3>
                <p className="text-sm text-[#5C5A56] max-w-md mx-auto leading-relaxed">
                  Thank you for submitting on behalf of <strong className="text-[#111111]">{societyName}</strong>. Our Hyderabad community director will contact your committee within 24 hours to finalize your dedicated portal and launch bulk pricing.
                </p>
                <Button
                  variant="primary"
                  size="md"
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
                >
                  Submit Another Community
                </Button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 sm:p-10 bg-white rounded-[24px] border border-[#E4E0D8] space-y-6 shadow-2xs"
              >
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-medium text-[#111111]">
                    RWA Partnership Proposal Form
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5A56] mt-1">
                    Fill out the community profile below to set up your society's custom bulk discount portal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Apartment / Society Name <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={societyName}
                      onChange={e => setSocietyName(e.target.value)}
                      placeholder="e.g. My Home Bhooja / Aparna Zenith"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      RWA Contact Person / Role <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={rwaContact}
                      onChange={e => setRwaContact(e.target.value)}
                      placeholder="e.g. Rajeshwar V. (President)"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Contact Phone <span className="text-[#DC2626]">*</span>
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
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. rwa@myhomebhooja.com"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Total Flats / Units
                    </label>
                    <input
                      type="number"
                      value={totalUnits}
                      onChange={e => setTotalUnits(e.target.value)}
                      placeholder="e.g. 350"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Location / Neighborhood in Hyderabad
                    </label>
                    <input
                      type="text"
                      value={area}
                      onChange={e => setArea(e.target.value)}
                      placeholder="e.g. Hitec City / Gachibowli / Kondapur"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Specific Requirements or Notes
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="e.g. We want weekend car wash pooling and quarterly deep cleaning for 4 towers..."
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E4E0D8] rounded-2xl text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
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
                    {submitting ? 'Submitting Application…' : 'Submit Society Partnership Application'}
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
