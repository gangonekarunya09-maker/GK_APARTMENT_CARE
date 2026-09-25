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

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error' | 'demo';

export interface MutationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
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
    notes?: string;
  }) => Promise<MutationResult<Booking>>;
  updateBookingStatus: (
    bookingId: string,
    status: BookingStatus,
    providerId?: string
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
  SELECTED_APT: 'gk_selected_apt_v2',
  ADMIN_SECTION: 'gk_admin_section_v2',
};

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
      // Demo mode: seed from mocks once.
      if (dataStatus === 'idle') {
        setApartments(INITIAL_APARTMENTS);
        setCategories(INITIAL_CATEGORIES);
        setProviders(INITIAL_PROVIDERS);
        setServices(INITIAL_SERVICES);
        setCampaigns(INITIAL_CAMPAIGNS);
        setResidentRequests(INITIAL_RESIDENT_REQUESTS);
        setBookings(INITIAL_BOOKINGS);
        setRwaApplications(INITIAL_RWA_APPLICATIONS);
        setVendorApplications(INITIAL_VENDOR_APPLICATIONS);
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

  /* ---------------- Selected apartment ---------------- */
  const [selectedApartmentId, setSelectedApartmentId] = useState<string>(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const queryCommunity = searchParams.get('c') || searchParams.get('community');
      if (queryCommunity) return '';
      return localStorage.getItem(STORAGE_KEYS.SELECTED_APT) || '';
    } catch {
      return '';
    }
  });

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [residentRequests, setResidentRequests] = useState<ResidentRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rwaApplications, setRwaApplications] = useState<RWAPartnershipApplication[]>([]);
  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>([]);

  useEffect(() => {
    try {
      if (selectedApartmentId) {
        localStorage.setItem(STORAGE_KEYS.SELECTED_APT, selectedApartmentId);
      }
    } catch {
      // ignore
    }
  }, [selectedApartmentId]);

  const selectedApartment =
    apartments.find(a => a.id === selectedApartmentId) || apartments[0];

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
      if (!supabase || !isBackendConnected) {
        // Demo mode: resolve against seed data only.
        const pool = apartments.length ? apartments : INITIAL_APARTMENTS;
        const match = pool.find(
          a =>
            (slugOrToken && (a.slug === slugOrToken || a.id === slugOrToken)) ||
            (token && a.portalToken && a.portalToken.toLowerCase() === token.toLowerCase())
        );
        if (!match) {
          return { success: false, error: 'Community not found. Please check your link.' };
        }
        return { success: true, data: match };
      }

      try {
        let query = supabase.from('apartments').select('*').limit(1);
        if (token && slugOrToken) {
          query = query.or(`slug.eq.${slugOrToken},portal_token.eq.${token}`);
        } else if (token) {
          query = query.eq('portal_token', token);
        } else if (slugOrToken) {
          query = query.eq('slug', slugOrToken);
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

      const newReq: ResidentRequest = {
        ...requestData,
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
      const { data: rpcData, error } = await supabase.rpc(
        'increment_campaign_demand',
        rpcPayload
      );
      campRow = rpcData;

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
            error:
              ins.error.code === '23503'
                ? 'This campaign is no longer accepting interest.'
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
    [campaigns, isBackendConnected]
  );

  /* ---------------- Apartment mutations ---------------- */
  const addApartment = useCallback(
    async (apt: Omit<Apartment, 'id' | 'createdAt'>): Promise<MutationResult<Apartment>> => {
      if (!apt.name?.trim()) return { success: false, error: 'Community name is required.' };

      const baseSlug = apt.slug?.trim() || slugify(apt.name);
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
    [runDb]
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
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const token = apartment.portalToken || '';
    return token ? `${origin}/c/${apartment.slug}/${token}` : `${origin}/c/${apartment.slug}`;
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
    [runDb]
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
      if (provUpdates.verificationStatus)
        dbUpdates.verification_status = provUpdates.verificationStatus;

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
    [services, apartments, providers, isBackendConnected]
  );

  const updateBookingStatus = useCallback(
    async (bookingId: string, status: BookingStatus, providerId?: string): Promise<MutationResult> => {
      const existing = bookings.find(b => b.id === bookingId);
      if (!existing) return { success: false, error: 'Booking not found.' };
      const matchedProv = providerId ? providers.find(p => p.id === providerId) : undefined;

      const nextBooking: Booking = {
        ...existing,
        status,
        providerId: providerId || existing.providerId,
        providerName: matchedProv ? matchedProv.businessName : existing.providerName,
        providerPhone: matchedProv ? matchedProv.phone : existing.providerPhone,
        updatedAt: new Date().toISOString(),
      };

      setBookings(prev => prev.map(b => (b.id === bookingId ? nextBooking : b)));

      const dbUpdates: Record<string, unknown> = {
        status,
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
    [bookings, providers, runDb]
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
        submitCommunityDemand,

        addCategory,
        toggleCategoryStatus,
        addProvider,
        updateProvider,
        addService,
        updateService,
        createBooking,
        updateBookingStatus,
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
