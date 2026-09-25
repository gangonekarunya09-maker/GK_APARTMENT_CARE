/**
 * Ground-truth check: did the browser interest submission actually persist,
 * and did the campaign demand counter move?
 * Run: npx tsx scripts/check-request-recorded.ts
 */
import { readFileSync } from 'node:fs';

const env = readFileSync('.env', 'utf8');
const url = (env.match(/VITE_SUPABASE_URL\s*=\s*"?([^"\n]+)"?/) || [])[1];
const key = (env.match(/VITE_SUPABASE_ANON_KEY\s*=\s*"?([^"\n]+)"?/) || [])[1];

const H = { apikey: key, Authorization: `Bearer ${key}` };

const reqs = await (await fetch(
  `${url}/rest/v1/resident_requests?campaign_id=eq.camp_bhooja_sofa_002&select=id,resident_name,phone,block,flat_number,status,submitted_at&order=submitted_at.desc&limit=5`,
  { headers: H }
)).json();
console.log('Latest resident_requests for camp_bhooja_sofa_002:');
for (const r of reqs) {
  console.log(`  ${r.submitted_at} | ${r.resident_name} | ${r.phone} | ${r.block} ${r.flat_number} | ${r.status}`);
}

const camps = await (await fetch(
  `${url}/rest/v1/campaigns?id=eq.camp_bhooja_sofa_002&select=id,status,current_demand,minimum_demand`,
  { headers: H }
)).json();
console.log('Campaign state:', JSON.stringify(camps[0]));
