/**
 * Vauclère mark: a single chevron V holding a small lozenge in its mouth.
 * Drawn for this demo, not borrowed from any brand.
 */
export function LogoMark({ className, title = "Vauclère" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 42" className={className} role="img" aria-label={title} fill="currentColor">
      <path d="M0 0 H12.5 L32 26.5 L51.5 0 H64 L32 42 Z" />
      <path d="M32 2 L38.5 10.5 L32 19 L25.5 10.5 Z" />
    </svg>
  );
}
