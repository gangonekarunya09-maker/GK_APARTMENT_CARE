import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, ServiceProvider, CommissionStatus } from '../../types';
import {
  IndianRupee,
  Percent,
  Wallet,
  ArrowUpRight,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  CreditCard,
  Building2,
  User,
  Phone,
  MessageSquare,
  Receipt,
  ArrowRight,
  Calendar,
  Layers,
  Sparkles,
  Plus,
  X,
  Send,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CommissionsManager: React.FC = () => {
  const {
    bookings,
    providers,
    apartments,
    defaultCommissionRate,
    setDefaultCommissionRate,
    settlements,
    createSettlement,
    updateBookingCommission,
    setAdminSection,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'providers' | 'ledger' | 'settlements' | 'settings'>('providers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProviderFilter, setSelectedProviderFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Rate config state
  const [newDefaultRate, setNewDefaultRate] = useState<number>(defaultCommissionRate || 15);
  const [rateSavedMessage, setRateSavedMessage] = useState(false);

  // Calculator Sandbox state
  const [calcGross, setCalcGross] = useState<number>(1200);
  const [calcRate, setCalcRate] = useState<number>(defaultCommissionRate || 15);

  // Settlement Modal State
  const [settlementModalOpen, setSettlementModalOpen] = useState(false);
  const [settleProviderId, setSettleProviderId] = useState<string>('');
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank_transfer' | 'cash' | 'other'>('upi');
  const [transactionRef, setTransactionRef] = useState('');
  const [settleNotes, setSettleNotes] = useState('');
  const [settleSuccessMsg, setSettleSuccessMsg] = useState<string | null>(null);

  // Edit single booking commission modal state
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editBookingRate, setEditBookingRate] = useState<number>(15);
  const [editBookingStatus, setEditBookingStatus] = useState<CommissionStatus>('pending');
  const [editBookingRef, setEditBookingRef] = useState('');

  // Overall Financial Calculations
  const metrics = useMemo(() => {
    let totalGrossGMV = 0;
    let totalGKCommission = 0;
    let totalVendorPayouts = 0;
    let pendingCommissionAmount = 0;
    let pendingPayoutAmount = 0;
    let pendingCount = 0;
    let settledCount = 0;

    bookings.forEach(b => {
      const gross = b.price || 0;
      totalGrossGMV += gross;

      const rate = b.commissionRate ?? (providers.find(p => p.id === b.providerId)?.commissionPercentage ?? defaultCommissionRate ?? 15);
      const comm = b.commissionAmount ?? Math.round((gross * rate) / 100);
      const payout = b.vendorPayoutAmount ?? Math.max(0, gross - comm);

      totalGKCommission += comm;
      totalVendorPayouts += payout;

      if (b.commissionStatus === 'settled') {
        settledCount++;
      } else {
        pendingCount++;
        pendingCommissionAmount += comm;
        pendingPayoutAmount += payout;
      }
    });

    const effectiveAvgRate = totalGrossGMV > 0 ? ((totalGKCommission / totalGrossGMV) * 100).toFixed(1) : (defaultCommissionRate || 15);

    return {
      totalGrossGMV,
      totalGKCommission,
      totalVendorPayouts,
      pendingCommissionAmount,
      pendingPayoutAmount,
      pendingCount,
      settledCount,
      effectiveAvgRate,
    };
  }, [bookings, providers, defaultCommissionRate]);

  // Provider Summaries
  const providerSummaries = useMemo(() => {
    return providers.map(p => {
      const pBookings = bookings.filter(b => b.providerId === p.id);
      const gross = pBookings.reduce((sum, b) => sum + (b.price || 0), 0);
      const rate = p.commissionPercentage !== undefined ? p.commissionPercentage : (defaultCommissionRate || 15);
      const gkCommission = pBookings.reduce(
        (sum, b) => sum + (b.commissionAmount ?? Math.round(((b.price || 0) * rate) / 100)),
        0
      );
      const netPayable = pBookings.reduce(
        (sum, b) => sum + (b.vendorPayoutAmount ?? Math.max(0, (b.price || 0) - Math.round(((b.price || 0) * rate) / 100))),
        0
      );
      const completedUnsettled = pBookings.filter(b => b.status === 'completed' && b.commissionStatus !== 'settled');
      const pendingPayout = completedUnsettled.reduce(
        (sum, b) => sum + (b.vendorPayoutAmount ?? Math.max(0, (b.price || 0) - Math.round(((b.price || 0) * rate) / 100))),
        0
      );
      const settledTotal = pBookings
        .filter(b => b.commissionStatus === 'settled')
        .reduce(
          (sum, b) => sum + (b.vendorPayoutAmount ?? Math.max(0, (b.price || 0) - Math.round(((b.price || 0) * rate) / 100))),
          0
        );

      return {
        provider: p,
        totalOrders: pBookings.length,
        completedOrders: pBookings.filter(b => b.status === 'completed').length,
        gross,
        rate,
        gkCommission,
        netPayable,
        pendingPayout,
        settledTotal,
        unsettledBookings: completedUnsettled,
      };
    });
  }, [providers, bookings, defaultCommissionRate]);

  // Filtered Bookings for Ledger
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (selectedProviderFilter !== 'all' && b.providerId !== selectedProviderFilter) return false;
      if (selectedStatusFilter !== 'all') {
        const commStatus = b.commissionStatus || 'pending';
        if (commStatus !== selectedStatusFilter) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesNumber = b.bookingNumber.toLowerCase().includes(q);
        const matchesResident = b.residentName.toLowerCase().includes(q);
        const matchesFlat = b.flatNumber.toLowerCase().includes(q);
        const matchesSociety = b.apartmentName.toLowerCase().includes(q);
        const matchesService = b.serviceName.toLowerCase().includes(q);
        const matchesProv = (b.providerName || '').toLowerCase().includes(q);
        const matchesRef = (b.settlementReference || '').toLowerCase().includes(q);
        if (!matchesNumber && !matchesResident && !matchesFlat && !matchesSociety && !matchesService && !matchesProv && !matchesRef) {
          return false;
        }
      }
      return true;
    });
  }, [bookings, selectedProviderFilter, selectedStatusFilter, searchQuery]);

  // Handle open settlement modal
  const handleOpenSettlementModal = (providerId?: string) => {
    const targetProvId = providerId || (providers[0]?.id ?? '');
    setSettleProviderId(targetProvId);
    setSettleSuccessMsg(null);
    setTransactionRef('');
    setSettleNotes('');
    setPaymentMethod('upi');

    // Auto-select completed unsettled bookings for this provider
    const unsettled = bookings
      .filter(b => b.providerId === targetProvId && b.status === 'completed' && b.commissionStatus !== 'settled')
      .map(b => b.id);
    setSelectedBookingIds(unsettled);
    setSettlementModalOpen(true);
  };

  const handleProviderSelectInModal = (pId: string) => {
    setSettleProviderId(pId);
    const unsettled = bookings
      .filter(b => b.providerId === pId && b.status === 'completed' && b.commissionStatus !== 'settled')
      .map(b => b.id);
    setSelectedBookingIds(unsettled);
  };

  const handleToggleBookingSelection = (bId: string) => {
    setSelectedBookingIds(prev =>
      prev.includes(bId) ? prev.filter(id => id !== bId) : [...prev, bId]
    );
  };

  const handleConfirmSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settleProviderId || selectedBookingIds.length === 0) return;
    if (!transactionRef.trim()) {
      alert('Please enter a Transaction Reference or UTR Number (e.g. UPI Ref / Bank UTR / Cash voucher #)');
      return;
    }

    const res = await createSettlement({
      providerId: settleProviderId,
      bookingIds: selectedBookingIds,
      paymentMethod,
      transactionReference: transactionRef.trim(),
      notes: settleNotes.trim() || undefined,
    });

    if (res.success && res.data) {
      setSettleSuccessMsg(`Settlement ${res.data.settlementNumber} recorded successfully!`);
      setTimeout(() => {
        setSettlementModalOpen(false);
      }, 1500);
    } else {
      alert(res.error || 'Failed to record settlement.');
    }
  };

  // Generate WhatsApp Payout Statement
  const generateWhatsAppStatement = (summary: (typeof providerSummaries)[0]) => {
    const p = summary.provider;
    const msg = `🧾 *GK APARTMENT CARE — COMMISSION & PAYOUT ADVICE*

To: *${p.businessName}* (${p.contactPerson})
Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}

📊 *COMMERCIAL SUMMARY:*
• Total Orders Handled: ${summary.totalOrders}
• Completed Jobs: ${summary.completedOrders}
• Total Gross Booking Value: ₹${summary.gross.toLocaleString('en-IN')}
• GK Platform Commission Rate: ${summary.rate}%
• GK Platform Fee: ₹${summary.gkCommission.toLocaleString('en-IN')}
• *Net Vendor Share:* ₹${summary.netPayable.toLocaleString('en-IN')}

💰 *SETTLEMENT STATUS:*
• Already Settled: ₹${summary.settledTotal.toLocaleString('en-IN')}
• *Pending Payout Balance:* ₹${summary.pendingPayout.toLocaleString('en-IN')}
${p.payoutUpiId ? `• Registered UPI ID: ${p.payoutUpiId}` : ''}

Thank you for delivering quality doorstep services across Hyderabad gated communities!
GK Apartment Care Operations`;

    const url = `https://wa.me/${p.whatsapp.replace(/\D/g, '') || '919849012345'}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleSaveDefaultRate = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = Number(newDefaultRate);
    if (rate >= 0 && rate <= 100) {
      setDefaultCommissionRate(rate);
      setRateSavedMessage(true);
      setTimeout(() => setRateSavedMessage(false), 2500);
    }
  };

  const handleOpenEditBooking = (b: Booking) => {
    setEditingBooking(b);
    const prov = providers.find(p => p.id === b.providerId);
    setEditBookingRate(b.commissionRate ?? prov?.commissionPercentage ?? defaultCommissionRate ?? 15);
    setEditBookingStatus(b.commissionStatus || 'pending');
    setEditBookingRef(b.settlementReference || '');
  };

  const handleSaveEditBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    await updateBookingCommission(editingBooking.id, {
      commissionRate: editBookingRate,
      commissionStatus: editBookingStatus,
      settlementReference: editBookingRef.trim() || undefined,
      settledAt: editBookingStatus === 'settled' ? new Date().toISOString() : undefined,
    });
    setEditingBooking(null);
  };

  // Selected bookings in settlement modal calculations
  const modalSelectedBookings = useMemo(() => {
    return bookings.filter(b => selectedBookingIds.includes(b.id));
  }, [bookings, selectedBookingIds]);

  const modalSelectedGross = modalSelectedBookings.reduce((sum, b) => sum + (b.price || 0), 0);
  const modalTargetProv = providers.find(p => p.id === settleProviderId);
  const modalRate = modalTargetProv?.commissionPercentage ?? defaultCommissionRate ?? 15;
  const modalSelectedCommission = modalSelectedBookings.reduce(
    (sum, b) => sum + (b.commissionAmount ?? Math.round(((b.price || 0) * modalRate) / 100)),
    0
  );
  const modalSelectedPayout = modalSelectedBookings.reduce(
    (sum, b) => sum + (b.vendorPayoutAmount ?? Math.max(0, (b.price || 0) - Math.round(((b.price || 0) * modalRate) / 100))),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#142326] tracking-tight">Commission &amp; Payout Hub</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Configure commission splits, track platform margin revenue, and disburse verified vendor settlements
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleOpenSettlementModal()}
            className="px-4 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Wallet className="w-4 h-4" />
            <span>Record Vendor Payout</span>
          </button>
        </div>
      </div>

      {/* Top 4 Financial Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Gross GMV */}
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#667085]">
            <span className="font-semibold">Gross Order Value (GMV)</span>
            <Receipt className="w-4 h-4 text-[#2596be]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#142326] font-mono tabular-nums">
            ₹{metrics.totalGrossGMV.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#667085] flex items-center gap-1">
            <span>Across {bookings.length} resident bookings</span>
          </div>
        </div>

        {/* Card 2: Platform Commission Revenue */}
        <div className="p-4 sm:p-5 bg-[#2596be]/5 rounded-2xl border border-[#2596be]/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#2596be] font-bold">
            <span>GK Platform Commission</span>
            <Percent className="w-4 h-4 text-[#2596be]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2596be] font-mono tabular-nums">
            ₹{metrics.totalGKCommission.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#2596be] font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Avg {metrics.effectiveAvgRate}% net margin retained</span>
          </div>
        </div>

        {/* Card 3: Vendor Net Payouts */}
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#667085]">
            <span className="font-semibold">Vendor Payouts (Total)</span>
            <Wallet className="w-4 h-4 text-[#2E8B57]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2E8B57] font-mono tabular-nums">
            ₹{metrics.totalVendorPayouts.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#2E8B57] font-semibold">
            <span>Distributed to partner providers</span>
          </div>
        </div>

        {/* Card 4: Pending Settlements */}
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#667085]">
            <span className="font-semibold">Pending Settlements</span>
            <Clock className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F59E0B] font-mono tabular-nums">
            ₹{metrics.pendingPayoutAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#F59E0B] font-semibold">
            <span>{metrics.pendingCount} orders pending payout</span>
          </div>
        </div>
      </div>

      {/* Commission Configuration & Live Sandbox Calculator Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Global Commission Setting */}
        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#2596be]">Default Commercial Rule</div>
              <h3 className="text-base font-bold text-[#142326] mt-0.5">Platform Base Commission Rate</h3>
            </div>
            <span className="px-2.5 py-1 bg-[#2596be]/10 text-[#2596be] font-mono font-bold text-xs rounded-lg">
              Current: {defaultCommissionRate}%
            </span>
          </div>

          <p className="text-xs text-[#667085] leading-relaxed">
            This base percentage is automatically applied when onboarding new service providers and calculating booking commission cuts. Individual providers can have custom override rates.
          </p>

          <form onSubmit={handleSaveDefaultRate} className="space-y-3 pt-1">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={newDefaultRate}
                  onChange={e => setNewDefaultRate(Number(e.target.value))}
                  className="w-full pl-3.5 pr-8 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#142326] focus:outline-none focus:border-[#2596be]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#667085]">%</span>
              </div>

              <div className="flex items-center gap-1">
                {[10, 15, 18, 20, 25].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setNewDefaultRate(pct)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      newDefaultRate === pct
                        ? 'bg-[#2596be] text-white'
                        : 'bg-[#F8F9FA] border border-[#E5E7EB] text-[#667085] hover:border-[#2596be]/40'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#142326] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Save Rate
              </button>
            </div>

            {rateSavedMessage && (
              <div className="text-xs font-bold text-[#2E8B57] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Default commission rate updated to {defaultCommissionRate}%!</span>
              </div>
            )}
          </form>
        </div>

        {/* Right: Live Commission Split Sandbox Calculator */}
        <div className="p-5 bg-linear-to-br from-[#F8F9FA] to-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-[#667085]">Instant Calculator</div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-[#E5E7EB] rounded-md text-[#667085]">
              Live Simulator
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#667085] mb-1">Customer Price (₹)</label>
              <input
                type="number"
                min={0}
                step={50}
                value={calcGross}
                onChange={e => setCalcGross(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#142326] font-mono focus:outline-none focus:border-[#2596be]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#667085] mb-1">Commission Split (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={calcRate}
                onChange={e => setCalcRate(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#2596be] font-mono focus:outline-none focus:border-[#2596be]"
              />
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#E5E7EB] grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase text-[#2596be]">GK Platform Cut</div>
              <div className="text-lg font-extrabold text-[#2596be] font-mono tabular-nums">
                ₹{Math.round((calcGross * calcRate) / 100).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-[#667085]">({calcRate}% of ₹{calcGross})</div>
            </div>
            <div className="border-l border-[#E5E7EB] pl-3">
              <div className="text-[10px] font-bold uppercase text-[#2E8B57]">Vendor Take-Home</div>
              <div className="text-lg font-extrabold text-[#2E8B57] font-mono tabular-nums">
                ₹{Math.max(0, calcGross - Math.round((calcGross * calcRate) / 100)).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-[#667085]">({100 - calcRate}% of ₹{calcGross})</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('providers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'providers'
              ? 'bg-[#2596be] text-white shadow-xs'
              : 'bg-white text-[#667085] hover:text-[#142326] border border-[#E5E7EB]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Provider Accounts &amp; Settlements ({providers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ledger'
              ? 'bg-[#2596be] text-white shadow-xs'
              : 'bg-white text-[#667085] hover:text-[#142326] border border-[#E5E7EB]'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Order Commission Ledger ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settlements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'settlements'
              ? 'bg-[#2596be] text-white shadow-xs'
              : 'bg-white text-[#667085] hover:text-[#142326] border border-[#E5E7EB]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Disbursement History ({settlements.length})</span>
        </button>
      </div>

      {/* TAB 1: Provider Accounts Breakdown */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-semibold text-[#667085]">
              Showing financial summaries for {providers.length} verified vendors
            </div>
            <button
              onClick={() => setAdminSection('providers')}
              className="text-xs font-bold text-[#2596be] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>Manage Provider Profiles &amp; Contacts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {providerSummaries.map(s => (
              <div
                key={s.provider.id}
                className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-[#142326]">{s.provider.businessName}</h3>
                        <span className="px-2 py-0.5 bg-[#2596be]/10 text-[#2596be] font-bold text-[10px] rounded border border-[#2596be]/20">
                          {s.rate}% Commission
                        </span>
                      </div>
                      <div className="text-xs text-[#667085] mt-0.5">
                        Lead: <span className="text-[#142326] font-semibold">{s.provider.contactPerson}</span> · {s.provider.phone}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenSettlementModal(s.provider.id)}
                      className="px-3 py-1.5 bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      <span>Settle</span>
                    </button>
                  </div>

                  {/* 4-stat Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#F8F9FA] p-3 rounded-xl border border-[#E5E7EB] text-xs">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-[#667085]">Gross GMV</div>
                      <div className="text-sm font-extrabold text-[#142326] font-mono tabular-nums">
                        ₹{s.gross.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-[#667085]">{s.totalOrders} jobs</div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase text-[#2596be]">GK Margin</div>
                      <div className="text-sm font-extrabold text-[#2596be] font-mono tabular-nums">
                        ₹{s.gkCommission.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-[#2596be]">{s.rate}% rate</div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase text-[#2E8B57]">Vendor Net</div>
                      <div className="text-sm font-extrabold text-[#2E8B57] font-mono tabular-nums">
                        ₹{s.netPayable.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-[#667085]">Total share</div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase text-[#F59E0B]">Pending Payout</div>
                      <div className="text-sm font-extrabold text-[#F59E0B] font-mono tabular-nums">
                        ₹{s.pendingPayout.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-[#F59E0B]">{s.unsettledBookings.length} unpaid</div>
                    </div>
                  </div>

                  {/* Registered Payout Info */}
                  <div className="p-2.5 bg-white rounded-xl border border-[#E5E7EB] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#667085] flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-[#2596be]" />
                        <span>Registered Payout UPI / Bank:</span>
                      </span>
                      <span className="font-mono font-bold text-[#142326]">
                        {s.provider.payoutUpiId || s.provider.payoutAccountNumber || 'Not Configured (Cash/UPI)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-[#E5E7EB] grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedProviderFilter(s.provider.id);
                      setActiveTab('ledger');
                    }}
                    className="py-2 px-3 bg-white border border-[#E5E7EB] hover:border-[#2596be] text-[#142326] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5 text-[#2596be]" />
                    <span>View Ledger</span>
                  </button>

                  <button
                    onClick={() => generateWhatsAppStatement(s)}
                    className="py-2 px-3 bg-[#2E8B57]/10 hover:bg-[#2E8B57]/20 text-[#2E8B57] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Statement</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Order Commission Ledger */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search booking ID, resident, society, flat, vendor, or UTR..."
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
              />
            </div>

            <select
              value={selectedProviderFilter}
              onChange={e => setSelectedProviderFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#142326] cursor-pointer"
            >
              <option value="all">All Service Providers</option>
              {providers.map(p => (
                <option key={p.id} value={p.id}>
                  {p.businessName}
                </option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#142326] cursor-pointer"
            >
              <option value="all">All Settlement Statuses</option>
              <option value="pending">Pending Settlement</option>
              <option value="settled">Settled (Disbursed)</option>
              <option value="collected">Commission Collected</option>
              <option value="waived">Waived</option>
            </select>
          </div>

          {/* Ledger Cards List */}
          <div className="space-y-3">
            {filteredBookings.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#E5E7EB] text-xs text-[#667085]">
                No orders match your search and filter criteria.
              </div>
            ) : (
              filteredBookings.map(b => {
                const prov = providers.find(p => p.id === b.providerId);
                const rate = b.commissionRate ?? prov?.commissionPercentage ?? defaultCommissionRate ?? 15;
                const gross = b.price || 0;
                const comm = b.commissionAmount ?? Math.round((gross * rate) / 100);
                const vendorPayout = b.vendorPayoutAmount ?? Math.max(0, gross - comm);
                const isSettled = b.commissionStatus === 'settled';

                return (
                  <div
                    key={b.id}
                    className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-sm text-[#2596be]">{b.bookingNumber}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            b.status === 'completed'
                              ? 'bg-[#2E8B57]/10 text-[#2E8B57]'
                              : b.status === 'in_progress'
                              ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                              : 'bg-[#2596be]/10 text-[#2596be]'
                          }`}
                        >
                          Order: {b.status.replace('_', ' ')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            isSettled
                              ? 'bg-[#2E8B57]/10 text-[#2E8B57] border-[#2E8B57]/30'
                              : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
                          }`}
                        >
                          Payout: {isSettled ? 'Settled' : 'Pending Settlement'}
                        </span>
                      </div>

                      <div className="text-xs text-[#142326] font-bold">{b.serviceName}</div>

                      <div className="flex items-center gap-2 text-xs text-[#667085] flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-[#2596be]" />
                          {b.apartmentName} ({b.block}, Flat {b.flatNumber})
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#667085]" />
                          {b.residentName} ({b.phone})
                        </span>
                        <span>·</span>
                        <span>Vendor: <strong className="text-[#142326]">{b.providerName || prov?.businessName || 'Unassigned'}</strong></span>
                      </div>

                      {b.settlementReference && (
                        <div className="text-[11px] font-mono text-[#2E8B57] bg-[#2E8B57]/5 px-2.5 py-1 rounded-md inline-block">
                          UTR / Ref: {b.settlementReference} {b.settledAt ? `(${new Date(b.settledAt).toLocaleDateString('en-IN')})` : ''}
                        </div>
                      )}
                    </div>

                    {/* Financial Split Summary */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E5E7EB] shrink-0">
                      <div className="text-right pr-2">
                        <div className="text-[10px] uppercase font-bold text-[#667085]">Customer Paid</div>
                        <div className="text-base font-extrabold text-[#142326] font-mono tabular-nums">
                          ₹{gross}
                        </div>
                      </div>

                      <div className="text-right px-2 border-l border-[#E5E7EB]">
                        <div className="text-[10px] uppercase font-bold text-[#2596be]">GK Margin ({rate}%)</div>
                        <div className="text-base font-extrabold text-[#2596be] font-mono tabular-nums">
                          ₹{comm}
                        </div>
                      </div>

                      <div className="text-right px-2 border-l border-[#E5E7EB]">
                        <div className="text-[10px] uppercase font-bold text-[#2E8B57]">Vendor Share</div>
                        <div className="text-base font-extrabold text-[#2E8B57] font-mono tabular-nums">
                          ₹{vendorPayout}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 pl-2">
                        <button
                          onClick={() => handleOpenEditBooking(b)}
                          className="px-2.5 py-1.5 bg-[#F8F9FA] hover:bg-[#E5E7EB] text-[#142326] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Edit Split
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Disbursement / Settlement History */}
      {activeTab === 'settlements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-[#667085]">
              Showing {settlements.length} past vendor payout settlements
            </div>
          </div>

          {settlements.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#E5E7EB] text-xs text-[#667085] space-y-2">
              <Receipt className="w-8 h-8 text-[#667085] mx-auto opacity-40" />
              <div>No payout settlements have been recorded yet.</div>
              <button
                onClick={() => handleOpenSettlementModal()}
                className="px-3.5 py-2 bg-[#2596be] text-white text-xs font-bold rounded-xl"
              >
                Record Your First Settlement
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {settlements.map(s => (
                <div
                  key={s.id}
                  className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-[#2E8B57]">{s.settlementNumber}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#2E8B57]/10 text-[#2E8B57] rounded-md">
                        {s.paymentMethod.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-[#142326]">
                      Paid to: {s.providerName}
                    </div>

                    <div className="text-xs text-[#667085] flex items-center gap-2 flex-wrap">
                      <span>Date: {new Date(s.settledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>·</span>
                      <span className="font-mono">UTR / Txn Ref: {s.transactionReference}</span>
                      <span>·</span>
                      <span>{s.totalOrders} Orders Cleared</span>
                    </div>

                    {s.notes && (
                      <div className="text-[11px] text-[#667085] italic">
                        Note: {s.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E5E7EB]">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-[#667085]">Gross Cleared</div>
                      <div className="text-xs font-bold font-mono text-[#667085] tabular-nums">
                        ₹{s.totalGross.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="text-right border-l border-[#E5E7EB] pl-3">
                      <div className="text-[10px] uppercase font-bold text-[#2596be]">GK Fee</div>
                      <div className="text-xs font-bold font-mono text-[#2596be] tabular-nums">
                        ₹{s.commissionAmount.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="text-right border-l border-[#E5E7EB] pl-3">
                      <div className="text-[10px] uppercase font-bold text-[#2E8B57]">Disbursed Payout</div>
                      <div className="text-lg font-black font-mono text-[#2E8B57] tabular-nums">
                        ₹{s.payoutAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RECORD SETTLEMENT MODAL */}
      <AnimatePresence>
        {settlementModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#2E8B57]" />
                  <h3 className="text-base font-bold text-[#142326]">Record Vendor Payout Settlement</h3>
                </div>
                <button
                  onClick={() => setSettlementModalOpen(false)}
                  className="p-1.5 text-[#667085] hover:bg-[#F8F9FA] rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmSettlement} className="p-5 overflow-y-auto space-y-4 max-h-[75vh]">
                {settleSuccessMsg && (
                  <div className="p-3 bg-[#2E8B57]/10 border border-[#2E8B57]/30 rounded-xl text-xs font-bold text-[#2E8B57] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{settleSuccessMsg}</span>
                  </div>
                )}

                {/* Provider Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Select Service Provider <span className="text-[#DC2626]">*</span>
                  </label>
                  <select
                    value={settleProviderId}
                    onChange={e => handleProviderSelectInModal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#142326] focus:outline-none focus:border-[#2596be]"
                  >
                    {providers.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.businessName} ({p.contactPerson}) — {p.commissionPercentage ?? defaultCommissionRate}% Commission
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bank/UPI info display */}
                {modalTargetProv && (
                  <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] text-xs space-y-1">
                    <div className="font-bold text-[#142326]">Vendor Payment Route:</div>
                    <div className="text-[#667085]">
                      UPI: <strong className="text-[#142326]">{modalTargetProv.payoutUpiId || 'None registered'}</strong>
                    </div>
                    {modalTargetProv.payoutAccountNumber && (
                      <div className="text-[#667085]">
                        Bank: {modalTargetProv.payoutAccountName} · A/C: {modalTargetProv.payoutAccountNumber} (IFSC: {modalTargetProv.payoutIfsc})
                      </div>
                    )}
                  </div>
                )}

                {/* Orders Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#142326]">
                      Completed Orders to Settle ({selectedBookingIds.length} Selected)
                    </label>
                    <span className="text-[11px] text-[#667085]">Select orders to clear</span>
                  </div>

                  {bookings.filter(b => b.providerId === settleProviderId && b.status === 'completed').length === 0 ? (
                    <div className="p-4 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] text-xs text-[#667085] text-center">
                      No completed orders found for this provider.
                    </div>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-2 border border-[#E5E7EB] rounded-xl p-2 bg-[#F8F9FA]">
                      {bookings
                        .filter(b => b.providerId === settleProviderId && b.status === 'completed')
                        .map(b => {
                          const isChecked = selectedBookingIds.includes(b.id);
                          const isAlreadySettled = b.commissionStatus === 'settled';
                          const bRate = b.commissionRate ?? modalRate;
                          const bPayout = b.vendorPayoutAmount ?? Math.max(0, (b.price || 0) - Math.round(((b.price || 0) * bRate) / 100));

                          return (
                            <label
                              key={b.id}
                              className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                isChecked
                                  ? 'bg-white border-[#2596be] shadow-2xs'
                                  : 'bg-white/60 border-[#E5E7EB]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleBookingSelection(b.id)}
                                  className="rounded text-[#2596be]"
                                />
                                <div>
                                  <div className="font-bold text-[#142326] flex items-center gap-1.5">
                                    <span>{b.bookingNumber}</span>
                                    <span className="text-[10px] text-[#667085]">({b.apartmentName}, {b.flatNumber})</span>
                                    {isAlreadySettled && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#2E8B57]/10 text-[#2E8B57] rounded">
                                        Settled
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-[#667085]">{b.serviceName}</div>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="font-bold text-[#2E8B57] font-mono">₹{bPayout} net</div>
                                <div className="text-[10px] text-[#667085]">Gross: ₹{b.price}</div>
                              </div>
                            </label>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Live Settlement Calculation Totals Box */}
                <div className="p-3.5 bg-[#2596be]/5 border border-[#2596be]/20 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#667085]">
                    <span>Total Gross Volume:</span>
                    <span className="font-bold font-mono text-[#142326]">₹{modalSelectedGross}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#2596be]">
                    <span>GK Platform Commission Retained ({modalRate}%):</span>
                    <span className="font-bold font-mono">₹{modalSelectedCommission}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-extrabold text-[#2E8B57] pt-1.5 border-t border-[#2596be]/20">
                    <span>Net Payout to Transfer to Vendor:</span>
                    <span className="text-base font-mono">₹{modalSelectedPayout}</span>
                  </div>
                </div>

                {/* Payment Method & UTR Input */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Payment Mode <span className="text-[#DC2626]">*</span>
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#142326] focus:outline-none focus:border-[#2596be]"
                    >
                      <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                      <option value="bank_transfer">Bank Transfer (IMPS / NEFT)</option>
                      <option value="cash">Cash Voucher</option>
                      <option value="other">Other / Cheque</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      UTR / Transaction Reference <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={e => setTransactionRef(e.target.value)}
                      placeholder="e.g. 402919482912 or UPI-9481"
                      className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-mono font-bold text-[#142326] focus:outline-none focus:border-[#2596be]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Internal Settlement Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={settleNotes}
                    onChange={e => setSettleNotes(e.target.value)}
                    placeholder="e.g. Sunday batch payout for Green Valley visit"
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSettlementModalOpen(false)}
                    className="px-4 py-2 border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#667085] hover:bg-[#F8F9FA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={selectedBookingIds.length === 0}
                    className="px-5 py-2.5 bg-[#2E8B57] hover:bg-[#257347] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Confirm &amp; Record Settlement (₹{modalSelectedPayout})
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT SINGLE BOOKING COMMISSION MODAL */}
      <AnimatePresence>
        {editingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl max-w-md w-full p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <h3 className="text-base font-bold text-[#142326]">
                  Edit Order Commission Split
                </h3>
                <button
                  onClick={() => setEditingBooking(null)}
                  className="p-1 text-[#667085] hover:bg-[#F8F9FA] rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditBooking} className="space-y-3.5 text-xs">
                <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] space-y-1">
                  <div className="font-bold text-[#142326]">{editingBooking.bookingNumber}</div>
                  <div className="text-[#667085]">
                    {editingBooking.serviceName} · Customer Paid: <strong className="text-[#142326]">₹{editingBooking.price}</strong>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#142326] mb-1">
                    Commission Rate (%) for this Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    required
                    value={editBookingRate}
                    onChange={e => setEditBookingRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl font-bold font-mono focus:outline-none focus:border-[#2596be]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#2596be]/5 p-2.5 rounded-xl border border-[#2596be]/20">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#2596be]">GK Margin</div>
                    <div className="text-sm font-extrabold text-[#2596be] font-mono">
                      ₹{Math.round((editingBooking.price * editBookingRate) / 100)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#2E8B57]">Vendor Share</div>
                    <div className="text-sm font-extrabold text-[#2E8B57] font-mono">
                      ₹{Math.max(0, editingBooking.price - Math.round((editingBooking.price * editBookingRate) / 100))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#142326] mb-1">Settlement Status</label>
                  <select
                    value={editBookingStatus}
                    onChange={e => setEditBookingStatus(e.target.value as CommissionStatus)}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl font-bold focus:outline-none focus:border-[#2596be]"
                  >
                    <option value="pending">Pending Settlement</option>
                    <option value="settled">Settled (Disbursed to Vendor)</option>
                    <option value="collected">Commission Collected</option>
                    <option value="waived">Waived (0% commission)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#142326] mb-1">UTR / Settlement Reference</label>
                  <input
                    type="text"
                    value={editBookingRef}
                    onChange={e => setEditBookingRef(e.target.value)}
                    placeholder="e.g. UTR-9481928"
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl font-mono focus:outline-none focus:border-[#2596be]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
                    className="px-4 py-2 border border-[#E5E7EB] rounded-xl text-[#667085] hover:bg-[#F8F9FA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2596be] text-white font-bold rounded-xl shadow-xs"
                  >
                    Save Changes
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
