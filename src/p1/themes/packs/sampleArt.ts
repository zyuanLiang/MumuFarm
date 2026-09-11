import type {ThemePack} from '../types';

/**
 * Sample art theme — same gameplay, full sticker slots filled.
 * Swap files under public/themes/sample-v1 and public/skins/sample-v1 without code changes.
 */
export const sampleArtTheme: ThemePack = {
  id: 'sample_art',
  name: '示例美装',
  blurb: '母版脸固定；帽衣靴远景可整包替换',
  unlockAtHarvests: 0,
  tokens: {
    cream: '#fff8ee',
    sage: '#9bc09a',
    sky: '#b7d8f0',
    peach: '#f3a989',
    honey: '#f0c75e',
    wood: '#e8d5b5',
    soil: '#d2a679',
    soilWet: '#b8895f',
    denim: '#7fa3c9',
    ink: '#5a4a3a',
    lilac: '#b9a0d6',
    shellGradient: 'linear-gradient(180deg, #f7d9c4 0%, #f3e2cf 28%, #e7f0d8 62%, #dfe9c9 100%)',
    skyGradient:
      'radial-gradient(ellipse 80% 45% at 70% 18%, rgba(255, 214, 170, 0.55), transparent 60%), linear-gradient(180deg, #f4c7b0 0%, #e8d5c4 45%, transparent 100%)',
  },
  assets: {
    vistaBg: {
      westlake: '/themes/sample-v1/vista-westlake.svg',
      guilin: '/themes/sample-v1/vista-guilin.svg',
      skycastle: '/themes/sample-v1/vista-skycastle.svg',
      huangshan: '/themes/sample-v1/vista-huangshan.svg',
    },
    mushroomHouse: '/themes/sample-v1/mushroom-house.svg',
    dress: {
      raincoat: '/skins/sample-v1/wardrobe/dress-raincoat.svg',
      witch: '/skins/sample-v1/wardrobe/dress-witch.svg',
      denim: '/skins/sample-v1/wardrobe/dress-denim.svg',
      garden: '/skins/sample-v1/wardrobe/dress-garden.svg',
      picnic: '/skins/sample-v1/wardrobe/dress-picnic.svg',
      sweater: '/skins/sample-v1/wardrobe/dress-sweater.svg',
      moonlight: '/skins/sample-v1/wardrobe/dress-moonlight.svg',
      spore: '/skins/sample-v1/wardrobe/dress-spore.svg',
    },
    hat: {
      rain_hood: '/skins/sample-v1/wardrobe/hat-rain-hood.svg',
      witch_hat: '/skins/sample-v1/wardrobe/hat-witch.svg',
      straw_hat: '/skins/sample-v1/wardrobe/hat-straw.svg',
      beret: '/skins/sample-v1/wardrobe/hat-beret.svg',
    },
    boots: {
      yellow: '/skins/sample-v1/wardrobe/boots-yellow.svg',
      witch: '/skins/sample-v1/wardrobe/boots-witch.svg',
      denim: '/skins/sample-v1/wardrobe/boots-denim.svg',
      peach: '/skins/sample-v1/wardrobe/boots-peach.svg',
      moss: '/skins/sample-v1/wardrobe/boots-moss.svg',
      check: '/skins/sample-v1/wardrobe/boots-check.svg',
      moon: '/skins/sample-v1/wardrobe/boots-moon.svg',
    },
  },
};
