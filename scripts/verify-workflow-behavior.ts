/**
 * Headless verification of the behavior claims documented in the READMEs/WORKFLOW.md.
 * Drives the REAL modules (src/lib/router.ts, src/lib/ids.ts) — no reimplementation.
 *
 * Run: npx tsx scripts/verify-workflow-behavior.ts
 */
import assert from 'node:assert/strict';
import { resolveRoute, isAdminPath, type RouteMatch } from '../src/lib/router';
import { generateId, generateShareToken, slugify } from '../src/lib/ids';

let passed = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ok  ${name}`);
  } catch (err) {
    console.error(`FAIL  ${name}`);
    throw err;
  }
}

console.log('\n== router.ts: WORKFLOW.md flowchart branch order ==\n');

// Priority 1: query-token campaign routes
check('?token= → campaign (query-token)', () => {
  const m = resolveRoute('/whatever/path', '?token=ABC123XY');
  assert.equal(m.kind, 'campaign');
  assert.equal(m.via, 'query-token');
  assert.equal(m.campaignToken, 'ABC123XY');
});
check('?campaign= → campaign', () => {
  const m = resolveRoute('/', '?campaign=XYZ99QQ');
  assert.equal(m.kind, 'campaign');
  assert.equal(m.campaignToken, 'XYZ99QQ');
});

// Priority 2: query-community (but NOT when path already says /community/...)
check('?c=slug → community', () => {
  const m = resolveRoute('/', '?c=my-home-bhooja');
  assert.equal(m.kind, 'community');
  assert.equal(m.via, 'query-community');
  assert.equal(m.communityToken, 'my-home-bhooja');
});
check('?community=token does not win over explicit /community/ 4-segment path', () => {
  const m = resolveRoute('/community/my-soc/cleaning/TOK1', '?community=nope');
  assert.equal(m.kind, 'campaign');
  assert.equal(m.campaignToken, 'TOK1');
  assert.equal(m.communitySlug, 'my-soc');
  assert.equal(m.via, 'path-community-service-token');
});

// Path campaign routes
check('/campaign/:token → campaign', () => {
  const m = resolveRoute('/campaign/8CHARA1', '');
  assert.equal(m.kind, 'campaign');
  assert.equal(m.via, 'path-campaign');
  assert.equal(m.campaignToken, '8CHARA1');
});
check('/book/:token → campaign', () => {
  const m = resolveRoute('/book/8CHARA1', '');
  assert.equal(m.kind, 'campaign');
  assert.equal(m.via, 'path-book');
});
check('/community/:slug/:service/:token → campaign (4 segments)', () => {
  const m = resolveRoute('/community/my-home-bhooja/deep-cleaning/TOK9ZZZ', '');
  assert.equal(m.kind, 'campaign');
  assert.equal(m.campaignToken, 'TOK9ZZZ');
  assert.equal(m.communitySlug, 'my-home-bhooja');
});

// Community portal routes
check('/c/:slug/:token → community (slug + token)', () => {
  const m = resolveRoute('/c/my-home-bhooja/MH82B1X9', '');
  assert.equal(m.kind, 'community');
  assert.equal(m.via, 'path-c-slug-token');
  assert.equal(m.communitySlug, 'my-home-bhooja');
  assert.equal(m.communityToken, 'MH82B1X9');
});
check('/c/:slug → community (slug-only, token falls back to slug)', () => {
  const m = resolveRoute('/c/my-home-bhooja', '');
  assert.equal(m.kind, 'community');
  assert.equal(m.via, 'path-c-slug');
  assert.equal(m.communitySlug, 'my-home-bhooja');
  assert.equal(m.communityToken, null);
  assert.equal(m.communityIdOrSlug, 'my-home-bhooja');
});
check('/community-portal/:idOrSlug → community', () => {
  const m = resolveRoute('/community-portal/apt-123', '');
  assert.equal(m.kind, 'community');
  assert.equal(m.via, 'path-community-portal');
  assert.equal(m.communityIdOrSlug, 'apt-123');
});

// Admin routes
check('/admin → admin', () => {
  const m = resolveRoute('/admin', '');
  assert.equal(m.kind, 'admin');
  assert.equal(m.via, 'path-admin');
});
check('/admin/campaigns → admin', () => {
  const m = resolveRoute('/admin/campaigns', '');
  assert.equal(m.kind, 'admin');
});
check('?admin=true → admin', () => {
  const m = resolveRoute('/', '?admin=true');
  assert.equal(m.kind, 'admin');
  assert.equal(m.via, 'query-admin');
});

// Resident default
check('/ → resident (default)', () => {
  const m = resolveRoute('/', '');
  assert.equal(m.kind, 'resident');
  assert.equal(m.via, 'default');
});
check('/anything-else → resident (default)', () => {
  const m = resolveRoute('/some/unknown/page', '');
  assert.equal(m.kind, 'resident');
});

// THE critical isolation guarantee from the docs:
// "Campaign tokens are matched against the campaigns table only, and community
//  slugs/tokens against the apartments table only — a portal token can never be
//  interpreted as a campaign token."
check('ISOLATION: /c/:slug never yields a campaignToken', () => {
  const m = resolveRoute('/c/MH82B1X9', '');
  assert.equal(m.kind, 'community');
  assert.equal(m.campaignToken, null);
});
check('ISOLATION: /campaign/:token never yields a communitySlug/Token', () => {
  const m = resolveRoute('/campaign/MH82B1X9', '');
  assert.equal(m.kind, 'campaign');
  assert.equal(m.communitySlug, null);
  assert.equal(m.communityToken, null);
  assert.equal(m.communityIdOrSlug, null);
});
check('ISOLATION: /admin/:x never yields tokens', () => {
  const m = resolveRoute('/admin/anything/here', '');
  assert.equal(m.kind, 'admin');
  assert.equal(m.campaignToken, null);
  assert.equal(m.communitySlug, null);
});
check('route priority: ?token beats /admin path (campaign link pasted with admin path)', () => {
  const m = resolveRoute('/admin', '?token=TOK1');
  assert.equal(m.kind, 'campaign');
});

// isAdminPath (used by App.tsx admin gate)
check('isAdminPath: /admin → isAdmin', () => {
  assert.deepEqual(isAdminPath('/admin', ''), { isAdmin: true, isLoginPath: false });
});
check('isAdminPath: /admin/login → isLoginPath', () => {
  assert.deepEqual(isAdminPath('/admin/login', ''), { isAdmin: true, isLoginPath: true });
});
check('isAdminPath: ?admin=login → isLoginPath', () => {
  assert.deepEqual(isAdminPath('/', '?admin=login'), { isAdmin: true, isLoginPath: true });
});
check('isAdminPath: /c/slug → false', () => {
  assert.deepEqual(isAdminPath('/c/my-home-bhooja', ''), { isAdmin: false, isLoginPath: false });
});

console.log('\n== ids.ts: token/ID generation claims ==\n');

const TOKEN_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

check('generateShareToken: default length 8', () => {
  assert.equal(generateShareToken().length, 8);
});
check('generateShareToken: only unambiguous alphabet chars (no I, O, 0, 1)', () => {
  for (let i = 0; i < 300; i++) {
    const t = generateShareToken();
    for (const ch of t) {
      assert.ok(TOKEN_ALPHABET.includes(ch), `unexpected char ${ch} in ${t}`);
    }
  }
});
check('generateShareToken: random-looking (300 tokens → >150 distinct)', () => {
  const set = new Set<string>();
  for (let i = 0; i < 300; i++) set.add(generateShareToken());
  assert.ok(set.size > 150, `only ${set.size} distinct tokens out of 300`);
});
check('generateShareToken: custom length honored', () => {
  assert.equal(generateShareToken(12).length, 12);
});
check('generateId: UUID format via crypto.randomUUID', () => {
  const id = generateId('apt');
  assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
});
check('generateId: unique across 500 calls', () => {
  const set = new Set<string>();
  for (let i = 0; i < 500; i++) set.add(generateId('x'));
  assert.equal(set.size, 500);
});
check('slugify: lowercase, hyphens, trimmed, ≤60 chars', () => {
  assert.equal(slugify('My Home Bhooja'), 'my-home-bhooja');
  assert.equal(slugify('  A  &  B Apartments!! '), 'a-b-apartments');
  assert.ok(slugify('X'.repeat(200)).length <= 60);
});

console.log(`\nALL ${passed} BEHAVIOR CHECKS PASSED\n`);
