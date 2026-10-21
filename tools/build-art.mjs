import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'assets');
function walk(dir) { return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : entry.name.endsWith('.svg') ? [join(dir, entry.name)] : []); }
const files = walk(assets).sort();
if (files.length !== 104) throw new Error(`Expected 104 SVG sources, found ${files.length}`);
const registry = {};
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const key = relative(assets, file).replaceAll('\\', '/').replace(/\.svg$/, '');
  const viewBox = text.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox || !text.includes('<title>') || /foreignObject|<image\b|https?:\/\/(?!www\.w3\.org)/.test(text)) throw new Error(`Invalid source ${key}`);
  registry[key] = { viewBox, body: text.slice(text.indexOf('<g'), text.lastIndexOf('</svg>')) };
}
writeFileSync(join(root, 'js', 'art.generated.js'), '/* Generated from 104 original local SVG sources. */\n(function(){ "use strict"; window.PetGame=window.PetGame||{}; window.PetGame.art=' + JSON.stringify(registry) + '; })();\n');
console.log(`Built ${files.length} original SVG assets into js/art.generated.js`);
