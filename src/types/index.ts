export type GateSecurityApp = 'Digital Gate Pass' | 'Society Security Desk' | 'GatePass App' | 'Traditional Register';

export interface Apartment {
  id: string;
  name: string;
  slug: string;
  portalToken: string; // e.g. "7H4K92"
  address: string;
  area: string;
  city: string;
  pincode: string;
  totalUnits: number;
  gateSecurityApp: GateSecurityApp;
  rwaContact: string;
  rwaPhone: string;
  rwaEmail: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  active: boolean;
}

export interface ServiceProvider {
  id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  email: string;
  categoryIds: string[];
  servicesOffered: string[];
  serviceAreas: string[];
  address: string;
  commissionPercentage: number; // e.g. 15 for 15%
  payoutUpiId?: string; // e.g. "suresh@okaxis"
  payoutAccountName?: string;
  payoutAccountNumber?: string;
  payoutIfsc?: string;
  normalPricingRatio?: number;
  verificationStatus: 'verified' | 'pending';
  completedJobs: number;
  rating: number;
  notes?: string;
  createdAt: string;
}

export type ServiceStatus =
  | 'draft'
  | 'active'
  | 'collecting_demand'
  | 'target_reached'
  | 'vendor_confirmed'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Service {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  iconName: string;
  apartmentIds: string[]; // Specific communities where this service is available, empty = all
  providerId?: string;
  providerName?: string;
  normalPrice: number;
  communityPrice: number;
  sundayBulkPrice: number;
  minimumDemand: number;
  currentDemand: number;
  durationMinutes: number;
  availableDays: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  availableSlots: string[]; // e.g. ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM']
  status: ServiceStatus;
  popular?: boolean;
  createdAt: string;
}

export type BookingStatus =
  | 'received'
  | 'vendor_assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type CampaignStatus =
  | 'collecting_demand'
  | 'target_reached'
  | 'provider_selected'
  | 'provider_confirmed'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Campaign {
  id: string;
  token: string; // e.g. "ABC123"
  apartmentId: string;
  serviceId: string;
  normalPrice: number;
  communityPrice: number;
  sundayBulkPrice?: number;
  minimumDemand: number;
  currentDemand: number;
  availableDates: string[];
  availableSlots: string[];
  status: CampaignStatus;
  providerId?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ResidentRequest {
  id: string;
  campaignId: string;
  apartmentId: string;
  residentName: string;
  phone: string;
  block: string;
  flatNumber: string;
  email?: string;
  preferredDate?: string;
  preferredSlot?: string;
  notes?: string;
  status: 'interested' | 'confirmed' | 'scheduled' | 'completed';
  submittedAt: string;
}

export interface BookingTimelineEvent {
  title: string;
  timestamp: string;
  description: string;
  done: boolean;
}

export type CommissionStatus = 'pending' | 'collected' | 'settled' | 'waived';

export interface Booking {
  id: string;
  bookingNumber: string; // e.g. GK-CA-00192
  serviceId: string;
  serviceName: string;
  apartmentId: string;
  apartmentName: string;
  residentName: string;
  phone: string;
  email?: string;
  block: string;
  flatNumber: string;
  date: string;
  slot: string;
  price: number;
  bookingType: 'regular' | 'sunday_bulk';
  status: BookingStatus;
  providerId?: string;
  providerName?: string;
  providerPhone?: string;
  commissionRate?: number; // Commission % e.g. 15
  commissionAmount?: number; // GK platform commission in ₹ e.g. 150
  vendorPayoutAmount?: number; // Net payout due to provider in ₹ e.g. 850
  commissionStatus?: CommissionStatus;
  settlementReference?: string; // UTR or Txn ID
  settledAt?: string;
  campaignId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionSettlement {
  id: string;
  settlementNumber: string; // e.g. "GK-SETTLE-00101"
  providerId: string;
  providerName: string;
  bookingIds: string[];
  totalOrders: number;
  totalGross: number;
  commissionAmount: number;
  payoutAmount: number;
  paymentMethod: 'upi' | 'bank_transfer' | 'cash' | 'other';
  transactionReference: string;
  settledAt: string;
  notes?: string;
}

export interface RWAPartnershipApplication {
  id: string;
  societyName: string;
  rwaContact: string;
  phone: string;
  email: string;
  totalUnits: number;
  area: string;
  message: string;
  status: 'pending' | 'reviewed' | 'partnered';
  createdAt: string;
}

export interface VendorApplication {
  id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  email: string;
  category: string;
  servicesOffered: string;
  serviceAreas: string;
  experienceYears: number;
  pricingNotes: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}
