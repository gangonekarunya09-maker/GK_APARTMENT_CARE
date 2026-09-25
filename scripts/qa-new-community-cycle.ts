/**
 * QA cycle: create → route → delete. Proves a NEW community row immediately
 * gets a working /c/:slug/:token URL with zero config changes (test E/F).
 * Run: npx tsx scripts/qa-new-community-cycle.ts
 */
import { readFileSync } from 'node:fs';

const env = readFileSync('.env', 'utf8');
const url = (env.match(/VITE_SUPABASE_URL\s*=\s*"?([^"\n]+)"?/) || [])[1];
const key = (env.match(/VITE_SUPABASE_ANON_KEY\s*=\s*"?([^"\n]+)"?/) || [])[1];
const H = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

const SLUG = 'qa-portal-check';
const TOKEN = 'QA42X9';

// 1. CREATE (same fields addApartment writes)
const ins = await fetch(`${url}/rest/v1/apartments`, {
  method: 'POST',
  headers: H,
  body: JSON.stringify({
    id: 'community_qa_portal_check',
    name: 'QA Portal Check Community',
    slug: SLUG,
    portal_token: TOKEN,
    address: 'QA Test Street',
    area: 'Test Area',
    city: 'Hyderabad',
    pincode: '500001',
    total_units: 10,
    status: 'active',
  }),
});
console.log('CREATE:', ins.status, ins.status === 201 ? 'ok' : await ins.text());

// 2. STRICT PAIRED LOOKUP (what fetchApartmentForPortal now sends)
const q = `${url}/rest/v1/apartments?select=id,slug,portal_token&slug=eq.${SLUG}&portal_token=eq.${TOKEN}`;
const row = await (await fetch(q, { headers: H })).json();
console.log('PAIRED LOOKUP:', JSON.stringify(row));

// 3. WRONG-TOKEN LOOKUP must be empty (isolation)
const bad = await (
  await fetch(`${url}/rest/v1/apartments?select=id&slug=eq.${SLUG}&portal_token=eq.WRONG1`, { headers: H })
).json();
console.log('WRONG TOKEN LOOKUP (must be []):', JSON.stringify(bad));

// 4. DELETE (cleanup)
const del = await fetch(`${url}/rest/v1/apartments?id=eq.community_qa_portal_check`, { method: 'DELETE', headers: H });
console.log('DELETE:', del.status);

// 5. Confirm gone
const after = await (await fetch(q, { headers: H })).json();
console.log('AFTER DELETE (must be []):', JSON.stringify(after));
