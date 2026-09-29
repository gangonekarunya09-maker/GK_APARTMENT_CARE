import { resolveRoute, isAdminPath } from '../src/lib/router';

const testPaths = [
  '/',
  '/about',
  '/how-it-works',
  '/services',
  '/contact',
  '/privacy-policy',
  '/terms',
  '/refund-policy',
  '/payment-info',
  '/rwa',
  '/vendor',
  '/c/my-home-bhooja/MH88B1',
  '/campaign/CMP-TEST-123',
  '/admin',
  '/admin/login',
  '/admin/campaigns',
];

console.log('Testing Route Classification:');
testPaths.forEach(path => {
  const match = resolveRoute(path, '');
  const admin = isAdminPath(path, '');
  console.log(`Path: ${path.padEnd(30)} -> Kind: ${match.kind.padEnd(10)} | Page: ${(match.page || '-').padEnd(16)} | Admin: ${admin.isAdmin}`);
});
