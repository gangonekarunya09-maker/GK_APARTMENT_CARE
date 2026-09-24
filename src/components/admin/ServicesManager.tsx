import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Service, ServiceStatus } from '../../types';
import {
  Sparkles,
  Plus,
  Search,
  Users,
  Edit2,
  Clock,
  Share2,
  MessageCircle,
  Copy,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ServicesManager: React.FC = () => {
  const { services, categories, providers, apartments, addService, updateService, setShareModalService } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-automotive');
  const [description, setDescription] = useState('');
  const [providerId, setProviderId] = useState(providers[0]?.id || '');
  const [normalPrice, setNormalPrice] = useState('1000');
  const [communityPrice, setCommunityPrice] = useState('850');
  const [sundayBulkPrice, setSundayBulkPrice] = useState('700');
  const [minimumDemand, setMinimumDemand] = useState('20');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [iconName, setIconName] = useState('Sparkles');

  // Quick preset buttons for common custom community needs
  const presets = [
    { name: 'Water Tank Cleaning', cat: 'cat-tank-water', norm: 1800, comm: 1400, sun: 1100, dur: 90, desc: 'Mechanized 4-stage anti-bacterial tank scrubbing.' },
    { name: 'Bike Detailing', cat: 'cat-automotive', norm: 600, comm: 500, sun: 399, dur: 30, desc: 'Foam wash, chain degrease, engine polish.' },
    { name: 'RO Filter Replacement', cat: 'cat-tank-water', norm: 1200, comm: 950, sun: 800, dur: 45, desc: 'Sediment, pre-carbon filter change and TDS check.' },
    { name: 'Balcony Pressure Wash', cat: 'cat-balcony-exterior', norm: 900, comm: 750, sun: 599, dur: 45, desc: 'High-pressure pigeon mesh cleaning & tile wash.' },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setName(p.name);
    setCategoryId(p.cat);
    setNormalPrice(p.norm.toString());
    setCommunityPrice(p.comm.toString());
    setSundayBulkPrice(p.sun.toString());
    setDurationMinutes(p.dur.toString());
    setDescription(p.desc);
  };

  const filtered = services.filter(
    s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setCategoryId(categories[0]?.id || 'cat-automotive');
    setDescription('');
    setProviderId(providers[0]?.id || '');
    setNormalPrice('1000');
    setCommunityPrice('850');
    setSundayBulkPrice('700');
    setMinimumDemand('20');
    setDurationMinutes('45');
    setIconName('Sparkles');
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setName(srv.name);
    setCategoryId(srv.categoryId);
    setDescription(srv.description);
    setProviderId(srv.providerId || '');
    setNormalPrice(srv.normalPrice.toString());
    setCommunityPrice(srv.communityPrice.toString());
    setSundayBulkPrice(srv.sundayBulkPrice.toString());
    setMinimumDemand(srv.minimumDemand.toString());
    setDurationMinutes(srv.durationMinutes.toString());
    setIconName(srv.iconName);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    const matchedProv = providers.find(p => p.id === providerId);

    if (editingService) {
      updateService(editingService.id, {
        name,
        categoryId,
        description,
        providerId: providerId || undefined,
        providerName: matchedProv ? matchedProv.businessName : undefined,
        normalPrice: parseFloat(normalPrice) || 1000,
        communityPrice: parseFloat(communityPrice) || 850,
        sundayBulkPrice: parseFloat(sundayBulkPrice) || 700,
        minimumDemand: parseInt(minimumDemand) || 20,
        durationMinutes: parseInt(durationMinutes) || 45,
        iconName,
      });
    } else {
      addService({
        name,
        categoryId,
        description,
        iconName,
        apartmentIds: [],
        providerId: providerId || undefined,
        providerName: matchedProv ? matchedProv.businessName : undefined,
        normalPrice: parseFloat(normalPrice) || 1000,
        communityPrice: parseFloat(communityPrice) || 850,
        sundayBulkPrice: parseFloat(sundayBulkPrice) || 700,
        minimumDemand: parseInt(minimumDemand) || 20,
        durationMinutes: parseInt(durationMinutes) || 45,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        availableSlots: [
          '09:00 AM – 11:00 AM',
          '11:00 AM – 01:00 PM',
          '02:30 PM – 04:30 PM',
        ],
        status: 'collecting_demand',
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#142326]">Services &amp; Pricing Management</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Configure normal prices, community discounts, Sunday bulk quotas, and assigned partners
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Custom Service</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter services by name or description..."
          className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
        />
      </div>

      {/* Services Grid (responsive cards, NO horizontal rows) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(srv => {
          const cat = categories.find(c => c.id === srv.categoryId);
          const percent = Math.min(100, Math.round((srv.currentDemand / srv.minimumDemand) * 100));

          return (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-col justify-between shadow-xs space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider">
                      {cat?.name || 'General'}
                    </span>
                    <h3 className="text-base font-bold text-[#142326]">{srv.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(srv)}
                      className="p-1.5 text-[#667085] hover:text-[#2596be] hover:bg-[#F8F9FA] rounded-md"
                      title="Edit Service"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShareModalService(srv)}
                      className="p-1.5 text-[#667085] hover:text-[#2E8B57] hover:bg-[#F8F9FA] rounded-md"
                      title="Generate WhatsApp Link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#667085] line-clamp-2 mb-3">
                  {srv.description}
                </p>

                {/* Pricing grid */}
                <div className="bg-[#F8F9FA] p-2.5 rounded-xl border border-[#E5E7EB] space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Individual Normal:</span>
                    <span className="font-mono text-[#667085] line-through">₹{srv.normalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#142326] font-medium">Community Rate:</span>
                    <span className="font-mono font-bold text-[#142326]">₹{srv.communityPrice}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#E5E7EB] font-bold text-[#2596be]">
                    <span>Sunday Bulk:</span>
                    <span className="font-mono font-extrabold">₹{srv.sundayBulkPrice}</span>
                  </div>
                </div>

                {/* Demand Progress */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#667085]">Sunday Demand:</span>
                    <span className="font-bold text-[#142326] font-mono">
                      {srv.currentDemand} / {srv.minimumDemand} units
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2596be] rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              </div>

              {/* Provider assignment & Quick Actions */}
              <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#667085]">
                <div className="truncate max-w-[160px]">
                  Partner: <strong className="text-[#142326]">{srv.providerName || 'Unassigned'}</strong>
                </div>
                <button
                  onClick={() => setShareModalService(srv)}
                  className="text-xs text-[#2596be] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Share link</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Create/Edit Service */}
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
                  {editingService ? 'Edit Service & Pricing' : 'Create Custom Service Need'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-[#667085] hover:bg-[#F8F9FA] rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 max-h-[75vh]">
                {/* Fast presets for custom community needs */}
                {!editingService && (
                  <div>
                    <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider block mb-1.5">
                      Quick Community Templates
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {presets.map(p => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => applyPreset(p)}
                          className="px-2.5 py-1 bg-[#F8F9FA] hover:bg-[#2596be]/10 hover:text-[#2596be] border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#142326] transition-colors"
                        >
                          + {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Service Name <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Water Tank Cleaning or Car Wash"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Service Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={e => setCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Assigned Provider
                    </label>
                    <select
                      value={providerId}
                      onChange={e => setProviderId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    >
                      <option value="">Unassigned</option>
                      {providers.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.businessName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142326] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe what is included in the service..."
                    className="w-full px-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
                  />
                </div>

                {/* 3 Tier Pricing */}
                <div className="grid grid-cols-3 gap-2.5 bg-[#F8F9FA] p-3 rounded-xl border border-[#E5E7EB]">
                  <div>
                    <label className="block text-[11px] font-bold text-[#667085] mb-1">
                      Normal (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={normalPrice}
                      onChange={e => setNormalPrice(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#142326] mb-1">
                      Community (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={communityPrice}
                      onChange={e => setCommunityPrice(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2596be] mb-1">
                      Sunday Bulk (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={sundayBulkPrice}
                      onChange={e => setSundayBulkPrice(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#2596be] rounded-lg text-xs font-mono font-bold text-[#2596be]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Sunday Demand Target
                    </label>
                    <input
                      type="number"
                      value={minimumDemand}
                      onChange={e => setMinimumDemand(e.target.value)}
                      placeholder="e.g. 20"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#142326] mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={e => setDurationMinutes(e.target.value)}
                      placeholder="e.g. 45"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
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
                    Save Service
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
