export type OutfitId = 'raincoat' | 'witch';

export interface OutfitDef {
  id: OutfitId;
  name: string;
  blurb: string;
}

export const OUTFITS: Record<OutfitId, OutfitDef> = {
  raincoat: {
    id: 'raincoat',
    name: '黄雨衣',
    blurb: '出门种菜的日常装',
  },
  witch: {
    id: 'witch',
    name: '小魔女',
    blurb: '蘑菇屋里的打扮时刻',
  },
};

export const OUTFIT_ORDER: OutfitId[] = ['raincoat', 'witch'];
