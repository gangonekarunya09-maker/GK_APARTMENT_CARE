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
  X,
  Percent,
  CreditCard,
  ReceiptText,
  ArrowRight,
  Trash2,
  AlertCircle,
  Loader2,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_SERVICE_CATEGORIES = [
  { id: 'cat-auto-care', name: 'Auto Care' },
  { id: 'cat-cleaning', name: 'Deep Cleaning' },
  { id: 'cat-plumbing', name: 'Plumbing' },
  { id: 'cat-electrical', name: 'Electrical & AC' },
  { id: 'cat-painting', name: 'Painting & Waterproofing' },
  { id: 'cat-appliances', name: 'Appliance Repair' },
];

const SERVICE_SUGGESTIONS = [
  'Doorstep Waterless Car Wash',
  'Deep Interior Detailing',
  'Sofa & Carpet Shampooing',
  'Bathroom Deep Scrub & Sanitization',
  'Kitchen Chimney & Hob Degreasing',
  'AC Jet Wash Servicing',
  'Plumbing Leak Fix & Tap Replacement',
  'Switchboard & Inverter Repair',
];

export const ProvidersManager: React.FC = () => {
  const {
    providers,
    categories,
    bookings,
    addProvider,
    updateProvider,
    deleteProvider,
    setAdminSection,
    defaultCommissionRate
  } = useApp();

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
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(['cat-auto-care']);
  const [servicesOffered, setServicesOffered] = useState('Doorstep car wash, polishing, and interior detailing');
  const [commissionPercentage, setCommissionPercentage] = useState<number>(15);
  const [payoutUpiId, setPayoutUpiId] = useState('');
  const [payoutAccountName, setPayoutAccountName] = useState('');
  const [payoutAccountNumber, setPayoutAccountNumber] = useState('');
  const [payoutIfsc, setPayoutIfsc] = useState('');
  const [serviceAreas, setServiceAreas] = useState('HITEC City, Kondapur, Gachibowli');
  const [notes, setNotes] = useState('');

  // UI feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const availableCategories = categories && categories.length > 0
    ? categories
    : DEFAULT_SERVICE_CATEGORIES;

  const filtered = providers.filter(
    p =>
      (p.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.contactPerson || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.serviceAreas || []).some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const showNotification = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingProvider(null);
    setBusinessName('');
    setContactPerson('');
    setPhone('');
    setWhatsapp('');
    setEmail('');
    setAddress('Madhapur / Hyderabad Hub');
    setSelectedCategoryIds([availableCategories[0]?.id || 'cat-auto-care']);
    setServicesOffered('Community doorstep detailing & maintenance');
    setCommissionPercentage(defaultCommissionRate || 15);
    setPayoutUpiId('');
    setPayoutAccountName('');
    setPayoutAccountNumber('');
    setPayoutIfsc('');
    setServiceAreas('HITEC City, Kondapur, Gachibowli');
    setNotes('');
    setSaveError(null);
    setIsSaving(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: ServiceProvider) => {
    setEditingProvider(p);
    setBusinessName(p.businessName || '');
    setContactPerson(p.contactPerson || '');
    setPhone(p.phone || '');
    setWhatsapp(p.whatsapp || '');
    setEmail(p.email || '');
    setAddress(p.address || '');
    setSelectedCategoryIds(p.categoryIds && p.categoryIds.length > 0 ? p.categoryIds : [availableCategories[0]?.id || 'cat-auto-care']);
    setServicesOffered((p.servicesOffered || []).join(', '));
    setCommissionPercentage(p.commissionPercentage !== undefined ? p.commissionPercentage : (defaultCommissionRate || 15));
    setPayoutUpiId(p.payoutUpiId || '');
    setPayoutAccountName(p.payoutAccountName || '');
    setPayoutAccountNumber(p.payoutAccountNumber || '');
    setPayoutIfsc(p.payoutIfsc || '');
    setServiceAreas((p.serviceAreas || []).join(', '));
    setNotes(p.notes || '');
    setSaveError(null);
    setIsSaving(false);
    setModalOpen(true);
  };

  const handleToggleCategory = (catId: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(catId)
        ? (prev.length > 1 ? prev.filter(c => c !== catId) : prev)
        : [...prev, catId]
    );
  };

  const handleAddServiceSuggestion = (service: string) => {
    if (!servicesOffered) {
      setServicesOffered(service);
    } else if (!servicesOffered.includes(service)) {
      setServicesOffered(prev => `${prev}, ${service}`);
    }
  };

  const handleDelete = async (p: ServiceProvider) => {
    if (confirm(`Remove provider "${p.businessName}"? This action cannot be undone.`)) {
      try {
        await deleteProvider(p.id);
        showNotification(`Removed provider ${p.businessName}.`);
      } catch (e: any) {
        alert(e?.message || 'Could not delete provider.');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setSaveError('Please enter a business or company name.');
      return;
    }
    if (!contactPerson.trim()) {
      setSaveError('Please enter the lead contact person name.');
      return;
    }
    if (!phone.trim()) {
      setSaveError('Please provide a mobile phone number.');
      return;
    }

    setSaveError(null);
    setIsSaving(true);

    const areas = serviceAreas
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const servicesList = servicesOffered
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const comm = Number(commissionPercentage) >= 0 ? Number(commissionPercentage) : 15;
    const cleanPhone = phone.trim().startsWith('+91')
      ? phone.trim()
      : `+91 ${phone.trim().replace(/^\+?91\s*/, '')}`;
    const cleanWhatsapp = whatsapp.trim() || cleanPhone.replace(/\D/g, '');

    try {
      if (editingProvider) {
        const res = await updateProvider(editingProvider.id, {
          businessName: businessName.trim(),
          contactPerson: contactPerson.trim(),
          phone: cleanPhone,
          whatsapp: cleanWhatsapp,
          email: email.trim(),
          address: address.trim() || 'Hyderabad Hub',
          categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : ['cat-auto-care'],
          servicesOffered: servicesList.length > 0 ? servicesList : ['General Doorstep Services'],
          commissionPercentage: comm,
          payoutUpiId: payoutUpiId.trim(),
          payoutAccountName: payoutAccountName.trim(),
          payoutAccountNumber: payoutAccountNumber.trim(),
          payoutIfsc: payoutIfsc.trim().toUpperCase(),
          serviceAreas: areas.length > 0 ? areas : ['Hyderabad'],
          notes: notes.trim(),
        });

        if (res && res.success === false) {
          setSaveError(res.error || 'Failed to update provider profile.');
          setIsSaving(false);
          return;
        }

        setModalOpen(false);
        showNotification(`Successfully updated "${businessName.trim()}".`);
      } else {
        const res = await addProvider({
          businessName: businessName.trim(),
          contactPerson: contactPerson.trim(),
          phone: cleanPhone,
          whatsapp: cleanWhatsapp,
          email: email.trim(),
          categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : ['cat-auto-care'],
          servicesOffered: servicesList.length > 0 ? servicesList : ['General Doorstep Services'],
          serviceAreas: areas.length > 0 ? areas : ['Hyderabad'],
          address: address.trim() || 'Hyderabad Hub',
          commissionPercentage: comm,
          payoutUpiId: payoutUpiId.trim(),
          payoutAccountName: payoutAccountName.trim(),
          payoutAccountNumber: payoutAccountNumber.trim(),
          payoutIfsc: payoutIfsc.trim().toUpperCase(),
          verificationStatus: 'verified',
          notes: notes.trim(),
        });

        if (res && res.success === false) {
          setSaveError(res.error || 'Failed to onboard provider.');
          setIsSaving(false);
          return;
        }

        setModalOpen(false);
        showNotification(`Service provider "${businessName.trim()}" onboarded successfully!`);
      }
    } catch (err: any) {
      setSaveError(err?.message || 'An unexpected error occurred while saving the provider.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Success Notification Banner */}
      <AnimatePresence>
        {successNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 bg-[#2E8B57]/10 border border-[#2E8B57]/30 text-[#2E8B57] text-xs font-bold rounded-xl flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successNotice}</span>
            </div>
            <button
              onClick={() => setSuccessNotice(null)}
              className="text-xs hover:opacity-75 font-bold cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#142326]">Service Providers CRM</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Verified vendor network with direct WhatsApp dispatch, custom commission terms, and instant settlements
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer active:scale-95"
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
          placeholder="Search by provider, lead person, or area..."
          className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
        />
      </div>

      {/* Providers Cards Grid - Targeted by CSS selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quick-Add Card at beginning of the grid */}
        <button
          type="button"
          onClick={handleOpenAdd}
          className="p-6 bg-white hover:bg-[#FAF8F5] border-2 border-dashed border-[#2596be]/35 hover:border-[#2596be] rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all cursor-pointer group min-h-[260px] shadow-2xs"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#2596be]/10 group-hover:bg-[#2596be] text-[#2596be] group-hover:text-white flex items-center justify-center transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#142326] group-hover:text-[#2596be] transition-colors">
              + Onboard Service Provider
            </h4>
            <p className="text-[11px] text-[#667085] mt-1 max-w-xs leading-relaxed">
              Register a partner technician, detailing agency, or home service crew with custom GK commission and payout details.
            </p>
          </div>
          <span className="text-xs font-bold text-[#2596be] px-3.5 py-1.5 bg-[#2596be]/10 rounded-xl group-hover:bg-[#2596be] group-hover:text-white transition-colors">
            Add Provider Profile
          </span>
        </button>

        {filtered.map(p => {
          const providerBookings = bookings.filter(b => b.providerId === p.id);
          const totalJobsCount = p.completedJobs || providerBookings.filter(b => b.status === 'completed').length;
          const totalGrossRevenue = providerBookings.reduce((sum, b) => sum + (b.price || 0), 0);
          const commRate = p.commissionPercentage !== undefined ? p.commissionPercentage : (defaultCommissionRate || 15);
          const totalPlatformCommission = providerBookings.reduce(
            (sum, b) => sum + (b.commissionAmount ?? Math.round(((b.price || 0) * commRate) / 100)),
            0
          );
          const totalVendorPayoutDue = providerBookings.reduce(
            (sum, b) => sum + (b.vendorPayoutAmount ?? Math.max(0, (b.price || 0) - Math.round(((b.price || 0) * commRate) / 100))),
            0
          );
          const pendingUnsettledBookings = providerBookings.filter(b => b.status === 'completed' && b.commissionStatus !== 'settled');

          return (
            <div
              key={p.id}
              className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#2596be]/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-[#142326]">{p.businessName}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#2E8B57]/10 text-[#2E8B57] rounded flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#2596be]/10 text-[#2596be] border border-[#2596be]/20 rounded-md flex items-center gap-1">
                        <Percent className="w-2.5 h-2.5" />
                        {commRate}% GK Commission
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#667085] mt-0.5">
                      Lead: <span className="text-[#142326]">{p.contactPerson}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 text-[#667085] hover:text-[#2596be] hover:bg-[#F8F9FA] rounded-md cursor-pointer transition-colors"
                      title="Edit Provider & Commission"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="p-1.5 text-[#667085] hover:text-[#DC2626] hover:bg-[#DC2626]/10 rounded-md cursor-pointer transition-colors"
                      title="Delete Provider"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Commercial & Commission Summary */}
                <div className="grid grid-cols-2 gap-2 bg-[#F8F9FA] p-3 rounded-xl border border-[#E5E7EB] text-xs">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#667085]">Gross Volume</div>
                    <div className="text-sm font-extrabold text-[#142326] font-mono tabular-nums">
                      ₹{totalGrossRevenue.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#2596be]">GK Commission ({commRate}%)</div>
                    <div className="text-sm font-extrabold text-[#2596be] font-mono tabular-nums">
                      ₹{totalPlatformCommission.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="pt-1 border-t border-[#E5E7EB]">
                    <div className="text-[10px] uppercase font-bold text-[#667085]">Net Payable / Paid</div>
                    <div className="text-xs font-bold text-[#2E8B57] font-mono tabular-nums">
                      ₹{totalVendorPayoutDue.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="pt-1 border-t border-[#E5E7EB]">
                    <div className="text-[10px] uppercase font-bold text-[#667085]">Unsettled Orders</div>
                    <div className="text-xs font-bold font-mono tabular-nums">
                      {pendingUnsettledBookings.length > 0 ? (
                        <span className="text-[#F59E0B] font-bold">{pendingUnsettledBookings.length} pending payout</span>
                      ) : (
                        <span className="text-[#2E8B57]">All settled</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Performance & areas */}
                <div className="bg-[#F8F9FA] p-3 rounded-xl border border-[#E5E7EB] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#667085]">Completed Society Jobs:</span>
                    <span className="font-bold text-[#142326] font-mono tabular-nums">
                      {totalJobsCount} orders
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#667085]">Resident Rating:</span>
                    <span className="font-bold text-[#142326] flex items-center gap-1 font-mono">
                      <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                      {p.rating} / 5.0
                    </span>
                  </div>

                  {p.servicesOffered && p.servicesOffered.length > 0 && (
                    <div className="pt-1 border-t border-[#E5E7EB] flex items-start gap-1.5">
                      <Tag className="w-3 h-3 text-[#2596be] mt-0.5 shrink-0" />
                      <span className="text-[#142326] text-[11px] leading-relaxed">
                        {p.servicesOffered.join(' • ')}
                      </span>
                    </div>
                  )}

                  {p.payoutUpiId && (
                    <div className="flex items-center justify-between pt-1 border-t border-[#E5E7EB]">
                      <span className="text-[#667085] flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-[#2596be]" />
                        Payout UPI:
                      </span>
                      <span className="font-mono font-bold text-[#142326]">{p.payoutUpiId}</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2 pt-1 border-t border-[#E5E7EB]">
                    <span className="text-[#667085] shrink-0">Service Areas:</span>
                    <span className="text-right text-[#142326] font-medium">
                      {(p.serviceAreas || []).join(', ') || 'Hyderabad'}
                    </span>
                  </div>
                </div>

                {p.notes && (
                  <p className="text-[11px] text-[#667085] leading-relaxed italic">
                    Notes: {p.notes}
                  </p>
                )}
              </div>

              {/* Commission Ledger Link & Communication Action Buttons */}
              <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
                <button
                  onClick={() => setAdminSection('commissions')}
                  className="w-full py-2 px-3 bg-[#2596be]/10 hover:bg-[#2596be]/20 text-[#2596be] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ReceiptText className="w-3.5 h-3.5" />
                  <span>Manage Commission &amp; Settle Payout</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${p.phone}`}
                    className="py-2.5 px-3 bg-white border border-[#E5E7EB] hover:border-[#2596be] text-[#142326] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#2596be]" />
                    <span>Call Provider</span>
                  </a>

                  <a
                    href={`https://wa.me/${(p.whatsapp || p.phone || '').replace(/\D/g, '') || '919849012345'}?text=${encodeURIComponent(
                      `Hi ${p.contactPerson}! Connecting from GK Apartment Care operations regarding upcoming society service schedules & payouts.`
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
            </div>
          );
        })}
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
                <div>
                  <h3 className="text-base font-bold text-[#142326]">
                    {editingProvider ? 'Edit Provider Profile' : 'Onboard Service Provider'}
                  </h3>
                  <p className="text-xs text-[#667085] mt-0.5">
                    {editingProvider ? 'Update verified credentials and commercial details' : 'Register a new verified partner to assign to community campaigns'}
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-[#667085] hover:bg-[#F8F9FA] rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {saveError && (
                <div className="mx-5 mt-4 p-3 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-xl text-xs text-[#DC2626] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{saveError}</span>
                </div>
              )}

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
                      Email Address
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

                {/* Service Categories Multi-Select */}
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1.5">
                    Covered Service Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map(cat => {
                      const isSelected = selectedCategoryIds.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleToggleCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#2596be] text-white shadow-2xs'
                              : 'bg-[#F8F9FA] text-[#667085] border border-[#E5E7EB] hover:border-[#2596be]/40'
                          }`}
                        >
                          <span>{cat.name}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Services Offered with Quick Suggestions */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#142326]">
                      Services Offered (comma-separated)
                    </label>
                    <span className="text-[11px] text-[#667085]">Click suggestion to add</span>
                  </div>
                  <input
                    type="text"
                    value={servicesOffered}
                    onChange={e => setServicesOffered(e.target.value)}
                    placeholder="e.g. Doorstep Car Detailing, Foam Wash, Ceramic Coating"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SERVICE_SUGGESTIONS.slice(0, 4).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleAddServiceSuggestion(s)}
                        className="text-[10px] px-2 py-1 bg-[#F8F9FA] hover:bg-[#2596be]/10 hover:text-[#2596be] text-[#667085] rounded-lg border border-[#E5E7EB] transition-colors cursor-pointer"
                      >
                        + {s}
                      </button>
                    ))}
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

                {/* Commission & Commercial Terms */}
                <div className="p-3.5 bg-[#2596be]/5 border border-[#2596be]/20 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#142326] flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-[#2596be]" />
                      <span>GK Platform Commission Rate (%)</span>
                      <span className="text-[#DC2626]">*</span>
                    </label>
                    <span className="text-[11px] font-mono font-bold text-[#2596be]">
                      {commissionPercentage}% cut
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        required
                        value={commissionPercentage}
                        onChange={e => setCommissionPercentage(Number(e.target.value))}
                        className="w-full pl-3 pr-8 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#142326] focus:outline-none focus:border-[#2596be]"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#667085]">
                        %
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[10, 15, 18, 20, 25].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setCommissionPercentage(pct)}
                          className={`px-2 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                            commissionPercentage === pct
                              ? 'bg-[#2596be] text-white'
                              : 'bg-white border border-[#E5E7EB] text-[#667085] hover:border-[#2596be]/40'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-[#667085] leading-relaxed">
                    Set the percentage retained by GK Apartment Care from every customer booking completed by this provider. (Vendor receives remaining {100 - Number(commissionPercentage || 0)}%).
                  </p>
                </div>

                {/* Payout & Settlement Details */}
                <div className="p-3.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl space-y-3">
                  <div className="text-xs font-bold text-[#142326] flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#2596be]" />
                    <span>Vendor Payout &amp; Bank Details (Optional)</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#667085] mb-1">
                      Payout UPI ID (for instant settlement)
                    </label>
                    <input
                      type="text"
                      value={payoutUpiId}
                      onChange={e => setPayoutUpiId(e.target.value)}
                      placeholder="e.g. suresh@okhdfcbank or 9849511224@paytm"
                      className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#667085] mb-1">
                        Bank Account Name
                      </label>
                      <input
                        type="text"
                        value={payoutAccountName}
                        onChange={e => setPayoutAccountName(e.target.value)}
                        placeholder="e.g. Sparkle Auto Care"
                        className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#667085] mb-1">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        value={payoutAccountNumber}
                        onChange={e => setPayoutAccountNumber(e.target.value)}
                        placeholder="e.g. 5010023491823"
                        className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#667085] mb-1">
                      Bank IFSC Code
                    </label>
                    <input
                      type="text"
                      value={payoutIfsc}
                      onChange={e => setPayoutIfsc(e.target.value.toUpperCase())}
                      placeholder="e.g. HDFC0001824"
                      className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-mono focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>
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
                    disabled={isSaving}
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#667085] hover:bg-[#F8F9FA] cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50 active:scale-95"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSaving ? 'Saving Provider…' : editingProvider ? 'Update Provider' : 'Save Provider'}</span>
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
