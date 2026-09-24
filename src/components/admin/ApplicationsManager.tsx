import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Wrench, CheckCircle2, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const ApplicationsManager: React.FC = () => {
  const { rwaApplications, vendorApplications } = useApp();
  const [tab, setTab] = useState<'rwa' | 'vendor'>('rwa');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#142326]">Inquiries &amp; Applications</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Review community RWA partnership requests and vendor onboarding forms
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E5E7EB] self-start sm:self-auto">
          <button
            onClick={() => setTab('rwa')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              tab === 'rwa'
                ? 'bg-[#2596be] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#142326]'
            }`}
          >
            RWA Societies ({rwaApplications.length})
          </button>
          <button
            onClick={() => setTab('vendor')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              tab === 'vendor'
                ? 'bg-[#2596be] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#142326]'
            }`}
          >
            Vendor Partners ({vendorApplications.length})
          </button>
        </div>
      </div>

      {/* RWA Submissions List - clean cards, strictly no horizontal rows */}
      {tab === 'rwa' && (
        <div className="space-y-3">
          {rwaApplications.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#E5E7EB] text-xs text-[#667085]">
              No pending RWA partnership inquiries.
            </div>
          ) : (
            rwaApplications.map(app => (
              <div
                key={app.id}
                className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#2596be]" />
                    <h3 className="text-base font-bold text-[#142326]">{app.societyName}</h3>
                    <span className="text-[10px] px-2 py-0.5 bg-[#2596be]/10 text-[#2596be] font-bold rounded">
                      {app.totalUnits} Units
                    </span>
                  </div>
                  <span className="text-[11px] text-[#667085]">
                    Received: {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F8F9FA] p-3 rounded-xl border border-[#E5E7EB]">
                  <div>
                    <span className="text-[#667085] block">RWA Contact:</span>
                    <strong className="text-[#142326]">{app.rwaContact}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Area / Locality:</span>
                    <strong className="text-[#142326]">{app.area}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Contact Number:</span>
                    <strong className="text-[#142326]">{app.phone}</strong>
                  </div>
                </div>

                {app.message && (
                  <p className="text-xs text-[#667085] bg-white p-3 rounded-xl border border-[#E5E7EB]">
                    &quot;{app.message}&quot;
                  </p>
                )}

                <div className="pt-2 flex items-center justify-end gap-2">
                  <a
                    href={`tel:${app.phone}`}
                    className="px-3 py-1.5 bg-white border border-[#E5E7EB] hover:border-[#2596be] text-xs font-semibold text-[#142326] rounded-lg flex items-center gap-1.5"
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
                    className="px-3 py-1.5 bg-[#2E8B57] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Vendor Applications List */}
      {tab === 'vendor' && (
        <div className="space-y-3">
          {vendorApplications.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#E5E7EB] text-xs text-[#667085]">
              No pending vendor onboarding submissions.
            </div>
          ) : (
            vendorApplications.map(vnd => (
              <div
                key={vnd.id}
                className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#2596be]" />
                    <h3 className="text-base font-bold text-[#142326]">{vnd.businessName}</h3>
                    <span className="text-[10px] px-2 py-0.5 bg-[#F8F9FA] text-[#667085] font-bold rounded">
                      {vnd.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#667085]">
                    {vnd.experienceYears} Years Experience
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F8F9FA] p-3 rounded-xl border border-[#E5E7EB]">
                  <div>
                    <span className="text-[#667085] block">Contact Person:</span>
                    <strong className="text-[#142326]">{vnd.contactPerson}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Phone / WhatsApp:</span>
                    <strong className="text-[#142326]">{vnd.phone}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Hubs:</span>
                    <strong className="text-[#142326]">{vnd.serviceAreas}</strong>
                  </div>
                </div>

                <div className="text-xs text-[#667085] space-y-1">
                  <div><strong>Offered Services:</strong> {vnd.servicesOffered}</div>
                  {vnd.pricingNotes && <div><strong>Pricing / Notes:</strong> {vnd.pricingNotes}</div>}
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <a
                    href={`tel:${vnd.phone}`}
                    className="px-3 py-1.5 bg-white border border-[#E5E7EB] hover:border-[#2596be] text-xs font-semibold text-[#142326] rounded-lg flex items-center gap-1.5"
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
                    className="px-3 py-1.5 bg-[#2E8B57] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
