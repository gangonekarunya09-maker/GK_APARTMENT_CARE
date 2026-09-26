import React, { useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { resolveRoute, isAdminPath } from './lib/router';
import { Navbar } from './components/common/Navbar';
import { Hero } from './components/resident/Hero';
import { ServiceCatalog } from './components/resident/ServiceCatalog';
import { TrustSection } from './components/resident/TrustSection';
import { MyBookingsView } from './components/resident/MyBookingsView';
import { RWAPartnershipsView } from './components/resident/RWAPartnershipsView';
import { VendorOnboardingView } from './components/resident/VendorOnboardingView';
import { BookingModal } from './components/resident/BookingModal';
import { WhatsAppShareModal } from './components/resident/WhatsAppShareModal';
import { Footer } from './components/common/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { PublicCampaignPage } from './components/public/PublicCampaignPage';
import { CommunityCustomerPortal } from './components/public/CommunityCustomerPortal';

/* ------------------------------------------------------------------ */
/* Public route data loader                                            */
/* ------------------------------------------------------------------ */

interface LoadedCampaign {
  campaign: import('./types').Campaign;
  apartment: import('./types').Apartment | null;
  service: import('./types').Service | null;
}

interface LoadedPortal {
  apartment: import('./types').Apartment;
  campaigns: import('./types').Campaign[];
  services: import('./types').Service[];
}

/**
 * Full-screen status panel shared by all public routes (loading / error / demo banner).
 * Kept intentionally simple and styled like the existing app.
 */
const StatusPanel: React.FC<{
  tone: 'loading' | 'error' | 'warn';
  title: string;
  message: string;
  onRetry?: () => void;
  onHome?: () => void;
}> = ({ tone, title, message, onRetry, onHome }) => {
  const accent =
    tone === 'error' ? '#DC2626' : tone === 'warn' ? '#F59E0B' : '#2596be';
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl border border-[#E5E7EB] text-center max-w-sm w-full space-y-3 shadow-xs">
        <div
          className="w-10 h-10 rounded-2xl mx-auto flex items-center justify-center text-white text-lg font-bold"
          style={{ backgroundColor: accent }}
        >
          {tone === 'loading' ? '…' : tone === 'error' ? '!' : 'i'}
        </div>
        <p className="text-sm font-bold text-[#142326]">{title}</p>
        <p className="text-xs text-[#667085] leading-relaxed">{message}</p>
        <div className="flex flex-col gap-2 pt-1">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full py-2.5 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Try Again
            </button>
          )}
          {onHome && (
            <button
              onClick={onHome}
              className="w-full py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA] text-[#142326] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Go to Homepage
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CampaignRoute: React.FC<{ token: string }> = ({ token }) => {
  const { fetchCampaignByToken, services, apartments } = useApp();
  const [state, setState] = React.useState<
    { status: 'loading' } | { status: 'ready'; data: LoadedCampaign } | { status: 'error'; message: string }
  >({ status: 'loading' });
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });

    (async () => {
      const res = await fetchCampaignByToken(token);
      if (cancelled) return;
      if (!res.success || !res.data) {
        setState({ status: 'error', message: res.error || 'Campaign not found.' });
        return;
      }
      const campaign = res.data;

      let apartment: import('./types').Apartment | null = null;
      let service: import('./types').Service | null = null;

      try {
        const { supabase, isSupabaseConfigured, mapApartmentFromDb, mapServiceFromDb } =
          await import('./lib/supabase');
        if (supabase && isSupabaseConfigured()) {
          // Scoped fetches: only the two rows this campaign page needs.
          const [{ data: aptRows }, { data: svcRows }] = await Promise.all([
            supabase.from('apartments').select('*').eq('id', campaign.apartmentId).limit(1),
            supabase.from('services').select('*').eq('id', campaign.serviceId).limit(1),
          ]);
          apartment = aptRows && aptRows.length > 0 ? mapApartmentFromDb(aptRows[0]) : null;
          service = svcRows && svcRows.length > 0 ? mapServiceFromDb(svcRows[0]) : null;
        } else {
          // Demo mode: resolve from seeded/local collections.
          apartment = apartments.find(a => a.id === campaign.apartmentId) || null;
          service = services.find(s => s.id === campaign.serviceId) || null;
        }
      } catch (err: any) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: err?.message || 'Could not load campaign details.',
          });
        }
        return;
      }

      if (cancelled) return;
      setState({ status: 'ready', data: { campaign, apartment, service } });
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, attempt]);

  if (state.status === 'loading') {
    return (
      <StatusPanel
        tone="loading"
        title="Loading campaign…"
        message="Fetching the latest community campaign details."
      />
    );
  }

  if (state.status === 'error') {
    return (
      <StatusPanel
        tone="error"
        title="Campaign Unavailable"
        message={state.message}
        onRetry={() => setAttempt(a => a + 1)}
        onHome={() => (window.location.href = '/')}
      />
    );
  }

  const { campaign, apartment, service } = state.data;
  if (!apartment || !service) {
    return (
      <StatusPanel
        tone="error"
        title="Campaign Data Incomplete"
        message="This campaign exists but its service or community details could not be loaded. It may have been unpublished."
        onRetry={() => setAttempt(a => a + 1)}
        onHome={() => (window.location.href = '/')}
      />
    );
  }

  return <PublicCampaignPage campaign={campaign} apartment={apartment} service={service} />;
};

const CommunityPortalRoute: React.FC<{
  slug: string | null;
  token: string | null;
}> = ({ slug, token }) => {
  const { fetchApartmentForPortal, campaigns, services, residentRequests } = useApp();
  const isLinkMode = Boolean(slug || token);

  const [state, setState] = React.useState<
    { status: 'loading' } | { status: 'ready'; data: LoadedPortal } | { status: 'error'; message: string }
  >({ status: 'loading' });
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    if (!isLinkMode) {
      // Resident "community" tab: use the already-loaded collections.
      setState({ status: 'ready', data: { apartment: null as any, campaigns: [], services: [] } });
      return;
    }
    let cancelled = false;
    setState({ status: 'loading' });

    (async () => {
      const res = await fetchApartmentForPortal(slug, token);
      if (cancelled) return;
      if (!res.success || !res.data) {
        setState({ status: 'error', message: res.error || 'Community not found.' });
        return;
      }
      const apartment = res.data;

      // Scoped public fetches — only this community's campaigns + their services.
      let communityCampaigns: import('./types').Campaign[] = [];
      let portalServices: import('./types').Service[] = [];

      try {
        const { supabase, isSupabaseConfigured, mapCampaignFromDb, mapServiceFromDb } =
          await import('./lib/supabase');
        if (supabase && isSupabaseConfigured()) {
          const { data: campRows, error: campErr } = await supabase
            .from('campaigns')
            .select('*')
            .eq('apartment_id', apartment.id)
            .order('created_at', { ascending: false });
          if (campErr) throw new Error(campErr.message);
          communityCampaigns = (campRows || []).map((r: any) => mapCampaignFromDb(r));

          const serviceIds = Array.from(
            new Set(communityCampaigns.map(c => c.serviceId).filter(Boolean))
          );
          if (serviceIds.length > 0) {
            const { data: svcRows } = await supabase
              .from('services')
              .select('*')
              .in('id', serviceIds as string[]);
            portalServices = (svcRows || []).map((r: any) => mapServiceFromDb(r));
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: err?.message || 'Could not load services for this community.',
          });
        }
        return;
      }

      if (cancelled) return;
      setState({
        status: 'ready',
        data: { apartment, campaigns: communityCampaigns, services: portalServices },
      });
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, token, isLinkMode, attempt]);

  // Resident tab mode: derive from global collections for the selected community.
  const tabApartment = useApp().selectedApartment;
  if (!isLinkMode) {
    if (!tabApartment) {
      return (
        <StatusPanel
          tone="warn"
          title="No Community Selected"
          message="Choose your community from the navigation to see its services."
        />
      );
    }
    return (
      <CommunityCustomerPortal
        apartment={tabApartment}
        campaigns={campaigns.filter(c => c.apartmentId === tabApartment.id)}
        services={services}
        residentRequests={residentRequests}
        allowLookup
      />
    );
  }

  if (state.status === 'loading') {
    return (
      <StatusPanel
        tone="loading"
        title="Loading community portal…"
        message="Fetching services and campaigns for this community."
      />
    );
  }

  if (state.status === 'error') {
    return (
      <StatusPanel
        tone="error"
        title="Community Portal Unavailable"
        message={state.message}
        onRetry={() => setAttempt(a => a + 1)}
        onHome={() => (window.location.href = '/')}
      />
    );
  }

  return (
    <CommunityCustomerPortal
      apartment={state.data.apartment}
      campaigns={state.data.campaigns}
      services={state.data.services}
      residentRequests={[]}
      allowLookup={false}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

const AppRouter: React.FC = () => {
  const {
    currentPath,
    isAdminAuthenticated,
    isAdminReady,
    isBackendConnected,
    dataStatus,
    dataError,
    reloadAll,
    services,
    setBookingModalService,
    residentTab,
    setResidentTab,
  } = useApp();

  const route = useMemo(
    () => resolveRoute(currentPath, window.location.search),
    [currentPath]
  );

  const admin = useMemo(
    () => isAdminPath(currentPath, window.location.search),
    [currentPath]
  );

  /* ---------------- Admin routes ---------------- */
  if (admin.isAdmin) {
    if (!isBackendConnected) {
      return (
        <StatusPanel
          tone="warn"
          title="Admin Portal Requires Supabase"
          message="Administrator sign-in is disabled because the Supabase backend is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable the operations portal."
          onHome={() => (window.location.href = '/')}
        />
      );
    }
    if (!isAdminReady) {
      return (
        <StatusPanel
          tone="loading"
          title="Checking your session…"
          message="Verifying administrator credentials with Supabase Auth."
        />
      );
    }
    if (!isAdminAuthenticated || admin.isLoginPath) {
      return <AdminLogin />;
    }
    return <AdminDashboard />;
  }

  /* ---------------- Campaign routes ---------------- */
  if (route.kind === 'campaign' && route.campaignToken) {
    return <CampaignRoute token={route.campaignToken} />;
  }

  /* ---------------- Community portal routes ---------------- */
  if (route.kind === 'community') {
    // Missing token with slug-only path is allowed (portal resolves by slug).
    if (!route.communitySlug && !route.communityToken && !route.communityIdOrSlug) {
      return (
        <StatusPanel
          tone="error"
          title="Invalid Community Link"
          message="This URL does not point to a valid community portal."
          onHome={() => (window.location.href = '/')}
        />
      );
    }
    return (
      <CommunityPortalRoute
        slug={route.communitySlug || route.communityIdOrSlug}
        token={route.communityToken}
      />
    );
  }

  /* ---------------- General website (all / routes) ---------------- */
  // `/` always shows the general GK Apartment Care website.
  // No community selector, no community gate, no LandingPage.
  // Community portal links (/c/:slug/:token) are routed above.
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
