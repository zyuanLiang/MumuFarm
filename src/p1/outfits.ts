export type OutfitId = 'raincoat' | 'witch' | 'denim' | 'garden';

export interface OutfitDef {
  id: OutfitId;
  name: string;
  blurb: string;
  /** 0 = start unlocked */
  unlockAtHarvests: number;
}

export const OUTFITS: Record<OutfitId, OutfitDef> = {
  raincoat: {
    id: 'raincoat',
    name: '黄雨衣',
    blurb: '出门种菜的日常装',
    unlockAtHarvests: 0,
  },
  witch: {
    id: 'witch',
    name: '小魔女',
    blurb: '蘑菇屋里的打扮时刻',
    unlockAtHarvests: 0,
  },
  denim: {
    id: 'denim',
    name: '牛仔日常',
    blurb: '米白背心配浅蓝牛仔裤',
    unlockAtHarvests: 3,
  },
  garden: {
    id: 'garden',
    name: '花园背带',
    blurb: '蜜桃背带裙，适合蹲在菜畦边',
    unlockAtHarvests: 6,
  },
};

export const OUTFIT_ORDER: OutfitId[] = ['raincoat', 'witch', 'denim', 'garden'];

export function outfitsUnlockedBy(harvestCount: number): OutfitId[] {
  return OUTFIT_ORDER.filter((id) => harvestCount >= OUTFITS[id].unlockAtHarvests);
}
