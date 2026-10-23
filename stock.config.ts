import type { Img, StockCredit } from "@/lib/types";

// Written by scripts/stock-images.mjs. Only edit by hand to delete photos you do not use.
// Real photos from the business always come first; stock only fills gaps.
// The footer credits every photo listed here that site.config.ts actually uses.
export const stockPhotos: StockCredit[] = [];

/** Use a stock photo in site.config.ts: stock("openverse-ab12cd.jpg") gives an Img. */
export function stock(file: string): Img {
  const p = stockPhotos.find((x) => x.src === file || x.src.endsWith(`/${file}`));
  if (!p) throw new Error(`stock photo not in stock.config.ts: ${file}`);
  return { src: p.src, alt: p.alt, width: p.width, height: p.height };
}
