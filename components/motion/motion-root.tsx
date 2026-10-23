"use client";

import { useEffect } from "react";

type Settings = { enabled: boolean; smoothScroll: boolean; intensity: "subtle" | "medium"; pin: boolean };

// All scroll motion lives here. It loads GSAP, ScrollTrigger and Lenis only after the page has
// loaded and the browser is idle, so first paint and LCP never wait on it. Content is fully visible
// without JavaScript; we only animate elements that are still below the fold when this runs.
// prefers-reduced-motion: nothing runs at all.
export function MotionRoot({ settings }: { settings: Settings }) {
  useEffect(() => {
    if (!settings.enabled) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const root = document.documentElement;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      root.toggleAttribute("data-scrolled", y > 24);
      if (y > 480 && y > lastY + 4) root.setAttribute("data-hide-header", "");
      else if (y < lastY - 4 || y < 480) root.removeAttribute("data-hide-header");
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let dispose = () => {};
    let cancelled = false;

    const start = async () => {
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const [{ gsap }, { ScrollTrigger }, lenisMod] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        settings.smoothScroll && finePointer ? import("lenis") : Promise.resolve(null),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      let lenis: import("lenis").default | null = null;
      let tick: ((t: number) => void) | null = null;
      if (lenisMod) {
        const Lenis = lenisMod.default;
        const l = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, anchors: { offset: -84 } });
        l.on("scroll", ScrollTrigger.update);
        lenis = l;
        tick = (t: number) => l.raf(t * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
      }

      const k = settings.intensity === "medium" ? 1.6 : 1;
      const touch = !finePointer;
      const vh = window.innerHeight;
      const belowFold = (el: Element) => el.getBoundingClientRect().top > vh * 0.92;
      const ease = "power3.out";

      const ctx = gsap.context(() => {
        // Fade and rise
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          if (!belowFold(el)) return;
          const kind = el.dataset.reveal;
          const from =
            kind === "clip"
              ? { clipPath: "inset(8% 6% 8% 6%)", scale: 1.03, duration: 1.3 }
              : { y: 26 * k, opacity: 0, duration: 1 };
          gsap.from(el, { ...from, ease, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        });

        // Staggered children (cards, menu rows, gallery tiles)
        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
          if (!belowFold(el)) return;
          gsap.from(el.children, {
            y: 22 * k,
            opacity: 0,
            duration: 0.9,
            ease,
            stagger: 0.07,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // Section headings: words rise out of a mask
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          if (!belowFold(el) || el.dataset.done) return;
          el.dataset.done = "1";
          const text = el.textContent ?? "";
          el.setAttribute("aria-label", text);
          el.innerHTML = text
            .split(/\s+/)
            .filter(Boolean)
            .map((w) => `<span aria-hidden="true" class="line-mask" style="display:inline-block;vertical-align:top"><span style="display:inline-block;animation:none">${w.replace(/</g, "&lt;")}&nbsp;</span></span>`)
            .join("");
          gsap.from(el.querySelectorAll(".line-mask > span"), {
            yPercent: 105,
            duration: 1,
            ease,
            stagger: 0.05,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        // Gentle parallax on photos. Half as much on touch screens.
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amt = Number(el.dataset.parallax || 8) * k * (touch ? 0.5 : 1);
          gsap.fromTo(
            el,
            { yPercent: -amt },
            { yPercent: amt, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });

        // Statement line fills in word by word as it scrolls through
        gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => {
          const words = el.querySelectorAll(".w");
          gsap.set(words, { opacity: 0.18 });
          gsap.to(words, {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 50%", scrub: true },
          });
        });
      });

      // Pinned sideways gallery: wide screens only, never on phones
      const mm = gsap.matchMedia();
      if (settings.pin) {
        mm.add("(min-width: 1024px)", () => {
          const sections = gsap.utils.toArray<HTMLElement>("[data-pin]");
          sections.forEach((sec) => {
            const track = sec.querySelector<HTMLElement>("[data-track]");
            if (!track) return;
            root.setAttribute("data-pinned", "");
            const dist = () => Math.max(0, track.scrollWidth - track.clientWidth);
            if (dist() < 80) return;
            gsap.to(track, {
              x: () => -dist(),
              ease: "none",
              scrollTrigger: { trigger: sec, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
            });
          });
          return () => root.removeAttribute("data-pinned");
        });
      }
      ScrollTrigger.refresh();

      dispose = () => {
        ctx.revert();
        mm.revert();
        if (tick) gsap.ticker.remove(tick);
        lenis?.destroy();
      };
    };

    const idle = () => {
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => void start(), { timeout: 1500 });
      else setTimeout(() => void start(), 300);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", idle);
      dispose();
    };
  }, [settings]);

  return null;
}
