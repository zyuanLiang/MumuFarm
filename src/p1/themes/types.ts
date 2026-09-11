import type {CropId} from '../types';
import type {VistaId} from '../vistas';
import type {DressId, HatId, BootsId} from '../pieces';

/** Color / surface tokens — applied as CSS variables on the shell. */
export interface ThemeTokens {
  cream: string;
  sage: string;
  sky: string;
  peach: string;
  honey: string;
  wood: string;
  soil: string;
  soilWet: string;
  denim: string;
  ink: string;
  lilac: string;
  shellGradient: string;
  skyGradient: string;
}

/**
 * Optional real art URLs for a pack.
 * Empty string / missing = keep CSS paper-cut placeholder.
 * Later art drops only fill these slots — no gameplay rewrite.
 */
export interface ThemeAssets {
  vistaBg?: Partial<Record<VistaId, string>>;
  cropMature?: Partial<Record<CropId, string>>;
  dress?: Partial<Record<DressId, string>>;
  hat?: Partial<Record<HatId, string>>;
  boots?: Partial<Record<BootsId, string>>;
  mushroomHouse?: string;
  uiChip?: string;
}

export interface ThemePack {
  id: string;
  name: string;
  blurb: string;
  /** 0 = start unlocked */
  unlockAtHarvests: number;
  tokens: ThemeTokens;
  assets?: ThemeAssets;
}

/** Sticker / icon skin packs can ship separately from world themes. */
export type SkinKind = 'crops' | 'wardrobe' | 'ui';

export interface SkinPack {
  id: string;
  name: string;
  blurb: string;
  kind: SkinKind;
  unlockAtHarvests: number;
  /** Logical key → image URL (or later atlas frame id) */
  assets: Record<string, string>;
}

export type ThemeId = string;
export type SkinId = string;
