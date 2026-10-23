import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { MotionRoot } from "@/components/motion/motion-root";
import { SiteHeader } from "@/components/site-header";
import { businessJsonLd, getSiteUrl, igHandle, motionSettings, resolveTheme, site } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();
const theme = resolveTheme();

const ogImage = {
  url: `${siteUrl}/og.jpg`,
  secureUrl: `${siteUrl}/og.jpg`,
  type: "image/jpeg",
  width: 1200,
  height: 630,
  alt: `${site.name}: ${site.tagline}`,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.seo.title, template: `%s | ${site.name}` },
  description: site.seo.description,
  keywords: site.seo.keywords,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    images: [ogImage],
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
  },
  twitter: {
    images: [{ url: ogImage.url, alt: ogImage.alt }],
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
  other: { "instagram:handle": `@${igHandle}` },
};

export const viewport: Viewport = { themeColor: theme.colors.bg };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-CA" style={theme.vars as CSSProperties} className="h-full">
      <body className="min-h-full antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-pill focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <MotionRoot settings={motionSettings()} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd()) }} />
      </body>
    </html>
  );
}
