import type {ThemePack} from '../types';

/**
 * North-star visual pack from user v1-complete mockups.
 * Farm + wardrobe only for this vertical slice.
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
    catArt: '/skins/v1-complete/girl/black-cat.png',
    dress: {
      raincoat: '/skins/png-portrait/wardrobe/dress-raincoat.png',
      witch: '/skins/png-portrait/wardrobe/dress-witch.png',
      denim: '/skins/png-portrait/wardrobe/dress-denim.png',
      garden: '/skins/png-portrait/wardrobe/dress-garden.png',
      picnic: '/skins/png-portrait/wardrobe/dress-picnic.png',
      sweater: '/skins/png-portrait/wardrobe/dress-sweater.png',
      moonlight: '/skins/png-portrait/wardrobe/dress-moonlight.png',
      spore: '/skins/png-portrait/wardrobe/dress-spore.png',
    },
    hat: {
      rain_hood: '/skins/png-portrait/wardrobe/hat-rain-hood.png',
      witch_hat: '/skins/png-portrait/wardrobe/hat-witch.png',
      straw_hat: '/skins/png-portrait/wardrobe/hat-straw.png',
      beret: '/skins/png-portrait/wardrobe/hat-beret.png',
    },
    boots: {
      yellow: '/skins/png-portrait/wardrobe/boots-yellow.png',
      witch: '/skins/png-portrait/wardrobe/boots-witch.png',
      denim: '/skins/png-portrait/wardrobe/boots-denim.png',
      peach: '/skins/png-portrait/wardrobe/boots-peach.png',
      moss: '/skins/png-portrait/wardrobe/boots-moss.png',
      check: '/skins/png-portrait/wardrobe/boots-check.png',
      moon: '/skins/png-portrait/wardrobe/boots-moon.png',
    },
  },
};
