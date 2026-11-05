"use client";

import { useId, useMemo } from "react";
import { buildLandscape, type LandscapeOptions } from "@/lib/key-visual";
import { landscapeMarkup, themePalette } from "@/lib/key-visual-svg";

/**
 * The fair's key visual: Saldus from above (fields, forest, an orange road with
 * linked innovation points). Decorative; the geometry is in `lib/key-visual.ts`.
 */
export function KeyVisual({
  className = "",
  radius = 24,
  ...options
}: LandscapeOptions & { className?: string; radius?: number }) {
  const id = `kv${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const { width, height, seed, cols, rows, nodes } = options;
  const markup = useMemo(
    () => landscapeMarkup(buildLandscape({ width, height, seed, cols, rows, nodes }), themePalette, id, { radius }),
    [width, height, seed, cols, rows, nodes, id, radius],
  );
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
