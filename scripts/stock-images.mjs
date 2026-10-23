#!/usr/bin/env node
// Stock photo helper for the premium kit.
//
// Real photos from the business always come first. This only tops up the gaps.
// Sources, in order:
//   1. Unsplash, when UNSPLASH_ACCESS_KEY is set (attribution + download tracking as their API rules ask)
//   2. Pexels, when PEXELS_API_KEY is set
//   3. Openverse (no key), limited to CC0 and public domain by default.
//      Add --commercial to also allow CC BY and CC BY-SA, which need the credit line the footer shows.
// Every photo is downloaded, resized and saved under public/images/stock/. Nothing is hotlinked.
// Credits are written to stock.config.ts; the footer credits the ones site.config.ts uses.
//
// Usage:
//   node scripts/stock-images.mjs --query "smash burger" --count 4
//   node scripts/stock-images.mjs --query "burger" --min 8          (only tops up to 8 real + stock photos)
//   options: --orientation landscape|portrait|squarish  --commercial  --source openverse|unsplash|pexels  --dry
//
// Then in site.config.ts:  import { stock } from "@/stock.config";  ...  image: stock("openverse-ab12cd34.jpg")

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public/images/stock");
const CONFIG = join(ROOT, "stock.config.ts");
const UA = "ClaudAuraStockHelper/1.0 (https://www.claudaura.ca)";
const APP = "claudaura_demo_sites";

function args() {
  const a = process.argv.slice(2);
  const o = { query: "", count: 4, min: 0, orientation: "", commercial: false, source: "", dry: false };
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    const v = () => a[++i];
    if (k === "--query" || k === "-q") o.query = v();
    else if (k === "--count" || k === "-n") o.count = Number(v());
    else if (k === "--min") o.min = Number(v());
    else if (k === "--orientation") o.orientation = v();
    else if (k === "--commercial") o.commercial = true;
    else if (k === "--source") o.source = v();
    else if (k === "--dry") o.dry = true;
    else if (k === "--help" || k === "-h") {
      console.log("node scripts/stock-images.mjs --query \"smash burger\" [--count 4] [--min 8] [--orientation landscape] [--commercial] [--source openverse] [--dry]");
      process.exit(0);
    }
  }
  if (!o.query) throw new Error("Give a --query, for example --query \"smash burger\"");
  return o;
}

async function fetchRetry(url, init = {}, tries = 4) {
  let last;
  for (let t = 0; t < tries; t++) {
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 60000);
      const r = await fetch(url, { ...init, signal: ctl.signal, headers: { "User-Agent": UA, ...(init.headers || {}) } });
      clearTimeout(timer);
      if (r.ok) return r;
      last = new Error(`HTTP ${r.status} for ${String(url).split("?")[0]}`);
      if (r.status < 500 && r.status !== 429) break;
    } catch (e) {
      last = e;
    }
    await new Promise((res) => setTimeout(res, 1500 * (t + 1)));
  }
  throw last;
}

// Count real photos already in public/images (logo, og and stock do not count).
async function realPhotoCount() {
  const dir = join(ROOT, "public/images");
  if (!existsSync(dir)) return 0;
  const files = await readdir(dir);
  return files.filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f) && !/^(logo|og|og-photo)\./i.test(f)).length;
}

async function fromUnsplash(o) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", o.query);
  u.searchParams.set("per_page", String(Math.min(30, o.count * 3)));
  u.searchParams.set("content_filter", "high");
  if (o.orientation) u.searchParams.set("orientation", o.orientation);
  const r = await fetchRetry(u, { headers: { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" } });
  const j = await r.json();
  return j.results.map((p) => ({
    id: p.id,
    url: `${p.urls.raw}&w=2000&fm=jpg&q=82`,
    alt: p.alt_description || p.description || o.query,
    author: p.user.name,
    authorUrl: `${p.user.links.html}?utm_source=${APP}&utm_medium=referral`,
    source: "Unsplash",
    sourceUrl: `${p.links.html}?utm_source=${APP}&utm_medium=referral`,
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
    // Unsplash asks apps to ping this when a photo is actually used.
    track: async () => {
      await fetchRetry(p.links.download_location, { headers: { Authorization: `Client-ID ${key}` } }, 2).catch(() => {});
    },
  }));
}

async function fromPexels(o) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  const u = new URL("https://api.pexels.com/v1/search");
  u.searchParams.set("query", o.query);
  u.searchParams.set("per_page", String(Math.min(40, o.count * 3)));
  if (o.orientation) u.searchParams.set("orientation", o.orientation === "squarish" ? "square" : o.orientation);
  const r = await fetchRetry(u, { headers: { Authorization: key } });
  const j = await r.json();
  return j.photos.map((p) => ({
    id: String(p.id),
    url: p.src.large2x || p.src.original,
    alt: p.alt || o.query,
    author: p.photographer,
    authorUrl: p.photographer_url,
    source: "Pexels",
    sourceUrl: p.url,
    license: "Pexels License",
    licenseUrl: "https://www.pexels.com/license/",
  }));
}

const OV_NAMES = { cc0: "CC0", pdm: "Public domain", by: "CC BY", "by-sa": "CC BY-SA" };

async function fromOpenverse(o) {
  const u = new URL("https://api.openverse.org/v1/images/");
  u.searchParams.set("q", o.query);
  u.searchParams.set("license", o.commercial ? "cc0,pdm,by,by-sa" : "cc0,pdm");
  u.searchParams.set("category", "photograph");
  u.searchParams.set("mature", "false");
  u.searchParams.set("page_size", String(Math.min(20, o.count * 5))); // over 20 needs an Openverse key
  if (o.orientation) u.searchParams.set("aspect_ratio", o.orientation === "landscape" ? "wide" : o.orientation === "portrait" ? "tall" : "square");
  const r = await fetchRetry(u, { headers: { Accept: "application/json" } });
  const j = await r.json();
  return (j.results || [])
    .filter((p) => Math.max(p.width ?? 0, p.height ?? 0) >= 1000 && Math.min(p.width ?? 0, p.height ?? 0) >= 700)
    .map((p) => ({
      id: p.id.replace(/-/g, "").slice(0, 10),
      url: p.url,
      alt: (p.title || o.query).replace(/\.(jpe?g|png)$/i, "").slice(0, 120),
      author: p.creator || "Unknown",
      authorUrl: p.creator_url || undefined,
      source: "Openverse",
      sourceUrl: p.foreign_landing_url || `https://openverse.org/image/${p.id}`,
      license: `${OV_NAMES[p.license] ?? p.license.toUpperCase()}${p.license_version && !["cc0", "pdm"].includes(p.license) ? ` ${p.license_version}` : ""}`,
      licenseUrl: p.license_url || undefined,
    }));
}

async function loadExisting() {
  if (!existsSync(CONFIG)) return [];
  const t = await readFile(CONFIG, "utf8");
  const m = t.match(/export const stockPhotos: StockCredit\[\] = (\[[\s\S]*?\]);\n/);
  return m ? JSON.parse(m[1]) : [];
}

async function writeConfig(list) {
  const body = `import type { Img, StockCredit } from "@/lib/types";

// Written by scripts/stock-images.mjs. Only edit by hand to delete photos you do not use.
// Real photos from the business always come first; stock only fills gaps.
// The footer credits every photo listed here that site.config.ts actually uses.
export const stockPhotos: StockCredit[] = ${JSON.stringify(list, null, 2)};

/** Use a stock photo in site.config.ts: stock("openverse-ab12cd.jpg") gives an Img. */
export function stock(file: string): Img {
  const p = stockPhotos.find((x) => x.src === file || x.src.endsWith(\`/\${file}\`));
  if (!p) throw new Error(\`stock photo not in stock.config.ts: \${file}\`);
  return { src: p.src, alt: p.alt, width: p.width, height: p.height };
}
`;
  await writeFile(CONFIG, body);
}

async function main() {
  const o = args();
  let want = o.count;
  if (o.min) {
    const real = await realPhotoCount();
    const have = (await loadExisting()).length;
    want = Math.max(0, o.min - real - have);
    console.log(`Real photos: ${real}, stock already: ${have}, target ${o.min}: fetching ${want}.`);
    if (!want) return;
  }

  const order = o.source ? [o.source] : ["unsplash", "pexels", "openverse"];
  const fns = { unsplash: fromUnsplash, pexels: fromPexels, openverse: fromOpenverse };
  let cands = [];
  for (const s of order) {
    try {
      const got = await fns[s](o);
      if (got === null) continue; // no key
      console.log(`${s}: ${got.length} candidates`);
      cands = cands.concat(got);
      if (cands.length >= want) break;
    } catch (e) {
      console.warn(`${s} failed: ${e.message}`);
    }
  }
  if (!cands.length) throw new Error("No usable photos found. Try a broader --query.");

  const existing = await loadExisting();
  const seen = new Set(existing.map((x) => x.sourceUrl));
  await mkdir(OUT_DIR, { recursive: true });
  const added = [];
  for (const c of cands) {
    if (added.length >= want) break;
    if (seen.has(c.sourceUrl)) continue;
    const file = `${c.source.toLowerCase()}-${c.id}.jpg`;
    if (o.dry) {
      console.log(`would add ${file}  ${c.license}  ${c.sourceUrl}`);
      added.push(c);
      continue;
    }
    try {
      const r = await fetchRetry(c.url, {}, 3);
      const buf = Buffer.from(await r.arrayBuffer());
      const out = await sharp(buf).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toBuffer({ resolveWithObject: true });
      if (out.info.width < 900) continue;
      await writeFile(join(OUT_DIR, file), out.data);
      if (c.track) await c.track();
      const entry = {
        src: `/images/stock/${file}`,
        alt: c.alt,
        width: out.info.width,
        height: out.info.height,
        author: c.author,
        ...(c.authorUrl ? { authorUrl: c.authorUrl } : {}),
        source: c.source,
        sourceUrl: c.sourceUrl,
        license: c.license,
        ...(c.licenseUrl ? { licenseUrl: c.licenseUrl } : {}),
      };
      added.push(entry);
      seen.add(c.sourceUrl);
      console.log(`added ${entry.src}  ${entry.width}x${entry.height}  ${c.license}  ${c.author}`);
    } catch (e) {
      console.warn(`skip ${c.sourceUrl}: ${e.message}`);
    }
  }
  if (!o.dry) await writeConfig([...existing, ...added]);
  console.log(`Done: ${added.length} photo(s). Check every one looks right before using it, and write a true alt text in site.config.ts if needed.`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
