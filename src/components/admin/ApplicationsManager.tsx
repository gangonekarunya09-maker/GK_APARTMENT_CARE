import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Wrench,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Search,
  Filter,
  Trash2,
  UserCheck,
  PlusCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Handshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ApplicationsManager: React.FC = () => {
  const {
    rwaApplications,
    vendorApplications,
    updateRWAApplicationStatus,
    deleteRWAApplication,
    convertRWAToApartment,
    updateVendorApplicationStatus,
    deleteVendorApplication,
    convertVendorToProvider,
    setAdminSection,
  } = useApp();

  const [tab, setTab] = useState<'rwa' | 'vendor'>('rwa');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Metrics
  const pendingRwa = rwaApplications.filter(a => a.status === 'pending').length;
  const partneredRwa = rwaApplications.filter(a => a.status === 'partnered').length;
  const pendingVendor = vendorApplications.filter(v => v.status === 'pending').length;
  const verifiedVendor = vendorApplications.filter(v => v.status === 'verified').length;

  // Filtered RWA applications
  const filteredRwa = rwaApplications.filter(app => {
    const matchesSearch =
      app.societyName.toLowerCase().includes(search.toLowerCase()) ||
      app.rwaContact.toLowerCase().includes(search.toLowerCase()) ||
      app.area.toLowerCase().includes(search.toLowerCase()) ||
      app.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Vendor applications
  const filteredVendor = vendorApplications.filter(vnd => {
    const matchesSearch =
      vnd.businessName.toLowerCase().includes(search.toLowerCase()) ||
      vnd.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      vnd.category.toLowerCase().includes(search.toLowerCase()) ||
      vnd.serviceAreas.toLowerCase().includes(search.toLowerCase()) ||
      vnd.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || vnd.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <AnimatePresence>
        {actionNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-[#2E8B57]/10 border border-[#2E8B57]/30 text-[#2E8B57] text-xs font-semibold rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-xs hover:opacity-75 font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-[#142326]">Partnership Requests</h2>
            <span className="px-2 py-0.5 bg-[#2596be]/10 text-[#2596be] text-xs font-bold rounded-md">
              {rwaApplications.length + vendorApplications.length} Total
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-0.5">
            Review incoming community RWA partnership inquiries and service provider partner applications
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E5E7EB] self-start sm:self-auto shadow-xs">
          <button
            onClick={() => {
              setTab('rwa');
              setStatusFilter('all');
            }}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              tab === 'rwa'
                ? 'bg-[#2596be] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#142326] hover:bg-[#F8F9FA]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>RWA Communities</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                tab === 'rwa' ? 'bg-white/20 text-white' : 'bg-[#F8F9FA] text-[#667085]'
              }`}
            >
              {rwaApplications.length}
            </span>
            {pendingRwa > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
            )}
          </button>
          <button
            onClick={() => {
              setTab('vendor');
              setStatusFilter('all');
            }}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              tab === 'vendor'
                ? 'bg-[#2596be] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#142326] hover:bg-[#F8F9FA]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Service Partners</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                tab === 'vendor' ? 'bg-white/20 text-white' : 'bg-[#F8F9FA] text-[#667085]'
              }`}
            >
              {vendorApplications.length}
            </span>
            {pendingVendor > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
            )}
          </button>
        </div>
      </div>

      {/* KPI stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-[#E5E7EB] shadow-xs">
          <div className="text-[11px] text-[#667085]">Pending RWA Societies</div>
          <div className="text-xl font-extrabold text-[#F59E0B] font-mono mt-0.5">
            {pendingRwa}
          </div>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-[#E5E7EB] shadow-xs">
          <div className="text-[11px] text-[#667085]">Partnered Societies</div>
          <div className="text-xl font-extrabold text-[#2E8B57] font-mono mt-0.5">
            {partneredRwa}
          </div>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-[#E5E7EB] shadow-xs">
          <div className="text-[11px] text-[#667085]">Pending Service Partners</div>
          <div className="text-xl font-extrabold text-[#F59E0B] font-mono mt-0.5">
            {pendingVendor}
          </div>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-[#E5E7EB] shadow-xs">
          <div className="text-[11px] text-[#667085]">Verified Providers</div>
          <div className="text-xl font-extrabold text-[#2596be] font-mono mt-0.5">
            {verifiedVendor}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            type="text"
            placeholder={
              tab === 'rwa'
                ? 'Search by society, contact person, locality, phone...'
                : 'Search by partner name, category, service area, phone...'
            }
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#142326] focus:outline-none focus:border-[#2596be]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#667085]" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#142326] font-semibold focus:outline-none focus:border-[#2596be]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            {tab === 'rwa' ? (
              <>
                <option value="reviewed">Under Discussion</option>
                <option value="partnered">Partnered</option>
              </>
            ) : (
              <>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* RWA Submissions List */}
      {tab === 'rwa' && (
        <div className="space-y-3">
          {filteredRwa.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] text-xs text-[#667085] space-y-2">
              <Building2 className="w-8 h-8 text-[#667085]/40 mx-auto" />
              <p className="font-bold text-[#142326]">No RWA partnership inquiries found</p>
              <p>
                {search || statusFilter !== 'all'
                  ? 'Try changing your search keywords or status filter.'
                  : 'New inquiries submitted via the resident portal "RWA Partnerships" tab will appear here in real-time.'}
              </p>
            </div>
          ) : (
            filteredRwa.map(app => (
              <div
                key={app.id}
                className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3.5 transition-all hover:border-[#2596be]/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="w-8 h-8 rounded-lg bg-[#2596be]/10 text-[#2596be] flex items-center justify-center font-bold">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#142326]">{app.societyName}</h3>
                      <div className="text-[11px] text-[#667085] flex items-center gap-2">
                        <span>{app.area}</span>
                        <span>·</span>
                        <span className="font-semibold text-[#2596be]">{app.totalUnits} Units</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        app.status === 'partnered'
                          ? 'bg-[#2E8B57]/10 text-[#2E8B57]'
                          : app.status === 'reviewed'
                          ? 'bg-[#2596be]/10 text-[#2596be]'
                          : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                      }`}
                    >
                      ● {app.status}
                    </span>
                    <span className="text-[11px] text-[#667085]">
                      {new Date(app.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F8F9FA] p-3 rounded-xl border border-[#E5E7EB]">
                  <div>
                    <span className="text-[#667085] block text-[11px]">RWA Contact Person:</span>
                    <strong className="text-[#142326]">{app.rwaContact}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block text-[11px]">Phone Number:</span>
                    <strong className="text-[#142326]">{app.phone}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block text-[11px]">Email Address:</span>
                    <strong className="text-[#142326] truncate block">{app.email || 'Not provided'}</strong>
                  </div>
                </div>

                {app.message && (
                  <div className="text-xs text-[#667085] bg-[#F8F9FA] p-3 rounded-xl border border-[#E5E7EB]">
                    <span className="text-[#142326] font-bold block mb-1">Message from RWA Board:</span>
                    <p className="italic">&quot;{app.message}&quot;</p>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#667085] font-semibold">Change Status:</span>
                    <select
                      value={app.status}
                      onChange={e => {
                        updateRWAApplicationStatus(
                          app.id,
                          e.target.value as 'pending' | 'reviewed' | 'partnered'
                        );
                        showNotice(`Updated status of ${app.societyName} to "${e.target.value}".`);
                      }}
                      className="px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#142326] focus:outline-none focus:border-[#2596be]"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed / Discussion</option>
                      <option value="partnered">Partnered</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {app.status !== 'partnered' && (
                      <button
                        onClick={async () => {
                          const res = await convertRWAToApartment(app.id);
                          if (res.success) {
                            showNotice(`Successfully onboarded ${app.societyName} as an active community!`);
                          } else {
                            showNotice(res.error || 'Failed to onboard community.');
                          }
                        }}
                        className="px-3 py-1.5 bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Onboard as Society</span>
                      </button>
                    )}

                    <a
                      href={`tel:${app.phone}`}
                      className="px-3 py-1.5 bg-white border border-[#E5E7EB] hover:border-[#2596be] text-xs font-semibold text-[#142326] rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#2596be]" />
                      <span>Call RWA</span>
                    </a>

                    <a
                      href={`https://wa.me/${app.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hi ${app.rwaContact}! Connecting from GK Apartment Care regarding your community partnership inquiry for ${app.societyName}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        if (confirm(`Remove partnership inquiry from "${app.societyName}"?`)) {
                          deleteRWAApplication(app.id);
                          showNotice(`Removed inquiry from ${app.societyName}.`);
                        }
                      }}
                      className="p-1.5 text-[#667085] hover:text-[#DC2626] hover:bg-[#DC2626]/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Vendor Applications List */}
      {tab === 'vendor' && (
        <div className="space-y-3">
          {filteredVendor.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] text-xs text-[#667085] space-y-2">
              <Wrench className="w-8 h-8 text-[#667085]/40 mx-auto" />
              <p className="font-bold text-[#142326]">No service partner applications found</p>
              <p>
                {search || statusFilter !== 'all'
                  ? 'Try changing your search keywords or status filter.'
                  : 'New provider applications submitted via the resident portal "Service Partner" tab will appear here in real-time.'}
              </p>
            </div>
          ) : (
            filteredVendor.map(vnd => (
              <div
                key={vnd.id}
                className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3.5 transition-all hover:border-[#2596be]/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="w-8 h-8 rounded-lg bg-[#2596be]/10 text-[#2596be] flex items-center justify-center font-bold">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#142326]">{vnd.businessName}</h3>
                      <div className="text-[11px] text-[#667085] flex items-center gap-2">
                        <span className="font-semibold text-[#2596be]">{vnd.category}</span>
                        <span>·</span>
                        <span>{vnd.experienceYears} Years Experience</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        vnd.status === 'verified'
                          ? 'bg-[#2E8B57]/10 text-[#2E8B57]'
                          : vnd.status === 'rejected'
                          ? 'bg-[#DC2626]/10 text-[#DC2626]'
                          : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                      }`}
                    >
                      ● {vnd.status}
                    </span>
                    <span className="text-[11px] text-[#667085]">
                      {new Date(vnd.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F8F9FA] p-3 rounded-xl border border-[#E5E7EB]">
                  <div>
                    <span className="text-[#667085] block text-[11px]">Contact Person:</span>
                    <strong className="text-[#142326]">{vnd.contactPerson}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block text-[11px]">Phone / WhatsApp:</span>
                    <strong className="text-[#142326]">{vnd.phone}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block text-[11px]">Service Hubs / Areas:</span>
                    <strong className="text-[#142326]">{vnd.serviceAreas}</strong>
                  </div>
                </div>

                <div className="text-xs text-[#667085] bg-[#F8F9FA] p-3 rounded-xl border border-[#E5E7EB] space-y-1.5">
                  <div>
                    <strong className="text-[#142326]">Offered Services:</strong>{' '}
                    <span>{vnd.servicesOffered}</span>
                  </div>
                  {vnd.pricingNotes && (
                    <div>
                      <strong className="text-[#142326]">Equipment / Pricing Notes:</strong>{' '}
                      <span className="italic">{vnd.pricingNotes}</span>
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#667085] font-semibold">Change Status:</span>
                    <select
                      value={vnd.status}
                      onChange={e => {
                        updateVendorApplicationStatus(
                          vnd.id,
                          e.target.value as 'pending' | 'verified' | 'rejected'
                        );
                        showNotice(`Updated partner ${vnd.businessName} status to "${e.target.value}".`);
                      }}
                      className="px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#142326] focus:outline-none focus:border-[#2596be]"
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {vnd.status !== 'verified' && (
                      <button
                        onClick={async () => {
                          const res = await convertVendorToProvider(vnd.id);
                          if (res.success) {
                            showNotice(`Successfully onboarded ${vnd.businessName} as an active service provider!`);
                          } else {
                            showNotice(res.error || 'Failed to onboard service provider.');
                          }
                        }}
                        className="px-3 py-1.5 bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Onboard as Provider</span>
                      </button>
                    )}

                    <a
                      href={`tel:${vnd.phone}`}
                      className="px-3 py-1.5 bg-white border border-[#E5E7EB] hover:border-[#2596be] text-xs font-semibold text-[#142326] rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#2596be]" />
                      <span>Call Candidate</span>
                    </a>

                    <a
                      href={`https://wa.me/${(vnd.whatsapp || vnd.phone).replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hi ${vnd.contactPerson}! We received your GK Apartment Care service partner application for ${vnd.businessName}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        if (confirm(`Remove service partner application from "${vnd.businessName}"?`)) {
                          deleteVendorApplication(vnd.id);
                          showNotice(`Removed application from ${vnd.businessName}.`);
                        }
                      }}
                      className="p-1.5 text-[#667085] hover:text-[#DC2626] hover:bg-[#DC2626]/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete submission"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
