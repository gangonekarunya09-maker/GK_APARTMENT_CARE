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
 *   4. Everything else  → Resident storefront
 *
 * Campaign tokens are matched against the `campaigns` table only, and community
 * slugs/tokens against the `apartments` table only — a portal token can never be
 * interpreted as a campaign token.
 */

export type RouteKind = 'campaign' | 'community' | 'admin' | 'resident';

export interface RouteMatch {
  kind: RouteKind;

  /** Path form that matched, e.g. 'campaign-token' | 'community-slug-token'. */
  via: string;

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
        campaignToken: null,
        communitySlug: second,
        communityToken: third,
        communityIdOrSlug: null,
      };
    }
    return {
      kind: 'community',
      via: 'path-c-slug',
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
      campaignToken: null,
      communitySlug: null,
      communityToken: null,
      communityIdOrSlug: null,
    };
  }

  // ---------- Resident (default) ----------
  return {
    kind: 'resident',
    via: 'default',
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

export { eq as routeEq };
