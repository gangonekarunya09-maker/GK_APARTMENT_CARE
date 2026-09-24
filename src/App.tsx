/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Hero } from './components/resident/Hero';
import { ServiceCatalog } from './components/resident/ServiceCatalog';
import { TrustSection } from './components/resident/TrustSection';
import { MyBookingsView } from './components/resident/MyBookingsView';
import { RWAPartnershipsView } from './components/resident/RWAPartnershipsView';
import { VendorOnboardingView } from './components/resident/VendorOnboardingView';
import { BookingModal } from './components/resident/BookingModal';
import { WhatsAppShareModal } from './components/resident/WhatsAppShareModal';
import { MobileStickyCTA } from './components/resident/MobileStickyCTA';
import { Footer } from './components/common/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { PublicCampaignPage } from './components/public/PublicCampaignPage';
import { CommunityCustomerPortal } from './components/public/CommunityCustomerPortal';

const AppRouter: React.FC = () => {
  const {
    currentPath,
    isAdminAuthenticated,
    apartments,
    campaigns,
    services,
    setBookingModalService,
    residentTab,
    setResidentTab,
    selectedApartment,
    setSelectedApartmentId,
  } = useApp();

  // Check if current URL is a Community Customer Portal link
  const matchedCommunity = useMemo(() => {
    // 1. Query parameters: ?c=token_or_slug or ?community=id_or_slug
    const searchParams = new URLSearchParams(window.location.search);
    const queryCommunity = searchParams.get('c') || searchParams.get('community');
    if (queryCommunity) {
      const match = apartments.find(
        a =>
          a.id === queryCommunity ||
          a.slug === queryCommunity ||
          (a.portalToken && a.portalToken.toLowerCase() === queryCommunity.toLowerCase())
      );
      if (match) return match;
    }

    // 2. Path: /c/:communitySlug/:token or /c/:communitySlug
    const pathParts = currentPath.split('/').filter(Boolean);
    if (pathParts[0] === 'c' && pathParts[1]) {
      const slugOrToken = pathParts[1];
      const secondPart = pathParts[2];
      const match = apartments.find(
        a =>
          a.slug === slugOrToken ||
          a.id === slugOrToken ||
          (a.portalToken && a.portalToken.toLowerCase() === slugOrToken.toLowerCase()) ||
          (secondPart && a.portalToken && a.portalToken.toLowerCase() === secondPart.toLowerCase())
      );
      if (match) return match;
    }

    // 3. Path: /community-portal/:id
    if (pathParts[0] === 'community-portal' && pathParts[1]) {
      const match = apartments.find(a => a.id === pathParts[1] || a.slug === pathParts[1]);
      if (match) return match;
    }

    return null;
  }, [currentPath, apartments]);

  // Check if current URL is a Campaign link (WhatsApp shared link)
  const matchedCampaign = useMemo(() => {
    // 1. Query parameter token: ?token=ABC123 or ?campaign=ABC123
    const searchParams = new URLSearchParams(window.location.search);
    const queryToken = searchParams.get('token') || searchParams.get('campaign');
    if (queryToken) {
      const match = campaigns.find(
        c => c.token.toLowerCase() === queryToken.toLowerCase() || c.id === queryToken
      );
      if (match) return match;
    }

    // 2. Path: /community/:communitySlug/:serviceSlug/:token
    const pathParts = currentPath.split('/').filter(Boolean);
    if (pathParts[0] === 'community' && pathParts.length >= 4) {
      const token = pathParts[3];
      const match = campaigns.find(
        c => c.token.toLowerCase() === token.toLowerCase() || c.id === token
      );
      if (match) return match;
    }

    // 3. Path: /campaign/:token or /book/:token
    if ((pathParts[0] === 'campaign' || pathParts[0] === 'book') && pathParts[1]) {
      const token = pathParts[1];
      const match = campaigns.find(
        c => c.token.toLowerCase() === token.toLowerCase() || c.id === token
      );
      if (match) return match;
    }

    return null;
  }, [currentPath, campaigns]);

  // Support legacy service deep-linking on mount: ?service=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');
    if (serviceParam && !matchedCampaign && !matchedCommunity) {
      const match = services.find(
        s => s.id === serviceParam || s.name.toLowerCase().includes(serviceParam.toLowerCase())
      );
      if (match) {
        setBookingModalService(match);
      }
    }
  }, [services, setBookingModalService, matchedCampaign, matchedCommunity]);

  // Sync selectedApartmentId if URL points to a specific community or campaign
  useEffect(() => {
    if (matchedCommunity && matchedCommunity.id !== selectedApartment?.id) {
      setSelectedApartmentId(matchedCommunity.id);
    } else if (matchedCampaign && matchedCampaign.apartmentId !== selectedApartment?.id) {
      setSelectedApartmentId(matchedCampaign.apartmentId);
    }
  }, [matchedCommunity, matchedCampaign, selectedApartment?.id, setSelectedApartmentId]);

  // 1. If URL matches a community campaign link: render ONLY the Public Campaign Page
  if (matchedCampaign) {
    return <PublicCampaignPage campaign={matchedCampaign} />;
  }

  // 2. If URL matches a community customer portal: render dedicated Community Customer Portal
  if (matchedCommunity) {
    return <CommunityCustomerPortal apartment={matchedCommunity} />;
  }

  // 3. If URL is in /admin namespace
  const isAdminRoute = currentPath.startsWith('/admin') || new URLSearchParams(window.location.search).get('admin') === 'true';
  if (isAdminRoute) {
    // If not authenticated or on login path, render Admin Login screen
    if (!isAdminAuthenticated || currentPath === '/admin/login') {
      return <AdminLogin />;
    }
    // Authenticated admin accessing dashboard
    return <AdminDashboard />;
  }

  // 4. Default Public Resident Experience (No admin buttons or private controls exposed)
  const handleScrollToCatalog = () => {
    setResidentTab('services');
    setTimeout(() => {
      const el = document.getElementById('services-catalog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleBookNow = () => {
    setResidentTab('services');
    const featured = services.find(s => s.id === 'srv-car-wash') || services[0];
    if (featured) {
      setBookingModalService(featured);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#142326] flex flex-col antialiased selection:bg-[#2596be]/20 selection:text-[#142326]">
      <Navbar />

      <main className="flex-1">
        {residentTab === 'community' && (
          <CommunityCustomerPortal apartment={selectedApartment || apartments[0]} />
        )}

        {residentTab === 'services' && (
          <>
            <Hero
              onExploreClick={handleScrollToCatalog}
              onBookNowClick={handleBookNow}
            />
            <ServiceCatalog />
            <TrustSection />
          </>
        )}

        {residentTab === 'my-bookings' && <MyBookingsView />}

        {residentTab === 'rwa' && <RWAPartnershipsView />}

        {residentTab === 'vendor' && <VendorOnboardingView />}
      </main>

      <Footer />
      <MobileStickyCTA />

      {/* Global interactive modals */}
      <BookingModal />
      <WhatsAppShareModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
