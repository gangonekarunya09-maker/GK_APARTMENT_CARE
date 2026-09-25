import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Apartment,
  ServiceCategory,
  ServiceProvider,
  Service,
  Booking,
  Campaign,
  ResidentRequest,
  RWAPartnershipApplication,
  VendorApplication,
} from '../types';

const RAW_SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const RAW_SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const isPlaceholderUrl =
  !RAW_SUPABASE_URL ||
  /^https:\/\/your-project\.supabase\.co\/?$/i.test(RAW_SUPABASE_URL) ||
  RAW_SUPABASE_URL === 'https://example.supabase.co';

const isPlaceholderKey =
  !RAW_SUPABASE_ANON_KEY ||
  RAW_SUPABASE_ANON_KEY.toLowerCase().startsWith('your-') ||
  RAW_SUPABASE_ANON_KEY === 'MY_GEMINI_API_KEY';

export const SUPABASE_CONFIG_ERROR = isPlaceholderUrl
  ? 'VITE_SUPABASE_URL is missing or still set to the placeholder value.'
  : isPlaceholderKey
    ? 'VITE_SUPABASE_ANON_KEY is missing or still set to a placeholder value.'
    : null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    !SUPABASE_CONFIG_ERROR &&
      RAW_SUPABASE_URL.startsWith('https://') &&
      RAW_SUPABASE_ANON_KEY.length > 20
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(RAW_SUPABASE_URL, RAW_SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Data Mapping Helpers (Snake <-> Camel)
 * Kept in one place so components never see raw DB rows.
 * (Field-by-field audit vs supabase/schema.sql lives in the audit report.)
 */

export function mapApartmentFromDb(data: any): Apartment {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    portalToken: data.portal_token || data.portalToken,
    address: data.address,
    area: data.area,
    city: data.city,
    pincode: data.pincode,
    totalUnits: data.total_units || data.totalUnits || 0,
    gateSecurityApp: data.gate_security_app || data.gateSecurityApp || 'MyGate',
    rwaContact: data.rwa_contact || data.rwaContact || '',
    rwaPhone: data.rwa_phone || data.rwaPhone || '',
    rwaEmail: data.rwa_email || data.rwaEmail || '',
    status: data.status || 'active',
    notes: data.notes || '',
    createdAt: data.created_at || data.createdAt || new Date().toISOString(),
  };
}

export function mapApartmentToDb(apt: Apartment): any {
  return {
    id: apt.id,
    name: apt.name,
    slug: apt.slug,
    portal_token: apt.portalToken,
    address: apt.address,
    area: apt.area,
    city: apt.city,
    pincode: apt.pincode,
    total_units: apt.totalUnits,
    gate_security_app: apt.gateSecurityApp,
    rwa_contact: apt.rwaContact,
    rwa_phone: apt.rwaPhone,
    rwa_email: apt.rwaEmail,
    status: apt.status,
    notes: apt.notes,
    created_at: apt.createdAt,
  };
}

export function mapCategoryFromDb(data: any): ServiceCategory {
  return {
    id: data.id,
    name: data.name,
    iconName: data.icon_name || data.iconName,
    description: data.description,
    active: data.active ?? true,
  };
}

export function mapCategoryToDb(cat: ServiceCategory): any {
  return {
    id: cat.id,
    name: cat.name,
    icon_name: cat.iconName,
    description: cat.description,
    active: cat.active,
  };
}

export function mapProviderFromDb(data: any): ServiceProvider {
  return {
    id: data.id,
    businessName: data.business_name || data.businessName,
    contactPerson: data.contact_person || data.contactPerson,
    phone: data.phone,
    whatsapp: data.whatsapp,
    email: data.email,
    categoryIds: data.category_ids || data.categoryIds || [],
    servicesOffered: data.services_offered || data.servicesOffered || [],
    serviceAreas: data.service_areas || data.serviceAreas || [],
    address: data.address,
    normalPricingRatio: data.normal_pricing_ratio || data.normalPricingRatio || 1.0,
    verificationStatus: data.verification_status || data.verificationStatus || 'verified',
    completedJobs: data.completed_jobs || data.completedJobs || 0,
    rating: data.rating || 5.0,
    notes: data.notes || '',
    createdAt: data.created_at || data.createdAt || new Date().toISOString(),
  };
}

export function mapProviderToDb(prov: ServiceProvider): any {
  return {
    id: prov.id,
    business_name: prov.businessName,
    contact_person: prov.contactPerson,
    phone: prov.phone,
    whatsapp: prov.whatsapp,
    email: prov.email,
    category_ids: prov.categoryIds,
    services_offered: prov.servicesOffered,
    service_areas: prov.serviceAreas,
    address: prov.address,
    normal_pricing_ratio: prov.normalPricingRatio,
    verification_status: prov.verificationStatus,
    completed_jobs: prov.completedJobs,
    rating: prov.rating,
    notes: prov.notes,
    created_at: prov.createdAt,
  };
}

export function mapServiceFromDb(data: any): Service {
  return {
    id: data.id,
    name: data.name,
    categoryId: data.category_id || data.categoryId,
    description: data.description,
    iconName: data.icon_name || data.iconName,
    apartmentIds: data.apartment_ids || data.apartmentIds || [],
    providerId: data.provider_id || data.providerId,
    providerName: data.provider_name || data.providerName,
    normalPrice: Number(data.normal_price ?? data.normalPrice ?? 0),
    communityPrice: Number(data.community_price ?? data.communityPrice ?? 0),
    sundayBulkPrice: Number(data.sunday_bulk_price ?? data.sundayBulkPrice ?? 0),
    minimumDemand: Number(data.minimum_demand ?? data.minimumDemand ?? 5),
    currentDemand: Number(data.current_demand ?? data.currentDemand ?? 0),
    durationMinutes: Number(data.duration_minutes ?? data.durationMinutes ?? 60),
    availableDays: data.available_days || data.availableDays || [],
    availableSlots: data.available_slots || data.availableSlots || [],
    status: data.status || 'active',
    popular: data.popular ?? false,
    createdAt: data.created_at || data.createdAt || new Date().toISOString(),
  };
}

export function mapServiceToDb(srv: Service): any {
  return {
    id: srv.id,
    name: srv.name,
    category_id: srv.categoryId,
    description: srv.description,
    icon_name: srv.iconName,
    apartment_ids: srv.apartmentIds,
    provider_id: srv.providerId,
    provider_name: srv.providerName,
    normal_price: srv.normalPrice,
    community_price: srv.communityPrice,
    sunday_bulk_price: srv.sundayBulkPrice,
    minimum_demand: srv.minimumDemand,
    current_demand: srv.currentDemand,
    duration_minutes: srv.durationMinutes,
    available_days: srv.availableDays,
    available_slots: srv.availableSlots,
    status: srv.status,
    popular: srv.popular,
    created_at: srv.createdAt,
  };
}

export function mapCampaignFromDb(data: any): Campaign {
  return {
    id: data.id,
    token: data.token,
    apartmentId: data.apartment_id || data.apartmentId,
    serviceId: data.service_id || data.serviceId,
    normalPrice: Number(data.normal_price ?? data.normalPrice ?? 0),
    communityPrice: Number(data.community_price ?? data.communityPrice ?? 0),
    sundayBulkPrice: data.sunday_bulk_price ? Number(data.sunday_bulk_price) : data.sundayBulkPrice,
    minimumDemand: Number(data.minimum_demand ?? data.minimumDemand ?? 5),
    currentDemand: Number(data.current_demand ?? data.current_demand ?? data.currentDemand ?? 0),
    availableDates: data.available_dates || data.availableDates || [],
    availableSlots: data.available_slots || data.availableSlots || [],
    status: data.status,
    providerId: data.provider_id || data.providerId,
    notes: data.notes || '',
    createdAt: data.created_at || data.createdAt || new Date().toISOString(),
    updatedAt: data.updated_at || data.updatedAt,
  };
}

export function mapCampaignToDb(camp: Campaign): any {
  return {
    id: camp.id,
    token: camp.token,
    apartment_id: camp.apartmentId,
    service_id: camp.serviceId,
    normal_price: camp.normalPrice,
    community_price: camp.communityPrice,
    sunday_bulk_price: camp.sundayBulkPrice ?? null,
    minimum_demand: camp.minimumDemand,
    current_demand: camp.currentDemand,
    available_dates: camp.availableDates,
    available_slots: camp.availableSlots,
    status: camp.status,
    provider_id: camp.providerId ?? null,
    notes: camp.notes,
    created_at: camp.createdAt,
    updated_at: camp.updatedAt || new Date().toISOString(),
  };
}

export function mapResidentRequestFromDb(data: any): ResidentRequest {
  return {
    id: data.id,
    campaignId: data.campaign_id || data.campaignId,
    apartmentId: data.apartment_id || data.apartmentId,
    residentName: data.resident_name || data.residentName,
    phone: data.phone,
    block: data.block,
    flatNumber: data.flat_number || data.flatNumber,
    email: data.email || '',
    preferredDate: data.preferred_date || data.preferredDate,
    preferredSlot: data.preferred_slot || data.preferredSlot,
    notes: data.notes || '',
    status: data.status || 'interested',
    submittedAt: data.submitted_at || data.submittedAt || new Date().toISOString(),
  };
}

export function mapResidentRequestToDb(req: ResidentRequest): any {
  return {
    id: req.id,
    campaign_id: req.campaignId,
    apartment_id: req.apartmentId,
    resident_name: req.residentName,
    phone: req.phone,
    block: req.block,
    flat_number: req.flatNumber,
    email: req.email,
    preferred_date: req.preferredDate,
    preferred_slot: req.preferredSlot,
    notes: req.notes,
    status: req.status,
    submitted_at: req.submittedAt,
  };
}

export function mapBookingFromDb(data: any): Booking {
  return {
    id: data.id,
    bookingNumber: data.booking_number || data.bookingNumber,
    serviceId: data.service_id || data.serviceId,
    serviceName: data.service_name || data.serviceName,
    apartmentId: data.apartment_id || data.apartmentId,
    apartmentName: data.apartment_name || data.apartmentName,
    residentName: data.resident_name || data.residentName,
    phone: data.phone,
    email: data.email || '',
    block: data.block,
    flatNumber: data.flat_number || data.flatNumber,
    date: data.date,
    slot: data.slot,
    price: Number(data.price ?? 0),
    bookingType: data.booking_type || data.bookingType || 'regular',
    status: data.status || 'received',
    providerId: data.provider_id || data.providerId,
    providerName: data.provider_name || data.providerName,
    providerPhone: data.provider_phone || data.providerPhone,
    notes: data.notes || '',
    createdAt: data.created_at || data.createdAt || new Date().toISOString(),
    updatedAt: data.updated_at || data.updatedAt || new Date().toISOString(),
  };
}

export function mapBookingToDb(b: Booking): any {
  return {
    id: b.id,
    booking_number: b.bookingNumber,
    service_id: b.serviceId,
    service_name: b.serviceName,
    apartment_id: b.apartmentId,
    apartment_name: b.apartmentName,
    resident_name: b.residentName,
    phone: b.phone,
    email: b.email,
    block: b.block,
    flat_number: b.flatNumber,
    date: b.date,
    slot: b.slot,
    price: b.price,
    booking_type: b.bookingType,
    status: b.status,
    provider_id: b.providerId ?? null,
    provider_name: b.providerName,
    provider_phone: b.providerPhone,
    notes: b.notes,
    created_at: b.createdAt,
    updated_at: b.updatedAt,
  };
}

export function mapRWAApplicationFromDb(data: any): RWAPartnershipApplication {
  return {
    id: data.id,
    societyName: data.society_name || data.societyName,
    rwaContact: data.rwa_contact || data.rwaContact,
    phone: data.phone,
    email: data.email,
    totalUnits: Number(data.total_units ?? data.totalUnits ?? 0),
    area: data.area,
    message: data.message || '',
    status: data.status || 'pending',
    createdAt: data.created_at || data.createdAt || new Date().toISOString(),
  };
}

export function mapRWAApplicationToDb(app: RWAPartnershipApplication): any {
  return {
    id: app.id,
    society_name: app.societyName,
    rwa_contact: app.rwaContact,
    phone: app.phone,
    email: app.email,
    total_units: app.totalUnits,
    area: app.area,
    message: app.message,
    status: app.status,
    created_at: app.createdAt,
  };
}

export function mapVendorApplicationFromDb(data: any): VendorApplication {
  return {
    id: data.id,
    businessName: data.business_name || data.businessName,
    contactPerson: data.contact_person || data.contactPerson,
    phone: data.phone,
    whatsapp: data.whatsapp,
    email: data.email,
    category: data.category,
    servicesOffered: data.services_offered || data.servicesOffered,
    serviceAreas: data.service_areas || data.serviceAreas,
    experienceYears: Number(data.experience_years ?? data.experienceYears ?? 0),
    pricingNotes: data.pricing_notes || data.pricingNotes || '',
    status: data.status || 'pending',
    createdAt: data.created_at || data.createdAt || new Date().toISOString(),
  };
}

export function mapVendorApplicationToDb(app: VendorApplication): any {
  return {
    id: app.id,
    business_name: app.businessName,
    contact_person: app.contactPerson,
    phone: app.phone,
    whatsapp: app.whatsapp,
    email: app.email,
    category: app.category,
    services_offered: app.servicesOffered,
    service_areas: app.serviceAreas,
    experience_years: app.experienceYears,
    pricing_notes: app.pricingNotes,
    status: app.status,
    created_at: app.createdAt,
  };
}
