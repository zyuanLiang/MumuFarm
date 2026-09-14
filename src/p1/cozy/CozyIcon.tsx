/**
 * Cozy kit icon helper — sliced PNGs from scripts/slice-cozy-kit.py.
 * Visual vocabulary for 1:1 mockup rebuild (not CSS silhouettes).
 */
import atlas from './atlas.json';

type AtlasEntry = {
  id: string;
  src: string;
  w?: number;
  h?: number;
  sheet?: string;
  index?: number;
};
type Atlas = {byId: Record<string, AtlasEntry>};

const data = atlas as Atlas;

export type CozyIconId = string;

export function cozyIconSrc(id: CozyIconId): string | undefined {
  return data.byId[id]?.src;
}

export function CozyIcon({
  id,
  alt = '',
  className,
  size,
}: {
  id: CozyIconId;
  alt?: string;
  className?: string;
  size?: number;
}) {
  const src = cozyIconSrc(id);
  if (!src) {
    return (
      <span className={className} title={`missing icon: ${id}`} aria-hidden>
        ?
      </span>
    );
  }
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      decoding="async"
    />
  );
}
