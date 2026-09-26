import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { CampaignsManager } from './CampaignsManager';
import { ApartmentsManager } from './ApartmentsManager';
import { ServicesManager } from './ServicesManager';
import { CategoriesManager } from './CategoriesManager';
import { ProvidersManager } from './ProvidersManager';
import { CommissionsManager } from './CommissionsManager';
import { ResidentRequestsManager } from './ResidentRequestsManager';
import { BookingsManager } from './BookingsManager';
import { DemandManager } from './DemandManager';
import { WhatsAppCampaigns } from './WhatsAppCampaigns';
import { AdminAnalytics } from './AdminAnalytics';
import { Menu, X, LogOut, RotateCcw } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { adminSection, logoutAdmin, resetToDemoData } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (adminSection) {
      case 'overview':
        return <AdminOverview />;
      case 'apartments':
        return <ApartmentsManager />;
      case 'services':
        return <ServicesManager />;
      case 'categories':
        return <CategoriesManager />;
      case 'providers':
        return <ProvidersManager />;
      case 'commissions':
        return <CommissionsManager />;
      case 'campaigns':
        return <CampaignsManager />;
      case 'requests':
        return <ResidentRequestsManager />;
      case 'bookings':
        return <BookingsManager />;
      case 'demand':
        return <DemandManager />;
      case 'whatsapp':
        return <WhatsAppCampaigns />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'settings':
        return (
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4 max-w-lg">
            <h3 className="text-base font-bold text-[#142326]">Operator System Settings</h3>
            <p className="text-xs text-[#667085]">
              GK Apartment Care hyper-local operations portal configuration.
            </p>
            <div className="pt-2 space-y-3">
              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] text-xs">
                <div className="font-bold text-[#142326]">Active Operator:</div>
                <div className="text-[#667085]">admin@gkapartmentcare.com</div>
              </div>
              <button
                onClick={() => {
                  if (confirm('Reset all demo data back to default initial state?')) {
                    resetToDemoData();
                  }
                }}
                className="w-full py-2.5 px-4 bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] text-[#DC2626] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Campaigns &amp; Requests</span>
              </button>
            </div>
          </div>
        );
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden text-[#142326]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-72 h-full bg-white shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Operations Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Top Header */}
        <header className="md:hidden bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 text-[#142326] border border-[#E5E7EB] rounded-lg"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-[#142326]">
              GK Operations Admin
            </span>
          </div>

          <button
            onClick={logoutAdmin}
            className="text-xs font-semibold text-[#DC2626] flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </header>

        {/* Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};
