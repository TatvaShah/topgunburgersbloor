import { SectionHead } from "@/components/media";
import { has, site } from "@/lib/site";

// Local mp4 copies of reels play inline without the Instagram iframe.
export function Reels() {
  const r = site.reels;
  if (!r || !has(r.items)) return null;
  return (
    <section id="reels" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <SectionHead eyebrow="Press play" title={r.title ?? "A closer look"} intro={r.intro} />
      <div data-stagger className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {r.items.map((it) => (
          <figure key={it.src}>
            <video controls playsInline muted preload="metadata" poster={it.poster} aria-label={it.title ?? "Video"} className="aspect-[9/16] w-full rounded-media bg-ink object-cover">
              <source src={it.src} type="video/mp4" />
            </video>
            <figcaption className="px-1 pt-3">
              {it.title ? <p className="font-display text-lg text-ink sm:text-xl">{it.title}</p> : null}
              {it.caption ? <p className="mt-1 text-sm text-muted">{it.caption}</p> : null}
              {it.href ? (
                <a href={it.href} className="mt-1 inline-block text-sm underline decoration-line underline-offset-4 hover:text-accent">
                  View on Instagram
                </a>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
