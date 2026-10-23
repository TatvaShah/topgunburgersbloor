import { shareImage } from "@/lib/og";

// Build-time source for public/og.jpg. scripts/make-og.mjs reads the prerendered PNG
// from .next and saves a compressed 1200x630 JPEG. Not linked anywhere on the site.
export const dynamic = "force-static";

export async function GET() {
  return shareImage();
}
