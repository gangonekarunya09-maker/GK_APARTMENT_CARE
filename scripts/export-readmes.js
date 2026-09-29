import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const EXPORT_DIR = path.join(ROOT_DIR, 'all_readmes');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PUBLIC_READMES_DIR = path.join(PUBLIC_DIR, 'readmes');

// Ensure directories exist
if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_READMES_DIR)) fs.mkdirSync(PUBLIC_READMES_DIR, { recursive: true });

const readmeFiles = [
  { src: 'README.md', dest: '00_ROOT_README.md', title: 'Root Project Overview' },
  { src: 'WORKFLOW.md', dest: '01_WORKFLOW.md', title: 'Platform Architecture & Workflows' },
  { src: 'src/README.md', dest: '02_SRC_README.md', title: 'Source Directory Guide' },
  { src: 'src/components/README.md', dest: '03_COMPONENTS_README.md', title: 'React UI Components Overview' },
  { src: 'src/components/ui/README.md', dest: '04_COMPONENTS_UI_README.md', title: 'Design System Primitives (Button, Badge, Marquee, etc.)' },
  { src: 'src/components/common/README.md', dest: '05_COMPONENTS_COMMON_README.md', title: 'Global Chrome (Navbar, PromoBar, Footer, Logo)' },
  { src: 'src/components/resident/README.md', dest: '06_COMPONENTS_RESIDENT_README.md', title: 'Resident Storefront & Homepage Sections' },
  { src: 'src/components/public/README.md', dest: '07_COMPONENTS_PUBLIC_README.md', title: 'Public Community Portals & WhatsApp Links' },
  { src: 'src/components/admin/README.md', dest: '08_COMPONENTS_ADMIN_README.md', title: 'Admin Operations Dashboard & Resource Managers' },
  { src: 'src/context/README.md', dest: '09_CONTEXT_README.md', title: 'Global State Store (AppContext)' },
  { src: 'src/data/README.md', dest: '10_DATA_README.md', title: 'Demo Seed Data' },
  { src: 'src/lib/README.md', dest: '11_LIB_README.md', title: 'Utilities, Router & Supabase Client' },
  { src: 'src/types/README.md', dest: '12_TYPES_README.md', title: 'Domain Types & Interfaces' },
  { src: 'supabase/README.md', dest: '13_SUPABASE_README.md', title: 'Supabase Database Schema & RLS Policies' },
];

let masterDoc = `# GK Apartment Care — Complete Project Documentation Bundle\n\nGenerated on: ${new Date().toISOString()}\n\nThis bundle compiles all architectural, domain, component, and database documentation across the GK Apartment Care codebase.\n\n---\n\n## Table of Contents\n\n`;

readmeFiles.forEach((item, index) => {
  masterDoc += `${index + 1}. [${item.title}](#${item.dest.replace(/\.md$/i, '').toLowerCase().replace(/[^a-z0-9_]/g, '-')})\n`;
});

masterDoc += `\n---\n\n`;

readmeFiles.forEach(item => {
  const fullSrcPath = path.join(ROOT_DIR, item.src);
  if (fs.existsSync(fullSrcPath)) {
    const content = fs.readFileSync(fullSrcPath, 'utf8');
    
    // Write individual file to /all_readmes/
    fs.writeFileSync(path.join(EXPORT_DIR, item.dest), content, 'utf8');
    
    // Also copy to /public/readmes/ for direct browser download
    fs.writeFileSync(path.join(PUBLIC_READMES_DIR, item.dest), content, 'utf8');

    masterDoc += `\n\n# ${item.dest}\n### ${item.title}\n*Original path: \`${item.src}\`*\n\n${content}\n\n---\n`;
    console.log(`✓ Exported: ${item.src} → ${item.dest}`);
  } else {
    console.warn(`! File not found: ${item.src}`);
  }
});

// Write Master Doc
fs.writeFileSync(path.join(EXPORT_DIR, 'ALL_IN_ONE_DOCUMENTATION.md'), masterDoc, 'utf8');
fs.writeFileSync(path.join(PUBLIC_READMES_DIR, 'ALL_IN_ONE_DOCUMENTATION.md'), masterDoc, 'utf8');
console.log('✓ Created: ALL_IN_ONE_DOCUMENTATION.md');

// Create HTML index for browser downloads
const htmlIndex = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GK Apartment Care — Documentation Download Center</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAF8F5; color: #111; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    p { color: #5C5A56; }
    .card { background: #fff; border: 1px solid #E4E0D8; border-radius: 16px; padding: 24px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .btn { display: inline-flex; align-items: center; justify-content: center; background: #111; color: #FAF8F5; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: 500; font-size: 14px; margin-top: 12px; }
    .btn:hover { background: #2596be; }
    ul { list-style: none; padding: 0; }
    li { padding: 10px 0; border-bottom: 1px solid #E4E0D8; display: flex; justify-content: space-between; align-items: center; }
    li a { color: #2596be; text-decoration: none; font-weight: 500; }
    li a:hover { text-decoration: underline; }
    .tag { font-size: 11px; background: #F0EDE7; padding: 4px 8px; border-radius: 9999px; color: #5C5A56; }
  </style>
</head>
<body>
  <h1>GK Apartment Care — Documentation Center</h1>
  <p>Download individual markdown documentation files or the complete all-in-one compiled manual.</p>
  
  <div class="card">
    <h2>📦 Complete All-in-One Documentation</h2>
    <p>Contains every README combined in a single comprehensive markdown file with a table of contents.</p>
    <a class="btn" href="/readmes/ALL_IN_ONE_DOCUMENTATION.md" download="GK_Apartment_Care_Complete_Documentation.md">Download Master Manual (.md)</a>
    <a class="btn" style="background: #2596be; margin-left: 8px;" href="/readmes/gk-apartment-care-readmes.zip" download="gk-apartment-care-readmes.zip">Download ZIP Archive (.zip)</a>
  </div>

  <div class="card">
    <h2>📄 Individual Markdown Files</h2>
    <ul>
      ${readmeFiles.map(item => `
        <li>
          <div>
            <strong>${item.dest}</strong><br>
            <span style="font-size: 12px; color: #5C5A56;">${item.title}</span>
          </div>
          <a href="/readmes/${item.dest}" download="${item.dest}">Download .md</a>
        </li>
      `).join('')}
    </ul>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC_READMES_DIR, 'index.html'), htmlIndex, 'utf8');
console.log('✓ Created: public/readmes/index.html');

// Try creating zip archive
try {
  execSync(`cd "${EXPORT_DIR}" && zip -r "${path.join(PUBLIC_READMES_DIR, 'gk-apartment-care-readmes.zip')}" .`);
  fs.copyFileSync(path.join(PUBLIC_READMES_DIR, 'gk-apartment-care-readmes.zip'), path.join(EXPORT_DIR, 'gk-apartment-care-readmes.zip'));
  console.log('✓ Created: gk-apartment-care-readmes.zip');
} catch (e) {
  console.log('Zip command fallback (zipping via script if needed)');
}
