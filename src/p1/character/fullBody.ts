/**
 * Character model (correct): one outfit = one full-body PNG.
 * The old CSS silhouette + sticker collage path is intentionally gone.
 */
import type {OutfitId} from '../outfits';
import {closestOutfit, type Look} from '../pieces';
import type {ThemePack} from '../themes/types';

/** Full-body art keyed by outfit preset id. */
export type FullBodyMap = Partial<Record<OutfitId, string>>;

export function fullBodiesFromTheme(theme: ThemePack): FullBodyMap {
  const assets = theme.assets;
  if (!assets) return {};
  const map: FullBodyMap = {...(assets.girlFullBodies ?? {})};
  // Legacy single slot → raincoat
  if (assets.girlFull && !map.raincoat) map.raincoat = assets.girlFull;
  return map;
}

export function fullBodyArtForLook(theme: ThemePack, look: Look): string | undefined {
  const bodies = fullBodiesFromTheme(theme);
  const outfit = closestOutfit(look);
  return bodies[outfit] ?? bodies.raincoat ?? theme.assets?.girlFull;
}

export function fullBodyArtForOutfit(theme: ThemePack, outfit: OutfitId): string | undefined {
  const bodies = fullBodiesFromTheme(theme);
  return bodies[outfit] ?? bodies.raincoat ?? theme.assets?.girlFull;
}

/** Outfits that currently have a real full-body PNG. */
export function outfitsWithFullBody(theme: ThemePack): OutfitId[] {
  const bodies = fullBodiesFromTheme(theme);
  return (Object.keys(bodies) as OutfitId[]).filter((id) => Boolean(bodies[id]));
}
