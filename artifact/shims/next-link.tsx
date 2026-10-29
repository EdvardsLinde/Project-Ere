/** Stand-in for `next/link` in the single-file preview build: navigates the in-memory router. */
import { forwardRef } from "react";
import { hashFor, router } from "../router";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

const Link = forwardRef<HTMLAnchorElement, Props>(function Link(
  { href, onClick, prefetch: _prefetch, replace, scroll: _scroll, target: _target, children, ...rest },
  ref,
) {
  void _prefetch;
  void _scroll;
  void _target;
  const name = hashFor(href);
  return (
    <a
      ref={ref}
      href={name ? `#${name}` : "#"}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        if (replace) router.replace(href);
        else router.push(href);
      }}
    >
      {children}
    </a>
  );
});

export default Link;
