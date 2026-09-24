import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

interface AppContextType {
  // Routing & navigation
  currentPath: string;
  navigate: (path: string) => void;

  // Supabase Status
  isBackendConnected: boolean;

  // Admin authentication
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

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

  // Campaign & Demand mutations
  createCampaign: (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'currentDemand'>) => Campaign;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  updateCampaignStatus: (id: string, status: CampaignStatus, providerId?: string) => void;
  assignProviderToCampaign: (campaignId: string, providerId: string) => void;
  submitResidentInterest: (requestData: Omit<ResidentRequest, 'id' | 'status' | 'submittedAt'>) => ResidentRequest;

  // Legacy & support mutations
  addApartment: (apt: Omit<Apartment, 'id' | 'createdAt'>) => Apartment;
  updateApartment: (id: string, apt: Partial<Apartment>) => void;
  toggleApartmentStatus: (id: string) => void;
  generateCustomerPortalToken: (apartmentId: string) => string;
  getCustomerPortalUrl: (apartment: Apartment) => string;
  submitCommunityDemand: (data: {
    apartmentId: string;
    serviceName: string;
    residentName: string;
    phone: string;
    flatNumber: string;
    notes?: string;
  }) => void;

  addCategory: (cat: Omit<ServiceCategory, 'id'>) => void;
  toggleCategoryStatus: (id: string) => void;

  addProvider: (prov: Omit<ServiceProvider, 'id' | 'createdAt' | 'completedJobs' | 'rating'>) => void;
  updateProvider: (id: string, prov: Partial<ServiceProvider>) => void;

  addService: (srv: Omit<Service, 'id' | 'createdAt' | 'currentDemand'>) => void;
  updateService: (id: string, srv: Partial<Service>) => void;

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
  }) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus, providerId?: string) => void;

  submitRWAApplication: (app: Omit<RWAPartnershipApplication, 'id' | 'status' | 'createdAt'>) => void;
  submitVendorApplication: (app: Omit<VendorApplication, 'id' | 'status' | 'createdAt'>) => void;

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
  APARTMENTS: 'gk_apartments_v2',
  SELECTED_APT: 'gk_selected_apt_v2',
  CATEGORIES: 'gk_categories_v2',
  PROVIDERS: 'gk_providers_v2',
  SERVICES: 'gk_services_v2',
  CAMPAIGNS: 'gk_campaigns_v2',
  REQUESTS: 'gk_requests_v2',
  BOOKINGS: 'gk_bookings_v2',
  RWA: 'gk_rwa_apps_v2',
  VENDORS: 'gk_vendor_apps_v2',
  ADMIN_AUTH: 'gk_admin_auth_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isBackendConnected = isSupabaseConfigured();

  // Browser Path Router State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = (path: string) => {
    setCurrentPath(path);
    try {
      window.history.pushState({}, '', path);
    } catch {
      // In some sandboxes pushState might be restricted
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    return saved === 'true';
  });

  const loginAdmin = (password: string) => {
    if (password.trim().length > 0) {
      setIsAdminAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    navigate('/');
  };

  const [adminSection, setAdminSection] = useState<string>('campaigns');
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [adminSelectedCommunityId, setAdminSelectedCommunityId] = useState<string | null>(null);
  const [residentTab, setResidentTab] = useState<'services' | 'community' | 'my-bookings' | 'rwa' | 'vendor'>('services');

  // Load initial state from LocalStorage or Seed
  const [apartments, setApartments] = useState<Apartment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APARTMENTS);
    return saved ? JSON.parse(saved) : INITIAL_APARTMENTS;
  });

  const [selectedApartmentId, setSelectedApartmentId] = useState<string>(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const queryCommunity = searchParams.get('c') || searchParams.get('community');
      if (queryCommunity) {
        const match = INITIAL_APARTMENTS.find(
          a =>
            a.id === queryCommunity ||
            a.slug === queryCommunity ||
            (a.portalToken && a.portalToken.toLowerCase() === queryCommunity.toLowerCase())
        );
        if (match) return match.id;
      }

      const pathParts = window.location.pathname.split('/').filter(Boolean);
      if (pathParts[0] === 'c' && pathParts[1]) {
        const slugOrToken = pathParts[1];
        const secondPart = pathParts[2];
        const match = INITIAL_APARTMENTS.find(
          a =>
            a.slug === slugOrToken ||
            a.id === slugOrToken ||
            (a.portalToken && a.portalToken.toLowerCase() === slugOrToken.toLowerCase()) ||
            (secondPart && a.portalToken && a.portalToken.toLowerCase() === secondPart.toLowerCase())
        );
        if (match) return match.id;
      }
    } catch {
      // ignore
    }

    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_APT);
    if (saved && (saved === 'apt-green-valley' || saved.includes('green-valley'))) {
      return 'community_green_valley_001';
    }
    return saved || 'community_green_valley_001';
  });

  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [providers, setProviders] = useState<ServiceProvider[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROVIDERS);
    return saved ? JSON.parse(saved) : INITIAL_PROVIDERS;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [residentRequests, setResidentRequests] = useState<ResidentRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return saved ? JSON.parse(saved) : INITIAL_RESIDENT_REQUESTS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [rwaApplications, setRwaApplications] = useState<RWAPartnershipApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RWA);
    return saved ? JSON.parse(saved) : INITIAL_RWA_APPLICATIONS;
  });

  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VENDORS);
    return saved ? JSON.parse(saved) : INITIAL_VENDOR_APPLICATIONS;
  });

  // Modals state
  const [bookingModalService, setBookingModalService] = useState<Service | null>(null);
  const [shareModalService, setShareModalService] = useState<Service | null>(null);
  const [trackingBooking, setTrackingBooking] = useState<Booking | null>(null);
  const [societySelectorOpen, setSocietySelectorOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(apartments));
  }, [apartments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_APT, selectedApartmentId);
  }, [selectedApartmentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(residentRequests));
  }, [residentRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RWA, JSON.stringify(rwaApplications));
  }, [rwaApplications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendorApplications));
  }, [vendorApplications]);

  // Fetch initial data from Supabase if configured
  const loadSupabaseData = useCallback(async () => {
    if (!supabase || !isBackendConnected) return;

    try {
      const [
        { data: dbApts },
        { data: dbCats },
        { data: dbProvs },
        { data: dbSrvs },
        { data: dbCamps },
        { data: dbReqs },
        { data: dbBooks },
        { data: dbRwa },
        { data: dbVnd },
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

      if (dbApts && dbApts.length > 0) setApartments(dbApts.map(mapApartmentFromDb));
      if (dbCats && dbCats.length > 0) setCategories(dbCats.map(mapCategoryFromDb));
      if (dbProvs && dbProvs.length > 0) setProviders(dbProvs.map(mapProviderFromDb));
      if (dbSrvs && dbSrvs.length > 0) setServices(dbSrvs.map(mapServiceFromDb));
      if (dbCamps && dbCamps.length > 0) setCampaigns(dbCamps.map(mapCampaignFromDb));
      if (dbReqs && dbReqs.length > 0) setResidentRequests(dbReqs.map(mapResidentRequestFromDb));
      if (dbBooks && dbBooks.length > 0) setBookings(dbBooks.map(mapBookingFromDb));
      if (dbRwa && dbRwa.length > 0) setRwaApplications(dbRwa.map(mapRWAApplicationFromDb));
      if (dbVnd && dbVnd.length > 0) setVendorApplications(dbVnd.map(mapVendorApplicationFromDb));
    } catch (err) {
      console.warn('Supabase fetch error, using local fallback:', err);
    }
  }, [isBackendConnected]);

  useEffect(() => {
    if (isBackendConnected) {
      loadSupabaseData();

      // Subscribe to Realtime changes
      if (supabase) {
        const channel = supabase
          .channel('public-db-changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public' },
            () => {
              loadSupabaseData();
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, [isBackendConnected, loadSupabaseData]);

  const selectedApartment = apartments.find(a => a.id === selectedApartmentId) || apartments[0];

  // Campaign Mutations
  const createCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'currentDemand'>): Campaign => {
    const newCamp: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      currentDemand: 0,
      createdAt: new Date().toISOString(),
    };

    setCampaigns(prev => [newCamp, ...prev]);

    if (supabase && isBackendConnected) {
      supabase
        .from('campaigns')
        .insert(mapCampaignToDb(newCamp))
        .then(({ error }) => {
          if (error) console.error('Supabase campaign insert error:', error);
        });
    }

    return newCamp;
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );

    if (supabase && isBackendConnected) {
      const dbUpdates: any = {};
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.providerId !== undefined) dbUpdates.provider_id = updates.providerId;
      if (updates.currentDemand !== undefined) dbUpdates.current_demand = updates.currentDemand;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      dbUpdates.updated_at = new Date().toISOString();

      supabase
        .from('campaigns')
        .update(dbUpdates)
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase campaign update error:', error);
        });
    }
  };

  const updateCampaignStatus = (id: string, status: CampaignStatus, providerId?: string) => {
    updateCampaign(id, {
      status,
      ...(providerId !== undefined ? { providerId } : {}),
    });
  };

  const assignProviderToCampaign = (campaignId: string, providerId: string) => {
    const camp = campaigns.find(c => c.id === campaignId);
    if (!camp) return;

    updateCampaign(campaignId, {
      providerId,
      status: camp.status === 'collecting_demand' ? 'provider_selected' : camp.status,
    });
  };

  // Resident Demand Submission: creates resident request, bumps campaign demand
  const submitResidentInterest = (
    requestData: Omit<ResidentRequest, 'id' | 'status' | 'submittedAt'>
  ): ResidentRequest => {
    const newReq: ResidentRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      status: 'interested',
      submittedAt: new Date().toISOString(),
    };

    setResidentRequests(prev => [newReq, ...prev]);

    if (supabase && isBackendConnected) {
      supabase
        .from('resident_requests')
        .insert(mapResidentRequestToDb(newReq))
        .then(({ error }) => {
          if (error) console.error('Supabase resident request insert error:', error);
        });
    }

    // Increase campaign demand count
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id === requestData.campaignId) {
          const nextDemand = c.currentDemand + 1;
          const nextStatus: CampaignStatus =
            nextDemand >= c.minimumDemand && c.status === 'collecting_demand'
              ? 'target_reached'
              : c.status;

          // Update Supabase campaign demand
          if (supabase && isBackendConnected) {
            supabase
              .from('campaigns')
              .update({
                current_demand: nextDemand,
                status: nextStatus,
                updated_at: new Date().toISOString(),
              })
              .eq('id', c.id)
              .then(({ error }) => {
                if (error) console.error('Supabase campaign demand update error:', error);
              });
          }

          return {
            ...c,
            currentDemand: nextDemand,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    return newReq;
  };

  // Apartment Mutations
  const generateRandomToken = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let res = '';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const addApartment = (apt: Omit<Apartment, 'id' | 'createdAt'>): Apartment => {
    const slug = apt.slug || apt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cleanSlug = slug.replace(/-/g, '_').substring(0, 18);
    const uniqueNum = Math.floor(100 + Math.random() * 900);
    const newApt: Apartment = {
      ...apt,
      slug,
      id: `community_${cleanSlug}_${uniqueNum}`,
      portalToken: apt.portalToken || generateRandomToken(),
      createdAt: new Date().toISOString(),
    };

    setApartments(prev => [newApt, ...prev]);

    if (supabase && isBackendConnected) {
      supabase
        .from('apartments')
        .insert(mapApartmentToDb(newApt))
        .then(({ error }) => {
          if (error) console.error('Supabase apartment insert error:', error);
        });
    }

    // Provision starter active campaigns for this newly created community
    const starterServices = services.slice(0, 3);
    const newCampaigns: Campaign[] = starterServices.map((srv, idx) => ({
      id: `camp-${cleanSlug}-${srv.id}-${Date.now() + idx}`,
      token: `${cleanSlug.substring(0, 3).toUpperCase()}-${srv.id.substring(4, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      apartmentId: newApt.id,
      serviceId: srv.id,
      normalPrice: srv.normalPrice,
      communityPrice: srv.communityPrice,
      sundayBulkPrice: srv.sundayBulkPrice,
      minimumDemand: srv.minimumDemand || 20,
      currentDemand: 0,
      availableDates: ['Sunday'],
      availableSlots: srv.availableSlots && srv.availableSlots.length > 0
        ? srv.availableSlots
        : ['09:00 AM – 11:00 AM', '11:00 AM – 01:00 PM', '02:00 PM – 04:00 PM'],
      status: 'collecting_demand',
      notes: `${srv.name} community campaign for ${newApt.name}.`,
      createdAt: new Date().toISOString(),
    }));

    if (newCampaigns.length > 0) {
      setCampaigns(prev => [...newCampaigns, ...prev]);
      if (supabase && isBackendConnected) {
        supabase
          .from('campaigns')
          .insert(newCampaigns.map(mapCampaignToDb))
          .then(({ error }) => {
            if (error) console.error('Supabase campaign batch insert error:', error);
          });
      }
    }

    return newApt;
  };

  const generateCustomerPortalToken = (apartmentId: string): string => {
    const newToken = generateRandomToken();
    setApartments(prev =>
      prev.map(a => (a.id === apartmentId ? { ...a, portalToken: newToken } : a))
    );

    if (supabase && isBackendConnected) {
      supabase
        .from('apartments')
        .update({ portal_token: newToken, updated_at: new Date().toISOString() })
        .eq('id', apartmentId)
        .then(({ error }) => {
          if (error) console.error('Supabase token update error:', error);
        });
    }

    return newToken;
  };

  const getCustomerPortalUrl = (apartment: Apartment): string => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://gkapartmentcare.com';
    const token = apartment.portalToken || '7H4K92';
    return `${origin}/c/${apartment.slug}/${token}`;
  };

  const submitCommunityDemand = (data: {
    apartmentId: string;
    serviceName: string;
    residentName: string;
    phone: string;
    flatNumber: string;
    notes?: string;
  }) => {
    const newReq: ResidentRequest = {
      id: `req-demand-${Date.now()}`,
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

    setResidentRequests(prev => [newReq, ...prev]);

    if (supabase && isBackendConnected) {
      supabase
        .from('resident_requests')
        .insert(mapResidentRequestToDb(newReq))
        .then(({ error }) => {
          if (error) console.error('Supabase demand request insert error:', error);
        });
    }
  };

  const updateApartment = (id: string, aptUpdates: Partial<Apartment>) => {
    setApartments(prev => prev.map(a => (a.id === id ? { ...a, ...aptUpdates } : a)));

    if (supabase && isBackendConnected) {
      const dbUpdates: any = {};
      if (aptUpdates.name) dbUpdates.name = aptUpdates.name;
      if (aptUpdates.rwaContact) dbUpdates.rwa_contact = aptUpdates.rwaContact;
      if (aptUpdates.rwaPhone) dbUpdates.rwa_phone = aptUpdates.rwaPhone;
      if (aptUpdates.rwaEmail) dbUpdates.rwa_email = aptUpdates.rwaEmail;
      if (aptUpdates.status) dbUpdates.status = aptUpdates.status;
      if (aptUpdates.notes !== undefined) dbUpdates.notes = aptUpdates.notes;
      dbUpdates.updated_at = new Date().toISOString();

      supabase
        .from('apartments')
        .update(dbUpdates)
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase apartment update error:', error);
        });
    }
  };

  const toggleApartmentStatus = (id: string) => {
    const apt = apartments.find(a => a.id === id);
    if (apt) {
      updateApartment(id, { status: apt.status === 'active' ? 'inactive' : 'active' });
    }
  };

  // Category Mutations
  const addCategory = (cat: Omit<ServiceCategory, 'id'>) => {
    const newCat: ServiceCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    setCategories(prev => [...prev, newCat]);

    if (supabase && isBackendConnected) {
      supabase
        .from('service_categories')
        .insert(mapCategoryToDb(newCat))
        .then(({ error }) => {
          if (error) console.error('Supabase category insert error:', error);
        });
    }
  };

  const toggleCategoryStatus = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;

    setCategories(prev => prev.map(c => (c.id === id ? { ...c, active: !c.active } : c)));

    if (supabase && isBackendConnected) {
      supabase
        .from('service_categories')
        .update({ active: !cat.active })
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase category toggle error:', error);
        });
    }
  };

  // Provider Mutations
  const addProvider = (prov: Omit<ServiceProvider, 'id' | 'createdAt' | 'completedJobs' | 'rating'>) => {
    const newProv: ServiceProvider = {
      ...prov,
      id: `prov-${Date.now()}`,
      completedJobs: 0,
      rating: 5.0,
      createdAt: new Date().toISOString(),
    };
    setProviders(prev => [newProv, ...prev]);

    if (supabase && isBackendConnected) {
      supabase
        .from('service_providers')
        .insert(mapProviderToDb(newProv))
        .then(({ error }) => {
          if (error) console.error('Supabase provider insert error:', error);
        });
    }
  };

  const updateProvider = (id: string, provUpdates: Partial<ServiceProvider>) => {
    setProviders(prev => prev.map(p => (p.id === id ? { ...p, ...provUpdates } : p)));

    if (supabase && isBackendConnected) {
      const dbUpdates: any = {};
      if (provUpdates.businessName) dbUpdates.business_name = provUpdates.businessName;
      if (provUpdates.contactPerson) dbUpdates.contact_person = provUpdates.contactPerson;
      if (provUpdates.phone) dbUpdates.phone = provUpdates.phone;
      if (provUpdates.verificationStatus) dbUpdates.verification_status = provUpdates.verificationStatus;
      dbUpdates.updated_at = new Date().toISOString();

      supabase
        .from('service_providers')
        .update(dbUpdates)
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase provider update error:', error);
        });
    }
  };

  // Service Mutations
  const addService = (srv: Omit<Service, 'id' | 'createdAt' | 'currentDemand'>) => {
    const newSrv: Service = {
      ...srv,
      id: `srv-${Date.now()}`,
      currentDemand: 1,
      createdAt: new Date().toISOString(),
    };
    setServices(prev => [newSrv, ...prev]);

    if (supabase && isBackendConnected) {
      supabase
        .from('services')
        .insert(mapServiceToDb(newSrv))
        .then(({ error }) => {
          if (error) console.error('Supabase service insert error:', error);
        });
    }
  };

  const updateService = (id: string, srvUpdates: Partial<Service>) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...srvUpdates } : s)));

    if (supabase && isBackendConnected) {
      const dbUpdates: any = {};
      if (srvUpdates.name) dbUpdates.name = srvUpdates.name;
      if (srvUpdates.normalPrice !== undefined) dbUpdates.normal_price = srvUpdates.normalPrice;
      if (srvUpdates.communityPrice !== undefined) dbUpdates.community_price = srvUpdates.communityPrice;
      if (srvUpdates.sundayBulkPrice !== undefined) dbUpdates.sunday_bulk_price = srvUpdates.sundayBulkPrice;
      if (srvUpdates.status) dbUpdates.status = srvUpdates.status;
      dbUpdates.updated_at = new Date().toISOString();

      supabase
        .from('services')
        .update(dbUpdates)
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase service update error:', error);
        });
    }
  };

  // Booking Mutations
  const createBooking = (bookingData: {
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
  }): Booking => {
    const srv = services.find(s => s.id === bookingData.serviceId);
    const apt = apartments.find(a => a.id === bookingData.apartmentId);
    const prov = providers.find(p => p.id === srv?.providerId);

    const bookingNum = `GK-${(srv?.name.substring(0, 2) || 'CA').toUpperCase()}-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      bookingNumber: bookingNum,
      serviceId: bookingData.serviceId,
      serviceName: srv?.name || 'Home Care Service',
      apartmentId: bookingData.apartmentId,
      apartmentName: apt?.name || 'Hyderabad Society',
      residentName: bookingData.residentName,
      phone: bookingData.phone,
      email: bookingData.email,
      block: bookingData.block,
      flatNumber: bookingData.flatNumber,
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

    setBookings(prev => [newBooking, ...prev]);

    if (supabase && isBackendConnected) {
      supabase
        .from('bookings')
        .insert(mapBookingToDb(newBooking))
        .then(({ error }) => {
          if (error) console.error('Supabase booking insert error:', error);
        });
    }

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, providerId?: string) => {
    const matchedProv = providerId ? providers.find(p => p.id === providerId) : undefined;

    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            status,
            providerId: providerId || b.providerId,
            providerName: matchedProv ? matchedProv.businessName : b.providerName,
            providerPhone: matchedProv ? matchedProv.phone : b.providerPhone,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );

    if (supabase && isBackendConnected) {
      const dbUpdates: any = {
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

      supabase
        .from('bookings')
        .update(dbUpdates)
        .eq('id', bookingId)
        .then(({ error }) => {
          if (error) console.error('Supabase booking status update error:', error);
        });
    }
  };

  const submitRWAApplication = (app: Omit<RWAPartnershipApplication, 'id' | 'status' | 'createdAt'>) => {
    const newApp: RWAPartnershipApplication = {
      ...app,
      id: `rwa-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setRwaApplications(prev => [newApp, ...prev]);

    if (supabase && isBackendConnected) {
      supabase
        .from('rwa_applications')
        .insert(mapRWAApplicationToDb(newApp))
        .then(({ error }) => {
          if (error) console.error('Supabase RWA application insert error:', error);
        });
    }
  };

  const submitVendorApplication = (app: Omit<VendorApplication, 'id' | 'status' | 'createdAt'>) => {
    const newApp: VendorApplication = {
      ...app,
      id: `vnd-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setVendorApplications(prev => [newApp, ...prev]);

    if (supabase && isBackendConnected) {
      supabase
        .from('vendor_applications')
        .insert(mapVendorApplicationToDb(newApp))
        .then(({ error }) => {
          if (error) console.error('Supabase Vendor application insert error:', error);
        });
    }
  };

  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.APARTMENTS);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_APT);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.PROVIDERS);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.CAMPAIGNS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.RWA);
    localStorage.removeItem(STORAGE_KEYS.VENDORS);

    setApartments(INITIAL_APARTMENTS);
    setSelectedApartmentId('community_green_valley_001');
    setCategories(INITIAL_CATEGORIES);
    setProviders(INITIAL_PROVIDERS);
    setServices(INITIAL_SERVICES);
    setCampaigns(INITIAL_CAMPAIGNS);
    setResidentRequests(INITIAL_RESIDENT_REQUESTS);
    setBookings(INITIAL_BOOKINGS);
    setRwaApplications(INITIAL_RWA_APPLICATIONS);
    setVendorApplications(INITIAL_VENDOR_APPLICATIONS);
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        isBackendConnected,
        isAdminAuthenticated,
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
