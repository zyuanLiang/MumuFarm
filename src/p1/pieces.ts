import {OUTFIT_ORDER, OUTFITS, type OutfitId} from './outfits';

/** Mixable wardrobe slots — same girl, sticker layers only. */
export type HatId = 'bare' | 'rain_hood' | 'witch_hat' | 'straw_hat' | 'beret';
export type DressId =
  | 'raincoat'
  | 'witch'
  | 'denim'
  | 'garden'
  | 'picnic'
  | 'moonlight'
  | 'sweater'
  | 'spore';
export type BootsId = 'yellow' | 'witch' | 'denim' | 'peach' | 'check' | 'moon' | 'moss';

export interface Look {
  hat: HatId;
  dress: DressId;
  boots: BootsId;
}

export interface PieceDef<T extends string> {
  id: T;
  name: string;
  unlockAtHarvests: number;
}

export const HATS: Record<HatId, PieceDef<HatId>> = {
  bare: {id: 'bare', name: '不戴帽', unlockAtHarvests: 0},
  rain_hood: {id: 'rain_hood', name: '黄雨帽', unlockAtHarvests: 0},
  witch_hat: {id: 'witch_hat', name: '魔女尖帽', unlockAtHarvests: 0},
  straw_hat: {id: 'straw_hat', name: '草帽', unlockAtHarvests: 4},
  beret: {id: 'beret', name: '贝雷帽', unlockAtHarvests: 7},
};

export const DRESSES: Record<DressId, PieceDef<DressId>> = {
  raincoat: {id: 'raincoat', name: '黄雨衣', unlockAtHarvests: 0},
  witch: {id: 'witch', name: '魔女裙', unlockAtHarvests: 0},
  denim: {id: 'denim', name: '牛仔背心', unlockAtHarvests: 3},
  garden: {id: 'garden', name: '花园背带', unlockAtHarvests: 6},
  picnic: {id: 'picnic', name: '野餐格裙', unlockAtHarvests: 8},
  moonlight: {id: 'moonlight', name: '月夜裙', unlockAtHarvests: 10},
  sweater: {id: 'sweater', name: '奶油毛衣', unlockAtHarvests: 9},
  spore: {id: 'spore', name: '蘑菇裙', unlockAtHarvests: 12},
};

export const BOOTS: Record<BootsId, PieceDef<BootsId>> = {
  yellow: {id: 'yellow', name: '黄雨靴', unlockAtHarvests: 0},
  witch: {id: 'witch', name: '魔女靴', unlockAtHarvests: 0},
  denim: {id: 'denim', name: '棕短靴', unlockAtHarvests: 3},
  peach: {id: 'peach', name: '蜜桃鞋', unlockAtHarvests: 6},
  check: {id: 'check', name: '野餐凉鞋', unlockAtHarvests: 8},
  moon: {id: 'moon', name: '月夜软靴', unlockAtHarvests: 10},
  moss: {id: 'moss', name: '苔绿靴', unlockAtHarvests: 5},
};

export const HAT_ORDER: HatId[] = ['bare', 'rain_hood', 'witch_hat', 'straw_hat', 'beret'];
export const DRESS_ORDER: DressId[] = [
  'raincoat',
  'witch',
  'denim',
  'garden',
  'picnic',
  'sweater',
  'moonlight',
  'spore',
];
export const BOOTS_ORDER: BootsId[] = [
  'yellow',
  'witch',
  'denim',
  'moss',
  'peach',
  'check',
  'moon',
];

/** Named presets — tap once to wear a full look, then remix hat/boots. */
export const LOOK_PRESETS: Record<OutfitId, Look> = {
  raincoat: {hat: 'rain_hood', dress: 'raincoat', boots: 'yellow'},
  witch: {hat: 'witch_hat', dress: 'witch', boots: 'witch'},
  denim: {hat: 'bare', dress: 'denim', boots: 'denim'},
  garden: {hat: 'straw_hat', dress: 'garden', boots: 'peach'},
  picnic: {hat: 'bare', dress: 'picnic', boots: 'check'},
  moonlight: {hat: 'bare', dress: 'moonlight', boots: 'moon'},
  sweater: {hat: 'beret', dress: 'sweater', boots: 'moss'},
  spore: {hat: 'bare', dress: 'spore', boots: 'yellow'},
};

export function lookFromOutfit(outfit: OutfitId): Look {
  return {...LOOK_PRESETS[outfit]};
}

export function looksEqual(a: Look, b: Look): boolean {
  return a.hat === b.hat && a.dress === b.dress && a.boots === b.boots;
}

/** Closest preset id for save/journal labels when mix doesn't match exactly. */
export function closestOutfit(look: Look): OutfitId {
  for (const id of OUTFIT_ORDER) {
    if (LOOK_PRESETS[id].dress === look.dress) return id;
  }
  return 'raincoat';
}

export function lookLabel(look: Look): string {
  const bits: string[] = [DRESSES[look.dress]?.name ?? '衣服'];
  if (look.hat !== 'bare') bits.push(HATS[look.hat].name);
  bits.push(BOOTS[look.boots].name);
  return bits.join('·');
}

export function hatsUnlockedBy(harvestCount: number): HatId[] {
  return HAT_ORDER.filter((id) => harvestCount >= HATS[id].unlockAtHarvests);
}

export function dressesUnlockedBy(harvestCount: number): DressId[] {
  return DRESS_ORDER.filter((id) => harvestCount >= DRESSES[id].unlockAtHarvests);
}

export function bootsUnlockedBy(harvestCount: number): BootsId[] {
  return BOOTS_ORDER.filter((id) => harvestCount >= BOOTS[id].unlockAtHarvests);
}

export function countWearablePieces(harvestCount: number): number {
  // bare hat is a slot option, not a "piece" to collect
  return (
    hatsUnlockedBy(harvestCount).filter((id) => id !== 'bare').length +
    dressesUnlockedBy(harvestCount).length +
    bootsUnlockedBy(harvestCount).length
  );
}

export function normalizeLook(
  look: Partial<Look> | undefined,
  unlocked: {hats: HatId[]; dresses: DressId[]; boots: BootsId[]},
  fallbackOutfit: OutfitId = 'raincoat',
): Look {
  const base = lookFromOutfit(
    OUTFIT_ORDER.includes(fallbackOutfit as OutfitId) ? fallbackOutfit : 'raincoat',
  );
  const hat = look?.hat && unlocked.hats.includes(look.hat) ? look.hat : base.hat;
  const dress =
    look?.dress && unlocked.dresses.includes(look.dress) ? look.dress : base.dress;
  const boots =
    look?.boots && unlocked.boots.includes(look.boots) ? look.boots : base.boots;
  return {hat, dress, boots};
}

export function describeLookBlurb(look: Look): string {
  const preset = closestOutfit(look);
  if (looksEqual(look, LOOK_PRESETS[preset])) {
    return OUTFITS[preset].blurb;
  }
  return '自己拼的搭配，回农场炫耀一下';
}
