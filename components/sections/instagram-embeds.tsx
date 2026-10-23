import { SectionHead } from "@/components/media";
import { has, igHandle, igUrl, site } from "@/lib/site";

function embedSrc(url: string) {
  const m = url.match(/instagram\.com\/(?:[^/]+\/)?(p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed/` : null;
}

// Official Instagram iframe embeds, lazy loaded. No script tag needed.
export function InstagramEmbeds() {
  const urls = (site.instagram.embeds ?? []).map(embedSrc).filter((u): u is string => !!u);
  if (!has(urls)) return null;
  return (
    <section id="instagram" className="scroll-mt-24 bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <SectionHead eyebrow={`@${igHandle}`} title={site.instagram.embedsTitle ?? "Fresh from Instagram"} />
        <div data-stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {urls.map((src) => (
            <iframe
              key={src}
              src={src}
              title={`Instagram post from @${igHandle}`}
              loading="lazy"
              className="h-[560px] w-full overflow-hidden rounded-card border border-line bg-bg"
              allow="encrypted-media"
            />
          ))}
        </div>
        <a href={igUrl} className="btn btn-ghost mt-8">
          Follow @{igHandle}
        </a>
      </div>
    </section>
  );
}
