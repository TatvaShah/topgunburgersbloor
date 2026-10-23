import { DmButton } from "@/components/dm-button";
import { SectionHead } from "@/components/media";
import { Roll } from "@/components/roll";
import { has, igDmUrl, igHandle, site } from "@/lib/site";

export function Order() {
  const o = site.order;
  const steps = has(o.steps)
    ? o.steps
    : ["Tap the button to copy a starter message.", `Paste it in a DM to @${igHandle} with your date and details.`, "Get a quote and confirm your order."];
  return (
    <section id="order" className="scroll-mt-24 bg-soft">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28 lg:gap-20">
        <div>
          <SectionHead eyebrow={o.label ?? "How to order"} title={o.title ?? "Order in a quick DM"} intro={o.intro} />
          <ol data-stagger className="mt-9 grid gap-5">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 font-display text-lg text-accent">{i + 1}</span>
                <p className="pt-1.5 leading-7">{s}</p>
              </li>
            ))}
          </ol>
          {o.note ? <p className="mt-6 text-sm text-muted">{o.note}</p> : null}
        </div>
        <div data-reveal className="lift rounded-card border border-line bg-surface p-6 shadow-[0_30px_60px_-45px_rgba(0,0,0,0.35)] sm:p-10">
          <p className="eyebrow">Starter message</p>
          <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-6 text-ink">{o.dmMessage}</pre>
          <div className="mt-6 flex flex-wrap gap-3">
            {o.preferLinks && o.links?.[0] ? (
              <a href={o.links[0].href} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                <Roll>{o.links[0].label}</Roll>
              </a>
            ) : null}
            <DmButton href={igDmUrl} message={o.dmMessage} label={`Copy and DM @${igHandle}`} className={o.preferLinks ? "btn btn-ghost" : undefined} />
            {(o.preferLinks ? o.links?.slice(1) : o.links)?.map((l) => (
              <a key={l.href} href={l.href} className="btn btn-ghost" target={l.href.startsWith("tel:") ? undefined : "_blank"} rel="noopener noreferrer">
                <Roll>{l.label}</Roll>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
