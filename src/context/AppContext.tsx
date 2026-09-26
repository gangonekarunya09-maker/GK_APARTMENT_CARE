import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import {
  Apartment,
  ServiceCategory,
  ServiceProvider,
  Service,
  Booking,
  BookingStatus,
  Campaign,
  CampaignStatus,
  ResidentRequest,
  RWAPartnershipApplication,
  VendorApplication,
  CommissionSettlement,
  CommissionStatus,
} from '../types';
import {
  INITIAL_APARTMENTS,
  INITIAL_CATEGORIES,
  INITIAL_PROVIDERS,
  INITIAL_SERVICES,
  INITIAL_BOOKINGS,
  INITIAL_CAMPAIGNS,
  INITIAL_RESIDENT_REQUESTS,
  INITIAL_RWA_APPLICATIONS,
  INITIAL_VENDOR_APPLICATIONS,
} from '../data/mockData';
import {
  supabase,
  isSupabaseConfigured,
  SUPABASE_CONFIG_ERROR,
  mapApartmentFromDb,
  mapApartmentToDb,
  mapCategoryFromDb,
  mapCategoryToDb,
  mapProviderFromDb,
  mapProviderToDb,
  mapServiceFromDb,
  mapServiceToDb,
  mapCampaignFromDb,
  mapCampaignToDb,
  mapResidentRequestFromDb,
  mapResidentRequestToDb,
  mapBookingFromDb,
  mapBookingToDb,
  mapRWAApplicationFromDb,
  mapRWAApplicationToDb,
  mapVendorApplicationFromDb,
  mapVendorApplicationToDb,
} from '../lib/supabase';
import { generateId, generateShareToken, slugify } from '../lib/ids';
import {
  getCustomerPortalUrl as getCanonicalCustomerPortalUrl,
  getCustomerPortalPath as getCanonicalCustomerPortalPath,
} from '../lib/router';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error' | 'demo';

export interface MutationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  /** True when the resident already expressed interest in this campaign. */
  alreadyRegistered?: boolean;
}

interface AppContextType {
  // Routing & navigation
  currentPath: string;
  navigate: (path: string) => void;

  // Backend status
  isBackendConnected: boolean;
  backendError: string | null;
  dataStatus: LoadStatus;
  dataError: string | null;
  reloadAll: () => Promise<void>;

  // Auth
  authUser: SupabaseUser | null;
  isAdminAuthenticated: boolean;
  /** True once the initial Supabase session check has completed. */
  isAdminReady: boolean;
  loginAdmin: (email: string, password: string) => Promise<MutationResult>;
  logoutAdmin: () => Promise<void>;

  // Admin section
  adminSection: string;
  setAdminSection: (section: string) => void;
  activeCampaignId: string | null;
  setActiveCampaignId: (id: string | null) => void;
  adminSelectedCommunityId: string | null;
  setAdminSelectedCommunityId: (id: string | null) => void;

  // Resident navigation
  residentTab: 'services' | 'community' | 'my-bookings' | 'rwa' | 'vendor';
  setResidentTab: (tab: 'services' | 'community' | 'my-bookings' | 'rwa' | 'vendor') => void;

  // Selected apartment
  selectedApartmentId: string;
  setSelectedApartmentId: (id: string) => void;
  selectedApartment: Apartment | undefined;
  /** True once the visitor explicitly entered the resident experience this session. */
  hasExplicitCommunity: boolean;

  // Data collections
  apartments: Apartment[];
  categories: ServiceCategory[];
  providers: ServiceProvider[];
  services: Service[];
  campaigns: Campaign[];
  residentRequests: ResidentRequest[];
  bookings: Booking[];
  rwaApplications: RWAPartnershipApplication[];
  vendorApplications: VendorApplication[];

  // Public scoped fetchers (used by anonymous link pages)
  fetchApartmentForPortal: (
    slugOrToken: string | null,
    token: string | null
  ) => Promise<MutationResult<Apartment>>;
  fetchCampaignByToken: (token: string) => Promise<MutationResult<Campaign>>;

  // Campaign & demand mutations (awaitable)
  createCampaign: (
    campaignData: Omit<Campaign, 'id' | 'createdAt' | 'currentDemand'>
  ) => Promise<MutationResult<Campaign>>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<MutationResult>;
  updateCampaignStatus: (
    id: string,
    status: CampaignStatus,
    providerId?: string
  ) => Promise<MutationResult>;
  assignProviderToCampaign: (campaignId: string, providerId: string) => Promise<MutationResult>;
  submitResidentInterest: (
    requestData: Omit<ResidentRequest, 'id' | 'status' | 'submittedAt'>
  ) => Promise<MutationResult<ResidentRequest>>;

  // Apartment mutations (awaitable)
  addApartment: (apt: Omit<Apartment, 'id' | 'createdAt'>) => Promise<MutationResult<Apartment>>;
  updateApartment: (id: string, apt: Partial<Apartment>) => Promise<MutationResult>;
  toggleApartmentStatus: (id: string) => Promise<MutationResult>;
  generateCustomerPortalToken: (apartmentId: string) => Promise<MutationResult<string>>;
  getCustomerPortalUrl: (apartment: Apartment) => string;
  getCustomerPortalPath: (apartment: Apartment) => string;
  submitCommunityDemand: (data: {
    apartmentId: string;
    serviceName: string;
    residentName: string;
    phone: string;
    flatNumber: string;
    notes?: string;
  }) => Promise<MutationResult<ResidentRequest>>;

  addCategory: (cat: Omit<ServiceCategory, 'id'>) => Promise<MutationResult<ServiceCategory>>;
  toggleCategoryStatus: (id: string) => Promise<MutationResult>;

  addProvider: (
    prov: Omit<ServiceProvider, 'id' | 'createdAt' | 'completedJobs' | 'rating'>
  ) => Promise<MutationResult<ServiceProvider>>;
  updateProvider: (id: string, prov: Partial<ServiceProvider>) => Promise<MutationResult>;

  addService: (
    srv: Omit<Service, 'id' | 'createdAt' | 'currentDemand'>
  ) => Promise<MutationResult<Service>>;
  updateService: (id: string, srv: Partial<Service>) => Promise<MutationResult>;

  createBooking: (bookingData: {
    serviceId: string;
    apartmentId: string;
    residentName: string;
    phone: string;
    email?: string;
    block: string;
    flatNumber: string;
    date: string;
    slot: string;
    price: number;
    bookingType: 'regular' | 'sunday_bulk';
    campaignId?: string;
    notes?: string;
  }) => Promise<MutationResult<Booking>>;
  updateBookingStatus: (
    bookingId: string,
    status: BookingStatus,
    providerId?: string
  ) => Promise<MutationResult>;

  // Commission & Payouts management
  defaultCommissionRate: number;
  setDefaultCommissionRate: (rate: number) => void;
  settlements: CommissionSettlement[];
  createSettlement: (data: {
    providerId: string;
    bookingIds: string[];
    paymentMethod: 'upi' | 'bank_transfer' | 'cash' | 'other';
    transactionReference: string;
    notes?: string;
  }) => Promise<MutationResult<CommissionSettlement>>;
  updateBookingCommission: (
    bookingId: string,
    updates: {
      commissionStatus?: CommissionStatus;
      commissionRate?: number;
      settlementReference?: string;
      settledAt?: string;
    }
  ) => Promise<MutationResult>;

  submitRWAApplication: (
    app: Omit<RWAPartnershipApplication, 'id' | 'status' | 'createdAt'>
  ) => Promise<MutationResult<RWAPartnershipApplication>>;
  submitVendorApplication: (
    app: Omit<VendorApplication, 'id' | 'status' | 'createdAt'>
  ) => Promise<MutationResult<VendorApplication>>;

  // Modals / active state
  bookingModalService: Service | null;
  setBookingModalService: (srv: Service | null) => void;
  shareModalService: Service | null;
  setShareModalService: (srv: Service | null) => void;
  trackingBooking: Booking | null;
  setTrackingBooking: (booking: Booking | null) => void;
  societySelectorOpen: boolean;
  setSocietySelectorOpen: (open: boolean) => void;

  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ADMIN_SECTION: 'gk_admin_section_v2',
  DEMO_APARTMENTS: 'gk_demo_apartments_v1',
  DEMO_CATEGORIES: 'gk_demo_categories_v1',
  DEMO_PROVIDERS: 'gk_demo_providers_v1',
  DEMO_SERVICES: 'gk_demo_services_v1',
  DEMO_CAMPAIGNS: 'gk_demo_campaigns_v1',
  DEMO_RESIDENT_REQUESTS: 'gk_demo_resident_requests_v1',
  DEMO_BOOKINGS: 'gk_demo_bookings_v1',
  DEMO_RWA_APPS: 'gk_demo_rwa_apps_v1',
  DEMO_VENDOR_APPS: 'gk_demo_vendor_apps_v1',
};

function loadLocalData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function saveLocalData(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isBackendConnected = isSupabaseConfigured();
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(!isBackendConnected);
  const [dataStatus, setDataStatus] = useState<LoadStatus>('idle');
  const [dataError, setDataError] = useState<string | null>(null);

  /* ---------------- Routing ---------------- */
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
    try {
      window.history.pushState({}, '', path);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname || '/');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /* ---------------- Auth (Supabase only in production) ---------------- */
  useEffect(() => {
    if (!supabase || !isBackendConnected) {
      setAuthChecked(true);
      setIsAdminAuthenticated(false);
      return;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        if (data.session?.user) {
          setAuthUser(data.session.user);
          setIsAdminAuthenticated(true);
        } else {
          setAuthUser(null);
          setIsAdminAuthenticated(false);
        }
      })
      .catch(() => {
        if (mounted) setIsAdminAuthenticated(false);
      })
      .finally(() => {
        if (mounted) setAuthChecked(true);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setAuthUser(session.user);
        setIsAdminAuthenticated(true);
      } else {
        setAuthUser(null);
        setIsAdminAuthenticated(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isBackendConnected]);

  /* ---------------- Data loading ---------------- */
  const loadSupabaseData = useCallback(async () => {
    if (!supabase || !isBackendConnected) return;
    setDataStatus(s => (s === 'ready' ? s : 'loading'));
    try {
      const [
        { data: dbApts, error: eApts },
        { data: dbCats, error: eCats },
        { data: dbProvs, error: eProvs },
        { data: dbSrvs, error: eSrvs },
        { data: dbCamps, error: eCamps },
        { data: dbReqs, error: eReqs },
        { data: dbBooks, error: eBooks },
        { data: dbRwa, error: eRwa },
        { data: dbVnd, error: eVnd },
      ] = await Promise.all([
        supabase.from('apartments').select('*').order('name'),
        supabase.from('service_categories').select('*').order('name'),
        supabase.from('service_providers').select('*').order('business_name'),
        supabase.from('services').select('*').order('created_at', { ascending: false }),
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('resident_requests').select('*').order('submitted_at', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('rwa_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('vendor_applications').select('*').order('created_at', { ascending: false }),
      ]);

      const firstError = eApts || eCats || eProvs || eSrvs || eCamps || eReqs || eBooks || eRwa || eVnd;
      if (firstError) {
        setDataError(firstError.message || 'Failed to load data from Supabase.');
        setDataStatus('error');
        return;
      }

      setApartments(dbApts ? dbApts.map(mapApartmentFromDb) : []);
      setCategories(dbCats ? dbCats.map(mapCategoryFromDb) : []);
      setProviders(dbProvs ? dbProvs.map(mapProviderFromDb) : []);
      setServices(dbSrvs ? dbSrvs.map(mapServiceFromDb) : []);
      setCampaigns(dbCamps ? dbCamps.map(mapCampaignFromDb) : []);
      setResidentRequests(dbReqs ? dbReqs.map(mapResidentRequestFromDb) : []);
      setBookings(dbBooks ? dbBooks.map(mapBookingFromDb) : []);
      setRwaApplications(dbRwa ? dbRwa.map(mapRWAApplicationFromDb) : []);
      setVendorApplications(dbVnd ? dbVnd.map(mapVendorApplicationFromDb) : []);
      setDataError(null);
      setDataStatus('ready');
    } catch (err: any) {
      setDataError(err?.message || 'Unexpected error while loading data.');
      setDataStatus('error');
    }
  }, [isBackendConnected]);

  useEffect(() => {
    if (!isBackendConnected) {
      // Demo mode: load from localStorage or seed from mocks once.
      if (dataStatus === 'idle') {
        setApartments(loadLocalData(STORAGE_KEYS.DEMO_APARTMENTS, INITIAL_APARTMENTS));
        setCategories(loadLocalData(STORAGE_KEYS.DEMO_CATEGORIES, INITIAL_CATEGORIES));
        setProviders(loadLocalData(STORAGE_KEYS.DEMO_PROVIDERS, INITIAL_PROVIDERS));
        setServices(loadLocalData(STORAGE_KEYS.DEMO_SERVICES, INITIAL_SERVICES));
        setCampaigns(loadLocalData(STORAGE_KEYS.DEMO_CAMPAIGNS, INITIAL_CAMPAIGNS));
        setResidentRequests(loadLocalData(STORAGE_KEYS.DEMO_RESIDENT_REQUESTS, INITIAL_RESIDENT_REQUESTS));
        setBookings(loadLocalData(STORAGE_KEYS.DEMO_BOOKINGS, INITIAL_BOOKINGS));
        setRwaApplications(loadLocalData(STORAGE_KEYS.DEMO_RWA_APPS, INITIAL_RWA_APPLICATIONS));
        setVendorApplications(loadLocalData(STORAGE_KEYS.DEMO_VENDOR_APPS, INITIAL_VENDOR_APPLICATIONS));
        setDataStatus('demo');
      }
      return;
    }
    loadSupabaseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBackendConnected, loadSupabaseData]);

  /* ---------------- Scoped realtime ---------------- */
  const realtimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!supabase || !isBackendConnected) return;

    // Full reload is acceptable for admin; public pages use scoped fetchers.
    const reloadRef = { current: loadSupabaseData };
    const channel = supabase
      .channel('gk-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'campaigns' },
        () => {
          if (realtimeRef.current) clearTimeout(realtimeRef.current);
          realtimeRef.current = setTimeout(() => reloadRef.current(), 800);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'apartments' },
        () => {
          if (realtimeRef.current) clearTimeout(realtimeRef.current);
          realtimeRef.current = setTimeout(() => reloadRef.current(), 800);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'resident_requests' },
        () => {
          if (realtimeRef.current) clearTimeout(realtimeRef.current);
          realtimeRef.current = setTimeout(() => reloadRef.current(), 800);
        }
      )
      .subscribe();

    return () => {
      if (realtimeRef.current) clearTimeout(realtimeRef.current);
      supabase.removeChannel(channel);
    };
  }, [isBackendConnected, loadSupabaseData]);

  /* ---------------- Selected apartment (session-scoped) ---------------- */
  // Deliberately NOT restored from localStorage: the root landing page must
  // never auto-enter a previously selected community. Selection happens only
  // via an explicit user action and lives for the current session.
  const [selectedApartmentId, setSelectedApartmentId] = useState<string>('');

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [residentRequests, setResidentRequests] = useState<ResidentRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rwaApplications, setRwaApplications] = useState<RWAPartnershipApplication[]>([]);
  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>([]);

  // Sync demo mode state changes to localStorage so that user interactions,
  // interest registrations, and bookings persist across page reloads.
  useEffect(() => {
    if (!isBackendConnected && dataStatus === 'demo') {
      saveLocalData(STORAGE_KEYS.DEMO_APARTMENTS, apartments);
    }
  }, [apartments, isBackendConnected, dataStatus]);

  useEffect(() => {
    if (!isBackendConnected && dataStatus === 'demo') {
      saveLocalData(STORAGE_KEYS.DEMO_CATEGORIES, categories);
    }
  }, [categories, isBackendConnected, dataStatus]);

  useEffect(() => {
    if (!isBackendConnected && dataStatus === 'demo') {
      saveLocalData(STORAGE_KEYS.DEMO_PROVIDERS, providers);
    }
  }, [providers, isBackendConnected, dataStatus]);

  useEffect(() => {
    if (!isBackendConnected && dataStatus === 'demo') {
      saveLocalData(STORAGE_KEYS.DEMO_SERVICES, services);
    }
  }, [services, isBackendConnected, dataStatus]);

  useEffect(() => {
    if (!isBackendConnected && dataStatus === 'demo') {
      saveLocalData(STORAGE_KEYS.DEMO_CAMPAIGNS, campaigns);
    }
  }, [campaigns, isBackendConnected, dataStatus]);

  useEffect(() => {
    if (!isBackendConnected && dataStatus === 'demo') {
      saveLocalData(STORAGE_KEYS.DEMO_RESIDENT_REQUESTS, residentRequests);
    }
  }, [residentRequests, isBackendConnected, dataStatus]);

  useEffect(() => {
    if (!isBackendConnected && dataStatus === 'demo') {
      saveLocalData(STORAGE_KEYS.DEMO_BOOKINGS, bookings);
    }
  }, [bookings, isBackendConnected, dataStatus]);

  useEffect(() => {
    if (!isBackendConnected && dataStatus === 'demo') {
      saveLocalData(STORAGE_KEYS.DEMO_RWA_APPS, rwaApplications);
    }
  }, [rwaApplications, isBackendConnected, dataStatus]);

  useEffect(() => {
    if (!isBackendConnected && dataStatus === 'demo') {
      saveLocalData(STORAGE_KEYS.DEMO_VENDOR_APPS, vendorApplications);
    }
  }, [vendorApplications, isBackendConnected, dataStatus]);

  // NOTE: community selection is session-scoped by design — nothing persisted.

  // No silent default: the root landing page must never impersonate a community
  // (previously this fell back to `apartments[0]`, branding `/` as whichever
  // community sorted first). A community is only "selected" through an explicit
  // user action (SocietySelectorModal) or an explicit /c/:slug/:token URL.
  const selectedApartment = selectedApartmentId
    ? apartments.find(a => a.id === selectedApartmentId)
    : undefined;

  // True once the visitor has explicitly chosen a community this session
  // (landing-page picker / SocietySelectorModal). Selection is session-scoped:
  // localStorage restore was removed so the root landing page never impersonates
  // a previously selected community.
  const hasExplicitCommunity = Boolean(selectedApartment);

  /* ---------------- Admin section (UI state only) ---------------- */
  const [adminSection, setAdminSection] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_SECTION) || 'campaigns';
    } catch {
      return 'campaigns';
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SECTION, adminSection);
    } catch {
      // ignore
    }
  }, [adminSection]);

  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [adminSelectedCommunityId, setAdminSelectedCommunityId] = useState<string | null>(null);
  const [residentTab, setResidentTab] = useState<
    'services' | 'community' | 'my-bookings' | 'rwa' | 'vendor'
  >('services');

  /* ---------------- Commission and Settlements State ---------------- */
  const [defaultCommissionRate, setDefaultCommissionRateState] = useState<number>(() => {
    try {
      const v = localStorage.getItem('gk_default_commission_rate');
      return v ? Number(v) : 15;
    } catch {
      return 15;
    }
  });

  const setDefaultCommissionRate = useCallback((rate: number) => {
    setDefaultCommissionRateState(rate);
    try {
      localStorage.setItem('gk_default_commission_rate', String(rate));
    } catch {
      // ignore
    }
  }, []);

  const [settlements, setSettlements] = useState<CommissionSettlement[]>(() => {
    try {
      const s = localStorage.getItem('gk_commission_settlements');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gk_commission_settlements', JSON.stringify(settlements));
    } catch {
      // ignore
    }
  }, [settlements]);

  /* ---------------- Modals ---------------- */
  const [bookingModalService, setBookingModalService] = useState<Service | null>(null);
  const [shareModalService, setShareModalService] = useState<Service | null>(null);
  const [trackingBooking, setTrackingBooking] = useState<Booking | null>(null);
  const [societySelectorOpen, setSocietySelectorOpen] = useState<boolean>(false);

  /* ---------------- Auth mutations ---------------- */
  const loginAdmin = useCallback(
    async (email: string, password: string): Promise<MutationResult> => {
      if (!supabase || !isBackendConnected) {
        return {
          success: false,
          error: SUPABASE_CONFIG_ERROR
            ? `Admin sign-in requires Supabase: ${SUPABASE_CONFIG_ERROR}`
            : 'Admin sign-in requires a configured Supabase backend.',
        };
      }
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        if (data.session?.user) {
          setAuthUser(data.session.user);
          setIsAdminAuthenticated(true);
          return { success: true };
        }
        return { success: false, error: 'Failed to establish session.' };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Unexpected authentication error.' };
      }
    },
    [isBackendConnected]
  );

  const logoutAdmin = useCallback(async () => {
    if (supabase && isBackendConnected) {
      await supabase.auth.signOut().catch(() => undefined);
    }
    setAuthUser(null);
    setIsAdminAuthenticated(false);
    navigate('/');
  }, [isBackendConnected, navigate]);

  /* ---------------- Public scoped fetchers ---------------- */
  const fetchApartmentForPortal = useCallback(
    async (slugOrToken: string | null, token: string | null): Promise<MutationResult<Apartment>> => {
      const cleanSlug = slugOrToken?.trim().toLowerCase();
      const cleanToken = token?.trim();

      if (!supabase || !isBackendConnected) {
        // Demo mode: resolve against seed data only. Strict slug+token pairing:
        // a valid token under a wrong slug must NOT load the community.
        const pool = apartments.length ? apartments : INITIAL_APARTMENTS;
        const match = pool.find(
          a =>
            Boolean(
              cleanSlug &&
                cleanToken &&
                (a.slug.toLowerCase() === cleanSlug || a.id.toLowerCase() === cleanSlug) &&
                a.portalToken &&
                a.portalToken.toLowerCase() === cleanToken.toLowerCase()
            ) ||
            Boolean(cleanSlug && !cleanToken && (a.slug.toLowerCase() === cleanSlug || a.id.toLowerCase() === cleanSlug)) ||
            Boolean(
              cleanToken &&
                !cleanSlug &&
                a.portalToken &&
                a.portalToken.toLowerCase() === cleanToken.toLowerCase()
            )
        );
        if (!match) {
          return { success: false, error: 'Community not found. Please check your link.' };
        }
        return { success: true, data: match };
      }

      try {
        let query = supabase.from('apartments').select('*').limit(1);
        if (cleanToken && cleanSlug) {
          // Strict pairing: slug AND token must match the SAME row, so a valid
          // portal token under a wrong slug can never load another community.
          query = query.eq('slug', cleanSlug).eq('portal_token', cleanToken);
        } else if (cleanToken) {
          query = query.eq('portal_token', cleanToken);
        } else if (cleanSlug) {
          query = query.eq('slug', cleanSlug);
        } else {
          return { success: false, error: 'Invalid community link.' };
        }

        const { data, error } = await query;
        if (error) {
          return { success: false, error: `Could not reach the community portal: ${error.message}` };
        }
        if (!data || data.length === 0) {
          return { success: false, error: 'Community not found. This link may be invalid or revoked.' };
        }
        return { success: true, data: mapApartmentFromDb(data[0]) };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Network error while loading community.' };
      }
    },
    [isBackendConnected, apartments]
  );

  const fetchCampaignByToken = useCallback(
    async (token: string): Promise<MutationResult<Campaign>> => {
      if (!supabase || !isBackendConnected) {
        const pool = campaigns.length ? campaigns : INITIAL_CAMPAIGNS;
        const match = pool.find(
          c => c.token.toLowerCase() === token.toLowerCase() || c.id === token
        );
        if (!match) {
          return { success: false, error: 'Campaign not found. Please check your link.' };
        }
        return { success: true, data: match };
      }

      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .ilike('token', token)
          .limit(1);
        if (error) {
          return { success: false, error: `Could not reach the campaign: ${error.message}` };
        }
        if (!data || data.length === 0) {
          return { success: false, error: 'Campaign not found. This link may have expired.' };
        }
        return { success: true, data: mapCampaignFromDb(data[0]) };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Network error while loading campaign.' };
      }
    },
    [isBackendConnected, campaigns]
  );

  /* ---------------- Mutation plumbing ---------------- */
  const runDb = useCallback(
    async (
      op: () => PromiseLike<{ error: { message: string } | null }>
    ): Promise<MutationResult> => {
      if (!supabase || !isBackendConnected) {
        // Demo mode: pretend success (localStorage already updated by caller).
        return { success: true };
      }
      try {
        const { error } = await op();
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Network error.' };
      }
    },
    [isBackendConnected]
  );

  /* ---------------- Campaign mutations ---------------- */
  const createCampaign = useCallback(
    async (
      campaignData: Omit<Campaign, 'id' | 'createdAt' | 'currentDemand'>
    ): Promise<MutationResult<Campaign>> => {
      if (!campaignData.apartmentId || !campaignData.serviceId) {
        return { success: false, error: 'Community and service are required.' };
      }
      if (!(campaignData.minimumDemand > 0)) {
        return { success: false, error: 'Minimum demand must be greater than zero.' };
      }

      let token = campaignData.token?.trim();
      if (!token) token = generateShareToken();

      const newCamp: Campaign = {
        ...campaignData,
        token,
        id: generateId('camp'),
        currentDemand: 0,
        createdAt: new Date().toISOString(),
      };

      setCampaigns(prev => [newCamp, ...prev]);

      const res = await runDb(() =>
        supabase!.from('campaigns').insert(mapCampaignToDb(newCamp))
      );
      if (!res.success) {
        setCampaigns(prev => prev.filter(c => c.id !== newCamp.id));
        return { success: false, error: res.error || 'Could not create campaign.' };
      }
      return { success: true, data: newCamp };
    },
    [runDb]
  );

  const updateCampaign = useCallback(
    async (id: string, updates: Partial<Campaign>): Promise<MutationResult> => {
      const existing = campaigns.find(c => c.id === id);
      if (!existing) return { success: false, error: 'Campaign not found.' };

      const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.providerId !== undefined) dbUpdates.provider_id = updates.providerId ?? null;
      if (updates.currentDemand !== undefined) dbUpdates.current_demand = updates.currentDemand;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.minimumDemand !== undefined) dbUpdates.minimum_demand = updates.minimumDemand;
      if (updates.normalPrice !== undefined) dbUpdates.normal_price = updates.normalPrice;
      if (updates.communityPrice !== undefined) dbUpdates.community_price = updates.communityPrice;
      if (updates.sundayBulkPrice !== undefined)
        dbUpdates.sunday_bulk_price = updates.sundayBulkPrice ?? null;

      setCampaigns(prev =>
        prev.map(c => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
      );

      const res = await runDb(() => supabase!.from('campaigns').update(dbUpdates).eq('id', id));
      if (!res.success) {
        setCampaigns(prev => prev.map(c => (c.id === id ? existing : c)));
        return res;
      }
      return { success: true };
    },
    [campaigns, runDb]
  );

  const updateCampaignStatus = useCallback(
    async (id: string, status: CampaignStatus, providerId?: string): Promise<MutationResult> => {
      return updateCampaign(id, {
        status,
        ...(providerId !== undefined ? { providerId } : {}),
      });
    },
    [updateCampaign]
  );

  const assignProviderToCampaign = useCallback(
    async (campaignId: string, providerId: string): Promise<MutationResult> => {
      const camp = campaigns.find(c => c.id === campaignId);
      if (!camp) return { success: false, error: 'Campaign not found.' };
      return updateCampaign(campaignId, {
        providerId,
        status: camp.status === 'collecting_demand' ? 'provider_selected' : camp.status,
      });
    },
    [campaigns, updateCampaign]
  );

  const submitResidentInterest = useCallback(
    async (
      requestData: Omit<ResidentRequest, 'id' | 'status' | 'submittedAt'>
    ): Promise<MutationResult<ResidentRequest>> => {
      if (!requestData.campaignId || !requestData.apartmentId) {
        return { success: false, error: 'Invalid interest request.' };
      }
      if (!requestData.residentName?.trim() || !requestData.phone?.trim() || !requestData.flatNumber?.trim()) {
        return { success: false, error: 'Name, phone, and flat number are required.' };
      }

      // Resident identity = the project's existing fields (phone + block + flat)
      // scoped to the campaign. Normalize so "+91 98765 43210", "09876543210" and
      // "9876543210" are the same resident (digits only, last 10 digits); block/flat
      // compare trimmed + case-insensitively (same rule as the dedupe_key column
      // in supabase/schema.sql Section 2C).
      const normalizedPhone = requestData.phone.replace(/[^0-9]/g, '').slice(-10);
      const normalizedBlock = (requestData.block || '').trim();
      const normalizedFlat = requestData.flatNumber.trim().toLowerCase();

      if (!supabase || !isBackendConnected) {
        // Demo mode: enforce one-interest-per-campaign locally (before the
        // optimistic demand bump so a duplicate never inflates the counter).
        const existing = residentRequests.find(
          r =>
            r.campaignId === requestData.campaignId &&
            r.phone.replace(/[^0-9]/g, '').slice(-10) === normalizedPhone &&
            (r.block || '').trim().toLowerCase() === normalizedBlock.toLowerCase() &&
            r.flatNumber.trim().toLowerCase() === normalizedFlat
        );
        if (existing) {
          return {
            success: false,
            alreadyRegistered: true,
            error: 'You have already expressed interest in this service.',
          };
        }
      }

      if (supabase && isBackendConnected) {
        // Application-level duplicate check before ANY write or demand change.
        // Under the secure RLS v2 model anonymous reads return no rows
        // (USING (false)), so this is a harmless no-op there — the RPC and the
        // Section 2C unique index are the real guards. On legacy permissive
        // databases the read is allowed and blocks the duplicate client-side.
        const { data: existingRows } = await supabase
          .from('resident_requests')
          .select('phone, block, flat_number')
          .eq('campaign_id', requestData.campaignId)
          .limit(500);
        const isDuplicate = (existingRows || []).some(
          (r: any) =>
            String(r.phone || '').replace(/[^0-9]/g, '').slice(-10) === normalizedPhone &&
            String(r.block || '').trim().toLowerCase() === normalizedBlock.toLowerCase() &&
            String(r.flat_number || '').trim().toLowerCase() === normalizedFlat
        );
        if (isDuplicate) {
          return {
            success: false,
            alreadyRegistered: true,
            error: 'You have already expressed interest in this service.',
          };
        }
      }

      const newReq: ResidentRequest = {
        ...requestData,
        phone: normalizedPhone,
        block: normalizedBlock || 'Block A',
        flatNumber: requestData.flatNumber.trim(),
        id: generateId('req'),
        status: 'interested',
        submittedAt: new Date().toISOString(),
      };

      // Optimistic: increment local campaign demand.
      const campaign = campaigns.find(c => c.id === requestData.campaignId);
      setCampaigns(prev =>
        prev.map(c => {
          if (c.id === requestData.campaignId) {
            const nextDemand = c.currentDemand + 1;
            const nextStatus: CampaignStatus =
              nextDemand >= c.minimumDemand && c.status === 'collecting_demand'
                ? 'target_reached'
                : c.status;
            return { ...c, currentDemand: nextDemand, status: nextStatus, updatedAt: new Date().toISOString() };
          }
          return c;
        })
      );

      if (!supabase || !isBackendConnected) {
        setResidentRequests(prev => [newReq, ...prev]);
        return { success: true, data: newReq };
      }

      // Atomic server-side write: the SECURITY DEFINER RPC (schema v2) inserts
      // the request AND increments campaign current_demand (flipping status at
      // target) in one transaction, returning the fresh campaign row. A plain
      // INSERT here would leave current_demand stale in the DB, and the
      // authoritative refetch would silently roll back the optimistic bump.
      const rpcPayload = {
        p_campaign_id: requestData.campaignId,
        p_request: {
          id: newReq.id,
          residentName: newReq.residentName,
          phone: newReq.phone,
          block: newReq.block,
          flatNumber: newReq.flatNumber,
          email: newReq.email ?? '',
          preferredDate: newReq.preferredDate ?? '',
          preferredSlot: newReq.preferredSlot ?? '',
          notes: newReq.notes ?? '',
        },
      };

      let campRow: any = null;
      let duplicateInterest = false;
      const { data: rpcData, error } = await supabase.rpc(
        'increment_campaign_demand',
        rpcPayload
      );
      // v3 RPC returns { duplicate, campaign }; an older v2 RPC (pre-dedupe)
      // returned the bare campaigns row — accept both so deploy order never
      // breaks interest submission.
      if (rpcData && typeof rpcData === 'object' && 'campaign' in rpcData) {
        duplicateInterest = Boolean((rpcData as any).duplicate);
        campRow = (rpcData as any).campaign;
      } else {
        campRow = rpcData;
      }

      // Duplicate interest (v3 RPC): nothing was written server-side — roll
      // back the optimistic bump and tell the resident they are registered.
      if (duplicateInterest) {
        setCampaigns(prev =>
          prev.map(c =>
            c.id === requestData.campaignId
              ? { ...c, currentDemand: Math.max(0, c.currentDemand - 1) }
              : c
          )
        );
        return {
          success: false,
          alreadyRegistered: true,
          error: 'You have already expressed interest in this service.',
        };
      }

      // Legacy-schema fallback: databases that have not run the v2 migration do
      // not have the RPC (404 PGRST202). There the old permissive RLS still
      // allows a plain INSERT plus a direct campaign update — keep the app
      // working and the demand counter accurate until the migration is applied.
      if (error && /PGRST202|not found|schema cache/i.test(error.message || '')) {
        const ins = await supabase
          .from('resident_requests')
          .insert(mapResidentRequestToDb(newReq))
          .select()
          .single();
        if (ins.error) {
          setCampaigns(prev =>
            prev.map(c =>
              c.id === requestData.campaignId
                ? { ...c, currentDemand: Math.max(0, c.currentDemand - 1) }
                : c
            )
          );
          return {
            success: false,
            ...(ins.error.code === '23505' ? { alreadyRegistered: true } : {}),
            error:
              ins.error.code === '23503'
                ? 'This campaign is no longer accepting interest.'
                : ins.error.code === '23505'
                ? 'You have already expressed interest in this service.'
                : ins.error.message || 'Could not save your request. Please try again.',
          };
        }
        const upd = await supabase
          .from('campaigns')
          .update({
            current_demand: (campaign?.currentDemand ?? 0) + 1,
            ...(campaign &&
            campaign.currentDemand + 1 >= campaign.minimumDemand &&
            campaign.status === 'collecting_demand'
              ? { status: 'target_reached' }
              : {}),
          })
          .eq('id', requestData.campaignId)
          .select()
          .single();
        campRow = upd.data;
      } else if (error) {
        // Non-404 RPC failure: roll back optimistic demand bump.
        setCampaigns(prev =>
          prev.map(c =>
            c.id === requestData.campaignId
              ? { ...c, currentDemand: Math.max(0, c.currentDemand - 1) }
              : c
          )
        );
        return {
          success: false,
          error: /campaign_not_found/i.test(error.message || '')
            ? 'This campaign is no longer accepting interest.'
            : error.message || 'Could not save your request. Please try again.',
        };
      }

      const saved: ResidentRequest = { ...newReq };
      setResidentRequests(prev => [saved, ...prev]);

      // Adopt the authoritative campaign row returned by the RPC
      // (demand already incremented server-side).
      if (campRow) {
        const fresh = mapCampaignFromDb(campRow);
        setCampaigns(prev => prev.map(c => (c.id === fresh.id ? fresh : c)));
      }

      return { success: true, data: saved };
    },
    [campaigns, residentRequests, isBackendConnected]
  );

  /* ---------------- Apartment mutations ---------------- */
  const addApartment = useCallback(
    async (apt: Omit<Apartment, 'id' | 'createdAt'>): Promise<MutationResult<Apartment>> => {
      if (!apt.name?.trim()) return { success: false, error: 'Community name is required.' };

      // Collision-free slug: two communities named "My Home Bhooja" must get
      // my-home-bhooja and my-home-bhooja-2, never two rows with the same URL.
      const base = slugify(apt.slug?.trim() || apt.name) || 'community';
      const taken = new Set(apartments.map(a => a.slug));
      let baseSlug = base;
      let suffix = 2;
      while (taken.has(baseSlug)) {
        baseSlug = `${base}-${suffix++}`;
      }
      const id = generateId('community');
      const newApt: Apartment = {
        ...apt,
        name: apt.name.trim(),
        slug: baseSlug,
        id,
        portalToken: apt.portalToken?.trim() || generateShareToken(6),
        createdAt: new Date().toISOString(),
      };

      setApartments(prev => [newApt, ...prev]);

      const res = await runDb(() => supabase!.from('apartments').insert(mapApartmentToDb(newApt)));
      if (!res.success) {
        setApartments(prev => prev.filter(a => a.id !== newApt.id));
        return { success: false, error: res.error || 'Could not create community.' };
      }
      return { success: true, data: newApt };
    },
    [apartments, runDb]
  );

  const updateApartment = useCallback(
    async (id: string, aptUpdates: Partial<Apartment>): Promise<MutationResult> => {
      const existing = apartments.find(a => a.id === id);
      if (!existing) return { success: false, error: 'Community not found.' };

      setApartments(prev => prev.map(a => (a.id === id ? { ...a, ...aptUpdates } : a)));

      const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (aptUpdates.name) dbUpdates.name = aptUpdates.name;
      if (aptUpdates.slug) dbUpdates.slug = aptUpdates.slug;
      if (aptUpdates.rwaContact !== undefined) dbUpdates.rwa_contact = aptUpdates.rwaContact;
      if (aptUpdates.rwaPhone !== undefined) dbUpdates.rwa_phone = aptUpdates.rwaPhone;
      if (aptUpdates.rwaEmail !== undefined) dbUpdates.rwa_email = aptUpdates.rwaEmail;
      if (aptUpdates.status) dbUpdates.status = aptUpdates.status;
      if (aptUpdates.notes !== undefined) dbUpdates.notes = aptUpdates.notes;
      if (aptUpdates.totalUnits !== undefined) dbUpdates.total_units = aptUpdates.totalUnits;
      if (aptUpdates.gateSecurityApp) dbUpdates.gate_security_app = aptUpdates.gateSecurityApp;

      const res = await runDb(() => supabase!.from('apartments').update(dbUpdates).eq('id', id));
      if (!res.success) {
        setApartments(prev => prev.map(a => (a.id === id ? existing : a)));
        return res;
      }
      return { success: true };
    },
    [apartments, runDb]
  );

  const toggleApartmentStatus = useCallback(
    async (id: string): Promise<MutationResult> => {
      const apt = apartments.find(a => a.id === id);
      if (!apt) return { success: false, error: 'Community not found.' };
      return updateApartment(id, {
        status: apt.status === 'active' ? 'inactive' : 'active',
      });
    },
    [apartments, updateApartment]
  );

  const generateCustomerPortalToken = useCallback(
    async (apartmentId: string): Promise<MutationResult<string>> => {
      const apt = apartments.find(a => a.id === apartmentId);
      if (!apt) return { success: false, error: 'Community not found.' };

      const newToken = generateShareToken(6);
      const res = await runDb(() =>
        supabase!
          .from('apartments')
          .update({ portal_token: newToken, updated_at: new Date().toISOString() })
          .eq('id', apartmentId)
      );
      if (!res.success) return { success: false, error: res.error };
      setApartments(prev =>
        prev.map(a => (a.id === apartmentId ? { ...a, portalToken: newToken } : a))
      );
      return { success: true, data: newToken };
    },
    [apartments, runDb]
  );

  const getCustomerPortalUrl = useCallback((apartment: Apartment): string => {
    return getCanonicalCustomerPortalUrl(apartment);
  }, []);

  const getCustomerPortalPath = useCallback((apartment: Apartment): string => {
    return getCanonicalCustomerPortalPath(apartment);
  }, []);

  const submitCommunityDemand = useCallback(
    async (data: {
      apartmentId: string;
      serviceName: string;
      residentName: string;
      phone: string;
      flatNumber: string;
      notes?: string;
    }): Promise<MutationResult<ResidentRequest>> => {
      const newReq: ResidentRequest = {
        id: generateId('req'),
        campaignId: 'community-demand-poll',
        apartmentId: data.apartmentId,
        residentName: data.residentName,
        phone: data.phone.startsWith('+91') ? data.phone : `+91 ${data.phone}`,
        block: 'Requested Service',
        flatNumber: data.flatNumber,
        preferredDate: 'Next Sunday',
        preferredSlot: 'Any Preferred Time',
        notes: `Service Requested: "${data.serviceName}". Resident note: ${data.notes || 'No extra note'}`,
        status: 'interested',
        submittedAt: new Date().toISOString(),
      };

      if (!supabase || !isBackendConnected) {
        setResidentRequests(prev => [newReq, ...prev]);
        return { success: true, data: newReq };
      }

      // The campaign_id FK does not exist for demand polls; strip it for DB insert.
      const { campaign_id: _ignored, ...dbRow } = mapResidentRequestToDb(newReq);
      const { data: inserted, error } = await supabase
        .from('resident_requests')
        .insert(dbRow)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message || 'Could not submit your request. Please try again.',
        };
      }
      const saved = mapResidentRequestFromDb(inserted);
      setResidentRequests(prev => [saved, ...prev]);
      return { success: true, data: saved };
    },
    [isBackendConnected]
  );

  /* ---------------- Category mutations ---------------- */
  const addCategory = useCallback(
    async (cat: Omit<ServiceCategory, 'id'>): Promise<MutationResult<ServiceCategory>> => {
      const newCat: ServiceCategory = { ...cat, id: generateId('cat') };
      setCategories(prev => [...prev, newCat]);
      const res = await runDb(() =>
        supabase!.from('service_categories').insert(mapCategoryToDb(newCat))
      );
      if (!res.success) {
        setCategories(prev => prev.filter(c => c.id !== newCat.id));
        return { success: false, error: res.error || 'Could not create category.' };
      }
      return { success: true, data: newCat };
    },
    [runDb]
  );

  const toggleCategoryStatus = useCallback(
    async (id: string): Promise<MutationResult> => {
      const cat = categories.find(c => c.id === id);
      if (!cat) return { success: false, error: 'Category not found.' };

      setCategories(prev => prev.map(c => (c.id === id ? { ...c, active: !c.active } : c)));
      const res = await runDb(() =>
        supabase!.from('service_categories').update({ active: !cat.active }).eq('id', id)
      );
      if (!res.success) {
        setCategories(prev => prev.map(c => (c.id === id ? cat : c)));
        return res;
      }
      return { success: true };
    },
    [categories, runDb]
  );

  /* ---------------- Provider mutations ---------------- */
  const addProvider = useCallback(
    async (
      prov: Omit<ServiceProvider, 'id' | 'createdAt' | 'completedJobs' | 'rating'>
    ): Promise<MutationResult<ServiceProvider>> => {
      const newProv: ServiceProvider = {
        ...prov,
        commissionPercentage: prov.commissionPercentage ?? defaultCommissionRate ?? 15,
        id: generateId('prov'),
        completedJobs: 0,
        rating: 5.0,
        createdAt: new Date().toISOString(),
      };
      setProviders(prev => [newProv, ...prev]);
      const res = await runDb(() =>
        supabase!.from('service_providers').insert(mapProviderToDb(newProv))
      );
      if (!res.success) {
        setProviders(prev => prev.filter(p => p.id !== newProv.id));
        return { success: false, error: res.error || 'Could not add provider.' };
      }
      return { success: true, data: newProv };
    },
    [defaultCommissionRate, runDb]
  );

  const updateProvider = useCallback(
    async (id: string, provUpdates: Partial<ServiceProvider>): Promise<MutationResult> => {
      const existing = providers.find(p => p.id === id);
      if (!existing) return { success: false, error: 'Provider not found.' };

      setProviders(prev => prev.map(p => (p.id === id ? { ...p, ...provUpdates } : p)));

      const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (provUpdates.businessName) dbUpdates.business_name = provUpdates.businessName;
      if (provUpdates.contactPerson) dbUpdates.contact_person = provUpdates.contactPerson;
      if (provUpdates.phone) dbUpdates.phone = provUpdates.phone;
      if (provUpdates.whatsapp) dbUpdates.whatsapp = provUpdates.whatsapp;
      if (provUpdates.email) dbUpdates.email = provUpdates.email;
      if (provUpdates.address) dbUpdates.address = provUpdates.address;
      if (provUpdates.commissionPercentage !== undefined)
        dbUpdates.commission_percentage = provUpdates.commissionPercentage;
      if (provUpdates.payoutUpiId !== undefined) dbUpdates.payout_upi_id = provUpdates.payoutUpiId;
      if (provUpdates.payoutAccountName !== undefined)
        dbUpdates.payout_account_name = provUpdates.payoutAccountName;
      if (provUpdates.payoutAccountNumber !== undefined)
        dbUpdates.payout_account_number = provUpdates.payoutAccountNumber;
      if (provUpdates.payoutIfsc !== undefined) dbUpdates.payout_ifsc = provUpdates.payoutIfsc;
      if (provUpdates.verificationStatus)
        dbUpdates.verification_status = provUpdates.verificationStatus;
      if (provUpdates.notes !== undefined) dbUpdates.notes = provUpdates.notes;

      const res = await runDb(() =>
        supabase!.from('service_providers').update(dbUpdates).eq('id', id)
      );
      if (!res.success) {
        setProviders(prev => prev.map(p => (p.id === id ? existing : p)));
        return res;
      }
      return { success: true };
    },
    [providers, runDb]
  );

  /* ---------------- Service mutations ---------------- */
  const addService = useCallback(
    async (
      srv: Omit<Service, 'id' | 'createdAt' | 'currentDemand'>
    ): Promise<MutationResult<Service>> => {
      const newSrv: Service = {
        ...srv,
        id: generateId('srv'),
        currentDemand: 1,
        createdAt: new Date().toISOString(),
      };
      setServices(prev => [newSrv, ...prev]);
      const res = await runDb(() => supabase!.from('services').insert(mapServiceToDb(newSrv)));
      if (!res.success) {
        setServices(prev => prev.filter(s => s.id !== newSrv.id));
        return { success: false, error: res.error || 'Could not create service.' };
      }
      return { success: true, data: newSrv };
    },
    [runDb]
  );

  const updateService = useCallback(
    async (id: string, srvUpdates: Partial<Service>): Promise<MutationResult> => {
      const existing = services.find(s => s.id === id);
      if (!existing) return { success: false, error: 'Service not found.' };

      setServices(prev => prev.map(s => (s.id === id ? { ...s, ...srvUpdates } : s)));

      const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (srvUpdates.name) dbUpdates.name = srvUpdates.name;
      if (srvUpdates.description) dbUpdates.description = srvUpdates.description;
      if (srvUpdates.normalPrice !== undefined) dbUpdates.normal_price = srvUpdates.normalPrice;
      if (srvUpdates.communityPrice !== undefined)
        dbUpdates.community_price = srvUpdates.communityPrice;
      if (srvUpdates.sundayBulkPrice !== undefined)
        dbUpdates.sunday_bulk_price = srvUpdates.sundayBulkPrice;
      if (srvUpdates.status) dbUpdates.status = srvUpdates.status;
      if (srvUpdates.providerId !== undefined)
        dbUpdates.provider_id = srvUpdates.providerId ?? null;
      if (srvUpdates.providerName !== undefined) dbUpdates.provider_name = srvUpdates.providerName;

      const res = await runDb(() => supabase!.from('services').update(dbUpdates).eq('id', id));
      if (!res.success) {
        setServices(prev => prev.map(s => (s.id === id ? existing : s)));
        return res;
      }
      return { success: true };
    },
    [services, runDb]
  );

  /* ---------------- Booking mutations ---------------- */
  const createBooking = useCallback(
    async (bookingData: {
      serviceId: string;
      apartmentId: string;
      residentName: string;
      phone: string;
      email?: string;
      block: string;
      flatNumber: string;
      date: string;
      slot: string;
      price: number;
      bookingType: 'regular' | 'sunday_bulk';
      campaignId?: string;
      notes?: string;
    }): Promise<MutationResult<Booking>> => {
      if (!bookingData.serviceId || !bookingData.apartmentId) {
        return { success: false, error: 'Service and community are required.' };
      }
      if (!bookingData.residentName?.trim() || !bookingData.phone?.trim() || !bookingData.flatNumber?.trim()) {
        return { success: false, error: 'Name, phone, and flat number are required.' };
      }

      const srv = services.find(s => s.id === bookingData.serviceId);
      const apt = apartments.find(a => a.id === bookingData.apartmentId);
      const prov = providers.find(p => p.id === srv?.providerId);

      const bookingNum = `GK-${(srv?.name.substring(0, 2) || 'CA').toUpperCase()}-${Math.floor(
        10000 + Math.random() * 90000
      )}`;

      const commRate = prov?.commissionPercentage ?? defaultCommissionRate ?? 15;
      const commissionAmount = Math.round((bookingData.price * commRate) / 100);
      const vendorPayoutAmount = Math.max(0, bookingData.price - commissionAmount);

      const newBooking: Booking = {
        id: generateId('book'),
        bookingNumber: bookingNum,
        serviceId: bookingData.serviceId,
        serviceName: srv?.name || 'Home Care Service',
        apartmentId: bookingData.apartmentId,
        apartmentName: apt?.name || 'Community Resident',
        residentName: bookingData.residentName.trim(),
        phone: bookingData.phone,
        email: bookingData.email,
        block: bookingData.block,
        flatNumber: bookingData.flatNumber.trim(),
        date: bookingData.date,
        slot: bookingData.slot,
        price: bookingData.price,
        bookingType: bookingData.bookingType,
        status: 'received',
        providerId: prov?.id,
        providerName: prov?.businessName,
        providerPhone: prov?.phone,
        commissionRate: commRate,
        commissionAmount,
        vendorPayoutAmount,
        commissionStatus: 'pending',
        campaignId: bookingData.campaignId,
        notes: bookingData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!supabase || !isBackendConnected) {
        setBookings(prev => [newBooking, ...prev]);
        return { success: true, data: newBooking };
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert(mapBookingToDb(newBooking))
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message || 'Could not create booking. Please try again.' };
      }
      const saved = mapBookingFromDb(data);
      setBookings(prev => [saved, ...prev]);
      return { success: true, data: saved };
    },
    [services, apartments, providers, defaultCommissionRate, isBackendConnected]
  );

  const updateBookingStatus = useCallback(
    async (bookingId: string, status: BookingStatus, providerId?: string): Promise<MutationResult> => {
      const existing = bookings.find(b => b.id === bookingId);
      if (!existing) return { success: false, error: 'Booking not found.' };
      const matchedProv = providerId ? providers.find(p => p.id === providerId) : undefined;

      const rate = matchedProv?.commissionPercentage ?? existing.commissionRate ?? defaultCommissionRate ?? 15;
      const commissionAmount = Math.round((existing.price * rate) / 100);
      const vendorPayoutAmount = Math.max(0, existing.price - commissionAmount);

      const nextBooking: Booking = {
        ...existing,
        status,
        providerId: providerId || existing.providerId,
        providerName: matchedProv ? matchedProv.businessName : existing.providerName,
        providerPhone: matchedProv ? matchedProv.phone : existing.providerPhone,
        commissionRate: rate,
        commissionAmount,
        vendorPayoutAmount,
        updatedAt: new Date().toISOString(),
      };

      setBookings(prev => prev.map(b => (b.id === bookingId ? nextBooking : b)));

      const dbUpdates: Record<string, unknown> = {
        status,
        commission_rate: rate,
        commission_amount: commissionAmount,
        vendor_payout_amount: vendorPayoutAmount,
        updated_at: new Date().toISOString(),
      };
      if (providerId) {
        dbUpdates.provider_id = providerId;
        if (matchedProv) {
          dbUpdates.provider_name = matchedProv.businessName;
          dbUpdates.provider_phone = matchedProv.phone;
        }
      }

      const res = await runDb(() =>
        supabase!.from('bookings').update(dbUpdates).eq('id', bookingId)
      );
      if (!res.success) {
        setBookings(prev => prev.map(b => (b.id === bookingId ? existing : b)));
        return res;
      }
      return { success: true };
    },
    [bookings, providers, defaultCommissionRate, runDb]
  );

  /* ---------------- Commission Mutations ---------------- */
  const createSettlement = useCallback(
    async (data: {
      providerId: string;
      bookingIds: string[];
      paymentMethod: 'upi' | 'bank_transfer' | 'cash' | 'other';
      transactionReference: string;
      notes?: string;
    }): Promise<MutationResult<CommissionSettlement>> => {
      const prov = providers.find(p => p.id === data.providerId);
      if (!prov) return { success: false, error: 'Provider not found.' };

      const targetBookings = bookings.filter(b => data.bookingIds.includes(b.id));
      const totalGross = targetBookings.reduce((sum, b) => sum + (b.price || 0), 0);
      const rate = prov.commissionPercentage ?? defaultCommissionRate ?? 15;
      const commissionAmount = targetBookings.reduce(
        (sum, b) => sum + (b.commissionAmount ?? Math.round(((b.price || 0) * rate) / 100)),
        0
      );
      const payoutAmount = targetBookings.reduce(
        (sum, b) =>
          sum +
          (b.vendorPayoutAmount ??
            Math.max(0, (b.price || 0) - Math.round(((b.price || 0) * rate) / 100))),
        0
      );

      const newSettlement: CommissionSettlement = {
        id: generateId('setl'),
        settlementNumber: `GK-SETTLE-${Math.floor(10000 + Math.random() * 90000)}`,
        providerId: data.providerId,
        providerName: prov.businessName,
        bookingIds: data.bookingIds,
        totalOrders: data.bookingIds.length,
        totalGross,
        commissionAmount,
        payoutAmount,
        paymentMethod: data.paymentMethod,
        transactionReference: data.transactionReference,
        settledAt: new Date().toISOString(),
        notes: data.notes,
      };

      setSettlements(prev => [newSettlement, ...prev]);

      // Mark bookings as settled
      setBookings(prev =>
        prev.map(b =>
          data.bookingIds.includes(b.id)
            ? {
                ...b,
                commissionStatus: 'settled',
                settlementReference: data.transactionReference,
                settledAt: newSettlement.settledAt,
                updatedAt: new Date().toISOString(),
              }
            : b
        )
      );

      if (supabase && isBackendConnected) {
        for (const bId of data.bookingIds) {
          try {
            await supabase
              .from('bookings')
              .update({
                commission_status: 'settled',
                settlement_reference: data.transactionReference,
                settled_at: newSettlement.settledAt,
                updated_at: new Date().toISOString(),
              })
              .eq('id', bId);
          } catch {
            // best-effort
          }
        }
      }

      return { success: true, data: newSettlement };
    },
    [providers, bookings, defaultCommissionRate, isBackendConnected]
  );

  const updateBookingCommission = useCallback(
    async (
      bookingId: string,
      updates: {
        commissionStatus?: CommissionStatus;
        commissionRate?: number;
        settlementReference?: string;
        settledAt?: string;
      }
    ): Promise<MutationResult> => {
      const existing = bookings.find(b => b.id === bookingId);
      if (!existing) return { success: false, error: 'Booking not found.' };

      const rate =
        updates.commissionRate ?? existing.commissionRate ?? defaultCommissionRate ?? 15;
      const commissionAmount = Math.round((existing.price * rate) / 100);
      const vendorPayoutAmount = Math.max(0, existing.price - commissionAmount);

      const nextBooking: Booking = {
        ...existing,
        commissionRate: rate,
        commissionAmount,
        vendorPayoutAmount,
        ...(updates.commissionStatus ? { commissionStatus: updates.commissionStatus } : {}),
        ...(updates.settlementReference !== undefined
          ? { settlementReference: updates.settlementReference }
          : {}),
        ...(updates.settledAt !== undefined ? { settledAt: updates.settledAt } : {}),
        updatedAt: new Date().toISOString(),
      };

      setBookings(prev => prev.map(b => (b.id === bookingId ? nextBooking : b)));

      if (supabase && isBackendConnected) {
        try {
          await supabase
            .from('bookings')
            .update({
              commission_rate: rate,
              commission_amount: commissionAmount,
              vendor_payout_amount: vendorPayoutAmount,
              ...(updates.commissionStatus
                ? { commission_status: updates.commissionStatus }
                : {}),
              ...(updates.settlementReference !== undefined
                ? { settlement_reference: updates.settlementReference }
                : {}),
              ...(updates.settledAt !== undefined ? { settled_at: updates.settledAt } : {}),
              updated_at: new Date().toISOString(),
            })
            .eq('id', bookingId);
        } catch {
          // best-effort
        }
      }

      return { success: true };
    },
    [bookings, defaultCommissionRate, isBackendConnected]
  );

  /* ---------------- Applications ---------------- */
  const submitRWAApplication = useCallback(
    async (
      app: Omit<RWAPartnershipApplication, 'id' | 'status' | 'createdAt'>
    ): Promise<MutationResult<RWAPartnershipApplication>> => {
      const newApp: RWAPartnershipApplication = {
        ...app,
        id: generateId('rwa'),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      if (!supabase || !isBackendConnected) {
        setRwaApplications(prev => [newApp, ...prev]);
        return { success: true, data: newApp };
      }
      const { data, error } = await supabase
        .from('rwa_applications')
        .insert(mapRWAApplicationToDb(newApp))
        .select()
        .single();
      if (error) {
        return { success: false, error: error.message || 'Could not submit application.' };
      }
      const saved = mapRWAApplicationFromDb(data);
      setRwaApplications(prev => [saved, ...prev]);
      return { success: true, data: saved };
    },
    [isBackendConnected]
  );

  const submitVendorApplication = useCallback(
    async (
      app: Omit<VendorApplication, 'id' | 'status' | 'createdAt'>
    ): Promise<MutationResult<VendorApplication>> => {
      const newApp: VendorApplication = {
        ...app,
        id: generateId('vnd'),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      if (!supabase || !isBackendConnected) {
        setVendorApplications(prev => [newApp, ...prev]);
        return { success: true, data: newApp };
      }
      const { data, error } = await supabase
        .from('vendor_applications')
        .insert(mapVendorApplicationToDb(newApp))
        .select()
        .single();
      if (error) {
        return { success: false, error: error.message || 'Could not submit application.' };
      }
      const saved = mapVendorApplicationFromDb(data);
      setVendorApplications(prev => [saved, ...prev]);
      return { success: true, data: saved };
    },
    [isBackendConnected]
  );

  /* ---------------- Demo reset ---------------- */
  const resetToDemoData = useCallback(() => {
    if (isBackendConnected) {
      // Never wipe the production DB from the UI.
      setCampaigns([]);
      setResidentRequests([]);
      void loadSupabaseData();
      return;
    }
    localStorage.removeItem(STORAGE_KEYS.DEMO_APARTMENTS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.DEMO_PROVIDERS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_SERVICES);
    localStorage.removeItem(STORAGE_KEYS.DEMO_CAMPAIGNS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_RESIDENT_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_RWA_APPS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_VENDOR_APPS);
    setApartments(INITIAL_APARTMENTS);
    setCategories(INITIAL_CATEGORIES);
    setProviders(INITIAL_PROVIDERS);
    setServices(INITIAL_SERVICES);
    setCampaigns(INITIAL_CAMPAIGNS);
    setResidentRequests(INITIAL_RESIDENT_REQUESTS);
    setBookings(INITIAL_BOOKINGS);
    setRwaApplications(INITIAL_RWA_APPLICATIONS);
    setVendorApplications(INITIAL_VENDOR_APPLICATIONS);
    setSelectedApartmentId('');
  }, [isBackendConnected, loadSupabaseData]);

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        isBackendConnected,
        backendError: isBackendConnected ? null : SUPABASE_CONFIG_ERROR,
        dataStatus,
        dataError,
        reloadAll: loadSupabaseData,

        authUser,
        isAdminAuthenticated,
        isAdminReady: authChecked,
        loginAdmin,
        logoutAdmin,

        adminSection,
        setAdminSection,
        activeCampaignId,
        setActiveCampaignId,
        adminSelectedCommunityId,
        setAdminSelectedCommunityId,
        residentTab,
        setResidentTab,
        selectedApartmentId,
        setSelectedApartmentId,
        selectedApartment,
        hasExplicitCommunity,

        apartments,
        categories,
        providers,
        services,
        campaigns,
        residentRequests,
        bookings,
        rwaApplications,
        vendorApplications,

        fetchApartmentForPortal,
        fetchCampaignByToken,

        createCampaign,
        updateCampaign,
        updateCampaignStatus,
        assignProviderToCampaign,
        submitResidentInterest,

        addApartment,
        updateApartment,
        toggleApartmentStatus,
        generateCustomerPortalToken,
        getCustomerPortalUrl,
        getCustomerPortalPath,
        submitCommunityDemand,

        addCategory,
        toggleCategoryStatus,
        addProvider,
        updateProvider,
        addService,
        updateService,
        createBooking,
        updateBookingStatus,

        defaultCommissionRate,
        setDefaultCommissionRate,
        settlements,
        createSettlement,
        updateBookingCommission,

        submitRWAApplication,
        submitVendorApplication,

        bookingModalService,
        setBookingModalService,
        shareModalService,
        setShareModalService,
        trackingBooking,
        setTrackingBooking,
        societySelectorOpen,
        setSocietySelectorOpen,

        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
