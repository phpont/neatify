"use client";

import { ReactNode } from "react";

export function Tooltip({
  content,
  children,
  side = "top",
}: {
  content: string;
  children: ReactNode;
  side?: "top" | "bottom";
}) {
  const pos =
    side === "top"
      ? "bottom-full mb-1 translate-y-1 group-hover:translate-y-0"
      : "top-full mt-1 -translate-y-1 group-hover:translate-y-0";

  return (
    <span className="relative inline-flex group">
      {children}
      <span
        className={[
          "pointer-events-none absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-150",
          pos,
          "z-[60]",
        ].join(" ")}
      >
        <span className="rounded-md border bg-card/95 px-2 py-1 text-[11px] shadow-md whitespace-nowrap">
          {content}
        </span>
      </span>
    </span>
  );
}

