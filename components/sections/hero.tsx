import { DmButton } from "@/components/dm-button";
import { Media } from "@/components/media";
import { HeroDepthSlot } from "@/components/motion/hero-depth-slot";
import { Roll } from "@/components/roll";
import { defaultHeroCta, igDmUrl, motionSettings, site } from "@/lib/site";

function Ctas({ center, i = 3 }: { center?: boolean; i?: number }) {
  const h = site.hero;
  const fallback = defaultHeroCta();
  const ext = (href: string) => (/^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {});
  return (
    <div className={`enter mt-9 flex flex-wrap gap-3 ${center ? "justify-center" : ""}`} style={{ ["--i" as string]: i }}>
      {h.primaryCta ? (
        <a href={h.primaryCta.href} className="btn btn-primary" {...ext(h.primaryCta.href)}>
          <Roll>{h.primaryCta.label}</Roll>
        </a>
      ) : fallback.kind === "link" ? (
        <a href={fallback.href} className="btn btn-primary" {...ext(fallback.href)}>
          <Roll>{fallback.label}</Roll>
        </a>
      ) : (
        <DmButton href={igDmUrl} message={site.order.dmMessage} label={fallback.label} />
      )}
      {h.secondaryCta ? (
        <a href={h.secondaryCta.href} className="btn btn-ghost">
          <Roll>{h.secondaryCta.label}</Roll>
        </a>
      ) : null}
    </div>
  );
}

// Headline words rise out of a mask, one after another (CSS only, so it never waits on JS).
function Headline({ light, big }: { light?: boolean; big?: boolean }) {
  const words = site.hero.headline.split(/\s+/).filter(Boolean);
  return (
    <h1
      aria-label={site.hero.headline}
      className={`mt-4 leading-[0.98] tracking-tight ${big ? "text-[clamp(2.9rem,7vw,6.2rem)]" : "text-[clamp(2.6rem,6vw,5rem)]"} ${light ? "!text-white" : ""}`}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="line-mask inline-block align-top">
          <span style={{ ["--i" as string]: i }}>{w}&nbsp;</span>
        </span>
      ))}
    </h1>
  );
}

function Copy({ center, light, big }: { center?: boolean; light?: boolean; big?: boolean }) {
  const h = site.hero;
  return (
    <div className={center ? "mx-auto max-w-4xl text-center" : ""}>
      {h.eyebrow ? (
        <p className={`enter ${light ? "eyebrow !text-white/85" : "eyebrow"}`} style={{ ["--i" as string]: 0 }}>
          {h.eyebrow}
        </p>
      ) : null}
      <Headline light={light} big={big} />
      {h.subhead ? (
        <p
          className={`enter mt-6 text-lg leading-8 ${light ? "text-white/90" : "text-muted"} ${center ? "mx-auto max-w-2xl" : "max-w-xl"}`}
          style={{ ["--i" as string]: 2 }}
        >
          {h.subhead}
        </p>
      ) : null}
      <Ctas center={center} />
    </div>
  );
}

export function Hero() {
  const h = site.hero;
  const imgs = h.images ?? [];
  const variant = h.variant ?? "editorial";
  const depth = !!h.depth && motionSettings().enabled && imgs.length > 1;

  if (variant === "full" && imgs[0]) {
    return (
      <section className="relative isolate flex min-h-[86svh] items-end overflow-hidden">
        <div className="unveil absolute inset-0 [--r-media:0px]">
          <div data-parallax="6" className="absolute inset-[-8%_0]">
            <Media img={imgs[0]} sizes="100vw" priority />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-36 md:px-8">
          <Copy light big />
        </div>
      </section>
    );
  }

  if (variant === "centered") {
    return (
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Copy center big />
        {imgs.length ? (
          <div className="mt-14 grid grid-cols-3 gap-3 md:gap-6">
            {imgs.slice(0, 3).map((img, i) => (
              <div key={img.src} className={`unveil relative aspect-[4/5] overflow-hidden rounded-media bg-soft ${i === 1 ? "md:-translate-y-8" : ""}`} style={{ ["--i" as string]: i }}>
                <Media img={img} sizes="33vw" priority={i === 0} />
              </div>
            ))}
          </div>
        ) : null}
      </section>
    );
  }

  if (variant === "split") {
    return (
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:py-20">
        <Copy />
        {imgs.length ? (
          <div className="grid grid-cols-[1.4fr_1fr] gap-3">
            <div className={`unveil relative overflow-hidden rounded-media bg-soft ${imgs.length > 1 ? "row-span-2 aspect-[4/5]" : "col-span-2 aspect-[4/5]"}`}>
              <Media img={imgs[0]} sizes="(min-width: 768px) 30vw, 60vw" priority />
            </div>
            {imgs.slice(1, 3).map((img, i) => (
              <div key={img.src} className="unveil relative aspect-square overflow-hidden rounded-media bg-soft" style={{ ["--i" as string]: i + 1 }}>
                <Media img={img} sizes="(min-width: 768px) 20vw, 40vw" />
              </div>
            ))}
          </div>
        ) : null}
      </section>
    );
  }

  // editorial (default): big type on the left, one tall photo with a small overlapping second photo
  const sizes = "(min-width: 1024px) 40vw, 92vw";
  return (
    <section className="mx-auto grid max-w-7xl items-end gap-12 px-5 pb-14 pt-10 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-24 lg:pt-16">
      <div className="lg:pb-6">
        <Copy big />
      </div>
      {imgs[0] ? (
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="unveil relative aspect-[4/5] overflow-hidden rounded-media bg-soft">
            <div data-parallax="5" className="absolute inset-[-7%_0]">
              <Media img={imgs[0]} sizes={sizes} priority />
            </div>
          </div>
          {imgs[1] && !depth ? (
            <div
              className="unveil absolute -bottom-8 -left-6 hidden aspect-square w-[38%] overflow-hidden rounded-media bg-soft ring-8 ring-bg sm:block lg:-left-14"
              style={{ ["--i" as string]: 3 }}
            >
              <Media img={imgs[1]} sizes="16vw" />
            </div>
          ) : null}
          {depth ? <HeroDepthSlot images={imgs} sizes={sizes} /> : null}
        </div>
      ) : null}
    </section>
  );
}
