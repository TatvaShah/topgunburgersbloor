"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Img } from "@/lib/types";

const HeroDepth = dynamic(() => import("./hero-depth"), { ssr: false });

// Mounts the 3D stack only when: motion is allowed, the hero is in view, the page has loaded,
// the browser is idle, and the visitor is not on Save-Data. Otherwise the static photo stays.
export function HeroDepthSlot({ images, sizes }: { images: Img[]; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const el = ref.current;
    if (!el) return;
    let idleId = 0;
    const go = () => {
      idleId = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(() => setOn(true), { timeout: 2500 }) : window.setTimeout(() => setOn(true), 600);
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (document.readyState === "complete") go();
      else window.addEventListener("load", go, { once: true });
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("load", go);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
    };
  }, []);
  return <div ref={ref} className="absolute inset-0">{on ? <HeroDepth images={images} sizes={sizes} /> : null}</div>;
}
