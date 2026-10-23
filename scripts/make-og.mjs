// usage: node scripts/make-og.mjs   (after `next build`; `npm run og` does both)
// Turns the prerendered share card (app/og-card) into public/og.jpg: 1200x630 JPEG, under 200 KB.
// WhatsApp and Instagram skip preview images over about 300 KB, so we keep it small and static.
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url + "/../../node_modules/next/package.json");
const sharp = require("sharp");
const src = [".next/server/app/og-card.body", ".next/server/app/og-card/route.body"].find(existsSync);
if (!src) {
  console.error("make-og: prerendered og-card not found, run `next build` first");
  process.exit(1);
}
const png = readFileSync(src);
let q = 82;
let out;
do {
  out = await sharp(png).resize(1200, 630, { fit: "cover" }).flatten({ background: "#ffffff" })
    .jpeg({ quality: q, progressive: true, mozjpeg: true }).toBuffer();
  q -= 6;
} while (out.length > 195_000 && q >= 50);
writeFileSync("public/og.jpg", out);
const kb = Math.round(statSync("public/og.jpg").size / 1024);
console.log(`make-og: public/og.jpg ${kb} KB`);
if (kb >= 200) process.exit(1);
