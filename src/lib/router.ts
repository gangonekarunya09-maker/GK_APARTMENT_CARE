/**
 * Explicit, deterministic URL router for GK Apartment Care.
 *
 * Route taxonomy (checked in priority order):
 *   1. Campaign URLs    → PublicCampaignPage
 *      /campaign/:token, /book/:token, /community/:slug/:service/:token,
 *      /community/:slug/:token (legacy), ?token=, ?campaign=
 *   2. Community portal → CommunityCustomerPortal
 *      /c/:slug/:token, /c/:slug, /community-portal/:idOrSlug,
 *      ?c=, ?community= (token or slug)
 *   3. Admin URLs       → AdminLogin / AdminDashboard
 *      /admin, /admin/<anything>, ?admin=true
 *   4. Public Pages     → Informational & Policy Pages
 *      /about, /how-it-works, /services, /contact,
 *      /privacy-policy, /terms, /refund-policy, /payment-info,
 *      /rwa, /vendor
 *   5. Homepage (/)     → Generic Home Storefront
 */

export type PublicPageName =
  | 'home'
  | 'about'
  | 'how-it-works'
  | 'services'
  | 'contact'
  | 'privacy-policy'
  | 'terms'
  | 'refund-policy'
  | 'payment-info'
  | 'rwa'
  | 'vendor';

export type RouteKind = 'campaign' | 'community' | 'admin' | 'page';

export interface RouteMatch {
  kind: RouteKind;

  /** Path form that matched, e.g. 'campaign-token' | 'community-slug-token' | 'page-about'. */
  via: string;

  /** For public page routes: the normalized page identifier. */
  page: PublicPageName;

  /** For campaign routes: the share token (never null for `kind === 'campaign'`). */
  campaignToken: string | null;

  /** For community routes: slug, token, id, or slug+token pair. */
  communitySlug: string | null;
  communityToken: string | null;
  communityIdOrSlug: string | null;
}

export interface AdminRouteMatch {
  isAdmin: boolean;
  /** True when the URL is /admin/login or ?admin=login */
  isLoginPath: boolean;
}

const CAMPAIGN_PREFIXES = ['campaign', 'book'] as const;

function partsOf(pathname: string): string[] {
  try {
    return pathname.split('/').filter(Boolean);
  } catch {
    return [];
  }
}

/** Lowercase, trimmed comparison helper (tokens are stored uppercase). */
function eq(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}

/**
 * Parse the current URL into an explicit route match.
 * Pure function of (pathname, search) — safe to run in render.
 */
export function resolveRoute(pathname: string, search: string): RouteMatch {
  const parts = partsOf(pathname);
  const params = new URLSearchParams(search || '');

  // ---------- Query-parameter routes (checked first, they are the most explicit) ----------
  const qpCampaign = params.get('token') || params.get('campaign');
  if (qpCampaign) {
    return {
      kind: 'campaign',
      via: 'query-token',
      page: 'home',
      campaignToken: qpCampaign,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  const qpCommunity = params.get('c') || params.get('community');
  if (qpCommunity && parts[0] !== 'community') {
    // ?community= may be a slug, id, or portal token — resolved by the caller.
    return {
      kind: 'community',
      via: 'query-community',
      page: 'home',
      campaignToken: null,
      communitySlug: null,
      communityToken: qpCommunity,
      communityIdOrSlug: qpCommunity,
    };
  }

  // ---------- Path routes ----------
  const [first, second, third, fourth] = parts;

  // /community/... is ambiguous: with 4 segments it is a campaign deep link
  // /community/:communitySlug/:serviceSlug/:token; otherwise ignore it (it is
  // also used as ?community= query syntax).
  if (first === 'community' && parts.length >= 4 && second && fourth) {
    return {
      kind: 'campaign',
      via: 'path-community-service-token',
      page: 'home',
      campaignToken: fourth,
      communitySlug: second,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  if (first && CAMPAIGN_PREFIXES.includes(first as (typeof CAMPAIGN_PREFIXES)[number]) && second) {
    return {
      kind: 'campaign',
      via: first === 'book' ? 'path-book' : 'path-campaign',
      page: 'home',
      campaignToken: second,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  // /c/:communitySlug/:token  (token optional for slug-only portals)
  if (first === 'c' && second) {
    if (third) {
      return {
        kind: 'community',
        via: 'path-c-slug-token',
        page: 'home',
        campaignToken: null,
        communitySlug: second,
        communityToken: third,
        communityIdOrSlug: null,
      };
    }
    return {
      kind: 'community',
      via: 'path-c-slug',
      page: 'home',
      campaignToken: null,
      communitySlug: second,
      communityToken: null,
      communityIdOrSlug: second,
    };
  }

  // /community-portal/:idOrSlug
  if (first === 'community-portal' && second) {
    return {
      kind: 'community',
      via: 'path-community-portal',
      page: 'home',
      campaignToken: null,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: second,
    };
  }

  // ---------- Admin ----------
  if (first === 'admin') {
    return {
      kind: 'admin',
      via: 'path-admin',
      page: 'home',
      campaignToken: null,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  if (params.get('admin') === 'true') {
    return {
      kind: 'admin',
      via: 'query-admin',
      page: 'home',
      campaignToken: null,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  // ---------- Public Informational & Policy Pages ----------
  const cleanPath = (first || '').toLowerCase();
  
  if (cleanPath === 'about') {
    return {
      kind: 'page',
      via: 'path-about',
      page: 'about',
      campaignToken: null,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  if (cleanPath === 'how-it-works' || cleanPath === 'howitworks') {
    return {
      kind: 'page',
      via: 'path-how-it-works',
      page: 'how-it-works',
      campaignToken: null,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  if (cleanPath === 'services') {
    return {
      kind: 'page',
      via: 'path-services',
      page: 'services',
      campaignToken: null,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  if (cleanPath === 'contact' || cleanPath === 'contact-us') {
    return {
      kind: 'page',
      via: 'path-contact',
      page: 'contact',
      campaignToken: null,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  if (cleanPath === 'privacy-policy' || cleanPath === 'privacy') {
    return {
      kind: 'page',
      via: 'path-privacy-policy',
      page: 'privacy-policy',
      campaignToken: null,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  if (cleanPath === 'terms' || cleanPath === 'terms-and-conditions' || cleanPath === 'terms-of-service') {
    return {
      kind: 'page',
      via: 'path-terms',
      page: 'terms',
      campaignToken: null,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  if (cleanPath === 'refund-policy' || cleanPath === 'cancellation-policy' || cleanPath === 'cancellation-and-refund') {
    return {
      kind: 'page',
      via: 'path-refund-policy',
      page: 'refund-policy',
      campaignToken: null,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  if (cleanPath === 'payment-info' || cleanPath === 'payments') {
    return {
      kind: 'page',
      via: 'path-payment-info',
      page: 'payment-info',
      campaignToken: null,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  if (cleanPath === 'rwa' || cleanPath === 'rwa-partnerships') {
    return {
      kind: 'page',
      via: 'path-rwa',
      page: 'rwa',
      campaignToken: null,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  if (cleanPath === 'vendor' || cleanPath === 'service-providers' || cleanPath === 'partners') {
    return {
      kind: 'page',
      via: 'path-vendor',
      page: 'vendor',
      campaignToken: null,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  // ---------- Generic Home Storefront (default: /) ----------
  return {
    kind: 'page',
    via: 'default-home',
    page: 'home',
    campaignToken: null,
    communitySlug: null,
    communityToken: null,
    communityIdOrSlug: null,
  };
}

export function isAdminPath(pathname: string, search: string): AdminRouteMatch {
  const params = new URLSearchParams(search || '');
  const parts = partsOf(pathname);
  const isAdmin =
    parts[0] === 'admin' ||
    params.get('admin') === 'true' ||
    params.get('admin') === 'login';
  return {
    isAdmin,
    isLoginPath: pathname === '/admin/login' || params.get('admin') === 'login',
  };
}

/** Canonical production base URL for public customer-facing links. */
export const PRODUCTION_APP_URL = 'https://gk-apartment-care.vercel.app';

/**
 * Returns the canonical public app base URL (no trailing slash).
 * Never uses window.location.origin so admin preview/deployment URLs never leak to residents.
 */
export function getPublicBaseUrl(): string {
  const envUrl = (
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_PUBLIC_APP_URL) ||
    ''
  ).trim();

  return (envUrl || PRODUCTION_APP_URL).replace(/\/+$/, '');
}

/**
 * Returns the canonical customer portal relative path, e.g. /c/aparna-sarovar-zenith/AS39Z4
 */
export function getCustomerPortalPath(apartment: { slug: string; portalToken?: string | null }): string {
  const token = apartment.portalToken?.trim();
  return token ? `/c/${apartment.slug}/${token}` : `/c/${apartment.slug}`;
}

/**
 * Generates the full canonical public customer portal URL pointing to the production domain.
 */
export function getCustomerPortalUrl(apartment: { slug: string; portalToken?: string | null }): string {
  return `${getPublicBaseUrl()}${getCustomerPortalPath(apartment)}`;
}

export { eq as routeEq };
