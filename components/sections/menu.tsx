import { SectionHead } from "@/components/media";
import { has, site } from "@/lib/site";
import type { Dietary } from "@/lib/types";
import { DietIcon, dietaryInfo, GroupItems, GroupNote, itemDietary } from "./menu-parts";
import { MenuTabs } from "./menu-tabs";

export function Menu() {
  const m = site.menu;
  if (!m || !has(m.groups)) return null;
  const list = m.variant === "list";
  const showPrices = m.showPrices !== false;
  const tabs = m.layout === "tabs" && m.groups.length > 1;
  const used = new Set<Dietary>();
  m.groups.forEach((g) => g.items.forEach((it) => itemDietary(it).forEach((d) => used.add(d))));
  const legend = m.dietaryLegend !== false && used.size > 0;

  const head = (title: string, note?: string, hideTitle?: boolean) => (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-3">
      {hideTitle ? null : <h3 className="text-2xl sm:text-3xl">{title}</h3>}
      <GroupNote note={note} />
    </div>
  );

  return (
    <section id="menu" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <SectionHead eyebrow={m.label ?? "Menu"} title={m.title ?? "What we make"} intro={m.intro} />
      {tabs ? (
        <MenuTabs
          titles={m.groups.map((g) => g.title)}
          counts={m.groups.map((g) => g.items.length)}
          panels={m.groups.map((g) => (
            <div key={g.title}>
              {head(g.title, g.note)}
              <GroupItems g={g} list={list} showPrices={showPrices} />
            </div>
          ))}
        />
      ) : (
        m.groups.map((g) => (
          <div key={g.title} className="mt-12">
            {g.title || g.note ? head(g.title, g.note, !(m.groups.length > 1 || g.title)) : null}
            <GroupItems g={g} list={list} showPrices={showPrices} />
          </div>
        ))
      )}
      {legend ? (
        <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          {[...used].map((d) => (
            <span key={d} className="inline-flex items-center gap-1.5">
              <DietIcon d={d} /> {dietaryInfo[d].label}
            </span>
          ))}
        </p>
      ) : null}
      {!showPrices && m.priceNote ? <p className="mt-6 text-sm font-medium text-ink">{m.priceNote}</p> : null}
      {m.footnote ? <p className="mt-4 text-sm text-muted">{m.footnote}</p> : null}
    </section>
  );
}
