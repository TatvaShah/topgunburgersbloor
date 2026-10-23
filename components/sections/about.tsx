import { Media, SectionHead } from "@/components/media";
import { site } from "@/lib/site";

export function About() {
  const a = site.about;
  if (!a || !a.body?.length) return null;
  return (
    <section id="about" className="scroll-mt-24">
      {a.statement ? (
        <div className="mx-auto max-w-6xl px-5 pt-20 md:px-8 md:pt-32">
          <p data-words className="font-display text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[1.12] tracking-tight text-ink [text-transform:var(--h-case)]">
            {a.statement.split(/\s+/).map((w, i) => (
              <span key={i} className="w">
                {w}{" "}
              </span>
            ))}
          </p>
        </div>
      ) : null}
      <div className={`mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:px-8 md:py-28 ${a.image ? "md:grid-cols-[0.9fr_1.1fr] lg:gap-20" : ""}`}>
        {a.image ? (
          <div data-reveal="clip" className="relative aspect-[4/5] overflow-hidden rounded-media bg-soft">
            <div data-parallax="8" className="absolute inset-[-9%_0]">
              <Media img={a.image} sizes="(min-width: 768px) 45vw, 100vw" />
            </div>
          </div>
        ) : null}
        <div>
          <SectionHead eyebrow="About" title={a.title ?? `About ${site.name}`} />
          <div data-stagger className="mt-6 grid max-w-xl gap-4 text-base leading-8 sm:text-lg">
            {a.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
