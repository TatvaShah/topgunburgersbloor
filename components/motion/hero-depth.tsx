"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Img } from "@/lib/types";

// Optional 3D style hero: the real photos as a floating, layered stack in CSS 3D.
// No WebGL and no three.js, so it costs about 2 KB. It fades in over the static photo
// once its images have loaded. Pointer tilt on desktop, a slow scroll tilt on phones.
export default function HeroDepth({ images, sizes }: { images: Img[]; sizes: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(0);
  const cards = images.slice(0, 3);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const loop = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 9).toFixed(2)}deg`);
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width - 0.5) * 2) / 2;
      ty = Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height - 0.5) * 2) / 2;
    };
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      ty = Math.max(-0.5, Math.min(0.5, (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight));
      tx = ty * -0.6;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    else window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const pos = [
    "inset-0 [transform:translateZ(0)]",
    "-left-[14%] bottom-[6%] h-[42%] w-[48%] [transform:translateZ(90px)]",
    "-right-[8%] top-[5%] h-[34%] w-[38%] [transform:translateZ(140px)]",
  ];

  return (
    <div
      ref={box}
      aria-hidden="true"
      className="absolute inset-0 transition-opacity duration-700"
      style={{ perspective: "1400px", opacity: ready >= cards.length ? 1 : 0 }}
    >
      <div className="relative h-full w-full [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]">
        {cards.map((img, i) => (
          <div
            key={img.src}
            className={`absolute overflow-hidden rounded-media bg-soft shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] ${pos[i]} ${i ? "ring-4 ring-bg" : ""}`}
          >
            <Image src={img.src} alt="" fill sizes={i ? "20vw" : sizes} className="object-cover" onLoad={() => setReady((n) => n + 1)} />
          </div>
        ))}
      </div>
    </div>
  );
}
