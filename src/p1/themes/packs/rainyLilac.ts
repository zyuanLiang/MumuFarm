import type {ThemePack} from '../types';

/** Alternate world theme — proves hot-swap without touching gameplay. */
export const rainyLilacTheme: ThemePack = {
  id: 'rainy_lilac',
  name: '雨紫庭院',
  blurb: '软雨紫调；小屋与远景可整包替换',
  unlockAtHarvests: 3,
  tokens: {
    cream: '#f4f0f8',
    sage: '#8fb3a8',
    sky: '#a8b8d8',
    peach: '#d4a0c0',
    honey: '#c8b0e0',
    wood: '#d8cce0',
    soil: '#9a7a8a',
    soilWet: '#7a5a6a',
    denim: '#7a8eb8',
    ink: '#4a3a58',
    lilac: '#9b7ec8',
    shellGradient: 'linear-gradient(180deg, #d8c8e8 0%, #e8e0f0 30%, #d0dce8 65%, #c8d8d0 100%)',
    skyGradient:
      'radial-gradient(ellipse 80% 45% at 65% 20%, rgba(180, 160, 220, 0.75), transparent 60%), linear-gradient(180deg, #b8a8d0 0%, #c8c0d8 55%, transparent 100%)',
  },
  assets: {
    vistaBg: {
      westlake: '/themes/rainy-lilac/vista-westlake.svg',
      guilin: '/themes/rainy-lilac/vista-guilin.svg',
      skycastle: '/themes/rainy-lilac/vista-skycastle.svg',
      huangshan: '/themes/rainy-lilac/vista-huangshan.svg',
    },
    mushroomHouse: '/themes/rainy-lilac/mushroom-house.svg',
    cottageInterior: '/themes/rainy-lilac/cottage-interior.svg',
    dress: {
      raincoat: '/themes/rainy-lilac/wardrobe/dress-raincoat.svg',
      witch: '/themes/rainy-lilac/wardrobe/dress-witch.svg',
      denim: '/themes/rainy-lilac/wardrobe/dress-denim.svg',
      garden: '/themes/rainy-lilac/wardrobe/dress-garden.svg',
      picnic: '/themes/rainy-lilac/wardrobe/dress-picnic.svg',
      sweater: '/themes/rainy-lilac/wardrobe/dress-sweater.svg',
      moonlight: '/themes/rainy-lilac/wardrobe/dress-moonlight.svg',
      spore: '/themes/rainy-lilac/wardrobe/dress-spore.svg',
    },
    hat: {
      rain_hood: '/themes/rainy-lilac/wardrobe/hat-rain-hood.svg',
      witch_hat: '/themes/rainy-lilac/wardrobe/hat-witch.svg',
      straw_hat: '/themes/rainy-lilac/wardrobe/hat-straw.svg',
      beret: '/themes/rainy-lilac/wardrobe/hat-beret.svg',
    },
    boots: {
      yellow: '/themes/rainy-lilac/wardrobe/boots-yellow.svg',
      witch: '/themes/rainy-lilac/wardrobe/boots-witch.svg',
      denim: '/themes/rainy-lilac/wardrobe/boots-denim.svg',
      peach: '/themes/rainy-lilac/wardrobe/boots-peach.svg',
      moss: '/themes/rainy-lilac/wardrobe/boots-moss.svg',
      check: '/themes/rainy-lilac/wardrobe/boots-check.svg',
      moon: '/themes/rainy-lilac/wardrobe/boots-moon.svg',
    },
  },
};
