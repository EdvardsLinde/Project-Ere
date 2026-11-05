"use client";

import { useEffect, useRef } from "react";
import { notchPath, type NotchCorner, type NotchOptions } from "@/lib/notch";

/**
 * A box with one notched corner (see `lib/notch.ts`). The clip follows the box's
 * size; before it is measured the box shows as a plain rounded rectangle.
 */
export function Notched({
  corner = "tl",
  options,
  className = "",
  children,
}: {
  corner?: NotchCorner;
  options?: NotchOptions;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const radius = options?.radius;
  const widthRatio = options?.widthRatio;
  const depthRatio = options?.depthRatio;
  const maxDepth = options?.maxDepth;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width && height) {
        el.style.clipPath = notchPath(Math.round(width), Math.round(height), corner, { radius, widthRatio, depthRatio, maxDepth });
      }
    };
    apply();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, [corner, radius, widthRatio, depthRatio, maxDepth]);

  return (
    <div ref={ref} className={`overflow-hidden rounded-[18px] ${className}`}>
      {children}
    </div>
  );
}
