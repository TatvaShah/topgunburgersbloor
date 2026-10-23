import { CLAUDAURA_URL, igHandle, igUrl, site, usedStockCredits } from "@/lib/site";

export function SiteFooter() {
  const c = site.contact;
  const credits = usedStockCredits();
  return (
    <footer className={`bg-surface ${site.theme.pattern === "checker" ? "checker-top" : "border-t border-line"}`}>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.4fr_1fr] md:px-8 md:py-20">
        <div>
          <p className="wordmark text-[clamp(2.4rem,6vw,4.5rem)] leading-none text-ink">{site.name}</p>
          <p className="mt-5 max-w-md text-sm leading-6 text-muted">{site.tagline}</p>
        </div>
        <ul className="grid content-start gap-2.5 text-sm">
          <li>
            <a href={igUrl} className="uline hover:text-accent">
              Instagram @{igHandle}
            </a>
          </li>
          {c?.socials?.map((s) => (
            <li key={s.href}>
              <a href={s.href} className="uline hover:text-accent">
                {s.label}
              </a>
            </li>
          ))}
          {c?.email ? (
            <li>
              <a href={`mailto:${c.email}`} className="uline hover:text-accent">
                {c.email}
              </a>
            </li>
          ) : null}
          {c?.phone ? (
            <li>
              <a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`} className="uline hover:text-accent">
                {c.phone}
              </a>
            </li>
          ) : null}
        </ul>
      </div>
      {credits.length ? (
        <div className="mx-auto max-w-7xl px-5 pb-6 text-[11px] leading-5 text-muted md:px-8">
          <p>
            Some photos are stock:{" "}
            {credits.map((p, i) => (
              <span key={p.src}>
                {i ? "; " : ""}
                <a href={p.sourceUrl} className="underline decoration-line underline-offset-2 hover:text-ink" rel="noopener noreferrer" target="_blank">
                  photo
                </a>{" "}
                by {p.authorUrl ? <a href={p.authorUrl} className="underline decoration-line underline-offset-2 hover:text-ink" rel="noopener noreferrer" target="_blank">{p.author}</a> : p.author} on {p.source}
                {p.licenseUrl ? (
                  <>
                    {" "}
                    (<a href={p.licenseUrl} className="underline decoration-line underline-offset-2 hover:text-ink" rel="noopener noreferrer" target="_blank">{p.license}</a>)
                  </>
                ) : (
                  ` (${p.license})`
                )}
              </span>
            ))}
            .
          </p>
        </div>
      ) : null}
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}
            {site.area ? `, ${site.area}` : ""}
          </p>
          <p>
            Website by{" "}
            <a href={CLAUDAURA_URL} className="font-medium text-ink underline decoration-line underline-offset-4">
              ClaudAura
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
