"use client";

import { useState, type ReactNode } from "react";

// Category tabs: one panel at a time. The tab bar scrolls sideways and sticks under the header on mobile.
export function MenuTabs({ titles, counts, panels }: { titles: string[]; counts: number[]; panels: ReactNode[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="mt-10">
      <div
        role="tablist"
        aria-label="Categories"
        className="menu-tabbar sticky top-[69px] z-30 -mx-5 flex gap-2 overflow-x-auto border-b border-line bg-bg/95 px-5 py-3 backdrop-blur md:static md:mx-0 md:flex-wrap md:border-0 md:bg-transparent md:px-0"
      >
        {titles.map((t, i) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`menu-tab-${i}`}
            aria-controls={`menu-panel-${i}`}
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`inline-flex shrink-0 snap-start items-center gap-2 rounded-pill border px-4 py-2 text-sm font-medium transition ${
              active === i ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface text-ink hover:border-accent"
            }`}
          >
            {t}
            <span className={`rounded-pill px-1.5 text-xs ${active === i ? "bg-white/20" : "bg-soft"}`}>{counts[i]}</span>
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div key={titles[i]} role="tabpanel" id={`menu-panel-${i}`} aria-labelledby={`menu-tab-${i}`} hidden={active !== i} className="pt-6">
          {p}
        </div>
      ))}
    </div>
  );
}
