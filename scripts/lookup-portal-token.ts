/**
 * One-off: read the real portal token for the seeded community from Supabase
 * (anon key is read from .env locally, never printed). Output is non-secret.
 * Run: npx tsx scripts/lookup-portal-token.ts
 */
import { readFileSync } from 'node:fs';

const env = readFileSync('.env', 'utf8');
const url = (env.match(/VITE_SUPABASE_URL\s*=\s*"?([^"\n]+)"?/) || [])[1];
const key = (env.match(/VITE_SUPABASE_ANON_KEY\s*=\s*"?([^"\n]+)"?/) || [])[1];

if (!url || !key) {
  console.error('Missing env vars');
  process.exit(1);
}

const res = await fetch(`${url}/rest/v1/apartments?select=id,name,slug,portal_token,status&limit=5`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
const rows: any[] = await res.json();
console.log('HTTP', res.status);
for (const r of rows) {
  console.log(
    `apartment: "${r.name}" slug=${r.slug} status=${r.status} portalToken=${r.portal_token} (len ${String(r.portal_token).length})`
  );
}

const cRes = await fetch(`${url}/rest/v1/campaigns?select=id,token,status,current_demand,minimum_demand&limit=5`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
const camps: any[] = await cRes.json();
console.log('campaigns HTTP', cRes.status, 'count:', camps.length);
for (const c of camps) console.log(`campaign: id=${c.id} token=${c.token} status=${c.status} demand=${c.current_demand}/${c.minimum_demand}`);
