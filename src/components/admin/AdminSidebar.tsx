import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  Sparkles,
  Layers,
  Users,
  Megaphone,
  Inbox,
  CalendarCheck,
  TrendingUp,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut,
  RotateCcw,
  X,
  Wallet,
  IndianRupee
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const {
    adminSection,
    setAdminSection,
    setActiveCampaignId,
    campaigns,
    apartments,
    services,
    categories,
    providers,
    residentRequests,
    bookings,
    logoutAdmin,
    resetToDemoData,
  } = useApp();

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'apartments', label: 'Communities', icon: Building2, count: apartments.length },
    { id: 'services', label: 'Services', icon: Sparkles, count: services.length },
    { id: 'categories', label: 'Service Categories', icon: Layers, count: categories.length },
    { id: 'providers', label: 'Service Providers', icon: Users, count: providers.length },
    { id: 'commissions', label: 'Commissions & Payouts', icon: Wallet },
    { id: 'campaigns', label: 'Community Campaigns', icon: Megaphone, count: campaigns.length },
    { id: 'requests', label: 'Customer Requests', icon: Inbox, count: residentRequests.length, alert: residentRequests.length > 0 },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, count: bookings.length },
    { id: 'demand', label: 'Demand', icon: TrendingUp },
    { id: 'whatsapp', label: 'WhatsApp Links', icon: MessageCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col h-full shrink-0">
      {/* Brand header */}
      <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
        <Logo size="sm" showSubtitle={false} />
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 text-[#667085] hover:bg-[#F8F9FA] rounded-md md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-4 py-2 bg-[#F8F9FA] border-b border-[#E5E7EB] flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#2596be]">
          Private Admin Portal
        </span>
        <span className="text-[10px] text-[#2E8B57] font-bold">● Active</span>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = adminSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setAdminSection(item.id);
                setActiveCampaignId(null);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2596be] text-white shadow-xs'
                  : 'text-[#142326] hover:bg-[#F8F9FA] hover:text-[#2596be]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#667085]'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.alert
                      ? 'bg-[#2596be]/10 text-[#2596be]'
                      : 'bg-[#F8F9FA] text-[#667085]'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions: Sign Out & Reset */}
      <div className="p-3 border-t border-[#E5E7EB] space-y-2">
        <button
          onClick={logoutAdmin}
          className="w-full py-2 px-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] text-[#DC2626] text-xs font-bold rounded-xl border border-[#E5E7EB] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Admin</span>
        </button>

        <button
          onClick={() => {
            if (confirm('Reset all demo data back to default initial state?')) {
              resetToDemoData();
            }
          }}
          className="w-full py-1.5 text-[11px] text-[#667085] hover:text-[#DC2626] flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
};
