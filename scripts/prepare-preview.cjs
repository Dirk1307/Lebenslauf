// Single-file review copy of the existing site, regenerated from the current sources.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const mime = { '.webp':'image/webp', '.svg':'image/svg+xml', '.woff':'font/woff', '.woff2':'font/woff2' };
function dataUri(file) {
  return `data:${mime[path.extname(file)] || 'application/octet-stream'};base64,${fs.readFileSync(file).toString('base64')}`;
}
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let css = fs.readFileSync(path.join(root, 'assets/site.css'), 'utf8');
css = css.replace(/url\((['"]?)([^)'"\s]+)\1\)/g, (match, quote, value) => {
  if (/^(data:|https?:|#)/.test(value)) return match;
  return `url("${dataUri(path.join(root, 'assets', value))}")`;
});
html = html.replace('<link rel="stylesheet" href="assets/site.css">', `<style>\n${css}\n</style>`);
const scripts = [];
html = html.replace(/<script src="(assets\/[^"<>]+)" defer><\/script>/g, (match, file) => {
  scripts.push(fs.readFileSync(path.join(root, file), 'utf8'));
  return '';
});
html = html.replace('</body>', `<script>\n${scripts.join('\n')}\n</script>\n</body>`);
// External SVG <use> keeps currentColor themeing in the normal site. Embed the
// original paths for the standalone copy so it needs no file:// fetches.
html = html.replace(/<use href="(assets\/illustrations\/[^"<>]+\.svg)"><\/use>/g, (match, file) => {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const inner = source.match(/<svg\b[^>]*>([\s\S]*)<\/svg>\s*$/);
  if (!inner) throw new Error(`Invalid illustration: ${file}`);
  return inner[1];
});
html = html.replace(/(src|href)="(assets\/[^"<>]+)"/g, (match, attr, file) => `${attr}="${dataUri(path.join(root, file))}"`);
// All resources are already embedded; eager loading makes offline checks predictable.
html = html.replaceAll('loading="lazy"', 'loading="eager"');
const licenseFiles = [
  'assets/fonts/LICENSE-V6A-Symbols.txt',
  'assets/fonts/OFL-DM-Sans.txt',
  'assets/fonts/OFL-DM-Serif-Display.txt',
  'assets/licenses/Watermelon-MIT.txt',
  'assets/licenses/evoMark-MIT.txt',
  'assets/licenses/unDraw.txt'
];
const licenses = licenseFiles.map(file => `${file}\n${fs.readFileSync(path.join(root, file), 'utf8')}`).join('\n\n');
html = html.replace('</head>', `<!-- Single-file V6A review copy. Third-party licenses:\n${licenses.replaceAll('--', '—')}\n-->\n</head>`);
html = html.split('\n').map(line => line.trimEnd()).join('\n');
const folder = path.join(root, 'vorschau');
fs.mkdirSync(folder, { recursive:true });
fs.writeFileSync(path.join(folder, 'Dirk_Herrmann_V6A_Vorschau.html'), html);
console.log('Current standalone preview saved to vorschau/Dirk_Herrmann_V6A_Vorschau.html');
