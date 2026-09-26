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
  IndianRupee,
  CreditCard,
  ReceiptText,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProvidersManager: React.FC = () => {
  const { providers, categories, bookings, addProvider, updateProvider, setAdminSection, defaultCommissionRate } = useApp();
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
  const [commissionPercentage, setCommissionPercentage] = useState<number>(15);
  const [payoutUpiId, setPayoutUpiId] = useState('');
  const [payoutAccountName, setPayoutAccountName] = useState('');
  const [payoutAccountNumber, setPayoutAccountNumber] = useState('');
  const [payoutIfsc, setPayoutIfsc] = useState('');
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
    setCommissionPercentage(defaultCommissionRate || 15);
    setPayoutUpiId('');
    setPayoutAccountName('');
    setPayoutAccountNumber('');
    setPayoutIfsc('');
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
    setCommissionPercentage(p.commissionPercentage !== undefined ? p.commissionPercentage : (defaultCommissionRate || 15));
    setPayoutUpiId(p.payoutUpiId || '');
    setPayoutAccountName(p.payoutAccountName || '');
    setPayoutAccountNumber(p.payoutAccountNumber || '');
    setPayoutIfsc(p.payoutIfsc || '');
    setServiceAreas(p.serviceAreas.join(', '));
    setNotes(p.notes || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !contactPerson || !phone) return;

    const areas = serviceAreas.split(',').map(s => s.trim()).filter(Boolean);
    const comm = Number(commissionPercentage) >= 0 ? Number(commissionPercentage) : 15;

    if (editingProvider) {
      updateProvider(editingProvider.id, {
        businessName,
        contactPerson,
        phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
        whatsapp: whatsapp || phone.replace(/\D/g, ''),
        email,
        address,
        commissionPercentage: comm,
        payoutUpiId,
        payoutAccountName,
        payoutAccountNumber,
        payoutIfsc,
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
        commissionPercentage: comm,
        payoutUpiId,
        payoutAccountName,
        payoutAccountNumber,
        payoutIfsc,
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
              className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-4"
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

                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 text-[#667085] hover:text-[#2596be] hover:bg-[#F8F9FA] rounded-md cursor-pointer"
                    title="Edit Provider & Commission"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
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
                    href={`https://wa.me/${p.whatsapp.replace(/\D/g, '') || '919849012345'}?text=${encodeURIComponent(
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
