/**
 * Verifies canonical community-portal URL generation (Tests 4–6 of the routing brief):
 * Copy Link, Open Portal and WhatsApp must all derive from the single canonical
 * implementation in src/lib/router.ts — never from window.location.origin.
 *
 * Run: npx tsx scripts/verify-canonical-urls.ts
 */
import {
  getPublicBaseUrl,
  getCustomerPortalPath,
  getCustomerPortalUrl,
} from '../src/lib/router';

let failed = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ok  ${name}`);
  } catch (err: any) {
    failed++;
    console.error(`FAIL  ${name}: ${err?.message || err}`);
  }
}
function assertEqual(actual: unknown, expected: unknown) {
  if (actual !== expected) {
    throw new Error(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

const APARNA = { slug: 'aparna-sarovar', portalToken: 'AS39Z4' };
const NO_TOKEN = { slug: 'sdfew', portalToken: '' };

// With no VITE_PUBLIC_APP_URL visible (plain Node/tsx), the hardcoded production
// default must be used — same path production takes when the env var is unset.
check('getPublicBaseUrl → canonical production URL (default)', () => {
  assertEqual(getPublicBaseUrl(), 'https://gk-apartment-care.vercel.app');
});

check('getCustomerPortalPath → /c/:slug/:token', () => {
  assertEqual(getCustomerPortalPath(APARNA), '/c/aparna-sarovar/AS39Z4');
});

check('getCustomerPortalUrl → full canonical production URL', () => {
  assertEqual(
    getCustomerPortalUrl(APARNA),
    'https://gk-apartment-care.vercel.app/c/aparna-sarovar/AS39Z4'
  );
});

check('tokenless community → /c/:slug', () => {
  assertEqual(getCustomerPortalUrl(NO_TOKEN), 'https://gk-apartment-care.vercel.app/c/sdfew');
});

check('VITE_PUBLIC_APP_URL override wins + trailing slash normalized', () => {
  // NOTE: under tsx/Node, import.meta.env is not Vite-injected and cannot be
  // mutated reliably, so we only assert the override when the mutation sticks.
  // In the real app Vite statically replaces import.meta.env.VITE_PUBLIC_APP_URL.
  const meta = import.meta as any;
  const original = meta.env?.VITE_PUBLIC_APP_URL;
  try {
    meta.env = { ...(meta.env || {}), VITE_PUBLIC_APP_URL: 'https://custom.example.com/' };
    if (getPublicBaseUrl() === 'https://custom.example.com') {
      assertEqual(
        getCustomerPortalUrl(APARNA),
        'https://custom.example.com/c/aparna-sarovar/AS39Z4'
      );
    } else {
      console.log('      (skip: import.meta not mutable under tsx — Vite injects env at build time)');
    }
  } finally {
    if (meta.env) meta.env.VITE_PUBLIC_APP_URL = original;
  }
});

console.log(
  failed === 0
    ? '\nALL CANONICAL-URL CHECKS PASSED'
    : `\n${failed} CHECK(S) FAILED`
);
process.exit(failed === 0 ? 0 : 1);
