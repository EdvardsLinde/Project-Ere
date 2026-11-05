/**
 * The "notched" shape: a rounded box with a stepped cut-out in one corner, like
 * a folder tab. Returns a CSS `clip-path: path(...)` value for a box of w × h px.
 * Pure, so it is easy to test; `components/ui/notched.tsx` applies it on resize.
 */
export type NotchCorner = "tl" | "br";

export interface NotchOptions {
  /** Corner radius, px (capped at a tenth of the width). */
  radius?: number;
  /** Width of the cut-out as a share of the box width. */
  widthRatio?: number;
  /** Depth of the cut-out as a share of the box height, and its maximum in px. */
  depthRatio?: number;
  maxDepth?: number;
}

export function notchPath(w: number, h: number, corner: NotchCorner = "tl", opts: NotchOptions = {}): string {
  const { radius = 18, widthRatio = 0.36, depthRatio = 0.16, maxDepth = 64 } = opts;
  const r = Math.max(0, Math.min(radius, w / 10, h / 6));
  const nw = Math.round(w * widthRatio);
  const nh = Math.round(Math.min(h * depthRatio, maxDepth));

  // Drawn for the top-left notch, clockwise from the left edge.
  const cmds: (string | number)[] = [
    "M", 0, nh + r,
    "A", r, r, 0, 0, 1, r, nh,
    "L", nw - r, nh,
    "A", r, r, 0, 0, 0, nw, nh - r,
    "L", nw, r,
    "A", r, r, 0, 0, 1, nw + r, 0,
    "L", w - r, 0,
    "A", r, r, 0, 0, 1, w, r,
    "L", w, h - r,
    "A", r, r, 0, 0, 1, w - r, h,
    "L", r, h,
    "A", r, r, 0, 0, 1, 0, h - r,
    "Z",
  ];

  if (corner === "br") {
    // Rotate by 180°: mirror both axes. A rotation keeps the arcs' sweep direction.
    for (let i = 0; i < cmds.length; i++) {
      if (cmds[i] === "M" || cmds[i] === "L") {
        cmds[i + 1] = w - (cmds[i + 1] as number);
        cmds[i + 2] = h - (cmds[i + 2] as number);
        i += 2;
      } else if (cmds[i] === "A") {
        cmds[i + 6] = w - (cmds[i + 6] as number);
        cmds[i + 7] = h - (cmds[i + 7] as number);
        i += 7;
      }
    }
  }
  return `path('${cmds.join(" ")}')`;
}
