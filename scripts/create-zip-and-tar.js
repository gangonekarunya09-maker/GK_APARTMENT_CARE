import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import zlib from 'zlib';

const EXPORT_DIR = path.join(process.cwd(), 'all_readmes');
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'readmes');

// 1. Create tar.gz using system tar
try {
  execSync(`tar -czf "${path.join(EXPORT_DIR, 'gk-apartment-care-readmes.tar.gz')}" -C "${EXPORT_DIR}" .`);
  fs.copyFileSync(
    path.join(EXPORT_DIR, 'gk-apartment-care-readmes.tar.gz'),
    path.join(PUBLIC_DIR, 'gk-apartment-care-readmes.tar.gz')
  );
  console.log('✓ Created tar.gz archive successfully');
} catch (e) {
  console.error('Tar creation error:', e);
}

// 2. Pure JavaScript ZIP generator (Standard PKZIP format without external dependencies)
function createZip(files, outputPath) {
  // Simple CRC32 implementation
  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ ((crc ^ byte) & 1 ? 0xedb88320 : 0);
        byte >>>= 1;
      }
    }
    return (crc ^ -1) >>> 0;
  }

  const fileEntries = [];
  let offset = 0;
  const localHeaders = [];

  for (const { name, data } of files) {
    const filenameBuf = Buffer.from(name, 'utf8');
    const crc = crc32(data);
    const uncompressedSize = data.length;
    const compressedSize = data.length; // Store (no compression)

    // Local file header (30 bytes + filename)
    const localHeader = Buffer.alloc(30 + filenameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local header signature
    localHeader.writeUInt16LE(20, 4);          // Version needed (2.0)
    localHeader.writeUInt16LE(0, 6);           // General purpose bit flag
    localHeader.writeUInt16LE(0, 8);           // Compression method (0 = Store)
    localHeader.writeUInt16LE(0, 10);          // Last mod file time
    localHeader.writeUInt16LE(0, 12);          // Last mod file date
    localHeader.writeUInt32LE(crc, 14);        // CRC-32
    localHeader.writeUInt32LE(compressedSize, 18);   // Compressed size
    localHeader.writeUInt32LE(uncompressedSize, 22); // Uncompressed size
    localHeader.writeUInt16LE(filenameBuf.length, 26); // Filename length
    localHeader.writeUInt16LE(0, 28);          // Extra field length
    filenameBuf.copy(localHeader, 30);

    localHeaders.push(localHeader, data);

    fileEntries.push({
      name: filenameBuf,
      crc,
      compressedSize,
      uncompressedSize,
      offset,
    });

    offset += localHeader.length + data.length;
  }

  // Central directory
  const centralHeaders = [];
  let centralDirSize = 0;

  for (const entry of fileEntries) {
    const centralHeader = Buffer.alloc(46 + entry.name.length);
    centralHeader.writeUInt32LE(0x02014b50, 0); // Central directory signature
    centralHeader.writeUInt16LE(20, 4);          // Version made by
    centralHeader.writeUInt16LE(20, 6);          // Version needed
    centralHeader.writeUInt16LE(0, 8);           // Flags
    centralHeader.writeUInt16LE(0, 10);          // Compression method
    centralHeader.writeUInt16LE(0, 12);          // Time
    centralHeader.writeUInt16LE(0, 14);          // Date
    centralHeader.writeUInt32LE(entry.crc, 16);  // CRC-32
    centralHeader.writeUInt32LE(entry.compressedSize, 20);
    centralHeader.writeUInt32LE(entry.uncompressedSize, 24);
    centralHeader.writeUInt16LE(entry.name.length, 28);
    centralHeader.writeUInt16LE(0, 30);          // Extra length
    centralHeader.writeUInt16LE(0, 32);          // Comment length
    centralHeader.writeUInt16LE(0, 34);          // Disk start
    centralHeader.writeUInt16LE(0, 36);          // Internal attributes
    centralHeader.writeUInt32LE(0, 38);          // External attributes
    centralHeader.writeUInt32LE(entry.offset, 42); // Relative offset
    entry.name.copy(centralHeader, 46);

    centralHeaders.push(centralHeader);
    centralDirSize += centralHeader.length;
  }

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
  eocd.writeUInt16LE(0, 4);          // Disk number
  eocd.writeUInt16LE(0, 6);          // Disk with central dir
  eocd.writeUInt16LE(files.length, 8); // Entries on disk
  eocd.writeUInt16LE(files.length, 10); // Total entries
  eocd.writeUInt32LE(centralDirSize, 12); // Central dir size
  eocd.writeUInt32LE(offset, 16);    // Central dir offset
  eocd.writeUInt16LE(0, 20);         // Comment length

  const finalZipBuffer = Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
  fs.writeFileSync(outputPath, finalZipBuffer);
}

try {
  const mdFiles = fs.readdirSync(EXPORT_DIR).filter(f => f.endsWith('.md'));
  const fileObjects = mdFiles.map(filename => ({
    name: filename,
    data: fs.readFileSync(path.join(EXPORT_DIR, filename)),
  }));

  const zipPathExport = path.join(EXPORT_DIR, 'gk-apartment-care-readmes.zip');
  const zipPathPublic = path.join(PUBLIC_DIR, 'gk-apartment-care-readmes.zip');

  createZip(fileObjects, zipPathExport);
  createZip(fileObjects, zipPathPublic);
  console.log('✓ Created pure JS PKZIP archive successfully');
} catch (e) {
  console.error('Zip creation error:', e);
}
