export type VistaId = 'westlake' | 'guilin' | 'skycastle' | 'huangshan';

export interface VistaDef {
  id: VistaId;
  name: string;
  unlockAtHarvests: number;
  blurb: string;
}

export const VISTAS: Record<VistaId, VistaDef> = {
  westlake: {
    id: 'westlake',
    name: '西湖',
    unlockAtHarvests: 0,
    blurb: '开局天幕',
  },
  guilin: {
    id: 'guilin',
    name: '桂林',
    unlockAtHarvests: 2,
    blurb: '收获两季后的明信片',
  },
  skycastle: {
    id: 'skycastle',
    name: '天空之城',
    unlockAtHarvests: 5,
    blurb: '魔法旅行远景',
  },
  huangshan: {
    id: 'huangshan',
    name: '黄山',
    unlockAtHarvests: 8,
    blurb: '云海奇峰',
  },
};

export const VISTA_ORDER: VistaId[] = ['westlake', 'guilin', 'skycastle', 'huangshan'];

export function vistasUnlockedBy(harvestCount: number): VistaId[] {
  return VISTA_ORDER.filter((id) => harvestCount >= VISTAS[id].unlockAtHarvests);
}
