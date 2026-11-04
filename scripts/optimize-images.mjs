// Pre-generates responsive WebP and AVIF variants of every raster image in /public at build time,
// so the site never asks Vercel to transform images on request.
// Output: public/_opt/<path>.<hash>-<width>.{webp,avif} plus lib/image-manifest.json
// The file name carries a content hash, so the variants can be cached as immutable.
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "_opt");
const MANIFEST = path.join(ROOT, "lib", "image-manifest.json");
// Matches the next.config deviceSizes and imageSizes, so every srcset entry gets a real file.
const WIDTHS = [128, 256, 384, 640, 750, 828, 1080, 1200, 1600, 1920, 2400];
const WEBP_QUALITY = 82;
// Same scale Next.js uses to match WebP visual quality in AVIF (quality * 50 / 80), so 82 becomes 51.
const AVIF_QUALITY = Math.round((WEBP_QUALITY * 50) / 80);
const EXT = /\.(jpe?g|png|webp)$/i;

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (p !== OUT) out.push(...(await walk(p)));
    } else if (EXT.test(e.name)) out.push(p);
  }
  return out;
}

const exists = (p) => fs.access(p).then(() => true, () => false);

const manifest = {};
const files = await walk(PUBLIC);
let made = 0;
for (let i = 0; i < files.length; i += 4) {
  await Promise.all(
    files.slice(i, i + 4).map(async (file) => {
      const rel = "/" + path.relative(PUBLIC, file).split(path.sep).join("/");
      const buf = await fs.readFile(file);
      const hash = createHash("sha1").update(buf).digest("hex").slice(0, 8);
      const meta = await sharp(buf).metadata();
      const srcW = (meta.orientation ?? 1) >= 5 ? meta.height : meta.width;
      if (!srcW) return;
      // No upscaling: keep the widths below the source, plus the source width itself (capped at 2400).
      const widths = [...new Set([...WIDTHS.filter((w) => w < srcW), Math.min(srcW, 2400)])].sort((a, b) => a - b);
      const base = rel.replace(EXT, "");
      for (const w of widths) {
        const stem = path.join(OUT, `${base}.${hash}-${w}`);
        if (!(await exists(`${stem}.webp`))) {
          await fs.mkdir(path.dirname(stem), { recursive: true });
          const img = sharp(buf).rotate().resize({ width: w, withoutEnlargement: true });
          await img.clone().webp({ quality: WEBP_QUALITY, effort: 5 }).toFile(`${stem}.webp`);
          await img.clone().avif({ quality: AVIF_QUALITY, effort: 4 }).toFile(`${stem}.avif`);
          made++;
        }
      }
      manifest[rel] = [hash, ...widths];
    }),
  );
}
const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");
console.log(`optimize-images: ${files.length} sources, ${made} new variant sizes`);
