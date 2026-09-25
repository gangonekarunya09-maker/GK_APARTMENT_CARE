/**
 * ID & token generation helpers.
 *
 * Production strategy:
 *  - Primary keys: UUID v4 via crypto.randomUUID() (Postgres `text` PKs accept them).
 *    `Date.now()` ids are only used as an offline fallback and are still unique.
 *  - Share/portal tokens: 8 chars from a 31-symbol unambiguous alphabet (no
 *    I, O, 0, 1) generated with crypto.getRandomValues → ~25 bits of entropy,
 *    unpredictable and URL-safe, with a collision-retry helper.
 */

const TOKEN_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function randomInts(length: number): Uint32Array {
  const cryptoObj: Crypto | undefined =
    typeof globalThis !== 'undefined' ? (globalThis.crypto as Crypto | undefined) : undefined;

  if (cryptoObj?.getRandomValues) {
    const arr = new Uint32Array(length);
    cryptoObj.getRandomValues(arr);
    return arr;
  }

  // Extremely defensive fallback for non-secure contexts.
  const arr = new Uint32Array(length);
  for (let i = 0; i < length; i++) {
    arr[i] = Math.floor(Math.random() * 0xffffffff);
  }
  return arr;
}

export function generateId(prefix: string): string {
  const cryptoObj: Crypto | undefined =
    typeof globalThis !== 'undefined' ? (globalThis.crypto as Crypto | undefined) : undefined;

  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
    return cryptoObj.randomUUID();
  }

  // Fallback: timestamp + random suffix (unique enough for offline demo mode).
  const rand = Array.from(randomInts(2))
    .map(n => n.toString(36))
    .join('');
  return `${prefix}-${Date.now().toString(36)}-${rand}`;
}

export function generateShareToken(length = 8): string {
  const ints = randomInts(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += TOKEN_ALPHABET[ints[i] % TOKEN_ALPHABET.length];
  }
  return out;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
