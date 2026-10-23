import { site } from "@/site.config";
import { stockPhotos } from "@/stock.config";
import { fonts } from "./fonts";
import { presets, radiusScale } from "./themes";
import type { SiteConfig } from "./types";

export { site, stockPhotos };
export const CLAUDAURA_URL = "https://www.claudaura.ca";

export function getSiteUrl() {
  if (site.siteUrl) return site.siteUrl.replace(/\/$/, "");
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;
  const host = process.env.VERCEL_URL;
  if (host) return `https://${host}`;
  return "http://localhost:3000";
}

export const igHandle = site.instagram.handle.replace(/^@/, "");
export const igUrl = `https://www.instagram.com/${igHandle}/`;
export const igDmUrl = `https://ig.me/m/${igHandle}`;

export function resolveTheme(cfg: SiteConfig = site) {
  const p = presets[cfg.theme.preset] ?? presets["bakery-pastel"];
  const colors = { ...p.colors, ...(cfg.theme.colors ?? {}) };
  const f = { ...p.fonts, ...(cfg.theme.fonts ?? {}) };
  const r = radiusScale[cfg.theme.radius ?? p.radius];
  const wordmark = cfg.theme.wordmark ?? p.wordmark ?? "display";
  const upper = (cfg.theme.headingCase ?? p.headingCase) === "upper";
  const vars: Record<string, string> = {
    "--c-bg": colors.bg,
    "--c-surface": colors.surface,
    "--c-ink": colors.ink,
    "--c-text": colors.text,
    "--c-muted": colors.muted,
    "--c-accent": colors.accent,
    "--c-accent-ink": colors.accentInk,
    "--c-soft": colors.soft,
    "--c-line": colors.line,
    "--f-display": fonts[f.display].style.fontFamily,
    "--f-body": fonts[f.body].style.fontFamily,
    "--f-script": fonts[f.script].style.fontFamily,
    "--f-wordmark": fonts[wordmark === "script" ? f.script : f.display].style.fontFamily,
    "--h-case": upper ? "uppercase" : "none",
    "--h-track": upper ? "0.01em" : "normal",
    "--r-card": r.card,
    "--r-pill": r.pill,
    "--r-media": r.media,
  };
  return { colors, vars, wordmark };
}

export const has = <T,>(arr?: T[] | null): arr is T[] => Array.isArray(arr) && arr.length > 0;

/** Presets for appointment businesses (salons, barbers, nails, lashes, groomers). */
const SERVICE_PRESETS = new Set([
  "salon-chic",
  "barber-bold",
  "barber-bold-light",
  "salon-luxe",
  "nails-lash-luxe",
  "barber-luxe",
  "barber-luxe-dark",
]);

export function isServicePreset(preset: string = site.theme.preset) {
  return SERVICE_PRESETS.has(preset);
}

/**
 * Default hero primary CTA when hero.primaryCta is unset.
 * Service presets: "DM to book", or "Book now" linking the first order.links entry.
 * Restaurant presets: "Order online" to the first order.links entry, else "Call to order", else DM.
 * Food and other presets: Instagram DM with "Order by Instagram DM".
 * Explicit hero.primaryCta / order.headerCtaLabel always win over these defaults.
 */
const RESTAURANT_PRESETS = new Set(["restaurant-luxe", "restaurant-luxe-dark"]);

export function isRestaurantPreset(preset: string = site.theme.preset) {
  return RESTAURANT_PRESETS.has(preset);
}

export function defaultHeroCta() {
  if (isRestaurantPreset()) {
    const order = site.order.links?.[0];
    if (order?.href) return { kind: "link" as const, label: "Order online", href: order.href };
    if (site.contact?.phone) return { kind: "link" as const, label: "Call to order", href: `tel:${site.contact.phone.replace(/[^+\d]/g, "")}` };
    return { kind: "dm" as const, label: "Order by Instagram DM" };
  }
  if (isServicePreset()) {
    const booking = site.order.links?.[0];
    if (booking?.href) return { kind: "link" as const, label: "Book now", href: booking.href };
    return { kind: "dm" as const, label: "DM to book" };
  }
  return { kind: "dm" as const, label: "Order by Instagram DM" };
}

export function isRasterForOg(path?: string) {
  return !!path && /\.(png|jpe?g)$/i.test(path) && path.startsWith("/");
}

// Build guard: fail the build if any copy in the config contains two hyphens in a row.
function walk(v: unknown, path: string, out: string[]) {
  if (typeof v === "string") {
    if (/^(https?:|\/)/.test(v)) return;
    if (v.includes("--")) out.push(path);
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`, out));
  else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`, out));
}
const bad: string[] = [];
walk(site, "site", bad);
if (bad.length) throw new Error(`Double hyphen found in site.config.ts copy at: ${bad.join(", ")}`);

export function businessJsonLd() {
  const url = getSiteUrl();
  const c = site.contact;
  const sameAs = [igUrl, ...(c?.socials ?? []).map((s) => s.href)];
  return {
    "@context": "https://schema.org",
    "@type": site.schemaType ?? "LocalBusiness",
    name: site.name,
    description: site.seo.description,
    url,
    ...(site.logo ? { logo: `${url}${site.logo}` } : {}),
    ...(site.hero.images?.[0]?.src?.startsWith("/") ? { image: `${url}${site.hero.images[0].src}` } : {}),
    ...(c?.email ? { email: c.email } : {}),
    ...(c?.phone ? { telephone: c.phone } : {}),
    ...(site.area || c?.address
      ? {
          address: {
            "@type": "PostalAddress",
            ...(c?.address ? { streetAddress: c.address } : {}),
            ...(site.area ? { addressLocality: site.area } : {}),
            addressRegion: "ON",
            addressCountry: "CA",
          },
        }
      : {}),
    ...(site.area ? { areaServed: [site.area, "Greater Toronto Area"] } : {}),
    sameAs,
  };
}

/** Motion settings with defaults. prefers-reduced-motion is checked in the browser and always wins. */
export function motionSettings() {
  const m = site.motion ?? {};
  return {
    enabled: m.enabled !== false,
    smoothScroll: m.smoothScroll !== false,
    intensity: m.intensity ?? "subtle",
    pin: m.pin !== false,
  };
}

/** Stock photos that the config actually uses. Only these get a credit in the footer. */
export function usedStockCredits() {
  const json = JSON.stringify(site);
  return stockPhotos.filter((p) => json.includes(`"${p.src}"`));
}
