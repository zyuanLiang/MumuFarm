import type {ThemePack} from '../types';

/**
 * North-star visual pack from user v1-complete mockups.
 * Character model: outfit → full-body PNG only (no CSS collage / sticker layers).
 */
export const v1CompleteTheme: ThemePack = {
  id: 'v1_complete',
  name: '晴暖定稿',
  blurb: '按完整定稿：绘本农场 + 换装卧室',
  unlockAtHarvests: 0,
  tokens: {
    cream: '#fff6e8',
    sage: '#8fbf7a',
    sky: '#7ec8f0',
    peach: '#f0a878',
    honey: '#f5d24a',
    wood: '#d8b88a',
    soil: '#c4a06e',
    soilWet: '#a88458',
    denim: '#7aa0c8',
    ink: '#5a4030',
    lilac: '#c8a0d8',
    shellGradient: 'linear-gradient(180deg, #ffe6c8 0%, #fff4e0 35%, #e8f5d0 70%, #d8eef8 100%)',
    skyGradient:
      'radial-gradient(ellipse 90% 50% at 70% 18%, rgba(255, 220, 140, 0.55), transparent 55%), linear-gradient(180deg, #7ec8f0 0%, #b8e0a8 55%, transparent 100%)',
  },
  assets: {
    farmBg: '/skins/v1-complete/farm/farm-bg.jpg',
    wardrobeBg: '/skins/v1-complete/wardrobe/wardrobe-room.jpg',
    mushroomHouse: '/skins/v1-complete/farm/mushroom-house.png',
    girlFull: '/skins/v1-complete/girl/girl-raincoat-full.png',
    girlFullBodies: {
      raincoat: '/skins/v1-complete/girl/girl-raincoat-full.png',
      witch: '/skins/v1-complete/girl/girl-witch-full.png',
      denim: '/skins/v1-complete/girl/girl-denim-full.png',
    },
    catArt: '/skins/v1-complete/girl/black-cat.png',
  },
};
