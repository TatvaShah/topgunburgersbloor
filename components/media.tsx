import Image from "next/image";
import type { Img } from "@/lib/types";

// Fills its parent box. The parent sets the aspect ratio and rounding.
export function Media({ img, sizes, priority }: { img: Img; sizes: string; priority?: boolean }) {
  return <Image src={img.src} alt={img.alt} fill sizes={sizes} preload={priority} fetchPriority={priority ? "high" : undefined} loading={priority ? "eager" : undefined} className="object-cover" />;
}

export function SectionHead({ eyebrow, title, intro, center }: { eyebrow?: string; title: string; intro?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p data-reveal className={`eyebrow flex items-center gap-3 ${center ? "justify-center" : ""}`}>
          <span aria-hidden="true" className="h-px w-8 bg-accent/60" />
          {eyebrow}
        </p>
      ) : null}
      <h2 data-split className="mt-4 text-[clamp(2.1rem,4.6vw,3.9rem)] leading-[1.02] tracking-tight">
        {title}
      </h2>
      {intro ? (
        <p data-reveal className={`mt-5 text-base leading-7 text-muted sm:text-lg sm:leading-8 ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {intro}
        </p>
      ) : null}
    </div>
  );
}
