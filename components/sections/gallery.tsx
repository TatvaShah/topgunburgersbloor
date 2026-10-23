import Image from "next/image";
import { SectionHead } from "@/components/media";
import { has, motionSettings, site } from "@/lib/site";
import type { GalleryItem } from "@/lib/types";

function Tile({ it, sizes, className }: { it: GalleryItem; sizes: string; className?: string }) {
  const img = (
    <Image
      src={it.src}
      alt={it.alt}
      width={it.width ?? 1200}
      height={it.height ?? 1500}
      sizes={sizes}
      className={`h-full w-full bg-soft object-cover ${className ?? ""}`}
    />
  );
  return it.href ? (
    <a href={it.href} target="_blank" rel="noopener noreferrer" aria-label={`${it.caption ?? it.alt} on Instagram`}>
      {img}
    </a>
  ) : (
    img
  );
}

export function Gallery() {
  const g = site.gallery;
  if (!g || !has(g.items)) return null;
  const strip = (g.layout ?? "strip") === "strip" && g.items.length >= 4;

  if (strip) {
    // Pinned on wide screens (the page scrolls the strip sideways), swipeable everywhere else.
    return (
      <section id="gallery" data-pin={motionSettings().pin ? "" : undefined} className="scroll-mt-24 overflow-x-clip bg-surface">
        <div className="mx-auto flex max-w-7xl lg:min-h-[100svh] flex-col justify-center px-5 py-16 md:px-8 md:py-24 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Gallery" title={g.title ?? "Recent work"} intro={g.intro} />
            <p className="hidden text-sm text-muted lg:block" aria-hidden="true">
              Scroll to explore
            </p>
          </div>
          <ul data-track className="strip -mx-5 mt-10 flex gap-4 overflow-x-auto px-5 pb-2 md:-mx-8 md:gap-6 md:px-8">
            {g.items.map((it, i) => (
              <li key={it.src} className={`shrink-0 ${i % 3 === 1 ? "lg:mt-16" : ""}`}>
                <figure className="zoom group w-[68vw] sm:w-[44vw] lg:w-[24vw] lg:max-w-[360px]">
                  <div className="aspect-[4/5] overflow-hidden rounded-media">
                    <Tile it={it} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 44vw, 68vw" />
                  </div>
                  {it.caption ? (
                    <figcaption className="flex items-baseline justify-between gap-3 px-1 pt-3 text-sm text-muted">
                      <span>{it.caption}</span>
                      <span aria-hidden="true" className="font-display text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </figcaption>
                  ) : null}
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="scroll-mt-24 bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-28">
        <SectionHead eyebrow="Gallery" title={g.title ?? "Recent work"} intro={g.intro} />
        <div data-stagger className="mt-12 columns-2 gap-3 md:columns-3 md:gap-6">
          {g.items.map((it) => (
            <figure key={it.src} className="zoom mb-3 break-inside-avoid md:mb-6">
              <div className="overflow-hidden rounded-media">
                <Tile it={it} sizes="(min-width: 768px) 33vw, 50vw" className="h-auto" />
              </div>
              {it.caption ? <figcaption className="px-1 pt-2 text-sm text-muted">{it.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
