"use client";

import { useState } from "react";
import { Roll } from "@/components/roll";

// Instagram DMs cannot be prefilled, so this copies the starter note, then opens the DM.
export function DmButton({ href, message, label, className }: { href: string; message: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? "btn btn-primary"}
      onClick={() => {
        try {
          void navigator.clipboard?.writeText(message);
          setCopied(true);
          setTimeout(() => setCopied(false), 4000);
        } catch {}
      }}
    >
      {copied ? <span aria-live="polite">Message copied, paste it in the DM</span> : <Roll>{label}</Roll>}
    </a>
  );
}
