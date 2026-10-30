import { photoSrc, type PhotoKey } from "@/lib/photos";

/**
 * A real photo, decorative. `round` = a circle crop with the ink edge (a photo
 * sticker); otherwise a die-cut cut-out that gets the hard ink shadow.
 */
export function Photo({
  name,
  className = "",
  round = false,
  eager = false,
}: {
  name: PhotoKey;
  className?: string;
  round?: boolean;
  eager?: boolean;
}) {
  const look = round
    ? "rounded-full border-2 border-edge object-cover"
    : "[filter:drop-shadow(3px_3px_0_var(--color-edge))]";
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static decorative file; next/image is not available in the single-file preview
    <img
      src={photoSrc[name]}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`select-none ${look} ${className}`}
    />
  );
}
