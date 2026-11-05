// Package the existing static site only; no framework, bundling or source rewriting.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
fs.mkdirSync(output, { recursive: true });
fs.copyFileSync(path.join(root, 'index.html'), path.join(output, 'index.html'));
fs.rmSync(path.join(output, 'assets'), { recursive: true, force: true });
fs.cpSync(path.join(root, 'assets'), path.join(output, 'assets'), {
  recursive: true,
  // Unused variants are retained in the handover but do not go onto the public site.
  filter: source => !['portrait-finger.webp', 'portrait-smile.webp'].includes(path.basename(source))
});
console.log('Static website packaged in dist/ (HTML + assets, exactly two personal photos).');
