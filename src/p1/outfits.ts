export type OutfitId =
  | 'raincoat'
  | 'witch'
  | 'denim'
  | 'garden'
  | 'picnic'
  | 'sweater'
  | 'moonlight'
  | 'spore';

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
  picnic: {
    id: 'picnic',
    name: '野餐格裙',
    blurb: '红白格，适合坐在田埂吃点心',
    unlockAtHarvests: 8,
  },
  sweater: {
    id: 'sweater',
    name: '奶油毛衣',
    blurb: '软软的，配贝雷帽刚刚好',
    unlockAtHarvests: 9,
  },
  moonlight: {
    id: 'moonlight',
    name: '月夜裙',
    blurb: '柔蓝长裙，西湖暮色时最好看',
    unlockAtHarvests: 10,
  },
  spore: {
    id: 'spore',
    name: '蘑菇裙',
    blurb: '一点小魔法，还是奶油纸片味',
    unlockAtHarvests: 12,
  },
};

export const OUTFIT_ORDER: OutfitId[] = [
  'raincoat',
  'witch',
  'denim',
  'garden',
  'picnic',
  'sweater',
  'moonlight',
  'spore',
];

export function outfitsUnlockedBy(harvestCount: number): OutfitId[] {
  return OUTFIT_ORDER.filter((id) => harvestCount >= OUTFITS[id].unlockAtHarvests);
}
