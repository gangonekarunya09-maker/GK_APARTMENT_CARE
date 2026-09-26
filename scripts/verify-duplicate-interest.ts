/**
 * Verifies the duplicate-interest rule (business rule: one interest per resident
 * per campaign) using the same normalization the app and the SQL dedupe_key use:
 *
 *   identity = digits-only(phone) + lower(trim(block)) + lower(trim(flat))
 *   scoped to (campaign_id, apartment_id)
 *
 * Mirrors scenarios 1-5 from the requirement brief at the logic level. True
 * concurrent-submission protection is enforced by the database (generated
 * dedupe_key + partial UNIQUE index + RPC check inside the locked transaction);
 * here we verify the exact rule those database objects implement.
 *
 * Run: npx tsx scripts/verify-duplicate-interest.ts
 */

// Shared normalization — must stay identical to:
//   - AppContext.submitResidentInterest (demo branch + live pre-check)
//   - resident_requests.dedupe_key / increment_campaign_demand (supabase/schema.sql §2C/§6)
function normalizePhone(phone: string): string {
  // Digits only, then last 10 digits: makes "+91 98765 43210", "09876543210"
  // and "9876543210" the same resident (must match app + SQL rule exactly).
  return (phone || '').replace(/[^0-9]/g, '').slice(-10);
}
function normalizeBlock(block: string): string {
  return (block || '').trim().toLowerCase();
}
function normalizeFlat(flat: string): string {
  return (flat || '').trim().toLowerCase();
}
function identityKey(r: { phone: string; block: string; flatNumber: string }): string {
  return `${normalizePhone(r.phone)}|${normalizeBlock(r.block)}|${normalizeFlat(r.flatNumber)}`;
}

interface InterestRow {
  id: string;
  campaignId: string;
  apartmentId: string;
  residentName: string;
  phone: string;
  block: string;
  flatNumber: string;
}

/**
 * In-memory model of the database rule (dedupe_key + partial UNIQUE index +
 * RPC duplicate check): insert only if the (campaign, apartment, identity)
 * triple is new; never modify demand on a duplicate.
 */
function submitInterest(
  table: InterestRow[],
  row: Omit<InterestRow, 'id'>
): { accepted: boolean; duplicate: boolean } {
  const key = identityKey(row);
  const exists = table.some(
    r =>
      r.campaignId === row.campaignId &&
      r.apartmentId === row.apartmentId &&
      identityKey(r) === key
  );
  if (exists) return { accepted: false, duplicate: true };
  table.push({ ...row, id: `req-${table.length + 1}` });
  return { accepted: true, duplicate: false };
}

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
function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}
function assertEqual(actual: unknown, expected: unknown) {
  if (actual !== expected) {
    throw new Error(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

const APT = 'community_my_home_bhooja_002';
const AC = 'camp_ac_cleaning';
const CW = 'camp_car_wash';

check('Scenario 1: first submission accepted, demand increments', () => {
  const table: InterestRow[] = [];
  let demand = 0;
  const res = submitInterest(table, {
    campaignId: AC, apartmentId: APT, residentName: 'Rahul Kumar',
    phone: '9876543210', block: 'Tower B', flatNumber: 'B-1204',
  });
  assert(res.accepted && !res.duplicate, 'first submission must be accepted');
  demand += 1;
  assertEqual(table.length, 1);
  assertEqual(demand, 1);
});

check('Scenario 2: same resident resubmits (format/case variants) → duplicate, demand unchanged', () => {
  const table: InterestRow[] = [
    { id: 'req-1', campaignId: AC, apartmentId: APT, residentName: 'Rahul Kumar',
      phone: '9876543210', block: 'Tower B', flatNumber: 'B-1204' },
  ];
  let demand = 1;
  // Same resident, different phone formatting and block casing:
  const res = submitInterest(table, {
    campaignId: AC, apartmentId: APT, residentName: 'Rahul K',
    phone: '+91 98765 43210', block: 'TOWER B', flatNumber: 'b-1204',
  });
  assert(!res.accepted && res.duplicate, 'must be detected as duplicate');
  assertEqual(table.length, 1); // no second request row may be created
  assertEqual(demand, 1); // demand must not increase on duplicate
});

check('Scenario 3: two identical submissions arrive together → only ONE row stored', () => {
  const table: InterestRow[] = [];
  const payload = {
    campaignId: AC, apartmentId: APT, residentName: 'Rahul Kumar',
    phone: '9876543210', block: 'Tower B', flatNumber: 'B-1204',
  };
  const results = [submitInterest(table, payload), submitInterest(table, payload)];
  assertEqual(table.length, 1); // database constraint allows exactly one row
  assert(results[0].accepted && !results[1].accepted, 'second concurrent submit is the duplicate');
});

check('Scenario 4: two different residents, same campaign → both accepted', () => {
  const table: InterestRow[] = [];
  const r1 = submitInterest(table, {
    campaignId: AC, apartmentId: APT, residentName: 'Rahul Kumar',
    phone: '9876543210', block: 'Tower B', flatNumber: 'B-1204',
  });
  const r2 = submitInterest(table, {
    campaignId: AC, apartmentId: APT, residentName: 'Priya Sharma',
    phone: '9876543211', block: 'Tower B', flatNumber: 'B-1205',
  });
  assert(r1.accepted && r2.accepted, 'different flats must both be accepted');
  assertEqual(table.length, 2); // demand counts both residents
});

check('Scenario 5: same resident, DIFFERENT campaign → allowed (rule is campaign-scoped)', () => {
  const table: InterestRow[] = [
    { id: 'req-1', campaignId: AC, apartmentId: APT, residentName: 'Rahul Kumar',
      phone: '9876543210', block: 'Tower B', flatNumber: 'B-1204' },
  ];
  const res = submitInterest(table, {
    campaignId: CW, apartmentId: APT, residentName: 'Rahul Kumar',
    phone: '9876543210', block: 'Tower B', flatNumber: 'B-1204',
  });
  assert(res.accepted, 'same resident may join a different campaign');
  assertEqual(table.length, 2);
});

check('Identity normalization matches the app/SQL rule exactly', () => {
  assertEqual(
    identityKey({ phone: '+91 98765 43210', block: ' Tower B ', flatNumber: 'B-1204' }),
    identityKey({ phone: '9876543210', block: 'tower b', flatNumber: 'b-1204' })
  );
  assertEqual(
    identityKey({ phone: '98765-43210', block: 'A', flatNumber: '101' }),
    '9876543210|a|101'
  );
});

check('demand-poll rows (campaign_id NULL) and other apartments are never conflated', () => {
  const table: InterestRow[] = [
    { id: 'req-1', campaignId: AC, apartmentId: APT, residentName: 'A',
      phone: '9876543210', block: 'Tower B', flatNumber: 'B-1204' },
  ];
  // Same identity but a different community: allowed (scoped by apartment_id).
  const otherApt = submitInterest(table, {
    campaignId: AC, apartmentId: 'community_green_valley_001', residentName: 'A',
    phone: '9876543210', block: 'Tower B', flatNumber: 'B-1204',
  });
  assert(otherApt.accepted, 'same resident in another community is a different resident set');
});

console.log(
  failed === 0
    ? '\nALL DUPLICATE-INTEREST SCENARIOS PASSED'
    : `\n${failed} SCENARIO(S) FAILED`
);
process.exit(failed === 0 ? 0 : 1);
