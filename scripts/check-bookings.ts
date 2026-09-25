/**
 * Ground-truth check: did the browser booking persist?
 * Run: npx tsx scripts/check-bookings.ts
 */
import { readFileSync } from 'node:fs';

const env = readFileSync('.env', 'utf8');
const url = (env.match(/VITE_SUPABASE_URL\s*=\s*"?([^"\n]+)"?/) || [])[1];
const key = (env.match(/VITE_SUPABASE_ANON_KEY\s*=\s*"?([^"\n]+)"?/) || [])[1];
const H = { apikey: key, Authorization: `Bearer ${key}` };

const res = await fetch(
  `${url}/rest/v1/bookings?select=*&order=created_at.desc&limit=3`,
  { headers: H }
);
const rows = await res.json();

if (!Array.isArray(rows)) {
  console.error('HTTP', res.status, JSON.stringify(rows).slice(0, 300));
  process.exit(1);
}
console.log(`HTTP ${res.status} — latest ${rows.length} bookings:`);
for (const b of rows) {
  console.log(
    `  ${b.booking_number} | ${b.booking_type} | ${b.date ?? b.preferred_date ?? '?'} ${b.slot ?? b.preferred_slot ?? '?'} | flat=${b.flat_number} | ${b.status}`
  );
}
