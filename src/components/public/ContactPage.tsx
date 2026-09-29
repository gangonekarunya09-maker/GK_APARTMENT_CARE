import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Building2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { navigate } = useApp();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [society, setSociety] = useState('');
  const [subject, setSubject] = useState<'resident' | 'rwa' | 'vendor' | 'general'>('general');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    // Direct WhatsApp redirect or confirmation
    const waText = encodeURIComponent(
      `Hi GK Apartment Care! My name is ${name.trim()} (${phone.trim()})${
        society.trim() ? ` from ${society.trim()}` : ''
      }.\nTopic: ${subject.toUpperCase()}\nMessage: ${message.trim()}`
    );
    window.open(`https://wa.me/919494335848?text=${waText}`, '_blank');
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-0">
      {/* Header */}
      <Section bg="bg" className="border-b border-[#E4E0D8] pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="neutral" size="md" icon={<Mail className="w-3.5 h-3.5 text-[#2596be]" />}>
            Contact Operations
          </Badge>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium text-[#111111] leading-[1.04] tracking-tight">
            Get in Touch With GK Apartment Care
          </h1>

          <p className="text-base sm:text-xl text-[#5C5A56] max-w-2xl mx-auto leading-relaxed">
            Have questions about an active campaign, want to onboard your apartment community, or interested in becoming a service provider partner?
          </p>
        </div>
      </Section>

      {/* Main Grid: Direct Channels & Message Form */}
      <Section bg="surface" className="border-b border-[#E4E0D8]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Direct Operations Desk Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#2596be]">
                Operations Desk
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#111111]">
                Hyderabad Support Hub
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5A56] leading-relaxed">
                Our central operations desk coordinates doorstep schedules, technician badges, and society gate clearances across Cyberabad and Greater Hyderabad.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <a
                href="https://wa.me/919494335848?text=Hi%20GK%20Apartment%20Care!"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] flex items-center gap-3.5 hover:border-[#25D366] transition-colors group block"
              >
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#5C5A56]">WhatsApp Support (Fastest)</div>
                  <div className="font-medium text-sm text-[#111111] group-hover:text-[#25D366]">
                    +91 94943 35848
                  </div>
                </div>
              </a>

              <a
                href="tel:+919494335848"
                className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] flex items-center gap-3.5 hover:border-[#2596be] transition-colors group block"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2596be]/10 text-[#2596be] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#5C5A56]">Helpline Phone</div>
                  <div className="font-medium text-sm text-[#111111] group-hover:text-[#2596be]">
                    +91 94943 35848
                  </div>
                </div>
              </a>

              <a
                href="mailto:care@gkapartmentcare.com"
                className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] flex items-center gap-3.5 hover:border-[#2596be] transition-colors group block"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2596be]/10 text-[#2596be] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#5C5A56]">Email Inquiries</div>
                  <div className="font-medium text-sm text-[#111111] group-hover:text-[#2596be]">
                    care@gkapartmentcare.com
                  </div>
                </div>
              </a>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F0EDE7] text-[#111111] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#2596be]" />
                </div>
                <div>
                  <div className="text-xs text-[#5C5A56]">Primary Service Region</div>
                  <div className="font-medium text-xs sm:text-sm text-[#111111]">
                    Hitec City, Gachibowli, Kondapur, Tellapur &amp; Greater Hyderabad
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4E0D8] flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F0EDE7] text-[#111111] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#2596be]" />
                </div>
                <div>
                  <div className="text-xs text-[#5C5A56]">Operational Rest Hours</div>
                  <div className="font-medium text-xs sm:text-sm text-[#111111]">
                    1:00 PM – 2:30 PM Quiet Hours Enforced
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 rounded-[24px] border border-[#E4E0D8] space-y-5">
            <div>
              <h3 className="font-display text-xl font-medium text-[#111111]">
                Send a Message to Operations
              </h3>
              <p className="text-xs sm:text-sm text-[#5C5A56] mt-1">
                Fill in your details below. We typically respond within 2 to 4 hours.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 bg-white rounded-2xl border border-[#2E8B57]/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-display text-lg font-medium text-[#111111]">
                  Message Dispatched!
                </h4>
                <p className="text-xs text-[#5C5A56] leading-relaxed max-w-sm mx-auto">
                  Thank you for reaching out. Our operations coordinator will connect with you on WhatsApp / Phone shortly.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setFormSubmitted(false)}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                    Your Name <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Anand Sharma"
                    className="w-full px-4 py-2.5 bg-white border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Phone Number <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="98490 12345"
                      className="w-full px-4 py-2.5 bg-white border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Apartment / Society Name
                    </label>
                    <input
                      type="text"
                      value={society}
                      onChange={e => setSociety(e.target.value)}
                      placeholder="e.g. My Home Bhooja"
                      className="w-full px-4 py-2.5 bg-white border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-white border border-[#E4E0D8] rounded-full text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                  >
                    <option value="general">General Question</option>
                    <option value="resident">Resident Campaign Support</option>
                    <option value="rwa">RWA / Society Onboarding</option>
                    <option value="vendor">Service Provider Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                    Message <span className="text-[#DC2626]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tell us what services or society you're inquiring about..."
                    className="w-full px-4 py-2.5 bg-white border border-[#E4E0D8] rounded-2xl text-sm focus:outline-none focus:border-[#111111] text-[#111111]"
                  />
                </div>

                <div className="pt-2">
                  <Button variant="primary" size="md" fullWidth type="submit">
                    Send Message to Desk
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Section>

      {/* Quick Pathway Cards */}
      <Section bg="surface-alt">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <h3 className="font-display text-xl sm:text-2xl font-medium text-[#111111]">
            Looking for specific onboarding flows?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-[24px] border border-[#E4E0D8] space-y-3 text-left">
              <Building2 className="w-6 h-6 text-[#2596be]" />
              <h4 className="font-display text-lg font-medium text-[#111111]">
                Apartment RWA &amp; Facility Boards
              </h4>
              <p className="text-xs text-[#5C5A56] leading-relaxed">
                Set up a dedicated portal for your gated community with custom campaign schedules and quiet hour enforcement.
              </p>
              <button
                onClick={() => navigate('/rwa')}
                className="text-xs font-semibold text-[#2596be] hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
              >
                Go to RWA Application Form →
              </button>
            </div>

            <div className="p-6 bg-white rounded-[24px] border border-[#E4E0D8] space-y-3 text-left">
              <ShieldCheck className="w-6 h-6 text-[#2596be]" />
              <h4 className="font-display text-lg font-medium text-[#111111]">
                Service Providers &amp; Vendors
              </h4>
              <p className="text-xs text-[#5C5A56] leading-relaxed">
                Serve aggregated apartment clusters across Hyderabad without individual travel downtime.
              </p>
              <button
                onClick={() => navigate('/vendor')}
                className="text-xs font-semibold text-[#2596be] hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
              >
                Go to Provider Application Form →
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
