/**
 * Debug: reproduce the strict slug+token portal query against live Supabase.
 * Run: npx tsx scripts/debug-portal-query.ts
 */
import { readFileSync } from 'node:fs';

const env = readFileSync('.env', 'utf8');
const url = (env.match(/VITE_SUPABASE_URL\s*=\s*"?([^"\n]+)"?/) || [])[1];
const key = (env.match(/VITE_SUPABASE_ANON_KEY\s*=\s*"?([^"\n]+)"?/) || [])[1];
const H = { apikey: key, Authorization: `Bearer ${key}` };

const q1 = `${url}/rest/v1/apartments?select=*&limit=1&slug=eq.my-home-bhooja&portal_token=eq.MH82B1`;
const r1 = await fetch(q1, { headers: H });
console.log('strict pairing:', r1.status, (await r1.text()).slice(0, 200));

const q2 = `${url}/rest/v1/apartments?select=id,slug,portal_token&slug=eq.my-home-bhooja`;
const r2 = await fetch(q2, { headers: H });
console.log('by slug only :', r2.status, (await r2.text()).slice(0, 300));
