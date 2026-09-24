import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceProvider } from '../../types';
import {
  Users,
  Plus,
  Search,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  CheckCircle2,
  MapPin,
  Edit2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProvidersManager: React.FC = () => {
  const { providers, categories, addProvider, updateProvider } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<ServiceProvider | null>(null);

  // Form states
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [serviceAreas, setServiceAreas] = useState('HITEC City, Kondapur, Gachibowli');
  const [notes, setNotes] = useState('');

  const filtered = providers.filter(
    p =>
      p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.serviceAreas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingProvider(null);
    setBusinessName('');
    setContactPerson('');
    setPhone('');
    setWhatsapp('');
    setEmail('');
    setAddress('');
    setServiceAreas('HITEC City, Kondapur, Gachibowli');
    setNotes('');
    setModalOpen(true);
  };

  const handleOpenEdit = (p: ServiceProvider) => {
    setEditingProvider(p);
    setBusinessName(p.businessName);
    setContactPerson(p.contactPerson);
    setPhone(p.phone);
    setWhatsapp(p.whatsapp);
    setEmail(p.email);
    setAddress(p.address);
    setServiceAreas(p.serviceAreas.join(', '));
    setNotes(p.notes || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !contactPerson || !phone) return;

    const areas = serviceAreas.split(',').map(s => s.trim()).filter(Boolean);

    if (editingProvider) {
      updateProvider(editingProvider.id, {
        businessName,
        contactPerson,
        phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
        whatsapp: whatsapp || phone.replace(/\D/g, ''),
        email,
        address,
        serviceAreas: areas,
        notes,
      });
    } else {
      addProvider({
        businessName,
        contactPerson,
        phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
        whatsapp: whatsapp || phone.replace(/\D/g, ''),
        email,
        categoryIds: ['cat-automotive'],
        servicesOffered: ['Community doorstep detailing & maintenance'],
        serviceAreas: areas,
        address: address || 'Hyderabad Hub',
        verificationStatus: 'verified',
        notes,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#142326]">Service Providers CRM</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Verified vendor network with direct WhatsApp and mobile dispatch actions
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Onboard Provider</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by provider, person, or area..."
          className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
        />
      </div>

      {/* Providers Cards Grid - No horizontal rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(p => (
          <div
            key={p.id}
            className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#142326]">{p.businessName}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#2E8B57]/10 text-[#2E8B57] rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#667085] mt-0.5">
                    Lead: <span className="text-[#142326]">{p.contactPerson}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-1.5 text-[#667085] hover:text-[#2596be] hover:bg-[#F8F9FA] rounded-md cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {/* Performance & areas */}
              <div className="bg-[#F8F9FA] p-3 rounded-xl border border-[#E5E7EB] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#667085]">Completed Society Jobs:</span>
                  <span className="font-bold text-[#142326] font-mono tabular-nums">
                    {p.completedJobs} orders
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#667085]">Resident Rating:</span>
                  <span className="font-bold text-[#142326] flex items-center gap-1 font-mono">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    {p.rating} / 5.0
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2 pt-1 border-t border-[#E5E7EB]">
                  <span className="text-[#667085] shrink-0">Service Areas:</span>
                  <span className="text-right text-[#142326] font-medium">
                    {p.serviceAreas.join(', ')}
                  </span>
                </div>
              </div>

              {p.notes && (
                <p className="text-[11px] text-[#667085] leading-relaxed italic">
                  Notes: {p.notes}
                </p>
              )}
            </div>

            {/* Direct Communication Action Buttons */}
            <div className="pt-3 border-t border-[#E5E7EB] grid grid-cols-2 gap-2">
              <a
                href={`tel:${p.phone}`}
                className="py-2.5 px-3 bg-white border border-[#E5E7EB] hover:border-[#2596be] text-[#142326] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#2596be]" />
                <span>Call Provider</span>
              </a>

              <a
                href={`https://wa.me/${p.whatsapp.replace(/\D/g, '') || '919849012345'}?text=${encodeURIComponent(
                  `Hi ${p.contactPerson}! Connecting from GK Apartment Care operations regarding upcoming society service schedules.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.98]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to add / edit provider */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <h3 className="text-base font-bold text-[#142326]">
                  {editingProvider ? 'Edit Provider Profile' : 'Onboard Service Provider'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-[#667085] hover:bg-[#F8F9FA] rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 max-h-[75vh]">
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Business / Company Name <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. Sparkle Auto Care HITEC"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Lead Contact Person <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={e => setContactPerson(e.target.value)}
                      placeholder="e.g. Suresh Varma"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Mobile Phone (+91) <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98495 11224"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="919849511224"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="partner@domain.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Covered Service Areas (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={serviceAreas}
                    onChange={e => setServiceAreas(e.target.value)}
                    placeholder="HITEC City, Banjara Hills, Gachibowli, Kondapur"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Operating Address / Workshop
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="e.g. Plot 44, Madhapur Main Road, Hyderabad"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Internal Verification Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Equipment owned, Aadhaar check status, crew size..."
                    className="w-full px-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#667085] hover:bg-[#F8F9FA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Save Provider
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
