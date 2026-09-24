import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Search,
  Building2,
  Phone,
  MessageSquare,
  Clock,
  User,
  Filter
} from 'lucide-react';

export const ResidentRequestsManager: React.FC = () => {
  const { residentRequests, campaigns, apartments, services } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterApartmentId, setFilterApartmentId] = useState('all');

  const filteredRequests = residentRequests.filter(req => {
    if (filterApartmentId !== 'all' && req.apartmentId !== filterApartmentId) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        req.residentName.toLowerCase().includes(q) ||
        req.phone.toLowerCase().includes(q) ||
        req.flatNumber.toLowerCase().includes(q) ||
        req.block.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#142326]">Resident Requests Log</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Complete private directory of residents who clicked &quot;I&apos;m Interested&quot; across campaigns
          </p>
        </div>
        <div className="text-xs font-semibold text-[#667085]">
          Showing {filteredRequests.length} of {residentRequests.length} total entries
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by resident name, phone, or flat number..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#2596be] text-[#142326]"
          />
        </div>

        <select
          value={filterApartmentId}
          onChange={e => setFilterApartmentId(e.target.value)}
          className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#142326] cursor-pointer"
        >
          <option value="all">All Apartments ({apartments.length})</option>
          {apartments.map(a => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Requests List - clean vertical cards, no horizontal row overflow */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#E5E7EB]">
            <CalendarCheck className="w-10 h-10 mx-auto text-[#667085]/40 mb-2" />
            <h4 className="text-sm font-bold text-[#142326]">No Requests Found</h4>
            <p className="text-xs text-[#667085] mt-1">
              When residents click &quot;I&apos;m Interested&quot; on public campaign links, their requests will appear here.
            </p>
          </div>
        ) : (
          filteredRequests.map(req => {
            const apt = apartments.find(a => a.id === req.apartmentId);
            const camp = campaigns.find(c => c.id === req.campaignId);
            const srv = services.find(s => s.id === camp?.serviceId);

            return (
              <div
                key={req.id}
                className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-[#142326]">{req.residentName}</strong>
                    <span>·</span>
                    <span className="font-semibold text-[#2596be]">
                      {req.block}, Flat {req.flatNumber}
                    </span>
                    {srv && (
                      <span className="text-[10px] px-2 py-0.5 bg-[#2596be]/10 text-[#2596be] font-bold rounded">
                        {srv.name}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 text-[#667085]">
                    <span className="flex items-center gap-1 font-medium text-[#142326]">
                      <Building2 className="w-3.5 h-3.5 text-[#2596be]" />
                      {apt?.name}
                    </span>
                    <span>·</span>
                    <span>Prefers: {req.preferredDate || 'Sunday'} · {req.preferredSlot || 'Morning'}</span>
                    <span>·</span>
                    <a href={`tel:${req.phone}`} className="text-[#2596be] font-mono hover:underline">
                      {req.phone}
                    </a>
                  </div>

                  {req.notes && (
                    <div className="text-[11px] text-[#667085] italic">Note: {req.notes}</div>
                  )}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#E5E7EB] shrink-0">
                  <span className="text-[11px] text-[#667085]">
                    {new Date(req.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <a
                    href={`tel:${req.phone}`}
                    className="p-2 text-[#2596be] hover:bg-[#2596be]/10 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
                    title="Call Resident"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`https://wa.me/${req.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hi ${req.residentName}! Connecting from GK Apartment Care regarding your ${srv?.name || 'home service'} request for ${apt?.name}, Flat ${req.flatNumber}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#2E8B57] hover:bg-[#257347] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
