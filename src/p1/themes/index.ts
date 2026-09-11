import {cottageCreamTheme} from './packs/cottageCream';
import {rainyLilacTheme} from './packs/rainyLilac';
import {paperCropsSkin, springCropsSkin} from './packs/cropSkins';
import type {SkinId, SkinPack, ThemeId, ThemePack, ThemeTokens} from './types';

export const THEME_PACKS: Record<string, ThemePack> = {
  [cottageCreamTheme.id]: cottageCreamTheme,
  [rainyLilacTheme.id]: rainyLilacTheme,
};

export const THEME_ORDER: ThemeId[] = [cottageCreamTheme.id, rainyLilacTheme.id];

export const SKIN_PACKS: Record<string, SkinPack> = {
  [paperCropsSkin.id]: paperCropsSkin,
  [springCropsSkin.id]: springCropsSkin,
};

export const DEFAULT_THEME_ID: ThemeId = cottageCreamTheme.id;
export const DEFAULT_CROP_SKIN_ID: SkinId = paperCropsSkin.id;

export function getTheme(id: ThemeId | undefined | null): ThemePack {
  return THEME_PACKS[id ?? ''] ?? THEME_PACKS[DEFAULT_THEME_ID];
}

export function getSkin(id: SkinId | undefined | null): SkinPack {
  return SKIN_PACKS[id ?? ''] ?? SKIN_PACKS[DEFAULT_CROP_SKIN_ID];
}

export function themesUnlockedBy(harvestCount: number): ThemeId[] {
  return THEME_ORDER.filter(
    (id) => harvestCount >= (THEME_PACKS[id]?.unlockAtHarvests ?? 0),
  );
}

export function skinsUnlockedBy(harvestCount: number, kind?: SkinPack['kind']): SkinId[] {
  return Object.values(SKIN_PACKS)
    .filter((pack) => harvestCount >= pack.unlockAtHarvests)
    .filter((pack) => (kind ? pack.kind === kind : true))
    .map((pack) => pack.id);
}

/** CSS custom properties injected onto `.p1-shell`. */
export function themeToCssVars(tokens: ThemeTokens): Record<string, string> {
  return {
    '--cream': tokens.cream,
    '--sage': tokens.sage,
    '--sky': tokens.sky,
    '--peach': tokens.peach,
    '--honey': tokens.honey,
    '--wood': tokens.wood,
    '--soil': tokens.soil,
    '--soil-wet': tokens.soilWet,
    '--denim': tokens.denim,
    '--ink': tokens.ink,
    '--lilac': tokens.lilac,
    '--shell-gradient': tokens.shellGradient,
    '--sky-gradient': tokens.skyGradient,
  };
}

export function resolveAsset(
  theme: ThemePack,
  skin: SkinPack | undefined,
  key: string,
): string | undefined {
  const fromSkin = skin?.assets[key];
  if (fromSkin) return fromSkin;
  const assets = theme.assets;
  if (!assets) return undefined;
  // theme-level dotted keys rarely used; keep for future
  return undefined;
}

export type {ThemePack, SkinPack, ThemeId, SkinId, ThemeTokens, ThemeAssets} from './types';
