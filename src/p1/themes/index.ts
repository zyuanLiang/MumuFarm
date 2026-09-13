import {cottageCreamTheme} from './packs/cottageCream';
import {pngPortraitTheme} from './packs/pngPortrait';
import {rainyLilacTheme} from './packs/rainyLilac';
import {sampleArtTheme} from './packs/sampleArt';
import {paperCropsSkin, sampleCropsSkin, springCropsSkin} from './packs/cropSkins';
import type {SkinId, SkinPack, ThemeId, ThemePack, ThemeTokens} from './types';
import type {CropId} from '../types';
import type {GrowthStage} from '../types';
import type {VistaId} from '../vistas';
import type {BootsId, DressId, HatId} from '../pieces';

export const THEME_PACKS: Record<string, ThemePack> = {
  [cottageCreamTheme.id]: cottageCreamTheme,
  [sampleArtTheme.id]: sampleArtTheme,
  [rainyLilacTheme.id]: rainyLilacTheme,
  [pngPortraitTheme.id]: pngPortraitTheme,
};

export const THEME_ORDER: ThemeId[] = [
  cottageCreamTheme.id,
  sampleArtTheme.id,
  rainyLilacTheme.id,
  pngPortraitTheme.id,
];

export const SKIN_PACKS: Record<string, SkinPack> = {
  [paperCropsSkin.id]: paperCropsSkin,
  [sampleCropsSkin.id]: sampleCropsSkin,
  [springCropsSkin.id]: springCropsSkin,
};

export const DEFAULT_THEME_ID: ThemeId = sampleArtTheme.id;
export const DEFAULT_CROP_SKIN_ID: SkinId = sampleCropsSkin.id;

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

export function cropArtUrl(
  skin: SkinPack,
  cropId: CropId,
  stage: GrowthStage,
): string | undefined {
  if (stage === 'empty') return undefined;
  return (
    skin.assets[`${cropId}.${stage}`] ||
    (stage === 'growing' ? skin.assets[`${cropId}.sprout`] : undefined) ||
    undefined
  );
}

export function vistaArtUrl(theme: ThemePack, vista: VistaId): string | undefined {
  return theme.assets?.vistaBg?.[vista];
}

export function dressArtUrl(theme: ThemePack, dress: DressId): string | undefined {
  return theme.assets?.dress?.[dress];
}

export function hatArtUrl(theme: ThemePack, hat: HatId): string | undefined {
  return theme.assets?.hat?.[hat];
}

export function bootsArtUrl(theme: ThemePack, boots: BootsId): string | undefined {
  return theme.assets?.boots?.[boots];
}

export function houseArtUrl(theme: ThemePack): string | undefined {
  return theme.assets?.mushroomHouse;
}

export function cottageArtUrl(theme: ThemePack): string | undefined {
  return theme.assets?.cottageInterior;
}

export type {ThemePack, SkinPack, ThemeId, SkinId, ThemeTokens, ThemeAssets} from './types';
