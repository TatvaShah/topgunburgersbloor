import { has, site } from "@/lib/site";

// Slow marquee of short true facts. Pauses on hover; static and centred with reduced motion.
export function Highlights() {
  if (!has(site.highlights)) return null;
  const row = (copy: number) =>
    site.highlights!.map((h, i) => (
      <li key={`${h}-${copy}`} data-dup={copy ? "" : undefined} aria-hidden={copy ? true : undefined} className="flex items-center gap-10 pr-10">
        <span>{h}</span>
        <span aria-hidden="true" className="text-accent">
          {i % 2 ? "✦" : "●"}
        </span>
      </li>
    ));
  const checker = site.theme.pattern === "checker";
  return (
    <section aria-label="Highlights" className={`overflow-hidden bg-surface py-5 ${checker ? "checker-y" : "border-y border-line"}`}>
      <ul className="marquee font-display text-xl tracking-tight text-ink sm:text-2xl [text-transform:var(--h-case)]">
        {row(0)}
        {row(1)}
        {row(2)}
        {row(3)}
      </ul>
    </section>
  );
}
